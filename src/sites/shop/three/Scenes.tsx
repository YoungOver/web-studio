import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree, type ThreeElements } from '@react-three/fiber'
import { ContactShadows, Environment, Float, Lightformer, PerspectiveCamera } from '@react-three/drei'
import type { Product } from '../data'
import { byId } from '../data'
import { pointer } from '../hooks'
import { blobTexture, leafGeometry, profile } from './geometry'
import { VesselModel, fitOf } from './Vessel'

/** Studio lighting built only from Lightformers — no HDR files. */
export function StudioLights({ res = 128 }: { res?: number }) {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 6, 4]} intensity={1.1} color="#fff5e8" />
      <Environment resolution={res} frames={1}>
        <color attach="background" args={['#857f76']} />
        <Lightformer form="rect" intensity={2.6} position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[10, 5, 1]} />
        <Lightformer form="rect" intensity={4} color="#fff3e2" position={[-4, 1.6, 1.5]} rotation-y={Math.PI / 2} scale={[1.1, 7, 1]} />
        <Lightformer form="rect" intensity={2.6} position={[4, 1.4, 1]} rotation-y={-Math.PI / 2} scale={[0.8, 7, 1]} />
        <Lightformer form="rect" intensity={1.4} color="#d8ccef" position={[0, 1.5, -6]} scale={[10, 4, 1]} />
        <Lightformer form="ring" intensity={1.6} position={[2.5, 3, 5]} scale={1.4} />
      </Environment>
    </>
  )
}

const damp = THREE.MathUtils.damp

/**
 * The canvas is transparent, so transmissive glass would refract an empty (white) buffer.
 * This sphere is drawn only into three's transmission pass (a render target) and never to the screen,
 * so the glass refracts a colour that matches the page behind it.
 */
export function GlassBackdrop({ color }: { color: string }) {
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ color, side: THREE.BackSide, toneMapped: false }), [color])
  return (
    <mesh
      material={mat}
      scale={30}
      renderOrder={-10}
      onBeforeRender={(gl) => {
        const offscreen = gl.getRenderTarget() !== null
        mat.colorWrite = offscreen
        mat.depthWrite = offscreen
      }}
    >
      <sphereGeometry args={[1, 24, 16]} />
    </mesh>
  )
}

function Blob({ scale = 2, opacity = 1, y = 0.001 }: { scale?: number; opacity?: number; y?: number }) {
  const tex = useMemo(() => blobTexture(), [])
  return (
    <mesh rotation-x={-Math.PI / 2} position-y={y} scale={scale} renderOrder={-1}>
      <planeGeometry />
      <meshBasicMaterial map={tex} transparent opacity={opacity} depthWrite={false} toneMapped={false} />
    </mesh>
  )
}

function Cam({ position, target, fov }: { position: [number, number, number]; target: [number, number, number]; fov: number }) {
  const ref = useRef<THREE.PerspectiveCamera>(null)
  useLayoutEffect(() => {
    ref.current?.lookAt(...target)
  })
  return <PerspectiveCamera ref={ref} makeDefault position={position} fov={fov} />
}

/* ------------------------------------------------------------------ hero */

const PLINTH_H = 0.42

function Plinth() {
  const geo = useMemo(
    () =>
      new THREE.LatheGeometry(
        profile([
          [0, 0],
          [1.3, 0, 0.05],
          [1.3, PLINTH_H, 0.08],
          [0, PLINTH_H],
        ]),
        96,
      ),
    [],
  )
  const base = useMemo(
    () =>
      new THREE.LatheGeometry(
        profile([
          [0, -0.12],
          [1.62, -0.12, 0.03],
          [1.62, 0, 0.03],
          [0, 0],
        ]),
        96,
      ),
    [],
  )
  return (
    <group>
      <mesh geometry={geo}>
        <meshPhysicalMaterial color="#dcd4c8" roughness={0.9} sheen={0.3} sheenColor="#ffffff" envMapIntensity={0.8} />
      </mesh>
      <mesh geometry={base}>
        <meshPhysicalMaterial color="#c9bfb0" roughness={0.85} envMapIntensity={0.7} />
      </mesh>
    </group>
  )
}

