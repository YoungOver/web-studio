import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const vertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

// Liquid chrome: domain-warped fbm height field, shaded as a mirror reflecting
// a studio environment (dark floor, hard silver horizon, softbox highlights,
// one thin blue reflection band). Cursor adds a damped ripple.
const fragment = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform vec2 uRes;
uniform vec2 uMouse;
uniform float uHover;
uniform float uIntro;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
const mat2 ROT = mat2(1.6, 1.2, -1.2, 1.6);
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = ROT * p;
    a *= 0.5;
  }
  return v;
}
// cheaper 3-octave version for the warp layers
float fbm3(vec2 p) {
  float v = 0.5 * noise(p);
  p = ROT * p;
  v += 0.25 * noise(p);
  p = ROT * p;
  v += 0.125 * noise(p);
  return v;
}

vec3 envColor(float g) {
  vec3 floorC = vec3(0.05, 0.055, 0.065);
  vec3 lowC = vec3(0.24, 0.26, 0.3);
  vec3 silver = vec3(0.78, 0.81, 0.86);
  vec3 skyDark = vec3(0.07, 0.08, 0.095);
  vec3 white = vec3(1.0, 1.0, 1.0);
  vec3 col = mix(floorC, lowC, smoothstep(-0.9, 0.0, g));
  col = mix(col, silver, smoothstep(0.0, 0.06, g));
  col = mix(col, skyDark, smoothstep(0.16, 0.34, g));
  col = mix(col, white, smoothstep(0.62, 0.7, g) * (1.0 - smoothstep(0.86, 1.05, g)));
  col = mix(col, skyDark * 0.8, smoothstep(0.95, 1.2, g));
  // thin electric-blue reflection band
  float band = 1.0 - smoothstep(0.0, 0.02, abs(g - 0.44));
  col += vec3(0.23, 0.48, 1.0) * band * 0.9;
  return col;
}

