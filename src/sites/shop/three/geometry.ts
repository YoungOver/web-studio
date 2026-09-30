import * as THREE from 'three'
import type { Product, Vessel } from '../data'

/** [x, y, cornerRadius] — the corner radius rounds that vertex with a quadratic arc. */
type Pt = [number, number, number?]

export function profile(pts: Pt[], seg = 8): THREE.Vector2[] {
  const out: THREE.Vector2[] = []
  const a = new THREE.Vector2()
  const b = new THREE.Vector2()
  for (let i = 0; i < pts.length; i++) {
    const [x, y, r = 0] = pts[i]
    if (!r || i === 0 || i === pts.length - 1) {
      out.push(new THREE.Vector2(x, y))
      continue
    }
    const [px, py] = pts[i - 1]
    const [nx, ny] = pts[i + 1]
    a.set(px - x, py - y)
    b.set(nx - x, ny - y)
    const rr = Math.min(r, a.length() / 2, b.length() / 2)
    a.normalize()
    b.normalize()
    const p0x = x + a.x * rr
    const p0y = y + a.y * rr
    const p2x = x + b.x * rr
    const p2y = y + b.y * rr
    for (let s = 0; s <= seg; s++) {
      const t = s / seg
      const u = 1 - t
      out.push(new THREE.Vector2(u * u * p0x + 2 * u * t * x + t * t * p2x, u * u * p0y + 2 * u * t * y + t * t * p2y))
    }
  }
  return out
}

const lathe = (pts: Pt[], radial = 72) => new THREE.LatheGeometry(profile(pts), radial)

export interface LabelSpec {
  r: number
  y: number
  h: number
  arc: number
}

export interface CapPart {
  geo: THREE.BufferGeometry
  mat: 'cap' | 'rubber' | 'metal' | 'tube' | 'collar'
}

export interface VesselGeo {
  glass: THREE.BufferGeometry
  liquid: THREE.BufferGeometry
  parts: CapPart[]
  label: LabelSpec
  height: number
  width: number
}

function dropper(): VesselGeo {
  const glass = lathe([
    [0, 0],
    [0.5, 0, 0.07],
    [0.53, 0.06, 0.05],
    [0.53, 1.02, 0.34],
    [0.2, 1.3, 0.09],
    [0.2, 1.46],
    [0, 1.46],
  ])
  const liquid = lathe([
    [0, 0.05],
    [0.47, 0.05, 0.06],
    [0.49, 0.1],
    [0.49, 0.72],
    [0, 0.72],
  ])
  const collar = lathe([
    [0, 1.36],
    [0.235, 1.36, 0.03],
    [0.245, 1.4],
    [0.245, 1.64, 0.03],
    [0.18, 1.66],
    [0, 1.66],
  ])
  const bulb = lathe([
    [0, 1.64],
    [0.17, 1.64],
    [0.17, 1.72, 0.03],
    [0.125, 1.79, 0.05],
    [0.158, 1.92, 0.08],
    [0.15, 2.06, 0.08],
    [0, 2.12],
  ])
  const tube = new THREE.CylinderGeometry(0.032, 0.022, 1.18, 16, 1)
  tube.translate(0, 0.78, 0)
  return {
    glass,
    liquid,
    parts: [
      { geo: collar, mat: 'collar' },
      { geo: bulb, mat: 'rubber' },
      { geo: tube, mat: 'tube' },
    ],
    label: { r: 0.536, y: 0.52, h: 0.6, arc: 1.9 },
    height: 2.12,
    width: 1.06,
  }
}

