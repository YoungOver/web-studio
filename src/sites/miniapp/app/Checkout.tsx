import { AnimatePresence, motion } from 'motion/react'
import { CreditCard, Gift, MapPin, Send } from 'lucide-react'
import { Art } from '../art'
import { byId, lineSummary, rub, unitPrice, BONUS_BALANCE, type Line, type Shop } from '../data'
import { Bump, IconTile, Press, Row, Section, Stepper, Switch, spring } from './ui'

export type PayMethod = 'tgpay' | 'card'

export function pickupSlots(eta: number) {
  const now = new Date()
  const slots: { id: string; label: string; sub: string }[] = [{ id: 'asap', label: 'Как можно скорее', sub: `~${eta} мин` }]
  const t = new Date(now.getTime() + (eta + 8) * 60000)
  t.setMinutes(Math.ceil(t.getMinutes() / 15) * 15, 0, 0)
  for (let i = 0; i < 3; i++) {
    const d = new Date(t.getTime() + i * 15 * 60000)
    const hh = String(d.getHours()).padStart(2, '0')
    const mm = String(d.getMinutes()).padStart(2, '0')
    slots.push({ id: `${hh}:${mm}`, label: `к ${hh}:${mm}`, sub: i === 0 ? 'ближайшее' : 'по времени' })
  }
  return slots
}

function Radio({ on }: { on: boolean }) {
  return (
    <span className="grid h-[22px] w-[22px] place-items-center rounded-full border-[1.5px] transition-colors" style={{ borderColor: on ? 'var(--tg-btn)' : '#c7c7cc' }}>
      <motion.span className="h-3 w-3 rounded-full bg-[var(--tg-btn)]" initial={false} animate={{ scale: on ? 1 : 0 }} transition={spring} />
    </span>
  )
}

