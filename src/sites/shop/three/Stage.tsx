import { useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { View } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Pauses the shared canvas when none of the 3D sections are near the viewport,
 * or when a modal covers the page. Clears once before stopping so no stale view is left behind.
 */
function Pauser({ sections, paused }: { sections: string[]; paused: boolean }) {
  const setFrameloop = useThree((s) => s.setFrameloop)
  const gl = useThree((s) => s.gl)
  useEffect(() => {
    const seen = new Map<Element, boolean>()
    let forced = paused
    const apply = () => {
      const any = [...seen.values()].some(Boolean)
      if (any && !forced) setFrameloop('always')
      else {
        setFrameloop('never')
        if (!any) {
          gl.setScissorTest(false)
          gl.clear(true, true)
        }
      }
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) seen.set(e.target, e.isIntersecting)
        apply()
      },
      { rootMargin: '120px 0px' },
    )
    const els = sections.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e)
    els.forEach((el) => io.observe(el))
    forced = paused
    apply()
    return () => io.disconnect()
  }, [sections.join(','), paused, setFrameloop, gl])
  return null
}

export default function Stage({ sections, paused }: { sections: string[]; paused: boolean }) {
  return (
    <Canvas
      className="lv-stage"
      style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 5 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.05
      }}
      eventPrefix="client"
    >
      <View.Port />
      <Pauser sections={sections} paused={paused} />
    </Canvas>
  )
}
