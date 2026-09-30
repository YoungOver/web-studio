import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { buildSpeedShape } from './speedShape'
import { LoopKick } from './ChromeCanvas'

export type MaterialTarget = {
  color: string
  roughness: number
  metalness: number
  clearcoat: number
  clearcoatRoughness: number
}

function useSpeedShape() {
  return useMemo(() => buildSpeedShape(), [])
}

function Sample({ target }: { target: MaterialTarget }) {
  const geo = useSpeedShape()
  const mat = useRef<THREE.MeshPhysicalMaterial>(null)
  const turntable = useRef<THREE.Group>(null)
  const targetColor = useMemo(() => new THREE.Color(target.color), [target.color])
  // JSX props get only the first values; later changes are lerped in useFrame,
  // otherwise r3f would re-apply the new props instantly on re-render.
  const [initial] = useState(target)

  useEffect(() => () => geo.dispose(), [geo])


  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05)
    if (turntable.current) turntable.current.rotation.y += dt * 0.14
    const m = mat.current
    if (!m) return
    const k = 1 - Math.exp(-dt * 5)
    m.color.lerp(targetColor, k)
    m.roughness += (target.roughness - m.roughness) * k
    m.metalness += (target.metalness - m.metalness) * k
    m.clearcoat += (target.clearcoat - m.clearcoat) * k
    m.clearcoatRoughness += (target.clearcoatRoughness - m.clearcoatRoughness) * k
  })

  return (
    <group ref={turntable} rotation-y={0.35}>
      {/* slight rake: nose a touch down, like a panel on a display stand */}
      <mesh geometry={geo} position-y={0.2} rotation={[0.03, 0, -0.045]} castShadow>
        <meshPhysicalMaterial
          ref={mat}
          color={initial.color}
          roughness={initial.roughness}
          metalness={initial.metalness}
          clearcoat={initial.clearcoat}
          clearcoatRoughness={initial.clearcoatRoughness}
          envMapIntensity={1.15}
        />
      </mesh>
      {/* turntable */}
      <mesh position-y={0.03}>
        <cylinderGeometry args={[2.7, 2.74, 0.06, 128]} />
        <meshStandardMaterial color="#101215" roughness={0.55} metalness={0.35} />
      </mesh>
      <mesh position-y={0.062} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[2.655, 2.665, 192]} />
        <meshBasicMaterial color="#5b8dff" transparent opacity={0.45} toneMapped={false} />
      </mesh>
    </group>
  )
}

/** Pull the camera back on narrow canvases so the whole sample stays in frame. */
function CameraRig() {
  const camera = useThree((s) => s.camera)
  const size = useThree((s) => s.size)
  useEffect(() => {
    const aspect = size.width / Math.max(size.height, 1)
    const base = 8.6
    const len = base * Math.max(1, 1.45 / aspect)
    camera.position.setLength(len)
    camera.lookAt(0, 0.35, 0)
  }, [camera, size])
  return null
}

export function FilmScene({ target, active, interactive }: { target: MaterialTarget; active: boolean; interactive: boolean }) {
  return (
    <Canvas
      style={{ position: 'absolute', inset: 0 }}
      dpr={[1, 1.75]}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [5.4, 2.3, 5.6], fov: 30 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.05
      }}
    >
      <CameraRig />
      <LoopKick active={active} />
      <ambientLight intensity={0.15} />
      <Sample target={target} />
      <ContactShadows position={[0, 0.065, 0]} opacity={0.8} scale={6.5} blur={2.2} far={1.5} resolution={512} color="#000000" />
      <Environment resolution={256} frames={1}>
        {/* long overhead softbox — the main stripe along the roof */}
        <Lightformer form="rect" intensity={4} position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[12, 1.6, 1]} />
        {/* side strips like a detailing booth's wall lamps */}
        <Lightformer form="rect" intensity={2.4} position={[-6, 1.6, 0]} rotation-y={Math.PI / 2} scale={[14, 0.35, 1]} />
        <Lightformer form="rect" intensity={2.4} position={[-6, 3.2, 0]} rotation-y={Math.PI / 2} scale={[14, 0.2, 1]} />
        <Lightformer form="rect" intensity={2.4} position={[6, 1.6, 0]} rotation-y={-Math.PI / 2} scale={[14, 0.35, 1]} />
        <Lightformer form="rect" intensity={1.2} position={[0, 2, 7]} scale={[10, 1.2, 1]} />
        {/* signal-blue kicker from behind */}
        <Lightformer form="ring" color="#3b7bff" intensity={3.5} position={[-2, 3, -6]} scale={3} onUpdate={(self) => self.lookAt(0, 0, 0)} />
        <Lightformer form="rect" color="#9fc0ff" intensity={1} position={[4, 0.5, -5]} scale={[6, 0.5, 1]} onUpdate={(self) => self.lookAt(0, 0, 0)} />
      </Environment>
      {interactive && (
        <OrbitControls
          makeDefault
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.6}
          minPolarAngle={Math.PI / 3.2}
          maxPolarAngle={Math.PI / 2.15}
          target={[0, 0.35, 0]}
        />
      )}
    </Canvas>
  )
}