export function Checkout({
  lines,
  shop,
  onShop,
  onQty,
  pickup,
  setPickup,
  bonusOn,
  setBonusOn,
  bonus,
  pay,
  setPay,
  subtotal,
  total,
  bottomPad,
}: {
  lines: Line[]
  shop: Shop
  onShop: () => void
  onQty: (key: string, d: number) => void
  pickup: string
  setPickup: (v: string) => void
  bonusOn: boolean
  setBonusOn: (v: boolean) => void
  bonus: number
  pay: PayMethod
  setPay: (v: PayMethod) => void
  subtotal: number
  total: number
  bottomPad: number
}) {
  const slots = pickupSlots(shop.eta)
  const count = lines.reduce((a, l) => a + l.qty, 0)
  return (
    <div className="tg-scroll absolute inset-0 bg-[var(--tg-sec)]" style={{ paddingBottom: bottomPad }}>
      <div className="px-4 pt-2">
        <h1 className="text-[27px] leading-[32px] font-bold tracking-[-0.025em]">Ваш заказ</h1>
        <p className="tg-num mt-[2px] text-[14px] text-[var(--tg-hint)]">
          {count} {count === 1 ? 'позиция' : count < 5 ? 'позиции' : 'позиций'} · самовывоз
        </p>
      </div>

      <div className="mx-3 mt-4 overflow-hidden rounded-[14px] bg-[var(--tg-bg)]">
        <Row
          last
          icon={<IconTile bg="#6b3f1f"><MapPin size={17} strokeWidth={2.3} /></IconTile>}
          title={<span className="font-medium">{shop.street}</span>}
          sub={`${shop.distance} от вас · готовность ~${shop.eta} мин`}
          right={
            <Press scale={0.92} onClick={onShop} className="text-[15px] text-[var(--tg-link)]">
              Изменить
            </Press>
          }
        />
      </div>

      <Section title="Состав">
        <AnimatePresence initial={false}>
          {lines.map((l, i) => {
            const p = byId(l.productId)
            return (
              <motion.div
                key={l.key}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={spring}
                className="relative flex items-center gap-3 overflow-hidden pl-3"
              >
                <div className="h-[52px] w-[52px] shrink-0 rounded-[11px] p-[3px]" style={{ background: p.tint }}>
                  <Art kind={p.art} />
                </div>
                <div className="relative flex min-h-[72px] flex-1 items-center gap-2 py-2 pr-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-[15.5px] leading-[20px] font-medium">{p.name}</div>
                    <div className="mt-[1px] line-clamp-2 text-[12.5px] leading-[16px] text-[var(--tg-hint)]">{lineSummary(l) || 'Как в меню'}</div>
                    <div className="tg-num mt-[3px] text-[14px] font-semibold">
                      <Bump value={rub(unitPrice(l) * l.qty)} />
                    </div>
                  </div>
                  <Stepper value={l.qty} onInc={() => onQty(l.key, 1)} onDec={() => onQty(l.key, -1)} size="sm" tone="soft" />
                  {i < lines.length - 1 && <span className="absolute right-0 bottom-0 left-0 h-px bg-[var(--tg-sep)]" style={{ transform: 'scaleY(.6)' }} />}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </Section>

      <section className="mt-5">
        <div className="mb-[7px] px-4 text-[13px] text-[var(--tg-hint)]">Когда забрать</div>
        <div className="tg-scroll flex gap-2 overflow-x-auto px-3 after:block after:w-1 after:shrink-0 after:content-['']">
          {slots.map((s) => {
            const on = pickup === s.id
            return (
              <Press
                key={s.id}
                scale={0.95}
                onClick={() => setPickup(s.id)}
                aria-pressed={on}
                className="relative flex h-[54px] shrink-0 flex-col items-start justify-center rounded-[12px] bg-[var(--tg-bg)] px-[14px] text-left"
              >
                {on && <motion.span layoutId="slot" className="absolute inset-0 rounded-[12px] border-2 border-[var(--tg-btn)] bg-[#2481cc]/[.06]" transition={spring} />}
                <span className="tg-num relative text-[14.5px] leading-[18px] font-medium whitespace-nowrap">{s.label}</span>
                <span className="tg-num relative text-[12px] leading-[15px] text-[var(--tg-hint)]">{s.sub}</span>
              </Press>
            )
          })}
        </div>
      </section>

      <Section title="Бонусы">
        <Row
          last
          icon={<IconTile bg="#f29a2e"><Gift size={17} strokeWidth={2.3} /></IconTile>}
          title={<span className="tg-num">Списать {bonus} бонусов</span>}
          sub={<span className="tg-num">На счёте {BONUS_BALANCE} · 1 бонус = 1 ₽</span>}
          right={<Switch label="Списать бонусы" on={bonusOn} onChange={setBonusOn} />}
        />
      </Section>

      <Section title="Оплата">
        <Row
          onClick={() => setPay('tgpay')}
          icon={<IconTile bg="var(--tg-btn)"><Send size={15} strokeWidth={2.4} className="-translate-x-[1px] translate-y-[1px]" /></IconTile>}
          title="Telegram Pay"
          sub="Apple Pay, Google Pay или карта"
          right={<Radio on={pay === 'tgpay'} />}
        />
        <Row
          last
          onClick={() => setPay('card')}
          icon={<IconTile bg="#34343a"><CreditCard size={16} strokeWidth={2.3} /></IconTile>}
          title="Банковская карта"
          sub="Мир •••• 4417"
          right={<Radio on={pay === 'card'} />}
        />
      </Section>

      <div className="mx-3 mt-5 rounded-[14px] bg-[var(--tg-bg)] px-4 py-3 text-[15px]">
        <div className="flex justify-between py-[3px]">
          <span className="text-[var(--tg-hint)]">Сумма заказа</span>
          <Bump value={rub(subtotal)} className="tg-num" />
        </div>
        <AnimatePresence initial={false}>
          {bonusOn && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={spring} className="overflow-hidden">
              <div className="flex justify-between py-[3px]">
                <span className="text-[var(--tg-hint)]">Бонусы</span>
                <span className="tg-num text-[var(--tg-green)]">−{rub(bonus)}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="mt-2 flex items-baseline justify-between border-t border-[var(--tg-sep)] pt-[10px]">
          <span className="font-semibold">К оплате</span>
          <Bump value={rub(total)} className="tg-num text-[19px] font-bold tracking-[-0.01em]" />
        </div>
      </div>
      <p className="tg-num px-6 pt-3 pb-4 text-center text-[12.5px] leading-[17px] text-[var(--tg-hint)]">
        После получения начислим {Math.round(total * 0.05)} бонусов. Отменить заказ можно, пока бариста не начал готовить.
      </p>
    </div>
  )
}
