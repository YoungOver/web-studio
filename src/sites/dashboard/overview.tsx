import { memo, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ArrowRight, Download, Info, Pause, Play, Plus, TriangleAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CHANNELS, CHANNEL_NAME, RANGES, type Channel, type Kpi, type Order, type Point, type RangeKey, type Summary } from './data'
import { ago, axisRub, num, pct, rub } from './format'
import { AnimatedNumber, Button, ChannelDot, Delta, Panel, PanelHeader, Segmented, Skeleton, Sparkline, useTheme, useToast } from './ui'
import type { View } from './shell'

const fmtKpi: Record<Kpi['id'], (n: number) => string> = {
  revenue: rub,
  orders: num,
  avg: rub,
  conv: (n) => pct(n, 2),
}

/* ---------- KPI ---------- */

function KpiCard({ k, prevLabel, loading }: { k: Kpi; prevLabel: string; loading: boolean }) {
  const { pal } = useTheme()
  return (
    <Panel className="relative overflow-hidden p-3.5 sm:p-4 md:p-5">
      <div className="flex items-center gap-1.5 text-[12.5px] text-(--text-2) sm:text-[13px]">
        {k.label}
        <span title={k.hint} className="text-(--text-3)">
          <Info className="size-3.5" />
          <span className="sr-only">{k.hint}</span>
        </span>
      </div>
      {loading ? (
        <div className="mt-3 space-y-2.5">
          <Skeleton className="h-7 w-[70%]" />
          <Skeleton className="h-4 w-[55%]" />
          <Skeleton className="mt-3 h-9 w-full" />
        </div>
      ) : (
        <>
          <div className="mt-1.5 text-[19px] leading-tight font-semibold tracking-[-0.02em] sm:mt-2 sm:text-[26px] md:text-[28px]">
            <AnimatedNumber value={k.value} format={fmtKpi[k.id]} />
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-(--text-3)">
            <Delta value={k.delta} />
            <span className="hidden sm:inline">{prevLabel}</span>
          </div>
          <div className="pointer-events-none mt-3 h-7 sm:mt-3.5 sm:h-9">
            <Sparkline data={k.spark} color={pal.site} id={k.id} height={36} />
          </div>
        </>
      )}
    </Panel>
  )
}

/* ---------- Revenue chart ---------- */

type Metric = 'revenue' | 'orders'
interface Row {
  label: string
  fullLabel: string
  site: number
  ozon: number
  wb: number
  avito: number
}

function ChartTooltip({ row, hidden, metric, pal }: { row?: Row; hidden: Set<Channel>; metric: Metric; pal: Record<Channel, string> }) {
  if (!row) return null
  const vis = CHANNELS.filter((c) => !hidden.has(c.id))
  const total = vis.reduce((s, c) => s + row[c.id], 0)
  const f = metric === 'revenue' ? rub : num
  return (
    <div className="min-w-[230px] rounded-xl bg-(--panel) p-3 text-[12.5px] shadow-(--shadow-pop)">
      <p className="mb-2 font-medium text-(--text-2) first-letter:uppercase">{row.fullLabel}</p>
      <ul className="space-y-1.5">
        {[...vis].reverse().map((c) => (
          <li key={c.id} className="flex items-center gap-2">
            <span className="size-2.5 rounded-[3px]" style={{ background: pal[c.id] }} />
            <span className="flex-1 text-(--text-2)">{c.name}</span>
            <span className="num text-(--text-3)">{total ? pct(row[c.id] / total, 0) : ''}</span>
            <span className="num w-[92px] text-right font-medium">{f(row[c.id])}</span>
          </li>
        ))}
      </ul>
      <div className="mt-2.5 flex items-center justify-between border-t border-(--border) pt-2.5">
        <span className="text-(--text-2)">Итого</span>
        <span className="num text-[13.5px] font-semibold">{f(total)}</span>
      </div>
    </div>
  )
}

