import { useRef, type RefObject } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, OrbitControls } from '@react-three/drei'
import type { Product } from '../data'
import { GlassBackdrop, StudioLights } from './Scenes'
import { VesselModel, fitOf } from './Vessel'

function Turntable({ p, idle }: { p: Product; idle: RefObject<boolean> }) {
  const g = useRef<THREE.Group>(null)
  const f = fitOf(p)
  useFrame((_, dt) => {
    if (g.current && idle.current) g.current.rotation.y += dt * 0.25
  })
  return (
    <group ref={g} position-y={-f.height / 2}>
      <group scale={f.scale}>
        <VesselModel p={p} q="hi" />
      </group>
      <ContactShadows position-y={0.002} scale={4} blur={2.2} far={2.5} opacity={0.5} resolution={512} color="#3b3328" />
    </group>
  )
}

/** Product viewer for the detail modal — its own small canvas, mounted only while the modal is open. */
export default function Viewer({ p }: { p: Product }) {
  const idle = useRef(true)
  const f = fitOf(p)
  const dist = p.vessel === 'set' || p.vessel === 'jar' ? 7.4 : 7
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, f.height * 0.18, dist], fov: 30 }}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.05
      }}
      style={{ touchAction: 'none' }}
    >
      <StudioLights res={256} />
      <GlassBackdrop color={p.tone} />
      <Turntable p={p} idle={idle} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI * 0.28}
        maxPolarAngle={Math.PI * 0.56}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.7}
        onStart={() => (idle.current = false)}
        onEnd={() => (idle.current = true)}
      />
    </Canvas>
  )
}
