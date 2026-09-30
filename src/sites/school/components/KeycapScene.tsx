import { Component, Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode, RefObject } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import type { ThreeEvent } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer, RoundedBox, Text } from '@react-three/drei'
import cyrFont from '@fontsource/russo-one/files/russo-one-cyrillic-400-normal.woff?url'
import latFont from '@fontsource/russo-one/files/russo-one-latin-400-normal.woff?url'
import { hasWebGL } from '../lib/motion'
import { StaticKeycaps } from './StaticKeycaps'

/* ------------------------------------------------------------------ */
/* Key layout                                                          */
/* ------------------------------------------------------------------ */

const C = {
  blue: '#3D5AFE',
  coral: '#FF5A36',
  yellow: '#FFC400',
  mint: '#00C389',
  white: '#F5F7FC',
  ink: '#14161F',
}

type KeyDef = {
  legend: string
  color: string
  ink: string
  w: number
  pos: [number, number, number]
  rot: [number, number, number]
  font: 'cyr' | 'lat'
  size?: number
}

const KEYS: KeyDef[] = [
  { legend: 'К', color: C.blue, ink: '#fff', w: 1, pos: [-2.45, 1.25, 0.2], rot: [0.28, 0.32, 0.12], font: 'cyr' },
  { legend: 'О', color: C.white, ink: C.ink, w: 1, pos: [-1.1, 1.55, -0.35], rot: [0.12, 0.18, -0.1], font: 'cyr' },
  { legend: 'Д', color: C.coral, ink: '#fff', w: 1, pos: [0.25, 1.2, 0.45], rot: [0.3, -0.08, 0.08], font: 'cyr' },
  { legend: '{', color: C.yellow, ink: C.ink, w: 1, pos: [1.6, 1.62, -0.45], rot: [-0.05, -0.38, 0.22], font: 'lat' },
  { legend: '}', color: C.mint, ink: C.ink, w: 1, pos: [2.75, 0.62, 0.05], rot: [0.2, -0.5, -0.16], font: 'lat' },
  { legend: ';', color: C.white, ink: C.ink, w: 1, pos: [-2.85, -0.2, -0.55], rot: [0.18, 0.52, -0.22], font: 'lat' },
  { legend: '<', color: C.coral, ink: '#fff', w: 1, pos: [-1.5, 0.08, 0.55], rot: [-0.12, 0.26, 0.06], font: 'lat' },
  { legend: '/', color: C.blue, ink: '#fff', w: 1, pos: [-0.1, -0.12, -0.2], rot: [0.16, -0.18, -0.26], font: 'lat' },
  { legend: '>', color: C.yellow, ink: C.ink, w: 1, pos: [1.3, 0.2, 0.62], rot: [0.26, 0.3, 0.1], font: 'lat' },
  { legend: 'Enter', color: C.mint, ink: C.ink, w: 2.15, pos: [-1.25, -1.5, 0.15], rot: [0.32, 0.14, -0.07], font: 'lat', size: 0.3 },
  { legend: 'Tab', color: C.white, ink: C.ink, w: 1.5, pos: [1.55, -1.3, -0.3], rot: [0.22, -0.3, 0.1], font: 'lat', size: 0.3 },
]

const PALETTE = [C.blue, C.coral, C.yellow, C.mint].map((c) => new THREE.Color(c))

type BurstFn = (origin: THREE.Vector3) => void
type Mouse = { x: number; y: number }

/* ------------------------------------------------------------------ */
/* Particle burst pool (instanced, no React state per frame)           */
/* ------------------------------------------------------------------ */

const COUNT = 120