function jar(): VesselGeo {
  const glass = lathe([
    [0, 0],
    [0.68, 0, 0.1],
    [0.74, 0.08, 0.06],
    [0.74, 0.6, 0.1],
    [0.64, 0.7, 0.03],
    [0.64, 0.8],
    [0, 0.8],
  ])
  const liquid = lathe([
    [0, 0.09],
    [0.64, 0.09, 0.08],
    [0.68, 0.16],
    [0.68, 0.58],
    [0.3, 0.62],
    [0, 0.66],
  ])
  const lid = lathe([
    [0, 0.72],
    [0.7, 0.72, 0.03],
    [0.715, 0.76],
    [0.715, 1.02, 0.05],
    [0.64, 1.06, 0.04],
    [0, 1.06],
  ])
  return {
    glass,
    liquid,
    parts: [{ geo: lid, mat: 'cap' }],
    label: { r: 0.746, y: 0.34, h: 0.36, arc: 1.55 },
    height: 1.06,
    width: 1.48,
  }
}

function pump(): VesselGeo {
  const glass = lathe([
    [0, 0],
    [0.42, 0, 0.06],
    [0.45, 0.05, 0.04],
    [0.45, 1.42, 0.2],
    [0.16, 1.62, 0.06],
    [0.16, 1.72],
    [0, 1.72],
  ])
  const liquid = lathe([
    [0, 0.05],
    [0.4, 0.05, 0.05],
    [0.41, 0.1],
    [0.41, 1.08],
    [0, 1.08],
  ])
  const collar = lathe([
    [0, 1.62],
    [0.2, 1.62, 0.02],
    [0.205, 1.65],
    [0.205, 1.8, 0.02],
    [0.07, 1.82],
    [0, 1.82],
  ])
  const stem = new THREE.CylinderGeometry(0.045, 0.045, 0.14, 16)
  stem.translate(0, 1.88, 0)
  const head = lathe([
    [0, 1.93],
    [0.16, 1.93, 0.03],
    [0.16, 2.03, 0.04],
    [0, 2.05],
  ])
  const nozzle = new THREE.BoxGeometry(0.32, 0.06, 0.08)
  nozzle.translate(0.26, 1.99, 0)
  const tube = new THREE.CylinderGeometry(0.02, 0.02, 1.6, 10)
  tube.translate(0, 0.84, 0)
  return {
    glass,
    liquid,
    parts: [
      { geo: collar, mat: 'cap' },
      { geo: stem, mat: 'cap' },
      { geo: head, mat: 'cap' },
      { geo: nozzle, mat: 'cap' },
      { geo: tube, mat: 'tube' },
    ],
    label: { r: 0.456, y: 0.66, h: 0.72, arc: 1.9 },
    height: 2.05,
    width: 0.9,
  }
}

function oil(): VesselGeo {
  const glass = lathe([
    [0, 0],
    [0.34, 0, 0.05],
    [0.36, 0.05, 0.04],
    [0.36, 1.5, 0.22],
    [0.13, 1.74, 0.05],
    [0.13, 1.88],
    [0, 1.88],
  ])
  const liquid = lathe([
    [0, 0.05],
    [0.32, 0.05, 0.05],
    [0.33, 0.1],
    [0.33, 1.2],
    [0, 1.2],
  ])
  const cap = lathe([
    [0, 1.78],
    [0.17, 1.78, 0.02],
    [0.175, 1.82],
    [0.175, 2.22, 0.07],
    [0, 2.24],
  ])
  return {
    glass,
    liquid,
    parts: [{ geo: cap, mat: 'cap' }],
    label: { r: 0.366, y: 0.72, h: 0.82, arc: 2.1 },
    height: 2.24,
    width: 0.72,
  }
}

const cache = new Map<Vessel, VesselGeo>()
export function vesselGeo(v: Exclude<Vessel, 'set'>): VesselGeo {
  let g = cache.get(v)
  if (!g) {
    g = v === 'dropper' ? dropper() : v === 'jar' ? jar() : v === 'pump' ? pump() : oil()
    cache.set(v, g)
  }
  return g
}

/* ---------- label texture ---------- */

const labelCache = new Map<string, THREE.CanvasTexture>()

const SERIF = "'Fraunces Variable', 'Sitka Display', 'Palatino Linotype', 'PT Serif', Georgia, serif"
const SANS = "'Manrope Variable', 'Segoe UI', system-ui, sans-serif"

