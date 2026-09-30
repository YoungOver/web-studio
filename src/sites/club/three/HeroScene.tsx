import { Suspense, useMemo, useRef } from 'react'
import type { RefObject } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Grid, Lightformer, MeshReflectorMaterial, Text3D } from '@react-three/drei'
import { Bloom, EffectComposer, ToneMapping, Vignette } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import { respawnFont } from './respawnFont'

export type PointerRef = RefObject<{ x: number; y: number }>

type SceneProps = {
  active: boolean
  pointer: PointerRef
  compact: boolean
}

const WORD = 'RESPAWN'
const SIZE = 1
const DEPTH = 0.34
const GAP = -0.015
const MAGENTA = new THREE.Color('#FF2BD6')
const CYAN = new THREE.Color('#22E7FF')

// Layout letters using the glyph advances from the typeface.
const LAYOUT = (() => {
  const items: { char: string; x: number; w: number }[] = []
  let cursor = 0
  for (const char of WORD) {
    const g = respawnFont.glyphs[char] as unknown as { ha: number; x_max: number }
    items.push({ char, x: cursor, w: (g.x_max / 1000) * SIZE })
    cursor += (g.ha / 1000) * SIZE + GAP
  }
  const last = items[items.length - 1]
  const total = last.x + last.w
  return { items: items.map((it) => ({ ...it, x: it.x - total / 2 })), total }
})()

const easeOutExpo = (p: number) => (p >= 1 ? 1 : 1 - Math.pow(2, -10 * p))

function Letter({ char, x, w, index }: { char: string; x: number; w: number; index: number }) {
  const group = useRef<THREE.Group>(null)
  const mat = useRef<THREE.MeshPhysicalMaterial>(null)
  const start = useRef<number | null>(null)
  const flash = index % 2 === 0 ? MAGENTA : CYAN

  useFrame((state) => {
    const g = group.current
    const m = mat.current
    if (!g || !m) return
    if (start.current === null) start.current = state.clock.elapsedTime
    const t = state.clock.elapsedTime - start.current
    const delay = 0.35 + index * 0.1
    const p = Math.min(Math.max((t - delay) / 1.6, 0), 1)
    const e = easeOutExpo(p)
    g.position.y = THREE.MathUtils.lerp(-1.25, 0.02, e)
    g.rotation.x = THREE.MathUtils.lerp(-1.1, 0, e)
    g.rotation.y = THREE.MathUtils.lerp(index % 2 ? 0.5 : -0.5, 0, e)
    // Short neon flash while the letter spawns out of the floor.
    m.emissiveIntensity = p <= 0 || p >= 1 ? 0 : Math.sin(Math.min(p * 1.6, 1) * Math.PI) * 1.1
  })

  return (
    <group ref={group} position={[x + w / 2, -1.25, 0]}>
      <Text3D
        font={respawnFont}
        size={SIZE}
        height={DEPTH}
        curveSegments={10}
        bevelEnabled
        bevelThickness={0.035}
        bevelSize={0.022}
        bevelSegments={5}
        position={[-w / 2, 0, -DEPTH / 2]}
      >
        {char}
        <meshPhysicalMaterial
          ref={mat}
          color="#f3f0fb"
          metalness={1}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.06}
          envMapIntensity={1.9}
          emissive={flash}
          emissiveIntensity={0}
        />
      </Text3D>
    </group>
  )
}

/**
 * The neon "light sweep": two tall coloured light panels that live only in the
 * environment map, so they show up as moving reflections on the chrome letters
 * without lighting the floor or rendering any visible helper geometry.
 */
function SweepStrips() {
  const a = useRef<THREE.Mesh>(null)
  const b = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (a.current) a.current.position.x = Math.sin(t * 0.45) * 7
    if (b.current) b.current.position.x = Math.sin(t * 0.45 + Math.PI) * 7
  })
  return (
    <>
      <Lightformer ref={a} form="rect" color="#FF2BD6" intensity={6} position={[0, 1.2, 6]} scale={[1.1, 7, 1]} />
      <Lightformer ref={b} form="rect" color="#22E7FF" intensity={5} position={[0, 1.2, 6]} scale={[1.1, 7, 1]} />
    </>
  )
}

const CAM_DIR = new THREE.Vector3(0, 1.25, 9.5).normalize()
const LOOK = new THREE.Vector3(0, -0.15, 0)

