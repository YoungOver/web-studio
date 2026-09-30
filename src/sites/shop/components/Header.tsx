import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Menu, Search, ShoppingBag, User, X } from 'lucide-react'
import { CATEGORY_LABEL, MEGA, byId, rub, type Category } from '../data'
import { useShop } from '../store'
import { lockScroll, scrollToId, useScrolled } from '../hooks'
import { Glyph } from './Glyph'

const CATS: Category[] = ['face', 'body', 'hair', 'sets']
const ease = [0.2, 0.8, 0.2, 1] as const

export function Sprig({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 32" className={className} aria-hidden fill="none">
      <path d="M12 31 C12 22 12.5 14 13.5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      {[6, 9, 12, 15, 18].map((y, i) => (
        <g key={y}>
          <ellipse cx={13.6 - i * 0.2 - 2.2} cy={y} rx="1.9" ry="2.8" transform={`rotate(-28 ${13.6 - i * 0.2 - 2.2} ${y})`} fill="currentColor" opacity={0.9 - i * 0.1} />
          <ellipse cx={13.6 - i * 0.2 + 2.1} cy={y + 1} rx="1.9" ry="2.8" transform={`rotate(28 ${13.6 - i * 0.2 + 2.1} ${y + 1})`} fill="currentColor" opacity={0.8 - i * 0.1} />
        </g>
      ))}
      <ellipse cx="13.6" cy="3.2" rx="1.6" ry="2.6" fill="currentColor" />
      <path d="M12.2 25 C8 23.5 6 21 5.5 18.5 C8.5 19 11 21 12.2 25Z" fill="currentColor" opacity=".55" />
    </svg>
  )
}

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <a href="#top" onClick={(e) => (e.preventDefault(), scrollToId('top'))} className={`flex items-center gap-1.5 ${className}`} aria-label="Лаванда, на главную">
      <Sprig className="h-7 w-5 text-[var(--lav)]" />
      <span className="lv-serif text-[1.65rem] leading-none tracking-[-0.02em]">
        <i>Лаванда</i>
      </span>
    </a>
  )
}

export function CartButton({ className = '' }: { className?: string }) {
  const { count, setDrawer, bump } = useShop()
  return (
    <button
      id="lv-cart-btn"
      onClick={() => setDrawer(true)}
      className={`lv-btn relative h-10 gap-2 rounded-full bg-[var(--ink)] pr-1.5 pl-4 text-[0.875rem] text-[var(--stone)] hover:bg-[#33332f] ${className}`}
      aria-label={`Корзина, товаров: ${count}`}
    >
      <ShoppingBag className="size-4" strokeWidth={1.6} />
      <span className="max-sm:hidden">Корзина</span>
      <motion.span
        key={bump}
        initial={bump ? { scale: 1.55, backgroundColor: '#b7a9cc' } : false}
        animate={{ scale: 1, backgroundColor: '#ede8e1' }}
        transition={{ type: 'spring', stiffness: 420, damping: 14 }}
        className="lv-num grid size-7 place-items-center rounded-full text-[0.8rem] text-[var(--ink)]"
      >
        {count}
      </motion.span>
    </button>
  )
}

