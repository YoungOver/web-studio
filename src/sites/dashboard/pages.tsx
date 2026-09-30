import { useMemo, useState, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { ArrowDown, ArrowUp, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CHANNEL_NAME, CLIENTS, RANGES, SEGMENT_LABEL, type Client, type RangeKey, type Segment, type Summary } from './data'
import { num, pct, plural, rub } from './format'
import { Avatar, Button, ChannelDot, Delta, Panel, Skeleton, Switch, useToast } from './ui'

function PageHead({ title, sub, right }: { title: string; sub: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 pt-1">
      <div>
        <h1 className="text-[22px] font-semibold tracking-[-0.02em] md:text-[24px]">{title}</h1>
        <p className="mt-1 text-[13.5px] text-(--text-2)">{sub}</p>
      </div>
      {right}
    </div>
  )
}

function Stat({ label, value, note }: { label: string; value: ReactNode; note?: ReactNode }) {
  return (
    <Panel className="p-4">
      <p className="text-[12.5px] text-(--text-2)">{label}</p>
      <p className="num mt-1.5 text-[20px] font-semibold tracking-[-0.015em]">{value}</p>
      {note && <div className="mt-1.5 text-[12px] text-(--text-3)">{note}</div>}
    </Panel>
  )
}

function Chips<T extends string>({ value, onChange, items }: { value: T; onChange: (v: T) => void; items: { value: T; label: string; count?: number }[] }) {
  return (
    <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 md:mx-0 md:px-0">
      {items.map((it) => (
        <button
          key={it.value}
          aria-pressed={value === it.value}
          onClick={() => onChange(it.value)}
          className={cn(
            'flex h-8 shrink-0 items-center gap-1.5 rounded-lg border px-3 text-[12.5px] font-medium transition-colors',
            value === it.value ? 'border-(--accent) bg-(--accent-soft) text-(--text)' : 'border-(--border) bg-(--panel) text-(--text-2) hover:border-(--border-strong)',
          )}
        >
          {it.label}
          {it.count !== undefined && <span className="num text-(--text-3)">{it.count}</span>}
        </button>
      ))}
    </div>
  )
}

const SEG_CLS: Record<Segment, string> = {
  vip: 'bg-(--accent-soft) text-(--accent)',
  loyal: 'bg-(--good-soft) text-(--good)',
  new: 'bg-(--hover) text-(--text-2)',
  risk: 'bg-(--warn-soft) text-(--warn)',
}

const lastLabel = (d: number) => (d === 0 ? 'сегодня' : d === 1 ? 'вчера' : `${d} ${plural(d, 'день', 'дня', 'дней')} назад`)

/* ---------- Clients ---------- */

type SortKey = 'ltv' | 'orders' | 'lastDays'

export function Clients() {
  const [seg, setSeg] = useState<'all' | Segment>('all')
  const [q, setQ] = useState('')
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: 'ltv', dir: -1 })
  const rows = useMemo(() => {
    const s = q.trim().toLowerCase()
    return CLIENTS.filter((c) => (seg === 'all' || c.segment === seg) && (!s || `${c.name} ${c.email} ${c.city}`.toLowerCase().includes(s))).sort(
      (a, b) => (a[sort.key] - b[sort.key]) * sort.dir,
    )
  }, [seg, q, sort])
  const count = (s: Segment) => CLIENTS.filter((c) => c.segment === s).length
  const avgLtv = CLIENTS.reduce((a, c) => a + c.ltv, 0) / CLIENTS.length
  const repeat = CLIENTS.filter((c) => c.orders > 1).length / CLIENTS.length

  const Th = ({ k, children, className }: { k: SortKey; children: ReactNode; className?: string }) => (
    <th className={cn('px-2 py-2 font-medium', className)} aria-sort={sort.key === k ? (sort.dir === 1 ? 'ascending' : 'descending') : 'none'}>
      <button
        onClick={() => setSort((s) => ({ key: k, dir: s.key === k ? ((s.dir * -1) as 1 | -1) : -1 }))}
        className="inline-flex items-center gap-1 rounded hover:text-(--text)"
      >
        {children}
        {sort.key === k && (sort.dir === -1 ? <ArrowDown className="size-3" /> : <ArrowUp className="size-3" />)}
      </button>
    </th>
  )

  return (
    <div className="space-y-4 md:space-y-5">
      <PageHead title="Клиенты" sub="Единая база покупателей со всех каналов, дубли склеены по телефону и почте" />
      <div className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">
        <Stat label="Всего клиентов" value={num(12_486)} note={<Delta value={0.084} />} />
        <Stat label="Повторные покупки" value={pct(repeat, 0)} note="купили больше одного раза" />
        <Stat label="Средний LTV" value={rub(avgLtv)} note={<Delta value={0.052} />} />
        <Stat label="Под угрозой ухода" value={num(count('risk') * 41)} note="не покупали больше 75 дней" />
      </div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Chips
          value={seg}
          onChange={setSeg}
          items={[
            { value: 'all', label: 'Все', count: CLIENTS.length },
            { value: 'vip', label: 'VIP', count: count('vip') },
            { value: 'loyal', label: 'Постоянные', count: count('loyal') },
            { value: 'new', label: 'Новые', count: count('new') },
            { value: 'risk', label: 'Под угрозой', count: count('risk') },
          ]}
        />
        <label className="flex h-8.5 items-center gap-2 rounded-lg border border-(--border) bg-(--panel) px-2.5 focus-within:border-(--accent) md:w-[280px]">
          <Search className="size-4 text-(--text-3)" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Имя, почта или город"
            aria-label="Поиск клиентов"
            className="h-full flex-1 bg-transparent text-[13px] outline-none placeholder:text-(--text-3) focus-visible:outline-none"
          />
        </label>
      </div>

      <Panel className="overflow-hidden">
        <div className="scroll-thin hidden overflow-x-auto md:block">
          <table className="w-full min-w-[760px] text-[13px]">
            <thead>
              <tr className="border-b border-(--border) text-left text-[12px] text-(--text-3)">
                <th className="py-2 pr-2 pl-5 font-medium">Клиент</th>
                <th className="px-2 py-2 font-medium">Город</th>
                <th className="px-2 py-2 font-medium">Первый канал</th>
                <Th k="orders" className="text-right">Заказов</Th>
                <Th k="ltv" className="text-right">LTV</Th>
                <Th k="lastDays">Последний заказ</Th>
                <th className="py-2 pr-5 pl-2 text-right font-medium">Сегмент</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} className="border-b border-(--border) last:border-0 hover:bg-(--hover)">
                  <td className="py-2.5 pr-2 pl-5">
                    <div className="flex items-center gap-3">
                      <Avatar name={c.name} size={30} />
                      <span className="min-w-0">
                        <span className="block font-medium">{c.name}</span>
                        <span className="block text-[12px] text-(--text-3)">{c.email}</span>
                      </span>
                    </div>
                  </td>
                  <td className="px-2 py-2.5 text-(--text-2)">{c.city}</td>
                  <td className="px-2 py-2.5">
                    <span className="flex items-center gap-2 text-(--text-2)">
                      <ChannelDot channel={c.channel} />
                      {CHANNEL_NAME[c.channel]}
                    </span>
                  </td>
                  <td className="num px-2 py-2.5 text-right">{c.orders}</td>
                  <td className="num px-2 py-2.5 text-right font-medium">{rub(c.ltv)}</td>
                  <td className="px-2 py-2.5 text-(--text-2)">{lastLabel(c.lastDays)}</td>
                  <td className="py-2.5 pr-5 pl-2 text-right">
                    <span className={cn('rounded-md px-1.5 py-0.5 text-[11.5px] font-medium', SEG_CLS[c.segment])}>{SEGMENT_LABEL[c.segment]}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="md:hidden">
          {rows.map((c: Client) => (
            <li key={c.id} className="flex items-center gap-3 border-b border-(--border) px-4 py-3 last:border-0">
              <Avatar name={c.name} size={34} />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-[13.5px] font-medium">{c.name}</span>
                  <span className="num shrink-0 text-[13.5px] font-semibold">{rub(c.ltv)}</span>
                </div>
                <div className="mt-1 flex items-center justify-between gap-2 text-[12px] text-(--text-3)">
                  <span className="flex min-w-0 items-center gap-1.5 truncate">
                    <ChannelDot channel={c.channel} />
                    {c.city} · {c.orders} {plural(c.orders, 'заказ', 'заказа', 'заказов')}
                  </span>
                  <span className={cn('shrink-0 rounded-md px-1.5 py-px text-[11px] font-medium', SEG_CLS[c.segment])}>{SEGMENT_LABEL[c.segment]}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {rows.length === 0 && <p className="px-5 py-12 text-center text-[13px] text-(--text-3)">Никого не нашли. Попробуйте изменить фильтр или запрос.</p>}
      </Panel>
    </div>
  )
}

/* ---------- Products ---------- */

export function Products({ s, loading, range }: { s: Summary; loading: boolean; range: RangeKey }) {
  const cats = Array.from(new Set(s.products.map((p) => p.category)))
  const [cat, setCat] = useState('all')
  const rows = s.products.filter((p) => cat === 'all' || p.category === cat)
  const max = Math.max(...s.products.map((p) => p.revenue))
  const r = RANGES.find((x) => x.key === range)!
  const out = s.products.filter((p) => p.stock === 0).length
  const low = s.products.filter((p) => p.stock > 0 && p.stock < 40).length
  return (
    <div className="space-y-4 md:space-y-5">
      <PageHead title="Товары" sub={`Продажи и остатки по всем каналам за ${r.key === '90d' ? 'квартал' : r.label}`} />
      <div className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">
        <Stat label="Активных SKU" value="148" note="10 в топе продаж" />
        <Stat label="Продано за период" value={loading ? <Skeleton className="h-6 w-24" /> : `${num(s.products.reduce((a, p) => a + p.units, 0))} шт.`} />
        <Stat label="Нет в наличии" value={out} note={<span className="text-(--bad)">теряем продажи на WB и сайте</span>} />
        <Stat label="Заканчиваются" value={low} note="остаток меньше 40 шт." />
      </div>
      <Chips value={cat} onChange={setCat} items={[{ value: 'all', label: 'Все категории' }, ...cats.map((c) => ({ value: c, label: c }))]} />
      <Panel className="overflow-hidden">
        <div className="scroll-thin overflow-x-auto">
          <table className="w-full min-w-[780px] text-[13px]">
            <thead>
              <tr className="border-b border-(--border) text-left text-[12px] text-(--text-3)">
                <th className="py-2 pr-2 pl-5 font-medium">Товар</th>
                <th className="px-2 py-2 font-medium">Категория</th>
                <th className="px-2 py-2 font-medium">Каналы</th>
                <th className="px-2 py-2 text-right font-medium">Цена</th>
                <th className="px-2 py-2 text-right font-medium">Продано</th>
                <th className="w-[24%] px-2 py-2 font-medium">Выручка</th>
                <th className="px-2 py-2 text-right font-medium">Динамика</th>
                <th className="py-2 pr-5 pl-2 font-medium">Остаток</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="border-b border-(--border) last:border-0 hover:bg-(--hover)">
                  <td className="py-2.5 pr-2 pl-5">
                    <span className="block max-w-[260px] truncate font-medium">{p.name}</span>
                    <span className="mono text-(--text-3)">{p.sku}</span>
                  </td>
                  <td className="px-2 py-2.5 text-(--text-2)">{p.category}</td>
                  <td className="px-2 py-2.5">
                    <span className="flex gap-1">
                      {p.channels.map((c) => (
                        <span key={c} title={CHANNEL_NAME[c]}>
                          <ChannelDot channel={c} />
                        </span>
                      ))}
                    </span>
                  </td>
                  <td className="num px-2 py-2.5 text-right text-(--text-2)">{rub(p.price)}</td>
                  <td className="num px-2 py-2.5 text-right">{loading ? <Skeleton className="ml-auto h-4 w-10" /> : num(p.units)}</td>
                  <td className="px-2 py-2.5">
                    {loading ? (
                      <Skeleton className="h-4 w-full" />
                    ) : (
                      <div className="flex items-center gap-2.5">
                        <span className="num w-[92px] shrink-0 font-medium">{rub(p.revenue)}</span>
                        <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-(--hover)">
                          <motion.span className="block h-full rounded-full bg-(--accent)" initial={{ width: 0 }} animate={{ width: `${(p.revenue / max) * 100}%` }} transition={{ duration: 0.6 }} />
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-2 py-2.5 text-right">{loading ? <Skeleton className="ml-auto h-4 w-14" /> : <Delta value={p.delta} />}</td>
                  <td className="py-2.5 pr-5 pl-2">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-14 overflow-hidden rounded-full bg-(--hover)">
                        <span
                          className={cn('block h-full rounded-full', p.stock === 0 ? 'bg-(--bad)' : p.stock < 40 ? 'bg-(--warn)' : 'bg-(--good)')}
                          style={{ width: `${Math.min(100, (p.stock / 400) * 100)}%` }}
                        />
                      </span>
                      <span className={cn('num text-[12.5px]', p.stock === 0 ? 'text-(--bad)' : p.stock < 40 ? 'text-(--warn)' : 'text-(--text-2)')}>
                        {p.stock === 0 ? 'нет' : `${num(p.stock)} шт.`}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}

/* ---------- Settings ---------- */

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-[12.5px] font-medium text-(--text-2)">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  )
}
const inputCls =
  'h-9 w-full rounded-lg border border-(--border) bg-(--panel-2) px-3 text-[13.5px] outline-none transition-colors focus:border-(--accent) focus:ring-3 focus:ring-(--accent-soft) focus-visible:outline-none'

export function SettingsPage() {
  const toast = useToast()
  const [n, setN] = useState({ big: true, errors: true, daily: false, stock: true })
  const toggles: { key: keyof typeof n; title: string; sub: string }[] = [
    { key: 'big', title: 'Крупные заказы в Telegram', sub: 'Заказы от 30 000 ₽ сразу в чат команды' },
    { key: 'errors', title: 'Сбои интеграций', sub: 'Если маркетплейс или CRM перестали отвечать' },
    { key: 'stock', title: 'Остатки заканчиваются', sub: 'Когда товара меньше 40 шт. на складе' },
    { key: 'daily', title: 'Ежедневная сводка на почту', sub: 'Выручка, заказы и воронка в 9:00' },
  ]
  return (
    <div className="max-w-[880px] space-y-4 md:space-y-5">
      <PageHead title="Настройки" sub="Профиль, уведомления и параметры магазина" />
      <Panel className="p-5">
        <h2 className="text-[14.5px] font-semibold">Профиль</h2>
        <div className="mt-4 flex items-center gap-4">
          <Avatar name="Марина Лебедева" size={52} />
          <div>
            <p className="font-medium">Марина Лебедева</p>
            <p className="text-[12.5px] text-(--text-3)">Руководитель продаж · администратор</p>
          </div>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label="Имя и фамилия">
            <input className={inputCls} defaultValue="Марина Лебедева" />
          </Field>
          <Field label="Рабочая почта">
            <input className={inputCls} defaultValue="marina@teplydom.ru" type="email" />
          </Field>
          <Field label="Часовой пояс">
            <select className={inputCls} defaultValue="msk">
              <option value="msk">Москва, UTC+3</option>
              <option value="ekb">Екатеринбург, UTC+5</option>
              <option value="nsk">Новосибирск, UTC+7</option>
            </select>
          </Field>
          <Field label="Цель по выручке в месяц">
            <input className={cn(inputCls, 'num')} defaultValue="25 000 000 ₽" />
          </Field>
        </div>
      </Panel>
      <Panel className="p-5">
        <h2 className="text-[14.5px] font-semibold">Уведомления</h2>
        <ul className="mt-2 divide-y divide-(--border)">
          {toggles.map((t) => (
            <li key={t.key} className="flex items-center justify-between gap-4 py-3.5">
              <div>
                <p className="text-[13.5px] font-medium">{t.title}</p>
                <p className="mt-0.5 text-[12.5px] text-(--text-3)">{t.sub}</p>
              </div>
              <Switch checked={n[t.key]} onChange={(v) => setN((x) => ({ ...x, [t.key]: v }))} label={t.title} />
            </li>
          ))}
        </ul>
      </Panel>
      <div className="flex justify-end gap-2 pb-2">
        <Button variant="ghost">Отмена</Button>
        <Button variant="primary" onClick={() => toast({ tone: 'good', title: 'Настройки сохранены' })}>
          Сохранить изменения
        </Button>
      </div>
    </div>
  )
}