const LEAF_GREENS = ['#5f6c50', '#7a8764', '#3f4a3c', '#909b78']

function Leaf({ color, ...props }: { color: string } & ThreeElements['group']) {
  const geo = useMemo(() => leafGeometry(), [])
  return (
    <group {...props}>
      <mesh geometry={geo}>
        <meshPhysicalMaterial color={color} roughness={0.55} side={THREE.DoubleSide} sheen={0.5} sheenColor="#e8f0d8" envMapIntensity={0.9} />
      </mesh>
    </group>
  )
}

/** A lavender sprig: thin stem plus whorls of buds, all instanced. */
function Sprig(props: ThreeElements['group']) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const count = 34
  useLayoutEffect(() => {
    const m = ref.current
    if (!m) return
    const o = new THREE.Object3D()
    const c = new THREE.Color()
    for (let i = 0; i < count; i++) {
      const t = i / count
      const y = 0.95 + t * 0.75
      const a = i * 2.4
      const r = 0.045 * (1 - t * 0.5)
      o.position.set(Math.cos(a) * r, y, Math.sin(a) * r)
      o.rotation.set(Math.sin(a) * 0.5, a, Math.cos(a) * 0.5)
      const s = 0.05 * (1 - t * 0.45)
      o.scale.set(s, s * 1.5, s)
      o.updateMatrix()
      m.setMatrixAt(i, o.matrix)
      m.setColorAt(i, c.set(i % 3 === 0 ? '#6f5d92' : i % 3 === 1 ? '#8c7aa8' : '#a896c4'))
    }
    m.instanceMatrix.needsUpdate = true
    if (m.instanceColor) m.instanceColor.needsUpdate = true
  }, [])
  return (
    <group {...props}>
      <mesh position-y={0.85}>
        <cylinderGeometry args={[0.008, 0.012, 1.7, 6]} />
        <meshStandardMaterial color="#6b7556" roughness={0.7} />
      </mesh>
      <instancedMesh ref={ref} args={[undefined, undefined, count]}>
        <sphereGeometry args={[1, 10, 8]} />
        <meshPhysicalMaterial roughness={0.6} sheen={0.8} sheenColor="#e6dcf5" />
      </instancedMesh>
    </group>
  )
}

export function HeroScene() {
  const p = byId('serum-lavender')
  const tilt = useRef<THREE.Group>(null)
  const spin = useRef<THREE.Group>(null)
  const size = useThree((s) => s.size)
  const narrow = size.width / size.height < 0.9
  useFrame((_, dt) => {
    if (spin.current) spin.current.rotation.y += dt * 0.32
    if (tilt.current) {
      tilt.current.rotation.y = damp(tilt.current.rotation.y, pointer.x * 0.22, 3, dt)
      tilt.current.rotation.x = damp(tilt.current.rotation.x, pointer.y * 0.05, 3, dt)
    }
  })
  return (
    <>
      <Cam position={[0, 2.2, narrow ? 12.5 : 10.6]} target={[0, 1.55, 0]} fov={30} />
      <StudioLights res={256} />
      <GlassBackdrop color="#e6e0e8" />
      <group ref={tilt}>
        <Plinth />
        <Float speed={1.4} rotationIntensity={0} floatIntensity={0.6} floatingRange={[0.02, 0.12]}>
          <group position-y={PLINTH_H} scale={1.32} ref={spin}>
            <VesselModel p={p} q="hi" />
          </group>
        </Float>
        <ContactShadows position-y={PLINTH_H + 0.003} scale={2.6} blur={2.4} far={2.2} opacity={0.55} resolution={512} color="#3b3328" />

        <Float speed={1.1} rotationIntensity={0.5} floatIntensity={1}>
          <Leaf color={LEAF_GREENS[0]} position={[-1.55, 2.75, 0.4]} rotation={[0.25, 0.35, 0.8]} scale={0.6} />
        </Float>
        <Float speed={0.9} rotationIntensity={0.6} floatIntensity={1.2}>
          <Leaf color={LEAF_GREENS[1]} position={[1.45, 3.25, -0.5]} rotation={[0.2, -0.4, -1.0]} scale={0.48} />
        </Float>
        <Float speed={1.3} rotationIntensity={0.4} floatIntensity={0.8}>
          <Leaf color={LEAF_GREENS[3]} position={[1.7, 1.15, 0.9]} rotation={[0.35, -0.3, -2.3]} scale={0.42} />
        </Float>
        <Float speed={1} rotationIntensity={0.5} floatIntensity={0.9}>
          <Leaf color={LEAF_GREENS[2]} position={[-1.85, 1.0, -0.2]} rotation={[0.3, 0.4, 2.2]} scale={0.4} />
        </Float>
        <Float speed={0.8} rotationIntensity={0.3} floatIntensity={0.7}>
          <Sprig position={[-1.05, 0.2, -1.1]} rotation={[0.1, 0, 0.32]} scale={1.55} />
        </Float>
        <Float speed={0.7} rotationIntensity={0.3} floatIntensity={0.8}>
          <Sprig position={[1.25, 0.9, -1.3]} rotation={[-0.1, 0.5, -0.5]} scale={1.2} />
        </Float>
      </group>
      <Blob scale={4.8} opacity={0.7} y={-0.119} />
    </>
  )
}