const RevenueChart = memo(function RevenueChart({ s, loading }: { s: Summary; loading: boolean }) {
  const { pal, theme } = useTheme()
  const [metric, setMetric] = useState<Metric>('revenue')
  const [hidden, setHidden] = useState<Set<Channel>>(new Set())

  const rows: Row[] = useMemo(
    () =>
      s.points.map((p: Point) =>
        metric === 'revenue'
          ? { label: p.label, fullLabel: p.fullLabel, site: p.site, ozon: p.ozon, wb: p.wb, avito: p.avito }
          : { label: p.label, fullLabel: p.fullLabel, ...p.ordersBy },
      ),
    [s, metric],
  )
  const totals = useMemo(() => {
    const t: Record<Channel, number> = { site: 0, ozon: 0, wb: 0, avito: 0 }
    for (const r of rows) for (const c of CHANNELS) t[c.id] += r[c.id]
    return t
  }, [rows])
  const visibleTotal = CHANNELS.filter((c) => !hidden.has(c.id)).reduce((a, c) => a + totals[c.id], 0)
  const grand = CHANNELS.reduce((a, c) => a + totals[c.id], 0)
  const kpi = s.kpis[metric === 'revenue' ? 0 : 1]

  const toggle = (c: Channel) =>
    setHidden((h) => {
      const n = new Set(h)
      if (n.has(c)) n.delete(c)
      else if (n.size < CHANNELS.length - 1) n.add(c)
      return n
    })

  const range = RANGES.find((r) => r.key === s.range)!
  const tickEvery = s.range === '30d' ? 5 : 1

  return (
    <Panel className="flex min-w-0 flex-col">
      <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-4.5">
        <div>
          <h2 className="text-[14.5px] font-semibold">{metric === 'revenue' ? 'Выручка по каналам' : 'Заказы по каналам'}</h2>
          {loading ? (
            <Skeleton className="mt-2 h-8 w-52" />
          ) : (
            <div className="mt-1 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
              <span className="text-[26px] font-semibold tracking-[-0.02em]">
                <AnimatedNumber value={visibleTotal} format={metric === 'revenue' ? rub : num} />
              </span>
              {hidden.size === 0 ? <Delta value={kpi.delta} /> : <span className="text-[12.5px] text-(--text-3)">{pct(visibleTotal / grand, 0)} от всех каналов</span>}
            </div>
          )}
        </div>
        <Segmented<Metric>
          size="sm"
          label="Метрика графика"
          value={metric}
          onChange={setMetric}
          options={[
            { value: 'revenue', label: 'Выручка' },
            { value: 'orders', label: 'Заказы' },
          ]}
        />
      </div>

      <div role="group" aria-label="Показать каналы" className="mt-4 flex flex-wrap gap-1.5 px-5">
        {CHANNELS.map((c) => {
          const off = hidden.has(c.id)
          return (
            <button
              key={c.id}
              aria-pressed={!off}
              onClick={() => toggle(c.id)}
              className={cn(
                'group flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[12.5px] transition-all',
                off ? 'border-dashed border-(--border-strong) text-(--text-3)' : 'border-(--border) bg-(--panel-2) hover:border-(--border-strong)',
              )}
            >
              <span className={cn('size-2.5 rounded-[3px] transition-opacity', off && 'opacity-30')} style={{ background: pal[c.id] }} />
              <span className={cn('font-medium', off && 'line-through decoration-(--text-3)')}>{c.name}</span>
              {!loading && <span className="num text-(--text-3)">{pct(totals[c.id] / grand, 0)}</span>}
            </button>
          )
        })}
      </div>

      <div className="relative mt-3 h-[260px] px-1 pb-3 md:h-[318px] md:px-2">
        {loading ? (
          <div className="flex h-full items-end gap-1.5 px-4 pb-6">
            {Array.from({ length: 24 }).map((_, i) => (
              <Skeleton key={i} className="flex-1 rounded-sm" style={{ height: `${38 + ((i * 37) % 11) * 5 + Math.sin(i / 2) * 8}%` }} />
            ))}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={rows} margin={{ top: 8, right: 14, left: 4, bottom: 0 }}>
              <defs>
                {CHANNELS.map((c) => (
                  <linearGradient key={c.id} id={`g-${c.id}-${theme}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={pal[c.id]} stopOpacity={theme === 'dark' ? 0.3 : 0.26} />
                    <stop offset="100%" stopColor={pal[c.id]} stopOpacity={theme === 'dark' ? 0.05 : 0.05} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid vertical={false} stroke={pal.grid} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fill: pal.axis, fontSize: 11.5 }}
                interval={s.range === '30d' ? tickEvery - 1 : 'preserveStartEnd'}
                tickMargin={10}
                minTickGap={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={58}
                tick={{ fill: pal.axis, fontSize: 11.5 }}
                tickFormatter={(v: number) => (metric === 'revenue' ? axisRub(v) : num(v))}
                tickCount={5}
              />
              <Tooltip
                cursor={{ stroke: pal.cursor, strokeWidth: 1, strokeDasharray: '3 3' }}
                isAnimationActive={false}
                content={({ active, payload }) => (active && payload?.length ? <ChartTooltip row={payload[0].payload as Row} hidden={hidden} metric={metric} pal={pal} /> : null)}
              />
              {CHANNELS.filter((c) => !hidden.has(c.id)).map((c) => (
                <Area
                  key={c.id}
                  type="monotone"
                  dataKey={c.id}
                  name={CHANNEL_NAME[c.id]}
                  stackId="1"
                  stroke={pal[c.id]}
                  strokeWidth={1.75}
                  fill={`url(#g-${c.id}-${theme})`}
                  activeDot={{ r: 4, strokeWidth: 2, stroke: pal.surface, fill: pal[c.id] }}
                  animationDuration={700}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
      <p className="sr-only">
        {range.label}:{' '}
        {CHANNELS.map((c) => `${c.name} ${metric === 'revenue' ? rub(totals[c.id]) : num(totals[c.id])}`).join(', ')}
      </p>
    </Panel>
  )
})

/* ---------- Funnel ---------- */

function Funnel({ s, loading }: { s: Summary; loading: boolean }) {
  const { theme } = useTheme()
  const ramp = theme === 'dark' ? ['#86b6ef', '#5598e7', '#2a78d6', '#1c5cab'] : ['#86b6ef', '#5598e7', '#2a78d6', '#1c5cab']
  const f = s.funnel
  const steps = f.map((st, i) => (i === 0 ? 1 : st.value / f[i - 1].value))
  let worst = 2
  for (let i = 3; i < steps.length; i++) if (steps[i] < steps[worst]) worst = i
  return (
    <Panel className="flex h-full flex-col">
      <PanelHeader title="Воронка продаж" sub="Конверсия каждого шага" />
      <div className="flex flex-1 flex-col justify-around gap-3 px-5 pt-4 pb-2">
        {f.map((st, i) => (
          <div key={st.label}>
            <div className="mb-1.5 flex items-baseline justify-between gap-2 text-[13px]">
              <span className="font-medium">{st.label}</span>
              {loading ? (
                <Skeleton className="h-4 w-24" />
              ) : (
                <span className="flex items-baseline gap-2">
                  <span className="num font-semibold">{num(st.value)}</span>
                  <span className="num w-[52px] text-right text-[12px] text-(--text-3)">{i === 0 ? '100 %' : pct(steps[i])}</span>
                </span>
              )}
            </div>
            <div className="h-7 overflow-hidden rounded-md bg-(--hover)">
              {!loading && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(steps[i] * 100, 2)}%` }}
                  transition={{ duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full rounded-md"
                  style={{ background: ramp[i] }}
                  title={st.hint}
                />
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="m-3 mt-3 flex items-start gap-2.5 rounded-xl border border-(--border) bg-(--panel-2) p-3 text-[12.5px]">
        <TriangleAlert className="mt-px size-4 shrink-0 text-(--warn)" />
        {loading ? (
          <Skeleton className="h-4 w-full" />
        ) : (
          <p className="leading-relaxed text-(--text-2)">
            Итоговая конверсия <span className="num font-semibold text-(--text)">{pct(f[3].value / f[0].value, 2)}</span>. Главная потеря после корзины: до шага «{f[worst].label.toLowerCase()}» доходят только{' '}
            <span className="num font-medium text-(--text)">{pct(steps[worst], 0)}</span> покупателей.
          </p>
        )}
      </div>
    </Panel>
  )
}

/* ---------- Top products ---------- */

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <span className="rounded-md bg-(--bad-soft) px-1.5 py-0.5 text-[11.5px] font-medium whitespace-nowrap text-(--bad)">Нет в наличии</span>
  if (stock < 40) return <span className="num rounded-md bg-(--warn-soft) px-1.5 py-0.5 text-[11.5px] font-medium whitespace-nowrap text-(--warn)">Мало · {stock}</span>
  return <span className="num text-[12.5px] text-(--text-2)">{num(stock)} шт.</span>
}

function TopProducts({ s, loading, onAll }: { s: Summary; loading: boolean; onAll: () => void }) {
  const rows = s.products.slice(0, 6)
  const max = rows[0]?.revenue ?? 1
  return (
    <Panel className="h-full min-w-0">
      <PanelHeader
        title="Топ товаров"
        sub="По выручке за период"
        right={
          <Button variant="ghost" size="sm" onClick={onAll}>
            Все товары <ArrowRight className="size-3.5" />
          </Button>
        }
      />
      <div className="scroll-thin mt-3 hidden overflow-x-auto md:block">
        <table className="w-full min-w-[680px] table-fixed text-[13px]">
          <colgroup>
            <col className="w-[36%]" />
            <col className="w-[10%]" />
            <col className="w-[9%]" />
            <col className="w-[22%]" />
            <col className="w-[11%]" />
            <col className="w-[12%]" />
          </colgroup>
          <thead>
            <tr className="border-y border-(--border) text-left text-[12px] text-(--text-3)">
              <th className="py-2 pr-2 pl-5 font-medium">Товар</th>
              <th className="px-2 py-2 font-medium">Каналы</th>
              <th className="px-2 py-2 text-right font-medium">Продано</th>
              <th className="px-2 py-2 font-medium">Выручка</th>
              <th className="px-2 py-2 text-right font-medium">Динамика</th>
              <th className="py-2 pr-5 pl-2 text-right font-medium">Остаток</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p, i) => (
              <tr key={p.id} className="border-b border-(--border) transition-colors last:border-0 hover:bg-(--hover)">
                <td className="py-2.5 pr-2 pl-5">
                  <div className="flex items-center gap-3">
                    <span className="num grid size-8 shrink-0 place-items-center rounded-lg border border-(--border) bg-(--panel-2) text-[12px] font-semibold text-(--text-3)">
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{p.name}</span>
                      <span className="mono block text-(--text-3)">{p.sku}</span>
                    </span>
                  </div>
                </td>
                <td className="px-2 py-2.5">
                  <span className="flex gap-1">
                    {p.channels.map((c) => (
                      <span key={c} title={CHANNEL_NAME[c]}>
                        <ChannelDot channel={c} />
                      </span>
                    ))}
                  </span>
                </td>
                <td className="num px-2 py-2.5 text-right text-(--text-2)">{loading ? <Skeleton className="ml-auto h-4 w-10" /> : num(p.units)}</td>
                <td className="px-2 py-2.5">
                  {loading ? (
                    <Skeleton className="h-4 w-full" />
                  ) : (
                    <div className="flex items-center gap-2.5">
                      <span className="num w-[88px] shrink-0 font-medium">{rub(p.revenue)}</span>
                      <span className="h-1.5 min-w-10 flex-1 overflow-hidden rounded-full bg-(--hover)">
                        <motion.span
                          className="block h-full rounded-full bg-(--accent)"
                          initial={{ width: 0 }}
                          animate={{ width: `${(p.revenue / max) * 100}%` }}
                          transition={{ duration: 0.7, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </span>
                    </div>
                  )}
                </td>
                <td className="px-2 py-2.5 text-right">{loading ? <Skeleton className="ml-auto h-4 w-14" /> : <Delta value={p.delta} />}</td>
                <td className="py-2.5 pr-5 pl-2 text-right">
                  <StockBadge stock={p.stock} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="mt-2 md:hidden">
        {rows.map((p, i) => (
          <li key={p.id} className="border-t border-(--border) px-4 py-3">
            <div className="flex items-baseline justify-between gap-3">
              <span className="truncate text-[13.5px] font-medium">{p.name}</span>
              <span className="num shrink-0 text-[13.5px] font-semibold">{loading ? '' : rub(p.revenue)}</span>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-(--hover)">
                {!loading && (
                  <motion.span
                    className="block h-full rounded-full bg-(--accent)"
                    initial={{ width: 0 }}
                    animate={{ width: `${(p.revenue / max) * 100}%` }}
                    transition={{ duration: 0.7, delay: i * 0.05 }}
                  />
                )}
              </span>
              <span className="num text-[12px] text-(--text-3)">{num(p.units)} шт.</span>
              {!loading && <Delta value={p.delta} />}
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  )
}

/* ---------- Live orders ---------- */

const BADGE: Record<Channel, string> = { site: 'Сайт', ozon: 'OZ', wb: 'WB', avito: 'Ав' }
function ChannelBadge({ channel }: { channel: Channel }) {
  const { pal } = useTheme()
  return (
    <span
      title={CHANNEL_NAME[channel]}
      className="grid size-9 shrink-0 place-items-center rounded-lg text-[10.5px] font-bold tracking-[-0.01em] text-(--text)"
      style={{ background: `color-mix(in srgb, ${pal[channel]} 18%, transparent)`, boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${pal[channel]} 35%, transparent)` }}
    >
      {BADGE[channel]}
    </span>
  )
}

function LiveOrders({ orders, paused, setPaused, today }: { orders: Order[]; paused: boolean; setPaused: (v: boolean) => void; today: { count: number; sum: number } }) {
  const [, setTick] = useState(0)
  useEffect(() => {
    const t = window.setInterval(() => setTick((x) => x + 1), 5000)
    return () => window.clearInterval(t)
  }, [])
  const now = Date.now()
  return (
    <Panel className="flex min-h-[420px] flex-col overflow-hidden">
      <div className="flex items-start justify-between gap-3 px-5 pt-4.5">
        <div>
          <h2 className="flex items-center gap-2 text-[14.5px] font-semibold">
            Последние заказы
            <span className={cn('size-2 rounded-full', paused ? 'bg-(--text-3)' : 'live-dot bg-(--good)')} />
          </h2>
          <p className="mt-0.5 text-[12.5px] text-(--text-3)">
            Сегодня <span className="num text-(--text-2)">{num(today.count)}</span> заказов на <span className="num text-(--text-2)">{rub(today.sum)}</span>
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setPaused(!paused)} aria-pressed={paused}>
          {paused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
          {paused ? 'Продолжить' : 'Пауза'}
        </Button>
      </div>
      <ul className="relative mt-3 flex-1 overflow-hidden px-2 pb-2" aria-live="polite">
        <AnimatePresence initial={false}>
          {orders.slice(0, 7).map((o) => {
            const fresh = now - o.at < 2500
            return (
              <motion.li
                key={o.id}
                layout
                initial={{ opacity: 0, height: 0, y: -12 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                className="overflow-hidden"
              >
                <div
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-[1500ms]',
                    fresh ? 'bg-(--accent-soft)' : 'hover:bg-(--hover)',
                  )}
                >
                  <ChannelBadge channel={o.channel} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-[13px] font-medium">{o.customer}</span>
                      <span className="num shrink-0 text-[13px] font-semibold">{rub(o.amount)}</span>
                    </div>
                    <div className="mt-0.5 flex items-baseline justify-between gap-2 text-[12px] text-(--text-3)">
                      <span className="truncate">
                        <span className="mono">{o.id}</span> · {o.items > 1 ? `${o.items} × ` : ''}
                        {o.product}
                      </span>
                      <span className="shrink-0">{ago(now - o.at)}</span>
                    </div>
                  </div>
                </div>
              </motion.li>
            )
          })}
        </AnimatePresence>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-linear-to-t from-(--panel) to-transparent" />
      </ul>
    </Panel>
  )
}

/* ---------- Page ---------- */

export function Overview({
  s,
  loading,
  range,
  orders,
  paused,
  setPaused,
  today,
  go,
}: {
  s: Summary
  loading: boolean
  range: RangeKey
  orders: Order[]
  paused: boolean
  setPaused: (v: boolean) => void
  today: { count: number; sum: number }
  go: (v: View) => void
}) {
  const toast = useToast()
  const [exporting, setExporting] = useState(false)
  const r = RANGES.find((x) => x.key === range)!
  const hour = new Date().getHours()
  const hello = hour < 5 ? 'Доброй ночи' : hour < 12 ? 'Доброе утро' : hour < 18 ? 'Добрый день' : 'Добрый вечер'
  return (
    <div className="space-y-4 md:space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3 pt-1">
        <div>
          <h1 className="text-[22px] font-semibold tracking-[-0.02em] md:text-[24px]">{hello}, Марина</h1>
          <p className="mt-1 text-[13.5px] text-(--text-2)">
            Продажи по 4 каналам за {r.key === '90d' ? 'квартал' : `последние ${r.label}`}. Выручка {s.kpis[0].delta >= 0 ? 'растёт' : 'снижается'}{' '}
            {r.prevLabel}.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            disabled={exporting}
            onClick={() => {
              setExporting(true)
              window.setTimeout(() => {
                setExporting(false)
                toast({ tone: 'good', title: 'Отчёт выгружен', body: `Продажи за ${r.label.toLowerCase()}, формат XLSX` })
              }, 1100)
            }}
          >
            <Download className={cn('size-3.5', exporting && 'animate-bounce')} />
            {exporting ? 'Готовим…' : 'Экспорт'}
          </Button>
          <Button variant="primary" onClick={() => go('deals')}>
            <Plus className="size-3.5" />
            Новая сделка
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">
        {s.kpis.map((k) => (
          <KpiCard key={k.id} k={k} prevLabel={r.prevLabel} loading={loading} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 md:gap-4 xl:grid-cols-12">
        <div className="min-w-0 xl:col-span-8">
          <RevenueChart s={s} loading={loading} />
        </div>
        <div className="min-w-0 xl:col-span-4">
          <LiveOrders orders={orders} paused={paused} setPaused={setPaused} today={today} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:gap-4 xl:grid-cols-12">
        <div className="min-w-0 xl:col-span-8">
          <TopProducts s={s} loading={loading} onAll={() => go('products')} />
        </div>
        <div className="min-w-0 xl:col-span-4">
          <Funnel s={s} loading={loading} />
        </div>
      </div>
    </div>
  )
}