export function labelTexture(p: Product, spec: LabelSpec, stamp: number): THREE.CanvasTexture {
  const k = `${p.id}:${spec.r}:${stamp}`
  const hit = labelCache.get(k)
  if (hit) return hit
  const aspect = (spec.r * spec.arc) / spec.h
  const H = 512
  const W = Math.round(H * aspect)
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const g = c.getContext('2d')!
  const dark = p.vessel === 'jar' && p.glassOpacity > 0.88 && p.cap === '#1e1e1c'
  const paper = dark ? '#2a2f27' : '#f3efe8'
  const ink = dark ? '#ece6da' : '#1e1e1c'
  g.fillStyle = paper
  g.fillRect(0, 0, W, H)
  // subtle paper fibre
  for (let i = 0; i < 1400; i++) {
    g.fillStyle = `rgba(${dark ? '255,255,255' : '60,50,40'},${Math.random() * 0.035})`
    g.fillRect(Math.random() * W, Math.random() * H, 1 + Math.random() * 2, 1)
  }
  g.strokeStyle = ink
  g.globalAlpha = 0.28
  g.lineWidth = 2
  const inset = H * 0.06
  g.strokeRect(inset, inset, W - inset * 2, H - inset * 2)
  g.globalAlpha = 1
  g.fillStyle = ink
  g.textAlign = 'center'
  g.textBaseline = 'alphabetic'
  const cx = W / 2
  const wide = aspect > 2.2
  if (wide) {
    g.font = `italic 300 ${H * 0.34}px ${SERIF}`
    g.fillText('Lavanda', cx, H * 0.5)
    g.font = `600 ${H * 0.085}px ${SANS}`
    g.globalAlpha = 0.75
    g.fillText(`${p.kind.toLowerCase()}  ·  N° ${p.num}`, cx, H * 0.72)
    g.globalAlpha = 1
  } else {
    g.font = `italic 300 ${H * 0.2}px ${SERIF}`
    g.fillText('Lavanda', cx, H * 0.33)
    g.globalAlpha = 0.5
    g.fillRect(cx - W * 0.08, H * 0.42, W * 0.16, 2)
    g.globalAlpha = 1
    g.font = `400 ${H * 0.15}px ${SERIF}`
    g.fillText(`N° ${p.num}`, cx, H * 0.62)
    g.font = `600 ${H * 0.058}px ${SANS}`
    g.globalAlpha = 0.72
    g.fillText(p.kind.toLowerCase(), cx, H * 0.76)
    g.font = `500 ${H * 0.05}px ${SANS}`
    g.fillText(p.title.toLowerCase(), cx, H * 0.85)
    g.globalAlpha = 1
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  labelCache.set(k, tex)
  return tex
}

/* ---------- blob shadow ---------- */

let blob: THREE.CanvasTexture | null = null
export function blobTexture() {
  if (blob) return blob
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')!
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  gr.addColorStop(0, 'rgba(40,34,26,0.55)')
  gr.addColorStop(0.45, 'rgba(40,34,26,0.22)')
  gr.addColorStop(1, 'rgba(40,34,26,0)')
  g.fillStyle = gr
  g.fillRect(0, 0, 128, 128)
  blob = new THREE.CanvasTexture(c)
  return blob
}

/* ---------- leaf ---------- */

let leafGeo: THREE.BufferGeometry | null = null
export function leafGeometry() {
  if (leafGeo) return leafGeo
  const s = new THREE.Shape()
  s.moveTo(0, 0)
  s.quadraticCurveTo(0.34, 0.35, 0, 1)
  s.quadraticCurveTo(-0.34, 0.35, 0, 0)
  const g = new THREE.ShapeGeometry(s, 16)
  const pos = g.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    // fold along the midrib and curl along the length
    pos.setZ(i, Math.abs(x) * 0.45 + y * y * 0.28)
  }
  g.computeVertexNormals()
  leafGeo = g
  return g
}