/* ------------------------------------------------------------------ catalog card */

function frame(p: Product, aspect: number, fov: number, pad = 1.32) {
  const f = fitOf(p)
  const w = p.vessel === 'set' ? 2.25 : p.vessel === 'jar' ? 1.48 * f.scale : p.vessel === 'dropper' ? 1.06 : p.vessel === 'pump' ? 1.0 : 0.72
  const t = Math.tan(THREE.MathUtils.degToRad(fov / 2))
  const byH = (f.height * pad) / (2 * t)
  const byW = (w * pad * 1.12) / (2 * t * aspect)
  return { dist: Math.max(byH, byW), h: f.height, scale: f.scale }
}

export function ProductScene({ p, hover = false, phase = 0, spinSpeed = 0.35 }: { p: Product; hover?: boolean; phase?: number; spinSpeed?: number }) {
  const g = useRef<THREE.Group>(null)
  const shadow = useRef<THREE.Mesh>(null)
  const lift = useRef(0)
  const swing = useRef(phase)
  const appear = useRef(0)
  const size = useThree((s) => s.size)
  const aspect = size.width / Math.max(1, size.height)
  const fov = 26
  const { dist, h, scale } = frame(p, aspect, fov)
  useFrame((_, dt) => {
    lift.current = damp(lift.current, hover ? 1 : 0, 5, dt)
    appear.current = damp(appear.current, 1, 3.5, Math.min(dt, 0.05))
    const l = lift.current
    const a = appear.current
    if (g.current) g.current.scale.setScalar(0.82 + 0.18 * a)
    if (g.current && p.vessel === 'set') {
      // a set would hide one item behind the other on a full turn, so it sways instead
      swing.current += dt * (0.5 + l * 1.2)
      g.current.rotation.y = Math.sin(swing.current) * 0.55
      g.current.position.y = l * 0.16 - (1 - a) * 0.35
    } else if (g.current) {
      g.current.rotation.y += dt * (spinSpeed + l * 1.6 + (1 - a) * 3)
      g.current.position.y = l * 0.16 - (1 - a) * 0.35
    }
    if (shadow.current) {
      const s = (p.vessel === 'jar' || p.vessel === 'set' ? 2.6 : 1.9) * (1 - l * 0.12)
      shadow.current.scale.setScalar(s)
      ;(shadow.current.material as THREE.MeshBasicMaterial).opacity = 0.85 - l * 0.35
    }
  })
  return (
    <>
      <Cam position={[0, h * 0.62 + 0.2, dist]} target={[0, h * 0.5 + 0.05, 0]} fov={fov} />
      <StudioLights res={96} />
      <group ref={g} rotation-y={phase}>
        <group scale={scale}>
          <VesselModel p={p} />
        </group>
      </group>
      <mesh ref={shadow} rotation-x={-Math.PI / 2} position-y={0.002}>
        <planeGeometry />
        <meshBasicMaterial map={blobTexture()} transparent depthWrite={false} toneMapped={false} />
      </mesh>
    </>
  )
}
