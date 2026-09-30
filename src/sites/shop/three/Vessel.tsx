import { useEffect, useMemo, useState } from 'react'
import * as THREE from 'three'
import { byId, type Product } from '../data'
import { labelTexture, vesselGeo, type VesselGeo } from './geometry'

let fontStamp = 0
const listeners = new Set<(n: number) => void>()
let fontsRequested = false

/** Labels are drawn on a 2D canvas, so wait for the web fonts before painting them for real. */
export function useFontStamp() {
  const [n, set] = useState(fontStamp)
  useEffect(() => {
    listeners.add(set)
    if (!fontsRequested && typeof document !== 'undefined' && document.fonts) {
      fontsRequested = true
      Promise.all([
        document.fonts.load("italic 300 60px 'Fraunces Variable'", 'Lavanda'),
        document.fonts.load("400 60px 'Fraunces Variable'", 'N° 0123456789'),
        document.fonts.load("600 20px 'Manrope Variable'", 'сыворотка масло крем'),
      ])
        .catch(() => undefined)
        .then(() => {
          fontStamp = 1
          listeners.forEach((l) => l(1))
        })
    }
    return () => {
      listeners.delete(set)
    }
  }, [])
  return n
}

export type Quality = 'hi' | 'lo'

const tint = (hex: string, l: number) => new THREE.Color(hex).lerp(new THREE.Color('#ffffff'), l)

function useMaterials(p: Product, q: Quality) {
  return useMemo(() => {
    const opaque = p.glassOpacity > 0.85
    const glass =
      q === 'hi'
        ? new THREE.MeshPhysicalMaterial({
            color: tint(p.glass, opaque ? 0.1 : 0.62),
            transmission: opaque ? 0.55 : 1,
            roughness: opaque ? 0.35 : 0.14,
            thickness: 0.32,
            ior: 1.5,
            attenuationColor: new THREE.Color(p.glass),
            attenuationDistance: opaque ? 0.35 : 2.4,
            clearcoat: 0.35,
            clearcoatRoughness: 0.1,
            specularIntensity: 1,
            envMapIntensity: 1.1,
          })
        : new THREE.MeshPhysicalMaterial({
            color: tint(p.glass, 0.12),
            transparent: true,
            opacity: Math.min(0.95, p.glassOpacity + 0.08),
            roughness: 0.14,
            metalness: 0.05,
            clearcoat: 1,
            clearcoatRoughness: 0.08,
            envMapIntensity: 1.6,
            depthWrite: false,
          })
    const liquid = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(p.liquid),
      roughness: 0.25,
      sheen: 0.4,
      sheenColor: tint(p.liquid, 0.5),
      envMapIntensity: 0.9,
    })
    const cap = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(p.cap),
      roughness: p.capKind === 'wood' ? 0.78 : 0.48,
      clearcoat: p.capKind === 'matte' ? 0.25 : 0,
      clearcoatRoughness: 0.5,
      envMapIntensity: 1,
    })
    const rubber = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(p.cap),
      roughness: 0.62,
      sheen: 0.6,
      sheenColor: new THREE.Color('#ffffff'),
      sheenRoughness: 0.6,
    })
    const collar = new THREE.MeshStandardMaterial({ color: new THREE.Color('#b8a98f'), metalness: 0.85, roughness: 0.28 })
    const tube = new THREE.MeshStandardMaterial({ color: new THREE.Color('#e8e4dc'), roughness: 0.15, transparent: q === 'lo', opacity: 0.8 })
    return { glass, liquid, cap, rubber, collar, metal: collar, tube }
  }, [p, q])
}

function Single({ p, g, q, stamp }: { p: Product; g: VesselGeo; q: Quality; stamp: number }) {
  const m = useMaterials(p, q)
  const labelMap = useMemo(() => labelTexture(p, g.label, stamp), [p, g, stamp])
  const labelGeo = useMemo(() => {
    const { r, h, arc } = g.label
    return new THREE.CylinderGeometry(r, r, h, 64, 1, true, -arc / 2, arc)
  }, [g])
  return (
    <group>
      <mesh geometry={g.liquid} material={m.liquid} renderOrder={0} />
      {g.parts.map((part, i) => (
        <mesh key={i} geometry={part.geo} material={m[part.mat]} castShadow />
      ))}
      <mesh geometry={labelGeo} position-y={g.label.y}>
        <meshStandardMaterial map={labelMap} roughness={0.85} envMapIntensity={0.7} />
      </mesh>
      <mesh geometry={g.glass} material={m.glass} renderOrder={2} />
    </group>
  )
}

/** A procedurally built bottle or jar. Origin at the base, centred. */
export function VesselModel({ p, q = 'lo' }: { p: Product; q?: Quality }) {
  const stamp = useFontStamp()
  if (p.vessel === 'set') {
    return <SetModel q={q} stamp={stamp} />
  }
  return <Single p={p} g={vesselGeo(p.vessel)} q={q} stamp={stamp} />
}

function SetModel({ q, stamp }: { q: Quality; stamp: number }) {
  const serum = byId('serum-lavender')
  const cream = byId('cream-oat')
  return (
    <group>
      <group position={[-0.42, 0, -0.18]} rotation-y={0.35}>
        <Single p={serum} g={vesselGeo('dropper')} q={q} stamp={stamp} />
      </group>
      <group position={[0.55, 0, 0.32]} scale={0.82} rotation-y={-0.4}>
        <Single p={cream} g={vesselGeo('jar')} q={q} stamp={stamp} />
      </group>
    </group>
  )
}

/** Visual height after the per-vessel fit scale, used to frame cameras. */
export function fitOf(p: Product) {
  switch (p.vessel) {
    case 'jar':
      return { scale: 1.42, height: 1.06 * 1.42 }
    case 'set':
      return { scale: 1, height: 2.12 }
    case 'oil':
      return { scale: 0.96, height: 2.24 * 0.96 }
    case 'pump':
      return { scale: 1, height: 2.05 }
    default:
      return { scale: 1, height: 2.12 }
  }
}