function BurstPool({ api }: { api: RefObject<BurstFn> }) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const data = useMemo(
    () => ({
      p: new Float32Array(COUNT * 3),
      v: new Float32Array(COUNT * 3),
      life: new Float32Array(COUNT),
      max: new Float32Array(COUNT).fill(1),
      next: 0,
    }),
    [],
  )
  const dummy = useMemo(() => new THREE.Object3D(), [])

  useLayoutEffect(() => {
    const m = mesh.current
    if (!m) return
    dummy.scale.setScalar(0)
    dummy.updateMatrix()
    for (let i = 0; i < COUNT; i++) {
      m.setMatrixAt(i, dummy.matrix)
      m.setColorAt(i, PALETTE[i % 4])
    }
    m.instanceMatrix.needsUpdate = true
    if (m.instanceColor) m.instanceColor.needsUpdate = true
  }, [dummy])

  useEffect(() => {
    api.current = (o) => {
      const m = mesh.current
      if (!m) return
      for (let n = 0; n < 18; n++) {
        const i = data.next
        data.next = (data.next + 1) % COUNT
        const a = Math.random() * Math.PI * 2
        const sp = 2 + Math.random() * 3.2
        data.p[i * 3] = o.x
        data.p[i * 3 + 1] = o.y
        data.p[i * 3 + 2] = o.z
        data.v[i * 3] = Math.cos(a) * sp
        data.v[i * 3 + 1] = Math.sin(a) * sp * 0.75 + 2.6
        data.v[i * 3 + 2] = 1.2 + Math.random() * 2.2
        data.max[i] = data.life[i] = 0.75 + Math.random() * 0.55
        m.setColorAt(i, PALETTE[(Math.random() * 4) | 0])
      }
      if (m.instanceColor) m.instanceColor.needsUpdate = true
    }
  }, [api, data])

  useFrame((_, delta) => {
    const m = mesh.current
    if (!m) return
    const d = Math.min(delta, 1 / 30)
    let any = false
    for (let i = 0; i < COUNT; i++) {
      if (data.life[i] <= 0) continue
      any = true
      data.life[i] -= d
      data.v[i * 3 + 1] -= 9.5 * d
      data.p[i * 3] += data.v[i * 3] * d
      data.p[i * 3 + 1] += data.v[i * 3 + 1] * d
      data.p[i * 3 + 2] += data.v[i * 3 + 2] * d
      const k = Math.max(0, data.life[i] / data.max[i])
      dummy.position.set(data.p[i * 3], data.p[i * 3 + 1], data.p[i * 3 + 2])
      dummy.rotation.set(k * 9 + i, k * 7, i)
      dummy.scale.setScalar(0.13 * Math.sqrt(k))
      dummy.updateMatrix()
      m.setMatrixAt(i, dummy.matrix)
    }
    if (any) m.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, COUNT]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial roughness={0.35} metalness={0.05} />
    </instancedMesh>
  )
}

/* ------------------------------------------------------------------ */
/* One keycap                                                          */
/* ------------------------------------------------------------------ */

const noRaycast = () => null
const tmpV = new THREE.Vector3()