export function Header({ onCategory }: { onCategory: (c: Category) => void }) {
  const scrolled = useScrolled(24)
  const [open, setOpen] = useState<Category | null>(null)
  const [mobile, setMobile] = useState(false)
  const closeT = useRef<number | undefined>(undefined)
  const { openProduct } = useShop()

  const enter = (c: Category) => {
    window.clearTimeout(closeT.current)
    setOpen(c)
  }
  const leave = () => {
    closeT.current = window.setTimeout(() => setOpen(null), 160)
  }

  useEffect(() => {
    lockScroll(mobile)
  }, [mobile])

  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null)
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [])

  const go = (c: Category) => {
    setOpen(null)
    setMobile(false)
    onCategory(c)
  }

  const solid = scrolled || open !== null

  return (
    <>
      <div className="relative z-[51] bg-[var(--olive)] text-[#e9e6dc]">
        <div className="mx-auto flex h-9 max-w-[1440px] items-center justify-center gap-6 px-4 text-[0.8125rem] sm:px-8">
          <span>Бесплатная доставка от 3 500 ₽</span>
          <span className="hidden h-1 w-1 rounded-full bg-[var(--lav-2)] sm:block" />
          <span className="hidden sm:block">Пробник в каждом заказе</span>
          <span className="hidden h-1 w-1 rounded-full bg-[var(--lav-2)] md:block" />
          <span className="hidden md:block">Сдайте пустой флакон — скидка 10 %</span>
        </div>
      </div>
      <header className="sticky top-0 z-50" onMouseLeave={leave}>
        <div
          className={`relative transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
            solid ? 'bg-[rgba(237,232,225,0.88)] shadow-[0_1px_0_var(--line)] backdrop-blur-xl' : 'bg-transparent'
          }`}
        >
          <div className="mx-auto grid h-[68px] max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-8">
            <nav className="flex items-center gap-1 max-lg:hidden" aria-label="Категории">
              {CATS.map((c) => (
                <button
                  key={c}
                  onMouseEnter={() => enter(c)}
                  onFocus={() => enter(c)}
                  onClick={() => go(c)}
                  aria-expanded={open === c}
                  className={`relative rounded-full px-3.5 py-2 text-[0.9375rem] font-medium transition-colors ${
                    open === c ? 'text-[var(--ink)]' : 'text-[var(--ink)]/75 hover:text-[var(--ink)]'
                  }`}
                >
                  {CATEGORY_LABEL[c]}
                  {open === c && (
                    <motion.span layoutId="lv-nav-dot" className="absolute bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-[var(--lav)]" />
                  )}
                </button>
              ))}
              <button onClick={() => scrollToId('quiz')} onMouseEnter={leave} className="lv-link ml-3 py-1 text-[0.9375rem] font-medium text-[var(--olive)]">
                Подбор ухода
              </button>
            </nav>
            <button
              className="grid size-10 place-items-center rounded-full border border-[var(--line)] lg:hidden"
              onClick={() => setMobile(true)}
              aria-label="Открыть меню"
            >
              <Menu className="size-[18px]" strokeWidth={1.6} />
            </button>

            <Wordmark />

            <div className="flex items-center justify-end gap-1.5 sm:gap-2">
              <button className="grid size-10 place-items-center rounded-full hover:bg-black/5 max-sm:hidden" aria-label="Поиск">
                <Search className="size-[18px]" strokeWidth={1.6} />
              </button>
              <button className="grid size-10 place-items-center rounded-full hover:bg-black/5 max-md:hidden" aria-label="Личный кабинет">
                <User className="size-[18px]" strokeWidth={1.6} />
              </button>
              <CartButton />
            </div>
          </div>

          <AnimatePresence>
            {open && (
              <motion.div
                key="mega"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.28, ease }}
                onMouseEnter={() => window.clearTimeout(closeT.current)}
                className="absolute inset-x-0 top-full border-t border-[var(--line)] bg-[var(--paper)] shadow-[0_30px_60px_-30px_rgba(30,30,28,0.35)] max-lg:hidden"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={open}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.2, ease }}
                    className="mx-auto grid max-w-[1440px] grid-cols-[1.1fr_1fr_1fr_1.35fr] gap-10 px-8 pt-9 pb-10"
                  >
                    <div>
                      <p className="lv-serif text-[2.6rem] leading-[1.02]">{CATEGORY_LABEL[open]}</p>
                      <p className="mt-3 max-w-[16rem] text-[0.9rem] leading-relaxed text-[var(--muted)]">
                        {open === 'sets'
                          ? 'Готовые ритуалы со скидкой до 15 % и льняной косметичкой.'
                          : 'Натуральные составы, стеклянные флаконы и честные проценты активов на этикетке.'}
                      </p>
                      <button onClick={() => go(open)} className="mt-6 inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-[var(--olive)]">
                        Смотреть всё <ArrowUpRight className="size-4" />
                      </button>
                    </div>
                    {MEGA[open].cols.map((col) => (
                      <div key={col.title}>
                        <p className="text-[0.8125rem] text-[var(--muted)]">{col.title}</p>
                        <ul className="mt-4 space-y-2.5">
                          {col.items.map((it) => (
                            <li key={it}>
                              <button onClick={() => go(open)} className="lv-link text-left text-[1.02rem]">
                                {it}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <FeatureCard
                      id={MEGA[open].feature}
                      note={MEGA[open].note}
                      onOpen={(id) => {
                        setOpen(null)
                        openProduct(id)
                      }}
                    />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <AnimatePresence>
        {mobile && (
          <motion.div
            className="fixed inset-0 z-[75] flex flex-col bg-[var(--stone)] lg:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.5, ease }}
            data-lenis-prevent
          >
            <div className="flex h-[68px] items-center justify-between px-4">
              <Wordmark />
              <button className="grid size-10 place-items-center rounded-full border border-[var(--line)]" onClick={() => setMobile(false)} aria-label="Закрыть меню">
                <X className="size-[18px]" strokeWidth={1.6} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-5 pt-6">
              {CATS.map((c, i) => (
                <motion.button
                  key={c}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.5, ease }}
                  onClick={() => go(c)}
                  className="flex w-full items-end justify-between gap-4 border-b border-[var(--line)] py-4 text-left"
                >
                  <span className="lv-serif text-[2.4rem] leading-none">{CATEGORY_LABEL[c]}</span>
                  <span className="max-w-[46%] pb-1 text-right text-[0.8125rem] leading-snug text-[var(--muted)]">{MEGA[c].cols[0].items.slice(0, 2).join(', ')}</span>
                </motion.button>
              ))}
              <button
                onClick={() => {
                  setMobile(false)
                  setTimeout(() => scrollToId('quiz'), 60)
                }}
                className="lv-btn lv-btn-primary mt-8 h-14 w-full"
              >
                Подобрать уход за 30 секунд
              </button>
              <div className="mt-8 grid grid-cols-2 gap-3 pb-10 text-[0.9rem] text-[var(--muted)]">
                <span>Доставка и оплата</span>
                <span>Возврат флаконов</span>
                <span>Подарочные сертификаты</span>
                <span>+7 800 555-19-71</span>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function FeatureCard({ id, note, onOpen }: { id: string; note: string; onOpen: (id: string) => void }) {
  const p = byId(id)
  return (
    <button
      onClick={() => onOpen(id)}
      className="group relative flex overflow-hidden rounded-[22px] p-5 text-left"
      style={{ background: `linear-gradient(160deg, ${p.tone}, #f3efe8)` }}
    >
      <div className="relative z-10 flex flex-1 flex-col">
        <span className="w-fit rounded-full bg-[var(--paper)]/80 px-2.5 py-1 text-[0.75rem] font-medium">{note}</span>
        <span className="mt-auto text-[0.8125rem] text-[var(--muted)]">
          {p.kind} № {p.num}
        </span>
        <span className="lv-serif mt-1 text-[1.45rem] leading-tight">{p.title}</span>
        <span className="lv-num mt-2 text-[1rem]">от {rub(p.prices[15])}</span>
      </div>
      <Glyph p={p} className="h-[170px] w-auto shrink-0 transition-transform duration-500 group-hover:-translate-y-1.5 group-hover:rotate-[-3deg]" />
    </button>
  )
}
