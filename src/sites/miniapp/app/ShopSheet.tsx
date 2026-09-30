import { motion } from 'motion/react'
import { Check, Coffee } from 'lucide-react'
import { shops, type Shop } from '../data'
import { Row, Sheet, spring } from './ui'

function MiniMap({ activeId, onPick }: { activeId: string; onPick: (id: string) => void }) {
  return (
    <svg viewBox="0 0 280 130" className="block h-auto w-full" aria-hidden>
      <rect width="280" height="130" fill="#eef0ec" />
      {[[8, 8, 70, 30], [86, 6, 60, 26], [154, 4, 56, 30], [218, 8, 56, 40], [6, 56, 44, 34], [84, 50, 30, 30], [150, 44, 40, 26], [236, 60, 40, 30], [12, 100, 60, 26], [92, 96, 70, 30], [184, 104, 50, 22]].map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} rx="3" fill="#e2e5df" />
      ))}
      <path d="M -10 96 C 40 86, 70 104, 120 92 S 200 70, 290 82" stroke="#bcd7ee" strokeWidth="9" fill="none" />
      <path d="M 0 44 L 280 36" stroke="#fff" strokeWidth="7" />
      <path d="M 140 0 L 150 130" stroke="#fff" strokeWidth="5" />
      <path d="M 200 0 L 214 130" stroke="#fff" strokeWidth="6" />
      <path d="M 0 44 L 280 36" stroke="#f6d88a" strokeWidth="2" opacity=".7" />
      <g>
        <circle cx="132" cy="96" r="14" fill="#2481cc" opacity=".12" />
        <circle cx="132" cy="96" r="5.5" fill="#fff" />
        <circle cx="132" cy="96" r="4" fill="#2481cc" />
      </g>
      {shops.map((s) => {
        const active = s.id === activeId
        const [x, y] = s.pin
        return (
          <g key={s.id} onClick={() => onPick(s.id)} style={{ cursor: 'pointer' }}>
            <motion.g initial={false} animate={{ scale: active ? 1.15 : 1 }} transition={spring} style={{ originX: `${x}px`, originY: `${y}px` }}>
              <path d={`M ${x} ${y} c -3 -5 -10 -9 -10 -16 a 10 10 0 0 1 20 0 c 0 7 -7 11 -10 16 z`} fill={active ? '#6b3f1f' : '#fff'} stroke={active ? '#6b3f1f' : '#d6cfc6'} strokeWidth="1" />
              <circle cx={x} cy={y - 16} r="3.6" fill={active ? '#f3d2a8' : '#6b3f1f'} />
            </motion.g>
          </g>
        )
      })}
    </svg>
  )
}

export function ShopSheet({ open, current, onClose, onPick }: { open: boolean; current: Shop; onClose: () => void; onPick: (id: string) => void }) {
  return (
    <Sheet open={open} onClose={onClose} label="Выбор кофейни">
      <div className="px-4 pt-7 pb-3">
        <h2 className="text-[20px] font-bold tracking-[-0.02em]">Где заберёте заказ?</h2>
        <p className="mt-[2px] text-[13.5px] text-[var(--tg-hint)]">Время готовности зависит от загрузки кофейни</p>
      </div>
      <div className="mx-3 overflow-hidden rounded-[14px]">
        <MiniMap activeId={current.id} onPick={onPick} />
      </div>
      <div className="mx-3 mt-3 overflow-hidden rounded-[14px] bg-[var(--tg-sec)]" style={{ marginBottom: 'calc(16px + var(--safe-b, 0px))' }}>
        {shops.map((s, i) => (
          <Row
            key={s.id}
            onClick={() => onPick(s.id)}
            last={i === shops.length - 1}
            icon={
              <span
                className="grid h-9 w-9 place-items-center rounded-full"
                style={{ background: s.id === current.id ? '#6b3f1f' : '#fff', color: s.id === current.id ? '#f3d2a8' : '#6b3f1f' }}
              >
                <Coffee size={17} strokeWidth={2.2} />
              </span>
            }
            title={<span className="font-medium">{s.street}</span>}
            sub={
              <span className="tg-num">
                {s.distance} · открыто {s.hours} · <span style={{ color: s.load === 'Много заказов' ? '#c46a12' : '#177a3a' }}>~{s.eta} мин</span>
              </span>
            }
            right={
              <span className="grid h-[22px] w-[22px] place-items-center">
                {s.id === current.id && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={spring} className="text-[var(--tg-link)]">
                    <Check size={20} strokeWidth={2.8} />
                  </motion.span>
                )}
              </span>
            }
          />
        ))}
      </div>
    </Sheet>
  )
}
