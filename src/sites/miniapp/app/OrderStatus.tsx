import { AnimatePresence, motion } from 'motion/react'
import { Check, Clock, Gift, MapPin, ScanLine, Wallet } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Art } from '../art'
import { byId, rub, type Line } from '../data'
import { IconTile, Row, Section, haptic, spring } from './ui'

export type Order = {
  number: string
  lines: Line[]
  total: number
  street: string
  eta: number
  pickupLabel: string
  payLabel: string
  placedAt: number
}

const DURATION = 11000
const ACCEPT_END = 0.16

const hhmm = (t: number) => {
  const d = new Date(t)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export function OrderStatus({ order, bottomPad, onReady }: { order: Order; bottomPad: number; onReady: () => void }) {
  const [p, setP] = useState(0)
  const fired = useRef(false)

  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const v = Math.min(1, (now - start) / DURATION)
      setP(v)
      if (v < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [order.number])

  const stage = p < ACCEPT_END ? 0 : p < 1 ? 1 : 2
  useEffect(() => {
    if (stage === 2 && !fired.current) {
      fired.current = true
      haptic(30)
      onReady()
    }
  }, [stage, onReady])

  const left = Math.max(1, Math.ceil(order.eta * (1 - p)))
  const head = [
    { t: 'Заказ принят', s: `Передаём бариста на ${order.street}` },
    { t: 'Бариста готовит заказ', s: `Осталось около ${left} мин` },
    { t: 'Заказ готов', s: 'Заберите его на стойке выдачи' },
  ][stage]
  const ready = stage === 2
  const R = 64
  const C = 2 * Math.PI * R
  const first = byId(order.lines[0].productId)
  const steps = [
    { label: 'Принят', time: hhmm(order.placedAt) },
    { label: 'Готовится', time: stage >= 1 ? hhmm(order.placedAt + 60000) : '' },
    { label: 'Готов', time: ready ? hhmm(order.placedAt + order.eta * 60000) : `~${hhmm(order.placedAt + order.eta * 60000)}` },
  ]
  const seg = (i: number) => (i === 0 ? Math.min(1, p / ACCEPT_END) : Math.max(0, (p - ACCEPT_END) / (1 - ACCEPT_END)))

  return (
    <div className="tg-scroll absolute inset-0 bg-[var(--tg-sec)]" style={{ paddingBottom: bottomPad }}>
      <div className="mx-3 mt-1 rounded-[20px] bg-[var(--tg-bg)] px-4 pt-6 pb-5">
        <div className="relative mx-auto h-[156px] w-[156px]">
          <svg viewBox="0 0 156 156" className="absolute inset-0 -rotate-90" aria-hidden>
            <circle cx="78" cy="78" r={R} fill="none" stroke="#eef0f4" strokeWidth="7" />
            <circle
              cx="78"
              cy="78"
              r={R}
              fill="none"
              stroke={ready ? 'var(--tg-green)' : 'var(--tg-btn)'}
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - p)}
              style={{ transition: 'stroke .4s' }}
            />
          </svg>
          <motion.div
            className="absolute inset-[22px] overflow-hidden rounded-full"
            style={{ background: first.tint }}
            animate={ready ? { scale: [1, 1.06, 1] } : { rotate: [0, -2, 2, 0] }}
            transition={ready ? { duration: 0.6 } : { duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="absolute inset-[8%]">
              <Art kind={first.art} />
            </div>
          </motion.div>
          <AnimatePresence>
            {ready && (
              <motion.span
                className="absolute right-[10px] bottom-[10px] grid h-9 w-9 place-items-center rounded-full border-[3px] border-white bg-[var(--tg-green)] text-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 18 }}
              >
                <Check size={18} strokeWidth={3.2} />
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-4 h-[52px] text-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={stage} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
              <div className="text-[21px] leading-[26px] font-bold tracking-[-0.02em]">{head.t}</div>
              <div className="tg-num mt-[3px] text-[14px] text-[var(--tg-hint)]">{head.s}</div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-5 px-1">
          <div className="relative flex items-center justify-between">
            {[0, 1].map((i) => (
              <div key={i} className="absolute top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-[#eef0f4]" style={{ left: `calc(${i * 50}% + 16px)`, width: 'calc(50% - 32px)' }}>
                <div className="h-full rounded-full" style={{ width: `${seg(i) * 100}%`, background: ready ? 'var(--tg-green)' : 'var(--tg-btn)', transition: 'background .4s' }} />
              </div>
            ))}
            {steps.map((s, i) => {
              const done = stage > i || ready
              const active = stage === i && !ready
              return (
                <motion.span
                  key={s.label}
                  className="relative z-10 grid h-6 w-6 place-items-center rounded-full"
                  animate={{
                    background: done ? (ready ? '#22a04b' : '#2481cc') : active ? '#ffffff' : '#eef0f4',
                    scale: active ? 1.08 : 1,
                  }}
                  style={{ boxShadow: active ? 'inset 0 0 0 2.5px #2481cc' : 'none' }}
                  transition={spring}
                >
                  {done ? <Check size={13} strokeWidth={3.4} className="text-white" /> : active ? <span className="h-2 w-2 rounded-full bg-[var(--tg-btn)]" /> : null}
                </motion.span>
              )
            })}
          </div>
          <div className="mt-2 flex justify-between text-[12.5px]">
            {steps.map((s, i) => (
              <div key={s.label} className={i === 0 ? 'text-left' : i === 1 ? 'text-center' : 'text-right'} style={{ width: 90 }}>
                <div className="font-medium" style={{ color: stage >= i ? 'var(--tg-text)' : 'var(--tg-hint)' }}>
                  {s.label}
                </div>
                <div className="tg-num h-4 text-[var(--tg-hint)]">{s.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative mx-3 mt-3 rounded-[20px] bg-[var(--tg-bg)]">
        <div className="flex items-end justify-between px-5 pt-4 pb-4">
          <div>
            <div className="text-[13px] text-[var(--tg-hint)]">Номер заказа</div>
            <div className="tg-num mt-[2px] text-[48px] leading-[50px] font-bold tracking-[-0.035em]">{order.number}</div>
          </div>
          <div className="mb-[6px] flex -space-x-3">
            {order.lines.slice(0, 3).map((l) => {
              const pr = byId(l.productId)
              return (
                <span key={l.key} className="h-11 w-11 rounded-full border-[2.5px] border-white p-[3px]" style={{ background: pr.tint }}>
                  <Art kind={pr.art} />
                </span>
              )
            })}
          </div>
        </div>
        <div className="relative h-0">
          <span className="absolute -top-[9px] -left-[9px] h-[18px] w-[18px] rounded-full bg-[var(--tg-sec)]" />
          <span className="absolute -top-[9px] -right-[9px] h-[18px] w-[18px] rounded-full bg-[var(--tg-sec)]" />
          <span className="absolute inset-x-4 top-0 border-t-[1.5px] border-dashed border-[#d9dbe1]" />
        </div>
        <div className="flex items-center gap-3 px-5 pt-4 pb-4">
          <ScanLine size={20} strokeWidth={2} className="shrink-0 text-[var(--tg-link)]" />
          <span className="text-[14.5px] leading-[19px]">Покажите номер бариста на стойке выдачи</span>
        </div>
      </div>

      <Section title="Детали">
        <Row icon={<IconTile bg="#6b3f1f"><MapPin size={16} strokeWidth={2.3} /></IconTile>} title={order.street} sub="Самовывоз" />
        <Row icon={<IconTile bg="#5b6cf0"><Clock size={16} strokeWidth={2.3} /></IconTile>} title={order.pickupLabel} sub="Время получения" />
        <Row
          icon={<IconTile bg="var(--tg-btn)"><Wallet size={16} strokeWidth={2.3} /></IconTile>}
          title={<span className="tg-num">{rub(order.total)}</span>}
          sub={`Оплачено · ${order.payLabel}`}
        />
        <Row last icon={<IconTile bg="#f29a2e"><Gift size={16} strokeWidth={2.3} /></IconTile>} title={<span className="tg-num">+{Math.round(order.total * 0.05)} бонусов</span>} sub="Начислим после получения" />
      </Section>
      <p className="px-6 pt-3 pb-4 text-center text-[12px] leading-[16px] text-[var(--tg-hint)]">
        В демо приготовление ускорено. В реальном заказе бот пришлёт сообщение, когда напиток будет готов.
      </p>
    </div>
  )
}
