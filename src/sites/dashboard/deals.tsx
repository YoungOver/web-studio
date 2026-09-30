import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent as RPointerEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CalendarDays, GripVertical, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CHANNEL_NAME, MANAGERS, STAGES, rng, type Deal, type Stage } from './data'
import { num, plural, rub } from './format'
import { Avatar, Button, ChannelDot, Kbd, Segmented, useToast } from './ui'

interface Drag {
  id: string
  x: number
  y: number
  ox: number
  oy: number
  w: number
}
interface Over {
  stage: Stage
  index: number
}

function DealCard({
  d,
  ghost,
  onPointerDown,
  onKeyDown,
}: {
  d: Deal
  ghost?: boolean
  onPointerDown?: (e: RPointerEvent<HTMLDivElement>) => void
  onKeyDown?: (e: KeyboardEvent<HTMLDivElement>) => void
}) {
  return (
    <div
      data-card={d.id}
      tabIndex={ghost ? -1 : 0}
      role="button"
      aria-roledescription="перетаскиваемая сделка"
      aria-label={`${d.title}, ${d.company}, ${rub(d.amount)}. Стрелки влево и вправо переносят сделку между этапами`}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      className={cn(
        'group relative cursor-grab rounded-xl border border-(--border) bg-(--panel) p-3.5 shadow-(--shadow-card) transition-[border-color,box-shadow] select-none hover:border-(--border-strong) active:cursor-grabbing',
        ghost && 'rotate-[1.5deg] cursor-grabbing border-(--accent) shadow-(--shadow-pop)',
      )}
    >
      <div className="flex items-center gap-2">
        <span className="mono text-(--text-3)">{d.id}</span>
        {d.tag && <span className="rounded-md bg-(--hover) px-1.5 py-px text-[11px] font-medium text-(--text-2)">{d.tag}</span>}
        <span data-handle className="ml-auto -mr-1.5 grid size-6 touch-none place-items-center rounded-md text-(--text-3) opacity-60 group-hover:opacity-100">
          <GripVertical className="size-3.5" />
        </span>
      </div>
      <p className="mt-2 text-[13.5px] leading-snug font-medium">{d.title}</p>
      <p className="mt-0.5 truncate text-[12.5px] text-(--text-3)">{d.company}</p>
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="num text-[14px] font-semibold tracking-[-0.01em]">{rub(d.amount)}</span>
        <Avatar name={d.owner} size={22} />
      </div>
      <div className="mt-2.5 flex items-center gap-3 border-t border-(--border) pt-2.5 text-[11.5px] text-(--text-3)">
        <span className="flex items-center gap-1.5">
          <ChannelDot channel={d.channel} />
          {CHANNEL_NAME[d.channel]}
        </span>
        <span className="flex items-center gap-1">
          <CalendarDays className="size-3" />
          до {d.due}
        </span>
        <span className="num ml-auto">{num(d.items)} шт.</span>
      </div>
    </div>
  )
}

