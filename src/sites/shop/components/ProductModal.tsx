import { Suspense, lazy, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, Hand, Leaf, Minus, Plus, Star, X } from 'lucide-react'
import { SKIN_LABEL, VOLUMES, byId, rub, volumeLabel, type Product, type Volume } from '../data'
import { useShop } from '../store'
import { lockScroll } from '../hooks'
import { Glyph } from './Glyph'

const Viewer = lazy(() => import('../three/Viewer'))
const ease = [0.2, 0.8, 0.2, 1] as const

export function ProductModal() {
  const { product, openProduct } = useShop()
  const p = product ? byId(product) : null

  useEffect(() => {
    lockScroll(!!p)
    if (!p) return
    const k = (e: KeyboardEvent) => e.key === 'Escape' && openProduct(null)
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [p, openProduct])

  return (
    <AnimatePresence>
      {p && (
        <motion.div
          key="pm"
          className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-label={`${p.kind} ${p.title}`}
        >
          <div className="absolute inset-0 bg-[rgba(30,30,28,0.42)] backdrop-blur-[6px]" onClick={() => openProduct(null)} />
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease }}
            className="relative grid max-h-[94svh] w-full max-w-[1180px] overflow-hidden rounded-t-[28px] bg-[var(--paper)] shadow-[0_40px_120px_-30px_rgba(20,20,18,0.6)] grid-rows-[auto_minmax(0,1fr)] sm:rounded-[30px] lg:grid-cols-[1.05fr_1fr] lg:grid-rows-1"
          >
            <Body p={p} onClose={() => openProduct(null)} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Body({ p, onClose }: { p: Product; onClose: () => void }) {
  const [vol, setVol] = useState<Volume>(30)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [open, setOpen] = useState<number>(0)
  const [hint, setHint] = useState(true)
  const { add } = useShop()

  const sections = [
    {
      t: 'Ключевые компоненты',
      c: (
        <ul className="divide-y divide-[var(--line)]">
          {p.key.map((k) => (
            <li key={k.name} className="grid grid-cols-[1fr_auto] gap-x-4 py-3">
              <span className="font-semibold">{k.name}</span>
              <span className="lv-num text-[var(--olive)]">{k.pct}</span>
              <span className="col-span-2 mt-0.5 text-[0.875rem] text-[var(--muted)]">{k.note}</span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      t: 'Как применять',
      c: (
        <ol className="space-y-3.5 py-2">
          {p.howTo.map((s, i) => (
            <li key={i} className="grid grid-cols-[2rem_1fr] items-start gap-3">
              <span className="lv-num grid size-8 place-items-center rounded-full border border-[var(--line)] text-[0.875rem]">{i + 1}</span>
              <span className="pt-1 text-[0.9375rem] leading-relaxed">{s}</span>
            </li>
          ))}
        </ol>
      ),
    },
    {
      t: 'Полный состав',
      c: <p className="py-2 text-[0.875rem] leading-relaxed text-[var(--muted)]">{p.inci}</p>,
    },
  ]

  return (
    <>
      <div
        className="relative h-[40svh] min-h-[280px] sm:h-[46svh] lg:h-auto lg:min-h-[640px]"
        style={{ background: `radial-gradient(90% 60% at 50% 100%, color-mix(in oklab, ${p.tone} 70%, #9c9282 30%), transparent 65%), linear-gradient(180deg, #f3efe9, ${p.tone})` }}
        onPointerDown={() => setHint(false)}
      >
        <Suspense fallback={<Glyph p={p} className="absolute inset-0 m-auto h-1/2" />}>
          <Viewer p={p} />
        </Suspense>
        <AnimatePresence>
          {hint && (
            <motion.span
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full whitespace-nowrap bg-[rgba(246,243,238,0.8)] px-3.5 py-2 text-[0.8125rem] backdrop-blur"
            >
              <Hand className="size-4" strokeWidth={1.6} />
              Потяните, чтобы повернуть
            </motion.span>
          )}
        </AnimatePresence>
        <span className="lv-num absolute top-5 left-6 text-[0.875rem] text-[var(--ink)]/60">№ {p.num}</span>
      </div>

      <div className="lv-scroll relative min-h-0 overflow-y-auto px-5 pt-6 pb-8 sm:px-10 sm:pt-10 lg:max-h-[94svh]" data-lenis-prevent>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 grid size-10 place-items-center rounded-full border border-[var(--line)] bg-[var(--paper)] hover:bg-[var(--stone)] sm:top-6 sm:right-6"
          aria-label="Закрыть"
        >
          <X className="size-[18px]" strokeWidth={1.6} />
        </button>
        <p className="text-[0.875rem] text-[var(--muted)]">{p.kind}</p>
        <h2 className="lv-serif mt-2 pr-12 text-[clamp(2rem,3.4vw,3rem)] leading-[1.02] tracking-[-0.02em]">{p.title}</h2>
        <div className="mt-3 flex items-center gap-2 text-[0.875rem]">
          <span className="flex">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} className={`size-3.5 ${i < Math.round(p.rating) ? 'fill-[var(--ink)]' : 'fill-transparent'} text-[var(--ink)]`} />
            ))}
          </span>
          <span className="lv-num">{p.rating.toFixed(1).replace('.', ',')}</span>
          <span className="text-[var(--muted)]">· {p.reviews} отзывов</span>
        </div>
        <p className="mt-5 text-[0.98rem] leading-[1.7] text-[#45433d]">{p.description}</p>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {p.skin.length === 5 ? (
            <span className="rounded-full bg-[var(--stone)] px-3 py-1.5 text-[0.8rem]">Для любого типа кожи</span>
          ) : (
            p.skin.map((s) => (
              <span key={s} className="rounded-full bg-[var(--stone)] px-3 py-1.5 text-[0.8rem]">
                {SKIN_LABEL[s]}
              </span>
            ))
          )}
          {!p.scented && <span className="flex items-center gap-1 rounded-full bg-[var(--lav-soft)] px-3 py-1.5 text-[0.8rem]">Без аромата</span>}
        </div>

        <div className="mt-7">
          <p className="text-[0.875rem] font-semibold">Объём</p>
          <div className="relative mt-2.5 grid grid-cols-3 rounded-2xl bg-[var(--stone)] p-1" role="radiogroup" aria-label="Объём">
            {VOLUMES.map((v) => (
              <button
                key={v}
                role="radio"
                aria-checked={vol === v}
                onClick={() => setVol(v)}
                className="relative z-10 flex flex-col items-center rounded-xl py-2.5 transition-colors"
              >
                {vol === v && (
                  <motion.span layoutId="lv-vol" className="absolute inset-0 -z-10 rounded-xl bg-[var(--paper)] shadow-[0_4px_14px_-6px_rgba(30,30,28,0.35)]" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />
                )}
                <span className="text-[0.9375rem] font-semibold">{volumeLabel(p, v)}</span>
                <span className="lv-num text-[0.8125rem] text-[var(--muted)]">{rub(p.prices[v])}</span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-[0.8rem] text-[var(--muted)]">
            {vol === 50 ? `Выгоднее на ${Math.round((1 - p.prices[50] / 50 / (p.prices[15] / 15)) * 100)} % за миллилитр, чем 15 мл` : vol === 15 ? 'Пробный формат, удобно взять в дорогу' : 'Хватает на 2–3 месяца ежедневного ухода'}
          </p>
        </div>

        <div className="mt-6 flex items-stretch gap-3">
          <div className="flex items-center rounded-full border border-[var(--line)]">
            <button className="grid size-12 place-items-center" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Меньше">
              <Minus className="size-4" />
            </button>
            <span className="lv-num w-6 text-center text-[1.05rem]">{qty}</span>
            <button className="grid size-12 place-items-center" onClick={() => setQty((q) => Math.min(9, q + 1))} aria-label="Больше">
              <Plus className="size-4" />
            </button>
          </div>
          <button
            onClick={() => {
              add(p.id, vol, qty)
              setAdded(true)
              setTimeout(() => setAdded(false), 1800)
            }}
            className="lv-btn lv-btn-primary h-14 flex-1 text-[1rem]"
          >
            <AnimatePresence mode="wait" initial={false}>
              {added ? (
                <motion.span key="a" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} className="flex items-center gap-2">
                  <Check className="size-4" /> Добавлено
                </motion.span>
              ) : (
                <motion.span key="b" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} className="flex items-center gap-2">
                  В корзину · <span className="lv-num">{rub(p.prices[vol] * qty)}</span>
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
        <p className="mt-3 flex items-center gap-2 text-[0.8125rem] text-[var(--muted)]">
          <Leaf className="size-3.5 text-[var(--olive)]" /> Отправим завтра, СДЭК или Почтой России
        </p>

        <div className="mt-8 border-t border-[var(--line)]">
          {sections.map((s, i) => (
            <div key={s.t} className="border-b border-[var(--line)]">
              <button className="flex w-full items-center justify-between py-4 text-left" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                <span className="text-[1rem] font-semibold">{s.t}</span>
                <span className="relative grid size-7 place-items-center rounded-full border border-[var(--line)]">
                  <Plus className={`size-3.5 transition-transform duration-300 ${open === i ? 'rotate-45' : ''}`} />
                </span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease }} className="overflow-hidden">
                    <div className="pb-4">{s.c}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
