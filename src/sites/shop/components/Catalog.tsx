import { useMemo, useRef, useState } from 'react'
import { View } from '@react-three/drei'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown, Plus, Star } from 'lucide-react'
import { CATEGORY_LABEL, PRODUCTS, SKIN_LABEL, rub, type Category, type Product, type Skin } from '../data'
import { useShop } from '../store'
import { ProductScene } from '../three/Scenes'

type Sort = 'popular' | 'cheap' | 'expensive' | 'new'
const SORTS: { v: Sort; l: string }[] = [
  { v: 'popular', l: 'По популярности' },
  { v: 'cheap', l: 'Сначала дешевле' },
  { v: 'expensive', l: 'Сначала дороже' },
  { v: 'new', l: 'Новинки' },
]
const CATS: (Category | 'all')[] = ['all', 'face', 'body', 'hair', 'sets']
const SKINS: (Skin | 'any')[] = ['any', 'dry', 'normal', 'combo', 'oily', 'sensitive']
const ease = [0.2, 0.8, 0.2, 1] as const

export function Catalog({ cat, setCat }: { cat: Category | 'all'; setCat: (c: Category | 'all') => void }) {
  const [skin, setSkin] = useState<Skin | 'any'>('any')
  const [sort, setSort] = useState<Sort>('popular')

  const list = useMemo(() => {
    const l = PRODUCTS.filter((p) => (cat === 'all' || p.category === cat) && (skin === 'any' || p.skin.includes(skin)))
    const by: Record<Sort, (a: Product, b: Product) => number> = {
      popular: (a, b) => a.popularity - b.popularity,
      cheap: (a, b) => a.prices[30] - b.prices[30],
      expensive: (a, b) => b.prices[30] - a.prices[30],
      new: (a, b) => b.added - a.added,
    }
    return l.sort(by[sort])
  }, [cat, skin, sort])

  const counts = useMemo(() => {
    const m: Record<string, number> = { all: PRODUCTS.length }
    for (const p of PRODUCTS) m[p.category] = (m[p.category] ?? 0) + 1
    return m
  }, [])

  return (
    <section id="catalog" className="relative mx-auto max-w-[1440px] px-4 pt-24 pb-10 sm:px-8 lg:pt-32">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-[0.9rem] text-[var(--muted)]">Каталог</p>
          <h2 className="lv-serif mt-3 text-[clamp(2.4rem,5vw,4.4rem)] leading-[0.98] tracking-[-0.025em]">
            Восемь средств, <em>без лишнего</em>
          </h2>
        </div>
        <p className="max-w-[23rem] text-[0.95rem] leading-relaxed text-[var(--muted)]">
          Мы не выпускаем двадцать кремов. Каждое средство решает одну задачу и сочетается с остальными.
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-3 border-y border-[var(--line)] py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="lv-noscroll -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="group" aria-label="Категория">
          {CATS.map((c) => (
            <button key={c} className="lv-chip" data-on={cat === c} onClick={() => setCat(c)}>
              {c === 'all' ? 'Все' : CATEGORY_LABEL[c]}
              <span className="lv-num text-[0.75rem] opacity-55">{counts[c] ?? 0}</span>
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-3 lg:justify-end">
          <label className="relative min-w-0">
            <span className="sr-only">Тип кожи</span>
            <select
              value={skin}
              onChange={(e) => setSkin(e.target.value as Skin | 'any')}
              className="lv-chip w-full cursor-pointer appearance-none bg-transparent pr-9 max-sm:text-[0.8125rem]"
              data-on={skin !== 'any'}
            >
              {SKINS.map((s) => (
                <option key={s} value={s}>
                  {s === 'any' ? 'Любой тип кожи' : `Кожа: ${SKIN_LABEL[s].toLowerCase()}`}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 opacity-60" style={{ color: skin !== 'any' ? '#ede8e1' : undefined }} />
          </label>
          <label className="relative min-w-0">
            <span className="sr-only">Сортировка</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="lv-chip w-full cursor-pointer appearance-none bg-transparent pr-9 max-sm:text-[0.8125rem]">
              {SORTS.map((s) => (
                <option key={s.v} value={s.v}>
                  {s.l}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 opacity-60" />
          </label>
        </div>
      </div>

      <motion.div layout className="mt-8 grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-4 lg:gap-y-14">
        <AnimatePresence mode="popLayout">
          {list.map((p, i) => (
            <Card key={p.id} p={p} i={i} />
          ))}
        </AnimatePresence>
      </motion.div>
      {list.length === 0 && (
        <div className="py-20 text-center">
          <p className="lv-serif text-[1.8rem]">Под эти условия ничего не нашлось</p>
          <button
            className="lv-btn lv-btn-ghost mt-6 h-12 px-6"
            onClick={() => {
              setCat('all')
              setSkin('any')
            }}
          >
            Сбросить фильтры
          </button>
        </div>
      )}
    </section>
  )
}

function Card({ p, i }: { p: Product; i: number }) {
  const [hover, setHover] = useState(false)
  const stage = useRef<HTMLDivElement>(null)
  const { add, openProduct } = useShop()
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.18 } }}
      transition={{ duration: 0.55, ease, delay: Math.min(i, 6) * 0.03 }}
      className="group flex flex-col"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        ref={stage}
        role="button"
        tabIndex={0}
        onClick={() => openProduct(p.id)}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), openProduct(p.id))}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        aria-label={`${p.kind} № ${p.num} ${p.title}, подробнее`}
        className="relative aspect-[4/5] cursor-pointer overflow-hidden rounded-[20px] sm:rounded-[26px]"
        style={{
          background: `radial-gradient(110% 60% at 50% 105%, color-mix(in oklab, ${p.tone} 70%, #9c9282 30%) 0%, transparent 60%), linear-gradient(180deg, color-mix(in oklab, ${p.tone} 60%, #f6f3ee 40%) 0%, ${p.tone} 100%)`,
        }}
      >
        <div className="absolute inset-x-0 bottom-[22%] h-px bg-white/40" />
        <View className="absolute inset-0" index={1}>
          <ProductScene p={p} hover={hover} phase={i * 1.3 + 0.4} />
        </View>
        <div className="absolute top-3 left-3 z-10 flex gap-1.5 sm:top-4 sm:left-4">
          {p.badge && (
            <span
              className={`rounded-full px-2.5 py-1 text-[0.72rem] font-semibold ${
                p.badge === 'Новинка' ? 'bg-[var(--lav)] text-white' : p.badge === 'Хит' ? 'bg-[var(--ink)] text-[var(--stone)]' : 'bg-[var(--paper)] text-[var(--olive)]'
              }`}
            >
              {p.badge}
            </span>
          )}
        </div>
        <span className="lv-num absolute top-3 right-3.5 z-10 text-[0.8rem] text-[var(--ink)]/55 sm:top-4 sm:right-5">№ {p.num}</span>
        <span className="absolute inset-x-3 bottom-3 z-10 hidden translate-y-2 items-center justify-center rounded-full bg-[rgba(246,243,238,0.85)] py-2.5 text-[0.8125rem] font-semibold opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:flex">
          Подробнее и объём
        </span>
      </div>

      <div className="mt-4 flex flex-1 flex-col px-0.5">
        <div className="flex items-center justify-between gap-2 text-[0.78rem] text-[var(--muted)] sm:text-[0.8125rem]">
          <span>{p.kind}</span>
          <span className="flex items-center gap-1">
            <Star className="size-3 fill-[var(--ink)] text-[var(--ink)]" />
            <span className="lv-num text-[var(--ink)]">{p.rating.toFixed(1).replace('.', ',')}</span>
            <span className="max-sm:hidden">· {p.reviews}</span>
          </span>
        </div>
        <h3 className="lv-serif mt-1.5 text-[1.2rem] leading-[1.15] sm:text-[1.45rem]">{p.title}</h3>
        <p className="mt-1.5 text-[0.84rem] leading-snug text-[var(--muted)] max-sm:hidden">{p.short}</p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-4">
          <p className="leading-none">
            <span className="lv-num text-[1.15rem] sm:text-[1.25rem]">{rub(p.prices[30])}</span>
            <span className="ml-1.5 text-[0.75rem] text-[var(--muted)]">{p.vessel === 'set' ? '2 × 30 мл' : '30 мл'}</span>
          </p>
          <button
            onClick={() => add(p.id, 30, 1, stage.current?.getBoundingClientRect())}
            className="lv-btn h-10 shrink-0 bg-[var(--ink)] px-3.5 text-[0.8125rem] text-[var(--stone)] hover:bg-[var(--olive)] max-sm:w-10 max-sm:px-0"
            aria-label={`В корзину: ${p.kind} ${p.title}`}
          >
            <Plus className="size-4" />
            <span className="max-sm:hidden">В корзину</span>
          </button>
        </div>
      </div>
    </motion.article>
  )
}