void main() {
  vec2 uv = vUv;
  float asp = uRes.x / max(uRes.y, 1.0);
  vec2 p = (uv - 0.5) * vec2(asp, 1.0) * 1.4;
  vec2 m = (uMouse - 0.5) * vec2(asp, 1.0) * 1.4;

  // cursor ripple
  vec2 dm = p - m;
  float dist = length(dm);
  float fall = exp(-dist * 3.2);
  float rip = sin(dist * 16.0 - uTime * 3.2) * fall * uHover;
  p += (dm / (dist + 1e-3)) * rip * 0.045;
  p -= dm * exp(-dist * dist * 5.0) * 0.18 * uHover;

  float t = uTime * 0.055;
  vec2 q = vec2(fbm3(p + vec2(0.0, t)), fbm3(p + vec2(5.2, 1.3) - t));
  vec2 r = vec2(
    fbm3(p + 2.2 * q + vec2(1.7, 9.2) + 1.3 * t),
    fbm3(p + 2.2 * q + vec2(8.3, 2.8) - t)
  );
  vec2 w = p * 0.8 + 1.7 * r;

  float e = 0.012;
  float h = fbm(w);
  float hx = fbm(w + vec2(e, 0.0));
  float hy = fbm(w + vec2(0.0, e));
  vec3 n = normalize(vec3((h - hx) / e * 0.5, (h - hy) / e * 0.5, 1.0));

  vec3 viewDir = vec3(0.0, 0.0, -1.0);
  vec3 rf = reflect(viewDir, n);
  // bias toward the bright part of the environment on the right and top
  float g = rf.y * 1.5 + rf.x * 0.35 + (h - 0.5) * 1.6 + (uv.y - 0.5) * 0.7 + (uv.x - 0.5) * 0.55 + 0.3;

  vec3 col = envColor(g);

  // softbox specular
  vec3 L = normalize(vec3(0.35, 0.55, 1.0));
  float spec = pow(max(dot(n, L), 0.0), 90.0);
  col += spec * 0.9;

  // fresnel toward grazing -> darker, glassier edges
  float fres = pow(1.0 - n.z, 2.0);
  col = mix(col, col * 0.35 + vec3(0.02, 0.03, 0.05), clamp(fres * 3.0, 0.0, 0.7));

  // darker zone behind the headline (bottom-left), chrome stays bright top/right
  // soft rounded box over the headline + subtext block (bottom-left 3/4 of the hero)
  vec2 bp = (uv - vec2(0.3, 0.3)) * vec2(asp, 1.0);
  vec2 bq = abs(bp) - vec2(0.42 * asp, 0.26);
  float sd = length(max(bq, 0.0)) + min(max(bq.x, bq.y), 0.0);
  float shade = 1.0 - smoothstep(-0.12, 0.3, sd);
  col *= 1.0 - 0.84 * shade;
  // portrait screens: the text covers most of the hero, so dim the whole field
  float portrait = 1.0 - smoothstep(0.8, 1.1, asp);
  col *= mix(1.0, 0.45, portrait);
  // keep the very top a touch calmer so the nav stays readable
  col *= mix(0.72, 1.0, smoothstep(1.0, 0.86, uv.y));

  // film grain
  col += (hash(uv * uRes + fract(uTime) * 91.0) - 0.5) * 0.03;

  // intro: light sweeps in from the top-right
  float sweep = smoothstep(0.0, 1.0, uIntro * 1.6 - (1.0 - uv.x) * 0.35 - (1.0 - uv.y) * 0.25);
  col *= sweep;

  gl_FragColor = vec4(col, 1.0);
}
`

type Pointer = { x: number; y: number; energy: number }

const INTRO_SECONDS = 2.2

function ChromePlane({ pointer }: { pointer: React.RefObject<Pointer> }) {
  const size = useThree((s) => s.size)
  const material = useRef<THREE.ShaderMaterial>(null)
  const initialUniforms = useMemo(
    () => ({
      uTime: { value: 12.0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.72, 0.62) },
      uHover: { value: 0.35 },
      uIntro: { value: 0 },
    }),
    [],
  )

  // r3f does not keep the object passed as `uniforms` by reference, so always write through
  // the live material; otherwise the GPU never sees time / intro / mouse change.
  // All animation lives here: uniforms are mutated in place, React never re-renders per frame.
  useFrame((_, delta) => {
    const uniforms = (material.current?.uniforms ?? initialUniforms) as typeof initialUniforms
    uniforms.uRes.value.set(size.width, size.height)
    const dt = Math.min(delta, 0.05)
    uniforms.uTime.value += dt
    uniforms.uIntro.value = Math.min(1, uniforms.uIntro.value + dt / INTRO_SECONDS)
    const ptr = pointer.current
    if (ptr) {
      const k = 1 - Math.exp(-dt * 4)
      uniforms.uMouse.value.x += (ptr.x - uniforms.uMouse.value.x) * k
      uniforms.uMouse.value.y += (ptr.y - uniforms.uMouse.value.y) * k
      ptr.energy *= Math.exp(-dt * 1.2)
      const targetHover = Math.min(1, 0.35 + ptr.energy)
      uniforms.uHover.value += (targetHover - uniforms.uHover.value) * (1 - Math.exp(-dt * 3))
    }
  })

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={material} vertexShader={vertex} fragmentShader={fragment} uniforms={initialUniforms} depthWrite={false} depthTest={false} toneMapped={false} />
    </mesh>
  )
}

/**
 * r3f does not restart its render loop when frameloop flips from "never" to "always",
 * so nudge it whenever the canvas becomes active again.
 */
export function LoopKick({ active }: { active: boolean }) {
  const invalidate = useThree((s) => s.invalidate)
  useEffect(() => {
    if (!active) return
    invalidate()
    const id = requestAnimationFrame(() => invalidate())
    return () => cancelAnimationFrame(id)
  }, [active, invalidate])
  return null
}

export function ChromeCanvas({ active, pointer }: { active: boolean; pointer: React.RefObject<Pointer> }) {
  return (
    <Canvas
      style={{ position: 'absolute', inset: 0 }}
      dpr={[1, 1.75]}
      frameloop={active ? 'always' : 'never'}
      flat
      linear
      gl={{ antialias: false, alpha: false, powerPreference: 'high-performance', stencil: false, depth: false }}
      aria-hidden
    >
      <ChromePlane pointer={pointer} />
      <LoopKick active={active} />
    </Canvas>
  )
}

export function usePointerTarget(target: React.RefObject<HTMLElement | null>) {
  const pointer = useRef<Pointer>({ x: 0.72, y: 0.62, energy: 0 })
  useEffect(() => {
    const el = target.current
    if (!el) return
    let lx = 0
    let ly = 0
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width
      const y = 1 - (e.clientY - r.top) / r.height
      const dx = x - lx
      const dy = y - ly
      lx = x
      ly = y
      pointer.current.x = x
      pointer.current.y = y
      pointer.current.energy = Math.min(1.2, pointer.current.energy + Math.hypot(dx, dy) * 6)
    }
    el.addEventListener('pointermove', onMove, { passive: true })
    return () => el.removeEventListener('pointermove', onMove)
  }, [target])
  return pointer
}
