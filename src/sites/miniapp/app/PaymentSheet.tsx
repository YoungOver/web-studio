import { AnimatePresence, motion } from 'motion/react'
import { Check, ChevronRight, Lock } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { rub } from '../data'
import type { PayMethod } from './Checkout'
import { Press, Sheet, haptic, spring } from './ui'

export function PaymentSheet({ open, onClose, total, pay, items, onPaid }: { open: boolean; onClose: () => void; total: number; pay: PayMethod; items: number; onPaid: () => void }) {
  const [phase, setPhase] = useState<'idle' | 'loading' | 'done'>('idle')
  const paidRef = useRef(onPaid)
  paidRef.current = onPaid

  useEffect(() => {
    if (open) setPhase('idle')
  }, [open])

  useEffect(() => {
    if (phase === 'loading') {
      const t = setTimeout(() => {
        setPhase('done')
        haptic(18)
      }, 1300)
      return () => clearTimeout(t)
    }
    if (phase === 'done') {
      const t = setTimeout(() => paidRef.current(), 750)
      return () => clearTimeout(t)
    }
  }, [phase])

  return (
    <Sheet open={open} onClose={() => phase === 'idle' && onClose()} label="Оплата">
      <div className="px-4 pt-7">
        <div className="flex items-center justify-between">
          <Press scale={0.92} onClick={() => phase === 'idle' && onClose()} className="text-[16px] text-[var(--tg-link)]">
            Отмена
          </Press>
          <div className="text-[17px] font-semibold">Оплата</div>
          <span className="w-[58px]" />
        </div>
      </div>

      <div className="flex flex-col items-center px-4 pt-6 pb-5">
        <div className="grid h-[58px] w-[58px] place-items-center rounded-full bg-gradient-to-br from-[#8a5530] to-[#4e2a12] text-[24px] font-semibold text-[#f6dcb8]">Б</div>
        <div className="mt-3 text-[15px] text-[var(--tg-hint)]">Бариста · заказ кофе</div>
        <div className="tg-num mt-1 text-[34px] leading-[40px] font-bold tracking-[-0.02em]">{rub(total)}</div>
        <div className="tg-num text-[13.5px] text-[var(--tg-hint)]">
          {items} {items === 1 ? 'позиция' : items < 5 ? 'позиции' : 'позиций'}, самовывоз
        </div>
      </div>

      <div className="mx-3 overflow-hidden rounded-[14px] bg-[var(--tg-sec)]">
        {[
          ['Способ оплаты', pay === 'tgpay' ? 'Apple Pay' : 'Мир •••• 4417'],
          ['Получатель', 'Бариста, сеть кофеен'],
          ['Чек', 'придёт в чат с ботом'],
        ].map(([k, v], i) => (
          <div key={k} className="relative flex h-[48px] items-center justify-between px-4 text-[15px]">
            <span>{k}</span>
            <span className="flex items-center gap-1 text-[var(--tg-hint)]">
              {v}
              {i === 0 && <ChevronRight size={16} strokeWidth={2.4} className="text-[#c4c4c7]" />}
            </span>
            {i < 2 && <span className="absolute right-0 bottom-0 left-4 h-px bg-[var(--tg-sep)]" style={{ transform: 'scaleY(.6)' }} />}
          </div>
        ))}
      </div>

      <div className="px-3 pt-4" style={{ paddingBottom: 'calc(12px + var(--safe-b, 0px))' }}>
        <Press
          scale={0.97}
          onClick={() => phase === 'idle' && setPhase('loading')}
          className="relative flex h-[50px] w-full items-center justify-center overflow-hidden rounded-[12px] text-[16px] font-semibold text-white transition-colors duration-300"
          style={{ background: phase === 'done' ? 'var(--tg-green)' : 'var(--tg-btn)' }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {phase === 'idle' && (
              <motion.span key="i" className="tg-num" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                Оплатить {rub(total)}
              </motion.span>
            )}
            {phase === 'loading' && (
              <motion.span key="l" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <span className="tg-spin block h-[22px] w-[22px] rounded-full border-[2.5px] border-white/35 border-t-white" />
              </motion.span>
            )}
            {phase === 'done' && (
              <motion.span key="d" className="flex items-center gap-2" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={spring}>
                <Check size={20} strokeWidth={3} /> Оплачено
              </motion.span>
            )}
          </AnimatePresence>
        </Press>
        <div className="mt-3 flex items-center justify-center gap-[6px] text-[12px] text-[var(--tg-hint)]">
          <Lock size={12} strokeWidth={2.4} /> Данные карты не передаются боту
        </div>
      </div>
    </Sheet>
  )
}