function CameraRig({ pointer }: { pointer: PointerRef }) {
  const smooth = useRef({ x: 0, y: 0 })
  const tmp = useMemo(() => new THREE.Vector3(), [])
  const look = useMemo(() => new THREE.Vector3(), [])
  useFrame((state) => {
    const cam = state.camera as THREE.PerspectiveCamera
    const aspect = state.size.width / Math.max(state.size.height, 1)
    const halfFov = THREE.MathUtils.degToRad(cam.fov / 2)
    const fit = ((LAYOUT.total / 2) * 1.2) / (Math.tan(halfFov) * aspect)
    const dist = Math.max(9.2, fit)
    const target = pointer.current ?? { x: 0, y: 0 }
    smooth.current.x += (target.x - smooth.current.x) * 0.045
    smooth.current.y += (target.y - smooth.current.y) * 0.045
    tmp.copy(CAM_DIR).multiplyScalar(dist)
    tmp.x += smooth.current.x * 0.9 * (dist / 9.5)
    tmp.y += smooth.current.y * 0.45 * (dist / 9.5)
    cam.position.copy(tmp)
    // On portrait screens push the word higher so it clears the headline block.
    look.copy(LOOK)
    if (aspect < 1) look.y -= (1 - aspect) * dist * 0.12
    cam.lookAt(look)
  })
  return null
}

function NeonTubes() {
  const cyan = useMemo(() => CYAN.clone().multiplyScalar(2.4), [])
  const magenta = useMemo(() => MAGENTA.clone().multiplyScalar(2), [])
  return (
    <>
      <mesh position={[0, 2.05, -2.6]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 8.6, 12, 1, true]} />
        <meshBasicMaterial color={cyan} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.03, -7]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.028, 0.028, 22, 12, 1, true]} />
        <meshBasicMaterial color={magenta} toneMapped={false} />
      </mesh>
    </>
  )
}

function Floor({ compact }: { compact: boolean }) {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[80, 80]} />
        <MeshReflectorMaterial
          resolution={compact ? 512 : 1024}
          blur={[280, 90]}
          mixBlur={1}
          mixStrength={30}
          mixContrast={1}
          roughness={1}
          depthScale={1.1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#0b0913"
          metalness={0.6}
          envMapIntensity={0.35}
        />
      </mesh>
      <Grid
        position={[0, 0.004, 0]}
        args={[80, 80]}
        cellSize={0.5}
        cellThickness={0.55}
        cellColor="#34205e"
        sectionSize={2.5}
        sectionThickness={1.1}
        sectionColor="#FF2BD6"
        fadeDistance={30}
        fadeStrength={1.6}
        infiniteGrid
      />
    </>
  )
}

function Scene({ pointer, compact }: Omit<SceneProps, 'active'>) {
  return (
    <>
      <color attach="background" args={['#06050A']} />
      <ambientLight intensity={0.15} color="#8B5CFF" />
      {/* Environment re-renders every frame so the sweeping strips move in the reflections. */}
      <Environment resolution={compact ? 128 : 256} frames={Infinity}>
        <Lightformer form="rect" intensity={2.4} color="#ffffff" position={[0, 5, -1]} scale={[14, 1.6, 1]} />
        <Lightformer form="rect" intensity={1.6} color="#ffffff" position={[0, 3.2, 7]} scale={[14, 0.6, 1]} />
        <Lightformer form="rect" intensity={2.2} color="#ffffff" position={[0, 0.6, 8]} scale={[12, 0.35, 1]} />
        <Lightformer form="rect" intensity={2.6} color="#FF2BD6" position={[-8, 1.5, 2]} scale={[7, 3, 1]} />
        <Lightformer form="rect" intensity={2.6} color="#22E7FF" position={[8, 1.2, 2]} scale={[7, 3, 1]} />
        <Lightformer form="ring" intensity={1.6} color="#8B5CFF" position={[0, 3, -6]} scale={3} />
        <SweepStrips />
      </Environment>
      <Suspense fallback={null}>
        <group>
          {LAYOUT.items.map((it, i) => (
            <Letter key={i} char={it.char} x={it.x} w={it.w} index={i} />
          ))}
        </group>
      </Suspense>
      <NeonTubes />
      <Floor compact={compact} />
      <CameraRig pointer={pointer} />
      <EffectComposer multisampling={compact ? 0 : 4}>
        <Bloom mipmapBlur luminanceThreshold={0.9} luminanceSmoothing={0.15} intensity={0.75} radius={0.6} />
        <Vignette offset={0.28} darkness={0.72} />
        {/* EffectComposer disables renderer tone mapping; without this, highlights clip to flat white. */}
        <ToneMapping mode={ToneMappingMode.NEUTRAL} />
      </EffectComposer>
    </>
  )
}

export default function HeroScene({ active, pointer, compact }: SceneProps) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.75]}
      camera={{ fov: 32, near: 0.1, far: 120, position: [0, 1.25, 9.5] }}
      gl={{ antialias: false, powerPreference: 'high-performance', alpha: false }}
      aria-hidden
    >
      <Scene pointer={pointer} compact={compact} />
    </Canvas>
  )
}