export function Deals({ deals, setDeals }: { deals: Deal[]; setDeals: (fn: (d: Deal[]) => Deal[]) => void }) {
  const toast = useToast()
  const [owner, setOwner] = useState<'all' | 'mine'>('all')
  const [drag, setDrag] = useState<Drag | null>(null)
  const [over, setOver] = useState<Over | null>(null)
  const boardRef = useRef<HTMLDivElement>(null)
  const start = useRef<{ id: string; x: number; y: number; rect: DOMRect } | null>(null)
  const overRef = useRef<Over | null>(null)
  const seq = useRef(0)

  const visible = deals.filter((d) => owner === 'all' || d.owner === MANAGERS[0])

  const move = useCallback(
    (id: string, to: Over) => {
      let fromStage: Stage | null = null
      setDeals((all) => {
        const d = all.find((x) => x.id === id)
        if (!d) return all
        fromStage = d.stage
        const rest = all.filter((x) => x.id !== id)
        const col = rest.filter((x) => x.stage === to.stage && (owner === 'all' || x.owner === MANAGERS[0]))
        const moved = { ...d, stage: to.stage }
        if (to.index >= col.length) {
          const last = col[col.length - 1]
          const at = last ? rest.indexOf(last) + 1 : rest.length
          rest.splice(at, 0, moved)
        } else {
          rest.splice(rest.indexOf(col[to.index]), 0, moved)
        }
        return rest
      })
      window.setTimeout(() => {
        if (fromStage && fromStage !== to.stage) {
          const st = STAGES.find((s) => s.id === to.stage)!
          const d = deals.find((x) => x.id === id)
          toast({
            tone: to.stage === 'paid' ? 'good' : 'info',
            title: `Сделка перенесена в «${st.title}»`,
            body: d ? `${d.id} · ${d.company}${to.stage === 'paid' ? ' · в amoCRM и 1С' : ''}` : undefined,
          })
        }
      }, 0)
    },
    [setDeals, owner, deals, toast],
  )

  const computeOver = (x: number, y: number, dragId: string): Over | null => {
    const els = document.elementsFromPoint(x, y)
    const colEl = els.find((e) => (e as HTMLElement).dataset?.col) as HTMLElement | undefined
    if (!colEl) return null
    const stage = colEl.dataset.col as Stage
    const cards = Array.from(colEl.querySelectorAll<HTMLElement>('[data-card]')).filter((c) => c.dataset.card !== dragId)
    let index = cards.length
    for (let i = 0; i < cards.length; i++) {
      const r = cards[i].getBoundingClientRect()
      if (y < r.top + r.height / 2) {
        index = i
        break
      }
    }
    return { stage, index }
  }

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const s = start.current
      if (!s) return
      if (!drag) {
        if (Math.hypot(e.clientX - s.x, e.clientY - s.y) < 5) return
        setDrag({ id: s.id, x: e.clientX, y: e.clientY, ox: s.x - s.rect.left, oy: s.y - s.rect.top, w: s.rect.width })
      } else {
        setDrag((d) => (d ? { ...d, x: e.clientX, y: e.clientY } : d))
      }
      const o = computeOver(e.clientX, e.clientY, s.id)
      overRef.current = o
      setOver(o)
      const b = boardRef.current
      if (b && b.scrollWidth > b.clientWidth) {
        const r = b.getBoundingClientRect()
        if (e.clientX > r.right - 40) b.scrollLeft += 12
        if (e.clientX < r.left + 40) b.scrollLeft -= 12
      }
    }
    const onUp = () => {
      const s = start.current
      start.current = null
      if (drag && s && overRef.current) move(s.id, overRef.current)
      setDrag(null)
      setOver(null)
      overRef.current = null
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [drag, move])

  const onPointerDown = (d: Deal) => (e: RPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    if (e.pointerType !== 'mouse' && !(e.target as HTMLElement).closest('[data-handle]')) return
    e.preventDefault()
    ;(e.currentTarget as HTMLElement).focus({ preventScroll: true })
    start.current = { id: d.id, x: e.clientX, y: e.clientY, rect: e.currentTarget.getBoundingClientRect() }
  }

  const onKey = (d: Deal) => (e: KeyboardEvent<HTMLDivElement>) => {
    const i = STAGES.findIndex((s) => s.id === d.stage)
    const j = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : -1
    if (j < 0 || j >= STAGES.length || j === i) return
    e.preventDefault()
    move(d.id, { stage: STAGES[j].id, index: 0 })
    window.setTimeout(() => (document.querySelector(`[data-card="${d.id}"]`) as HTMLElement | null)?.focus(), 60)
  }

  const addDeal = () => {
    const r = rng(++seq.current * 311)
    const n = 1300 + seq.current
    const items = 10 + Math.floor(r() * 90)
    const d: Deal = {
      id: `D-${n}`,
      title: ['Пледы для загородного клуба', 'Свечи для спа-салона', 'Лампы Arc для коворкинга', 'Текстиль для апартаментов'][seq.current % 4] + `, ${items} шт.`,
      company: ['Клуб «Сосны»', 'Спа «Тишина»', 'Коворкинг «Точка»', 'Апарт-отель «Лофт»'][seq.current % 4],
      amount: Math.round((items * (1_800 + r() * 3_000)) / 100) * 100,
      stage: 'new',
      channel: 'site',
      owner: MANAGERS[0],
      due: '7 окт',
      tag: 'Новая',
      items,
    }
    setDeals((all) => [d, ...all])
    toast({ tone: 'info', title: 'Сделка создана', body: `${d.id} · ${d.company}` })
  }

  const total = visible.reduce((s, d) => s + d.amount, 0)
  const paid = visible.filter((d) => d.stage === 'paid').reduce((s, d) => s + d.amount, 0)
  const dragged = drag ? deals.find((d) => d.id === drag.id) : null

  return (
    <div className="space-y-4 md:space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3 pt-1">
        <div>
          <h1 className="text-[22px] font-semibold tracking-[-0.02em] md:text-[24px]">Сделки</h1>
          <p className="mt-1 text-[13.5px] text-(--text-2)">
            <span className="num">{visible.length}</span> {plural(visible.length, 'сделка', 'сделки', 'сделок')} на <span className="num">{rub(total)}</span>, оплачено{' '}
            <span className="num">{rub(paid)}</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Segmented<'all' | 'mine'>
            label="Ответственный"
            value={owner}
            onChange={setOwner}
            options={[
              { value: 'all', label: 'Все менеджеры' },
              { value: 'mine', label: 'Мои' },
            ]}
          />
          <Button variant="primary" onClick={addDeal}>
            <Plus className="size-3.5" />
            Новая сделка
          </Button>
        </div>
      </div>
      <p className="hidden items-center gap-1.5 text-[12.5px] text-(--text-3) md:flex">
        Перетащите карточку в другую колонку или выделите её и нажмите <Kbd>←</Kbd> <Kbd>→</Kbd>
      </p>

      <div
        ref={boardRef}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:snap-none md:grid-cols-2 md:gap-4 md:overflow-visible md:px-0 xl:grid-cols-4"
      >
        {STAGES.map((st) => {
          const cards = visible.filter((d) => d.stage === st.id && d.id !== drag?.id)
          const sum = visible.filter((d) => d.stage === st.id).reduce((s, d) => s + d.amount, 0)
          const count = visible.filter((d) => d.stage === st.id).length
          const isOver = over?.stage === st.id
          return (
            <section
              key={st.id}
              data-col={st.id}
              aria-label={`Колонка ${st.title}`}
              className={cn(
                'flex w-[82vw] max-w-[320px] shrink-0 snap-start flex-col rounded-2xl border bg-(--panel-2) transition-colors md:w-auto md:max-w-none',
                isOver ? 'border-(--accent) bg-(--accent-soft)' : 'border-(--border)',
              )}
            >
              <header className="flex items-center gap-2 px-3.5 pt-3.5 pb-3">
                <span className="size-2 rounded-full" style={{ background: st.tone }} />
                <h2 className="text-[13.5px] font-semibold">{st.title}</h2>
                <span className="num rounded-md bg-(--hover) px-1.5 text-[11.5px] font-medium text-(--text-2)">{count}</span>
                <span className="num ml-auto text-[12.5px] font-medium text-(--text-2)">{rub(sum)}</span>
              </header>
              <div className="flex min-h-[140px] flex-1 flex-col gap-2.5 px-2.5 pb-2.5">
                <AnimatePresence initial={false}>
                  {cards.map((d, i) => (
                    <motion.div
                      key={d.id}
                      layout
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.1 } }}
                      transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                    >
                      {isOver && over.index === i && <Placeholder />}
                      <DealCard d={d} onPointerDown={onPointerDown(d)} onKeyDown={onKey(d)} />
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isOver && over.index >= cards.length && <Placeholder />}
                {cards.length === 0 && !isOver && (
                  <div className="grid flex-1 place-items-center rounded-xl border border-dashed border-(--border-strong) py-8 text-[12.5px] text-(--text-3)">
                    Перетащите сделку сюда
                  </div>
                )}
              </div>
            </section>
          )
        })}
      </div>

      {drag && dragged && (
        <div
          className="pointer-events-none fixed z-[90]"
          style={{ left: drag.x - drag.ox, top: drag.y - drag.oy, width: drag.w }}
        >
          <DealCard d={dragged} ghost />
        </div>
      )}
    </div>
  )
}

function Placeholder() {
  return <div className="mb-2.5 h-[120px] rounded-xl border-2 border-dashed border-(--accent) bg-(--accent-soft) opacity-70" />
}
