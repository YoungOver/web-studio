import * as THREE from 'three'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

/**
 * "Speed shape": the long, low teardrop panel paint and film suppliers use to show a finish.
 * Plan view is a teardrop (blunt nose, long tapered tail), the profile is a fastback,
 * the belly is flat, and a raised shoulder crease runs along both sides like a hood character line.
 * Nose points to +x, sits on y = 0.
 */
export function buildSpeedShape({
  length = 4.3,
  halfWidth = 0.86,
  height = 0.72,
  segU = 220,
  segV = 260,
} = {}) {
  const tear = (s: number, a: number, b: number) => {
    const peak = a / (a + b)
    const norm = Math.pow(peak, a) * Math.pow(1 - peak, b)
    return (Math.pow(s, a) * Math.pow(1 - s, b)) / norm
  }
  const superPow = (c: number, e: number) => Math.sign(c) * Math.pow(Math.abs(c), e)

  const creaseAt = 0.46 // radians above the side, where the character line sits
  const creaseWidth = 0.11
  const creaseHeight = 0.045

  const positions: number[] = []
  for (let i = 0; i <= segU; i++) {
    const s = i / segU // 0 nose → 1 tail
    const w = tear(s, 0.5, 0.72) * halfWidth
    const h = tear(s, 0.45, 0.95) * height
    const x = length / 2 - s * length
    const fade = Math.pow(Math.sin(Math.PI * Math.min(1, s * 1.15)), 0.7) // crease dies out at nose and tail
    for (let j = 0; j <= segV; j++) {
      const t = (j / segV) * Math.PI * 2
      const c = Math.cos(t)
      const sn = Math.sin(t)
      let z = w * superPow(c, 0.78)
      let y = sn >= 0 ? h * Math.pow(sn, 0.82) : -h * 0.1 * Math.pow(-sn, 0.25)
      if (sn > 0) {
        // tent-shaped ridge → a narrow, crisp highlight line along each shoulder
        const d = Math.min(Math.abs(t - creaseAt), Math.abs(t - (Math.PI - creaseAt)))
        const ridge = Math.max(0, 1 - d / creaseWidth) * creaseHeight * fade
        z += Math.sign(c) * ridge * 0.6
        y += ridge
      }
      positions.push(x, y, z)
    }
  }

  const indices: number[] = []
  const row = segV + 1
  for (let i = 0; i < segU; i++) {
    for (let j = 0; j < segV; j++) {
      const a = i * row + j
      const b = (i + 1) * row + j
      const c = (i + 1) * row + j + 1
      const d = i * row + j + 1
      indices.push(a, d, b, b, d, c)
    }
  }

  let geo: THREE.BufferGeometry = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setIndex(indices)
  geo = mergeVertices(geo, 1e-5)
  geo.computeVertexNormals()
  geo.computeBoundingBox()
  const bb = geo.boundingBox!
  geo.translate(-(bb.min.x + bb.max.x) / 2, -bb.min.y, -(bb.min.z + bb.max.z) / 2)
  return geo
}
