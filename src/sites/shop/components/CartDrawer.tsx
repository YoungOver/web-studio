import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Check, Gift, Minus, Plus, Truck, X } from 'lucide-react'
import { FREE_DELIVERY, PROMO, byId, rub, volumeLabel } from '../data'
import { useShop } from '../store'
import { lockScroll } from '../hooks'
import { Glyph } from './Glyph'

const ease = [0.2, 0.8, 0.2, 1] as const

const plural = (n: number) => {
  const m10 = n % 10
  const m100 = n % 100
  if (m10 === 1 && m100 !== 11) return 'товар'
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return 'товара'
  return 'товаров'
}

export function CartDrawer() {
  const s = useShop()
  const [code, setCode] = useState('')
  const [err, setErr] = useState(false)
  const [checkout, setCheckout] = useState(false)

  useEffect(() => {
    lockScroll(s.drawer)
    if (!s.drawer) {
      setCheckout(false)
      return
    }
    const k = (e: KeyboardEvent) => e.key === 'Escape' && s.setDrawer(false)
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [s.drawer])

  const afterDiscount = s.subtotal - s.discount
  const left = Math.max(0, FREE_DELIVERY - afterDiscount)
  const pct = Math.min(1, afterDiscount / FREE_DELIVERY)

  return (
    <AnimatePresence>
      {s.drawer && (
        <motion.div key="cd" className="fixed inset-0 z-[72]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <div className="absolute inset-0 bg-[rgba(30,30,28,0.38)] backdrop-blur-[4px]" onClick={() => s.setDrawer(false)} />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Корзина"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.55, ease }}
            className="absolute top-0 right-0 bottom-0 flex w-full max-w-[460px] flex-col bg-[var(--paper)] shadow-[-30px_0_80px_-40px_rgba(20,20,18,0.5)]"
          >
            <div className="flex items-center justify-between px-5 pt-5 pb-4 sm:px-7">
              <p className="lv-serif text-[1.9rem] leading-none">
                Корзина{' '}
                <span className="lv-num align-top text-[0.95rem] text-[var(--muted)]">
                  {s.count} {plural(s.count)}
                </span>
              </p>
              <button onClick={() => s.setDrawer(false)} className="grid size-10 place-items-center rounded-full border border-[var(--line)] hover:bg-[var(--stone)]" aria-label="Закрыть корзину">
                <X className="size-[18px]" strokeWidth={1.6} />
              </button>
            </div>

            {s.count > 0 && (
              <div className="mx-5 rounded-2xl bg-[var(--stone)] p-4 sm:mx-7">
                <p className="flex items-center gap-2 text-[0.9rem]">
                  <Truck className="size-4 text-[var(--olive)]" strokeWidth={1.7} />
                  {left > 0 ? (
                    <span>
                      До бесплатной доставки <span className="lv-num font-semibold">{rub(left)}</span>
                    </span>
                  ) : (
                    <span className="font-semibold text-[var(--olive)]">Доставка бесплатно</span>
                  )}
                </p>
                <div className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-[rgba(30,30,28,0.09)]">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ background: 'linear-gradient(90deg, var(--lav), var(--olive))' }}
                    initial={false}
                    animate={{ width: `${pct * 100}%` }}
                    transition={{ duration: 0.7, ease }}
                  />
                </div>
              </div>
            )}

            <div className="lv-scroll min-h-0 flex-1 overflow-y-auto px-5 sm:px-7" data-lenis-prevent>
              {s.count === 0 ? (
                <div className="flex h-full flex-col items-center justify-center py-16 text-center">
                  <p className="lv-serif text-[1.8rem]">Пока пусто</p>
                  <p className="mt-2 max-w-[18rem] text-[0.9rem] text-[var(--muted)]">Пройдите подбор ухода — соберём набор за 30 секунд.</p>
                </div>
              ) : (
                <ul className="divide-y divide-[var(--line)] py-2">
                  <AnimatePresence initial={false}>
                    {s.cart.map((l) => {
                      const p = byId(l.id)
                      return (
                        <motion.li
                          key={l.id + l.vol}
                          layout
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.35, ease }}
                          className="overflow-hidden"
                        >
                          <div className="flex gap-4 py-4">
                            <div className="grid h-[104px] w-[84px] shrink-0 place-items-center rounded-2xl" style={{ background: `linear-gradient(180deg, #f3efe9, ${p.tone})` }}>
                              <Glyph p={p} className="h-[84px] w-auto" />
                            </div>
                            <div className="flex min-w-0 flex-1 flex-col">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="text-[0.78rem] text-[var(--muted)]">
                                    {p.kind} № {p.num}
                                  </p>
                                  <p className="lv-serif truncate text-[1.15rem] leading-tight">{p.title}</p>
                                  <p className="mt-0.5 text-[0.8rem] text-[var(--muted)]">{volumeLabel(p, l.vol)}</p>
                                </div>
                                <button onClick={() => s.remove(l.id, l.vol)} className="-mt-0.5 -mr-1 grid size-8 shrink-0 place-items-center rounded-full text-[var(--muted)] hover:bg-[var(--stone)] hover:text-[var(--ink)]" aria-label="Удалить">
                                  <X className="size-4" />
                                </button>
                              </div>
                              <div className="mt-auto flex items-center justify-between pt-2">
                                <div className="flex items-center rounded-full border border-[var(--line)]">
                                  <button className="grid size-8 place-items-center" onClick={() => s.setQty(l.id, l.vol, l.qty - 1)} aria-label="Уменьшить количество">
                                    <Minus className="size-3.5" />
                                  </button>
                                  <motion.span key={l.qty} initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="lv-num w-6 text-center text-[0.95rem]">
                                    {l.qty}
                                  </motion.span>
                                  <button className="grid size-8 place-items-center" onClick={() => s.setQty(l.id, l.vol, l.qty + 1)} aria-label="Увеличить количество">
                                    <Plus className="size-3.5" />
                                  </button>
                                </div>
                                <span className="lv-num text-[1.05rem]">{rub(p.prices[l.vol] * l.qty)}</span>
                              </div>
                            </div>
                          </div>
                        </motion.li>
                      )
                    })}
                  </AnimatePresence>
                </ul>
              )}
              {s.count > 0 && (
                <p className="mb-4 flex items-center gap-2.5 rounded-2xl border border-dashed border-[var(--line)] px-4 py-3 text-[0.84rem] text-[var(--muted)]">
                  <Gift className="size-4 shrink-0 text-[var(--lav)]" strokeWidth={1.7} />
                  Положим пробник масла № 05 — 3 мл, в подарок
                </p>
              )}
            </div>

            {s.count > 0 && (
              <div className="border-t border-[var(--line)] px-5 pt-4 pb-5 sm:px-7 sm:pb-7">
                {s.promo ? (
                  <div className="flex items-center justify-between rounded-xl bg-[var(--lav-soft)] px-4 py-3 text-[0.875rem]">
                    <span className="flex items-center gap-2">
                      <Check className="size-4 text-[var(--olive)]" /> Промокод <b className="font-semibold">{s.promo}</b> · −{Math.round(PROMO[s.promo] * 100)} %
                    </span>
                    <button onClick={s.clearPromo} className="text-[var(--muted)] underline-offset-2 hover:underline">
                      Убрать
                    </button>
                  </div>
                ) : (
                  <form
                    className="flex gap-2"
                    onSubmit={(e) => {
                      e.preventDefault()
                      const ok = s.applyPromo(code)
                      setErr(!ok)
                      if (ok) setCode('')
                    }}
                  >
                    <label className="relative flex-1">
                      <span className="sr-only">Промокод</span>
                      <input
                        value={code}
                        onChange={(e) => {
                          setCode(e.target.value)
                          setErr(false)
                        }}
                        placeholder="Промокод, например LAVANDA10"
                        className={`h-11 w-full rounded-full border bg-transparent px-4 text-[0.875rem] outline-none placeholder:text-[var(--muted)]/70 focus:border-[var(--olive)] ${
                          err ? 'border-[#b4553f]' : 'border-[var(--line)]'
                        }`}
                      />
                    </label>
                    <button className="lv-btn lv-btn-ghost h-11 px-4 text-[0.875rem]">Применить</button>
                  </form>
                )}
                {err && <p className="mt-1.5 pl-4 text-[0.8rem] text-[#b4553f]">Такого промокода нет. Попробуйте LAVANDA10</p>}

                <dl className="mt-4 space-y-1.5 text-[0.9rem]">
                  <div className="flex justify-between">
                    <dt className="text-[var(--muted)]">Товары</dt>
                    <dd className="lv-num">{rub(s.subtotal)}</dd>
                  </div>
                  {s.discount > 0 && (
                    <div className="flex justify-between">
                      <dt className="text-[var(--muted)]">Скидка</dt>
                      <dd className="lv-num text-[var(--olive)]">−{rub(s.discount)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-[var(--muted)]">Доставка СДЭК</dt>
                    <dd className="lv-num">{s.delivery ? rub(s.delivery) : 'бесплатно'}</dd>
                  </div>
                  <div className="flex items-baseline justify-between pt-2">
                    <dt className="font-semibold">Итого</dt>
                    <dd className="lv-num text-[1.6rem] leading-none">{rub(s.total)}</dd>
                  </div>
                </dl>
                <button onClick={() => setCheckout(true)} className="lv-btn lv-btn-primary mt-4 h-14 w-full text-[1rem]">
                  {checkout ? 'Это демо: здесь откроется оплата ЮKassa' : 'Оформить заказ'}
                  {!checkout && <ArrowRight className="size-4" />}
                </button>
                <p className="mt-2.5 text-center text-[0.78rem] text-[var(--muted)]">Карта, СБП, SberPay или «Долями» — оплата через ЮKassa</p>
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