function Keycap({ def, index, burst, reduced }: { def: KeyDef; index: number; burst: RefObject<BurstFn>; reduced: boolean }) {
  const outer = useRef<THREE.Group>(null)
  const inner = useRef<THREE.Group>(null)
  const s = useRef({
    press: 0,
    pv: 0,
    hover: false,
    drop: reduced ? 0 : 7.5 + index * 0.35,
    dv: 0,
    t0: -1,
    flash: 0,
    spin: 0,
    sv: 0,
  })

  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: def.color,
        roughness: def.color === C.white ? 0.36 : 0.3,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        sheen: 0.25,
        sheenColor: new THREE.Color('#ffffff'),
        emissive: new THREE.Color(def.color === C.white ? C.blue : def.color),
        emissiveIntensity: 0,
      }),
    [def.color],
  )
  useEffect(() => () => material.dispose(), [material])

  useFrame((state, delta) => {
    const o = outer.current
    const inn = inner.current
    if (!o || !inn) return
    const d = Math.min(delta, 1 / 30)
    const st = s.current
    const t = state.clock.elapsedTime
    if (st.t0 < 0) st.t0 = t
    const local = t - st.t0

    // intro drop: under-damped spring so every key lands with a small bounce
    if (local > 0.2 + index * 0.075) {
      const a = -95 * st.drop - 11.5 * st.dv
      st.dv += a * d
      st.drop += st.dv * d
    }
    // hover press
    const target = st.hover ? 1 : 0
    const a2 = 340 * (target - st.press) - 17 * st.pv
    st.pv += a2 * d
    st.press += st.pv * d
    // click wobble
    const a3 = -150 * st.spin - 8 * st.sv
    st.sv += a3 * d
    st.spin += st.sv * d
    st.flash = Math.max(0, st.flash - d * 2.4)

    const bob = reduced ? 0 : Math.sin(t * 0.95 + index * 1.7) * 0.085
    o.position.set(def.pos[0], def.pos[1] + bob + st.drop, def.pos[2])
    o.rotation.set(
      def.rot[0] + (reduced ? 0 : Math.sin(t * 0.6 + index) * 0.045),
      def.rot[1] + (reduced ? 0 : Math.cos(t * 0.5 + index * 0.7) * 0.05),
      def.rot[2] + st.spin,
    )
    inn.position.z = -0.26 * st.press
    const sq = 1 - 0.04 * Math.max(0, st.press)
    inn.scale.set(sq, sq, 1)
    material.emissiveIntensity = st.flash * 0.85
  })

  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    s.current.hover = true
    document.body.style.cursor = 'pointer'
  }
  const out = () => {
    s.current.hover = false
    document.body.style.cursor = ''
  }
  const click = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    const st = s.current
    st.pv += 16
    st.sv += (index % 2 ? 1 : -1) * (3 + Math.random() * 2)
    st.flash = 1
    if (inner.current) burst.current?.(inner.current.localToWorld(tmpV.set(0, 0, 0.6)))
  }

  const w = def.w
  return (
    <group ref={outer}>
      {/* stable invisible hit-box so pressing doesn't flicker hover */}
      <mesh onPointerOver={over} onPointerOut={out} onClick={click}>
        <boxGeometry args={[w + 0.05, 1.05, 0.8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
      </mesh>
      <group ref={inner}>
        <RoundedBox args={[w, 1, 0.56]} radius={0.17} smoothness={5} bevelSegments={5} creaseAngle={0.5} material={material} raycast={noRaycast} />
        <RoundedBox
          args={[w - 0.2, 0.8, 0.2]}
          radius={0.08}
          smoothness={4}
          bevelSegments={4}
          position={[0, 0.02, 0.24]}
          material={material}
          raycast={noRaycast}
        />
        <Text
          font={def.font === 'cyr' ? cyrFont : latFont}
          fontSize={def.size ?? 0.46}
          color={def.ink}
          anchorX="center"
          anchorY="middle"
          position={[0, 0.03, 0.345]}
          raycast={noRaycast}
          letterSpacing={def.legend.length > 1 ? 0.02 : 0}
        >
          {def.legend}
        </Text>
      </group>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* Cluster: responsive scale + mouse tilt                              */
/* ------------------------------------------------------------------ */

function Cluster({ reduced, mouse }: { reduced: boolean; mouse: RefObject<Mouse> }) {
  const tilt = useRef<THREE.Group>(null)
  const burst = useRef<BurstFn>(() => {})
  const viewport = useThree((s) => s.viewport)
  const camera = useThree((s) => s.camera)
  const scale = Math.min(1.05, viewport.width / 7.4, viewport.height / 5.5)

  useLayoutEffect(() => {
    camera.lookAt(0, -0.15, 0)
  }, [camera])

  useFrame((_, delta) => {
    const g = tilt.current
    if (!g || !mouse.current) return
    const k = 1 - Math.exp(-delta * 3)
    const m = reduced ? { x: 0, y: 0 } : mouse.current
    g.rotation.y += (m.x * 0.32 - g.rotation.y) * k
    g.rotation.x += (-m.y * 0.16 - g.rotation.x) * k
  })

  return (
    <>
      <group scale={scale}>
        <group ref={tilt}>
          {KEYS.map((def, i) => (
            <Keycap key={def.legend} def={def} index={i} burst={burst} reduced={reduced} />
          ))}
        </group>
        <ContactShadows position={[0, -2.75, 0]} scale={15} blur={2.6} far={5} opacity={0.34} resolution={512} color="#1d2766" />
      </group>
      <BurstPool api={burst} />
    </>
  )
}

function Scene({ reduced }: { reduced: boolean }) {
  const mouse = useRef<Mouse>({ x: 0, y: 0 })
  useEffect(() => {
    const move = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [])

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 6, 6]} intensity={1.1} />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.6} position={[0, 6, 2]} rotation-x={Math.PI / 2} scale={[12, 4, 1]} />
        <Lightformer form="rect" intensity={1.8} position={[-7, 2, 3]} rotation-y={Math.PI / 2} scale={[4, 9, 1]} />
        <Lightformer form="rect" intensity={1.3} position={[7, 1, 3]} rotation-y={-Math.PI / 2} scale={[4, 9, 1]} color="#dfe5ff" />
        <Lightformer form="ring" intensity={2.2} position={[2.5, 3, 9]} scale={3} />
        <Lightformer form="rect" intensity={0.9} position={[0, -5, 4]} rotation-x={-Math.PI / 2} scale={[12, 3, 1]} color="#fff3d1" />
      </Environment>
      <Cluster reduced={reduced} mouse={mouse} />
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Stage: visibility pausing, WebGL fallback, error boundary           */
/* ------------------------------------------------------------------ */

class GLBoundary extends Component<{ children: ReactNode; onError: () => void }, { err: boolean }> {
  state = { err: false }
  static getDerivedStateFromError() {
    return { err: true }
  }
  componentDidCatch() {
    this.props.onError()
  }
  render() {
    return this.state.err ? null : this.props.children
  }
}

export default function KeycapStage() {
  const host = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)
  const [gl] = useState(() => hasWebGL())
  const [failed, setFailed] = useState(false)
  // Policy: the hero 3D motion (drop-in, bob, tilt) stays on even with prefers-reduced-motion;
  // only smooth scroll and scroll-scrubbed effects are disabled site-wide.
  const reduced = false

  useEffect(() => {
    const el = host.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '80px' })
    io.observe(el)
    return () => io.disconnect()
  }, [gl, failed])

  useEffect(() => () => void (document.body.style.cursor = ''), [])

  if (!gl || failed) return <StaticKeycaps />

  return (
    <div ref={host} className="absolute inset-0" aria-hidden="true">
      <GLBoundary onError={() => setFailed(true)}>
        <Canvas
          frameloop={visible ? 'always' : 'never'}
          dpr={[1, 1.75]}
          camera={{ position: [0, 1.5, 10.5], fov: 32, near: 0.1, far: 60 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          onCreated={({ gl: r }) => {
            r.toneMapping = THREE.NeutralToneMapping
            r.toneMappingExposure = 1.05
          }}
          style={{ touchAction: 'pan-y' }}
        >
          <Suspense fallback={null}>
            <Scene reduced={reduced} />
          </Suspense>
        </Canvas>
      </GLBoundary>
    </div>
  )
}
