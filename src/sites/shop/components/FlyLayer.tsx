import { motion } from 'motion/react'
import { byId } from '../data'
import { useShop, type Flight } from '../store'
import { Glyph } from './Glyph'

const SIZE = 96

function One({ f, onDone }: { f: Flight; onDone: () => void }) {
  const target = document.getElementById('lv-cart-btn')?.getBoundingClientRect()
  const sx = f.from.left + f.from.width / 2 - SIZE / 2
  const sy = f.from.top + f.from.height / 2 - SIZE / 2
  const tx = target ? target.left + target.width - 22 - SIZE / 2 : window.innerWidth - 60
  const ty = target ? target.top + target.height / 2 - SIZE / 2 : 20
  const mx = sx + (tx - sx) * 0.4
  const my = Math.max(ty + 70, Math.min(sy - 110, window.innerHeight * 0.45))
  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[80]"
      style={{ width: SIZE, height: SIZE }}
      initial={{ x: sx, y: sy, scale: 1.25, opacity: 0, rotate: 0 }}
      animate={{ x: [sx, mx, tx], y: [sy, my, ty], scale: [1.25, 0.9, 0.22], opacity: [0, 1, 0.9], rotate: [0, -14, 8] }}
      transition={{ duration: 0.85, ease: [0.45, 0, 0.2, 1], times: [0, 0.45, 1] }}
      onAnimationComplete={onDone}
    >
      <Glyph p={byId(f.id)} className="h-full w-full drop-shadow-[0_12px_18px_rgba(30,30,28,0.3)]" />
    </motion.div>
  )
}

/** Items that fly from a product card into the cart button. */
export function FlyLayer() {
  const { flights, land } = useShop()
  return (
    <>
      {flights.map((f) => (
        <One key={f.key} f={f} onDone={() => land(f.key)} />
      ))}
    </>
  )
}
