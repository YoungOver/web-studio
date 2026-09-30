import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown, MapPin, Plus } from 'lucide-react'
import { useState } from 'react'
import { Art } from '../art'
import { categories, products, rub, BONUS_BALANCE, type Category, type Product, type Shop } from '../data'
import { Press, Stepper, spring } from './ui'

function greeting() {
  const h = new Date().getHours()
  if (h < 5) return 'Доброй ночи'
  if (h < 12) return 'Доброе утро'
  if (h < 18) return 'Добрый день'
  return 'Добрый вечер'
}

export function EtaBadge({ eta }: { eta: number }) {
  return (
    <span className="inline-flex h-[26px] items-center gap-[7px] rounded-full bg-[#e7f5ec] pr-[10px] pl-[9px] text-[13px] font-medium text-[#177a3a]">
      <span className="tg-pulse h-[7px] w-[7px] rounded-full bg-[var(--tg-green)]" />
      <span className="tg-num whitespace-nowrap">
        Готово через ~
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={eta} className="inline-block" initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 8, opacity: 0 }} transition={spring}>
            {eta}
          </motion.span>
        </AnimatePresence>{' '}
        мин
      </span>
    </span>
  )
}

function Loyalty() {
  const filled = 4
  return (
    <div className="mx-3 mt-3 flex items-center gap-3 rounded-[14px] bg-[var(--tg-bg)] px-4 py-3">
      <div className="min-w-0 flex-1">
        <div className="text-[15px] font-semibold">
          <span className="tg-num">{BONUS_BALANCE}</span> бонусов
        </div>
        <div className="mt-[1px] text-[12.5px] text-[var(--tg-hint)]">Ещё 2 чашки до подарка</div>
      </div>
      <div className="flex gap-[5px]">
        {Array.from({ length: 6 }).map((_, i) => (
          <span
            key={i}
            className="grid h-[22px] w-[22px] place-items-center rounded-full"
            style={{
              background: i < filled ? '#6b3f1f' : i === 5 ? 'transparent' : '#ece7e1',
              border: i === 5 ? '1.5px dashed #c7a17a' : 'none',
            }}
          >
            {i < filled && (
              <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden>
                <ellipse cx="6" cy="6" rx="3.4" ry="4.6" fill="#e8c296" transform="rotate(30 6 6)" />
                <path d="M4.4 3.4 Q 6.4 6 7.6 8.6" stroke="#6b3f1f" strokeWidth="0.9" fill="none" />
              </svg>
            )}
          </span>
        ))}
      </div>
    </div>
  )
}

function Card({ p, count, onOpen, onAdd, onDec }: { p: Product; count: number; onOpen: () => void; onAdd: () => void; onDec: () => void }) {
  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ ...spring, opacity: { duration: 0.18 } }}
      className="relative"
    >
      <motion.div
        role="button"
        tabIndex={0}
        aria-label={`${p.name}, ${rub(p.price)}`}
        onClick={onOpen}
        onKeyDown={(e) => e.key === 'Enter' && onOpen()}
        whileTap={{ scale: 0.975 }}
        transition={spring}
        className="flex h-full cursor-pointer flex-col rounded-[16px] bg-[var(--tg-bg)] p-[6px] pb-[10px] outline-none"
      >
        <div className="relative aspect-square overflow-hidden rounded-[12px]" style={{ background: p.tint }}>
          <div className="absolute inset-[6%]">
            <Art kind={p.art} />
          </div>
          {p.tag && (
            <span className="absolute top-2 left-2 rounded-full bg-white/85 px-2 py-[2px] text-[11px] font-medium text-[#7a4b25] backdrop-blur">
              {p.tag}
            </span>
          )}
        </div>
        <div className="mt-2 px-[6px]">
          <div className="text-[15px] leading-[19px] font-semibold tracking-[-0.01em]">{p.name}</div>
          <div className="mt-[2px] truncate text-[12.5px] leading-[16px] text-[var(--tg-hint)]">{p.desc}</div>
        </div>
        <div className="mt-auto flex h-9 items-end justify-between pt-2 pl-[6px]">
          <span className="tg-num pb-[5px] text-[15px] font-semibold">
            {p.sizes && <span className="font-normal text-[var(--tg-hint)]">от </span>}
            {rub(p.price)}
          </span>
        </div>
      </motion.div>
      <motion.div
        className="absolute right-[10px] bottom-[10px] overflow-hidden rounded-full"
        animate={{ width: count > 0 ? 92 : 32 }}
        transition={spring}
        style={{ height: 32 }}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {count > 0 ? (
            <motion.div key="st" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}>
              <div className="w-[92px]">
                <Stepper value={count} onInc={onAdd} onDec={onDec} size="sm" />
              </div>
            </motion.div>
          ) : (
            <motion.div key="add" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}>
              <Press
                aria-label={`Добавить ${p.name}`}
                scale={0.85}
                onClick={(e) => {
                  e.stopPropagation()
                  onAdd()
                }}
                className="grid h-8 w-8 place-items-center rounded-full bg-[var(--tg-btn)] text-white"
              >
                <Plus size={18} strokeWidth={2.6} />
              </Press>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

export function Menu({
  shop,
  onShop,
  counts,
  onOpen,
  onAdd,
  onDec,
  bottomPad,
}: {
  shop: Shop
  onShop: () => void
  counts: Record<string, number>
  onOpen: (id: string) => void
  onAdd: (id: string) => void
  onDec: (id: string) => void
  bottomPad: number
}) {
  const [cat, setCat] = useState<Category>('coffee')
  const list = products.filter((p) => p.category === cat)
  return (
    <div className="tg-scroll absolute inset-0 bg-[var(--tg-sec)]" style={{ paddingBottom: bottomPad }}>
      <div className="rounded-b-[22px] bg-[var(--tg-bg)] px-4 pt-1 pb-4">
        <Press scale={0.98} onClick={onShop} className="-ml-1 flex items-center gap-[10px] rounded-[12px] py-1 pr-2 pl-1 text-left active:bg-black/[.03]" aria-label="Выбрать кофейню">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#e8f1fa] text-[var(--tg-link)]">
            <MapPin size={18} strokeWidth={2.2} />
          </span>
          <span>
            <span className="flex items-center gap-1 text-[15px] leading-[19px] font-semibold">
              {shop.street}
              <ChevronDown size={16} strokeWidth={2.4} className="text-[var(--tg-hint)]" />
            </span>
            <span className="block text-[12.5px] leading-[16px] text-[var(--tg-hint)]">
              {shop.distance} от вас · открыто {shop.hours}
            </span>
          </span>
        </Press>
        <div className="mt-4 flex items-end justify-between gap-2">
          <h1 className="text-[27px] leading-[31px] font-bold tracking-[-0.025em]">
            {greeting()},
            <br />
            Анна
          </h1>
          <div className="pb-[3px]">
            <EtaBadge eta={shop.eta} />
          </div>
        </div>
      </div>

      <Loyalty />

      <div className="sticky top-0 z-10 bg-[var(--tg-sec)]/90 px-3 pt-3 pb-[10px] backdrop-blur-md">
        <div className="relative flex rounded-[10px] bg-[#e3e4e9] p-[2px]" role="tablist">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={cat === c.id}
              onClick={() => setCat(c.id)}
              className="relative z-0 h-[30px] flex-1 text-[13.5px] font-medium"
            >
              {cat === c.id && (
                <motion.span
                  layoutId="seg"
                  className="absolute inset-0 -z-10 rounded-[8px] bg-white"
                  style={{ boxShadow: '0 3px 8px rgba(0,0,0,.08), 0 1px 1px rgba(0,0,0,.04)' }}
                  transition={spring}
                />
              )}
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-[10px] px-3 pb-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {list.map((p) => (
            <Card
              key={p.id}
              p={p}
              count={counts[p.id] ?? 0}
              onOpen={() => onOpen(p.id)}
              onAdd={() => onAdd(p.id)}
              onDec={() => onDec(p.id)}
            />
          ))}
        </AnimatePresence>
      </div>
      <p className="px-6 pb-2 text-center text-[12px] leading-[16px] text-[var(--tg-hint)]">
        Цены указаны для самовывоза. Бонусами можно оплатить до 30% заказа.
      </p>
    </div>
  )
}
