import { useCallback, useEffect, useMemo, useRef, useState, type ComponentType, type KeyboardEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  Activity,
  ArrowRight,
  Bell,
  Boxes,
  Check,
  ChevronsUpDown,
  CircleAlert,
  CornerDownLeft,
  Handshake,
  LayoutDashboard,
  Moon,
  PackageOpen,
  PanelLeftClose,
  PanelLeftOpen,
  Plug,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShoppingBag,
  Sun,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { CHANNEL_NAME, CLIENTS, DEALS, NOTES, PRODUCTS, RANGES, type Note, type Order, type RangeKey } from './data'
import { num, rub } from './format'
import { Avatar, ChannelDot, IconButton, Kbd, Segmented, useDismiss, useTheme } from './ui'

export type View = 'overview' | 'deals' | 'clients' | 'products' | 'integrations' | 'settings'

export const NAV: { id: View; label: string; icon: ComponentType<{ className?: string; strokeWidth?: number }>; group: 0 | 1 }[] = [
  { id: 'overview', label: 'Обзор', icon: LayoutDashboard, group: 0 },
  { id: 'deals', label: 'Сделки', icon: Handshake, group: 0 },
  { id: 'clients', label: 'Клиенты', icon: Users, group: 0 },
  { id: 'products', label: 'Товары', icon: Boxes, group: 0 },
  { id: 'integrations', label: 'Интеграции', icon: Plug, group: 1 },
  { id: 'settings', label: 'Настройки', icon: Settings, group: 1 },
]

const WORKSPACES = [
  { id: 'main', name: 'Тёплый дом', sub: 'Интернет-магазин' },
  { id: 'opt', name: 'Тёплый дом · Опт', sub: 'B2B-продажи · 2 канала' },
  { id: 'room', name: 'Шоурум на Покровке', sub: 'Офлайн-точка · касса' },
]

export function Logo({ size = 32 }: { size?: number }) {
  return (
    <span
      style={{ width: size, height: size }}
      className="grid shrink-0 place-items-center rounded-[9px] bg-[linear-gradient(145deg,#5a9bf5,#2c64c9)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_4px_14px_-4px_rgba(58,120,220,0.6)]"
    >
      <Activity className="size-[55%]" strokeWidth={2.4} />
    </span>
  )
}

/* ---------- Sidebar ---------- */

export function Sidebar({
  view,
  setView,
  collapsed,
  setCollapsed,
  errorCount,
  dealCount,
}: {
  view: View
  setView: (v: View) => void
  collapsed: boolean
  setCollapsed: (v: boolean) => void
  errorCount: number
  dealCount: number
}) {
  const [wsOpen, setWsOpen] = useState(false)
  const [ws, setWs] = useState('main')
  const wsRef = useRef<HTMLDivElement>(null)
  useDismiss(wsOpen, () => setWsOpen(false), [wsRef])
  const current = WORKSPACES.find((w) => w.id === ws)!

  return (
    <motion.aside
      animate={{ width: collapsed ? 68 : 252 }}
      transition={{ type: 'spring', stiffness: 380, damping: 40 }}
      className="sticky top-0 z-30 hidden h-dvh shrink-0 flex-col border-r border-(--border) bg-(--bg) md:flex"
    >
      <div ref={wsRef} className="relative px-3 pt-3.5">
        <button
          onClick={() => setWsOpen((o) => !o)}
          aria-expanded={wsOpen}
          aria-label="Сменить магазин"
          className={cn('flex w-full items-center gap-2.5 rounded-xl p-1.5 text-left transition-colors hover:bg-(--hover)', collapsed && 'justify-center')}
        >
          <Logo />
          {!collapsed && (
            <>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13.5px] font-semibold">{current.name}</span>
                <span className="block truncate text-[11.5px] text-(--text-3)">{current.sub}</span>
              </span>
              <ChevronsUpDown className="size-4 text-(--text-3)" />
            </>
          )}
        </button>
        <AnimatePresence>
          {wsOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98, transition: { duration: 0.12 } }}
              transition={{ duration: 0.16 }}
              className="absolute top-[calc(100%+6px)] left-3 z-50 w-[252px] rounded-xl bg-(--panel) p-1.5 shadow-(--shadow-pop)"
            >
              <p className="px-2 pt-1 pb-1.5 text-[11.5px] text-(--text-3)">Магазины</p>
              {WORKSPACES.map((w) => (
                <button
                  key={w.id}
                  onClick={() => {
                    setWs(w.id)
                    setWsOpen(false)
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left hover:bg-(--hover)"
                >
                  <span className="grid size-7 place-items-center rounded-lg border border-(--border) bg-(--panel-2) text-[11px] font-semibold text-(--text-2)">
                    {w.name.slice(0, 1)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium">{w.name}</span>
                    <span className="block truncate text-[11.5px] text-(--text-3)">{w.sub}</span>
                  </span>
                  {w.id === ws && <Check className="size-4 text-(--accent)" />}
                </button>
              ))}
              <div className="my-1 h-px bg-(--border)" />
              <button className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-[13px] text-(--text-2) hover:bg-(--hover) hover:text-(--text)">
                <span className="grid size-7 place-items-center rounded-lg border border-dashed border-(--border-strong)">
                  <Plus className="size-3.5" />
                </span>
                Добавить магазин
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <nav aria-label="Основная навигация" className="scroll-thin mt-4 flex-1 overflow-y-auto overflow-x-hidden px-3">
        {[0, 1].map((g) => (
          <div key={g} className={g ? 'mt-5' : ''}>
            {!collapsed && <p className="mb-1 px-2.5 text-[11.5px] font-medium text-(--text-3)">{g ? 'Система' : 'Продажи'}</p>}
            {collapsed && g === 1 && <div className="mx-2 mb-2 h-px bg-(--border)" />}
            <ul className="space-y-0.5">
              {NAV.filter((n) => n.group === g).map((n) => {
                const on = view === n.id
                const Icon = n.icon
                const badge = n.id === 'deals' ? dealCount : n.id === 'integrations' && errorCount ? errorCount : null
                return (
                  <li key={n.id} className="group/nav relative">
                    <button
                      onClick={() => setView(n.id)}
                      aria-current={on ? 'page' : undefined}
                      className={cn(
                        'relative flex h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-[13.5px] transition-colors',
                        on ? 'text-(--text)' : 'text-(--text-2) hover:bg-(--hover) hover:text-(--text)',
                        collapsed && 'justify-center px-0',
                      )}
                    >
                      {on && (
                        <motion.span
                          layoutId="nav-active"
                          transition={{ type: 'spring', stiffness: 480, damping: 38 }}
                          className="absolute inset-0 rounded-lg bg-(--active) shadow-[inset_0_0_0_1px_var(--border)]"
                        />
                      )}
                      <Icon className={cn('relative size-[17px] shrink-0', on && 'text-(--accent)')} strokeWidth={1.9} />
                      {!collapsed && <span className="relative flex-1 truncate text-left font-medium">{n.label}</span>}
                      {!collapsed && badge !== null && (
                        <span
                          className={cn(
                            'num relative rounded-md px-1.5 text-[11.5px] font-medium',
                            n.id === 'integrations' ? 'bg-(--bad-soft) text-(--bad)' : 'bg-(--hover) text-(--text-3)',
                          )}
                        >
                          {badge}
                        </span>
                      )}
                      {collapsed && n.id === 'integrations' && errorCount > 0 && (
                        <span className="absolute top-1.5 right-3 size-1.5 rounded-full bg-(--bad)" />
                      )}
                    </button>
                    {collapsed && (
                      <span className="pointer-events-none absolute top-1/2 left-[calc(100%+10px)] z-50 -translate-y-1/2 rounded-md bg-(--panel) px-2 py-1 text-[12px] font-medium whitespace-nowrap opacity-0 shadow-(--shadow-pop) transition-opacity group-hover/nav:opacity-100">
                        {n.label}
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        ))}

        {!collapsed && (
          <div className="mt-6 rounded-xl border border-(--border) bg-(--panel) p-3">
            <div className="flex items-center gap-2 text-[12.5px] font-medium">
              <span className="live-dot size-2 rounded-full bg-(--good)" />
              Данные в реальном времени
            </div>
            <p className="mt-1.5 text-[12px] leading-relaxed text-(--text-3)">
              4 канала продаж, 6 интеграций. Заказы поступают по вебхукам без задержки.
            </p>
          </div>
        )}
      </nav>

      <div className="border-t border-(--border) p-3">
        <div className={cn('flex items-center gap-2.5 rounded-xl p-1.5', collapsed && 'flex-col')}>
          <Avatar name="Марина Лебедева" size={30} />
          {!collapsed && (
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-medium">Марина Лебедева</span>
              <span className="block truncate text-[11.5px] text-(--text-3)">Руководитель продаж</span>
            </span>
          )}
          <IconButton
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Развернуть меню' : 'Свернуть меню'}
            className="size-7.5"
          >
            {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
          </IconButton>
        </div>
      </div>
    </motion.aside>
  )
}

/* ---------- Mobile bottom nav ---------- */

export function MobileNav({ view, setView }: { view: View; setView: (v: View) => void }) {
  return (
    <nav
      aria-label="Навигация"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-(--border) bg-[color-mix(in_srgb,var(--bg)_88%,transparent)] pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
    >
      <ul className="grid grid-cols-5">
        {NAV.filter((n) => n.id !== 'settings').map((n) => {
          const on = n.id === view
          const Icon = n.icon
          return (
            <li key={n.id}>
              <button
                onClick={() => setView(n.id)}
                aria-current={on ? 'page' : undefined}
                className={cn('flex h-15 w-full flex-col items-center justify-center gap-1 text-[10.5px] font-medium', on ? 'text-(--accent)' : 'text-(--text-3)')}
              >
                <Icon className="size-5" strokeWidth={on ? 2.1 : 1.8} />
                {n.label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

/* ---------- Notifications ---------- */

function NoteIcon({ kind }: { kind: Note['kind'] }) {
  const map = {
    order: { Icon: ShoppingBag, cls: 'bg-(--accent-soft) text-(--accent)' },
    error: { Icon: CircleAlert, cls: 'bg-(--bad-soft) text-(--bad)' },
    stock: { Icon: PackageOpen, cls: 'bg-(--warn-soft) text-(--warn)' },
    deal: { Icon: Handshake, cls: 'bg-(--good-soft) text-(--good)' },
  }[kind]
  return (
    <span className={cn('grid size-8 shrink-0 place-items-center rounded-lg', map.cls)}>
      <map.Icon className="size-4" />
    </span>
  )
}

function Notifications({ onOpenView }: { onOpenView: (v: View) => void }) {
  const [open, setOpen] = useState(false)
  const [notes, setNotes] = useState(NOTES)
  const ref = useRef<HTMLDivElement>(null)
  useDismiss(open, () => setOpen(false), [ref])
  const unread = notes.filter((n) => n.unread).length
  return (
    <div ref={ref} className="relative">
      <IconButton aria-label={`Уведомления, непрочитанных: ${unread}`} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <Bell className="size-[17px]" strokeWidth={1.9} />
        {unread > 0 && (
          <span className="num absolute top-1 right-1 grid h-3.5 min-w-3.5 place-items-center rounded-full bg-(--accent) px-0.5 text-[9.5px] font-semibold text-white ring-2 ring-(--bg)">
            {unread}
          </span>
        )}
      </IconButton>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.12 } }}
            transition={{ duration: 0.16 }}
            className="fixed inset-x-3 top-15 z-50 origin-top-right rounded-2xl bg-(--panel) shadow-(--shadow-pop) sm:absolute sm:inset-x-auto sm:top-[calc(100%+8px)] sm:right-0 sm:w-[380px]"
          >
            <div className="flex items-center justify-between px-4 pt-3.5 pb-2.5">
              <p className="text-[14px] font-semibold">Уведомления</p>
              <button
                disabled={!unread}
                onClick={() => setNotes((ns) => ns.map((n) => ({ ...n, unread: false })))}
                className="text-[12.5px] font-medium text-(--accent) hover:underline disabled:text-(--text-3) disabled:no-underline"
              >
                Отметить все прочитанными
              </button>
            </div>
            <ul className="scroll-thin max-h-[380px] overflow-y-auto border-t border-(--border) p-1.5">
              {notes.map((n) => (
                <li key={n.id}>
                  <button
                    onClick={() => {
                      setNotes((ns) => ns.map((x) => (x.id === n.id ? { ...x, unread: false } : x)))
                      if (n.kind === 'error') onOpenView('integrations')
                      if (n.kind === 'deal') onOpenView('deals')
                      if (n.kind === 'stock') onOpenView('products')
                      setOpen(false)
                    }}
                    className="flex w-full items-start gap-3 rounded-xl p-2.5 text-left hover:bg-(--hover)"
                  >
                    <NoteIcon kind={n.kind} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className={cn('truncate text-[13px]', n.unread ? 'font-semibold' : 'font-medium text-(--text-2)')}>{n.title}</span>
                      </span>
                      <span className="mt-0.5 block truncate text-[12px] text-(--text-3)">{n.body}</span>
                    </span>
                    <span className="flex shrink-0 flex-col items-end gap-1.5">
                      <span className="text-[11.5px] text-(--text-3)">{n.ago}</span>
                      {n.unread && <span className="size-1.5 rounded-full bg-(--accent)" />}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ---------- Top bar ---------- */

export function Topbar({
  view,
  range,
  setRange,
  onSearch,
  onOpenView,
}: {
  view: View
  range: RangeKey
  setRange: (r: RangeKey) => void
  onSearch: () => void
  onOpenView: (v: View) => void
}) {
  const { theme, toggle } = useTheme()
  const title = NAV.find((n) => n.id === view)!.label
  const showRange = view === 'overview' || view === 'products'
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)
  return (
    <header className="sticky top-0 z-30 border-b border-(--border) bg-[color-mix(in_srgb,var(--bg)_86%,transparent)] backdrop-blur-xl">
      <div className="flex h-14 items-center gap-3 px-4 md:h-15 md:px-6">
        <div className="flex min-w-0 items-center gap-2.5 md:hidden">
          <Logo size={28} />
          <span className="truncate text-[15px] font-semibold">{title}</span>
        </div>
        <div className="hidden min-w-0 items-center gap-2 text-[13.5px] md:flex">
          <span className="text-(--text-3)">Тёплый дом</span>
          <span className="text-(--text-3)">/</span>
          <span className="font-medium">{title}</span>
        </div>

        <div className="ml-auto flex items-center gap-1.5 md:gap-2">
          <button
            onClick={onSearch}
            className="hidden h-8.5 w-[280px] items-center gap-2 rounded-lg border border-(--border) bg-(--panel) px-2.5 text-[13px] text-(--text-3) transition-colors hover:border-(--border-strong) lg:flex"
          >
            <Search className="size-4" />
            <span className="flex-1 truncate text-left">Заказы, клиенты, товары…</span>
            <Kbd>{isMac ? '⌘' : 'Ctrl'}</Kbd>
            <Kbd>K</Kbd>
          </button>
          <IconButton onClick={onSearch} aria-label="Поиск" className="lg:hidden">
            <Search className="size-[17px]" strokeWidth={1.9} />
          </IconButton>
          {showRange && (
            <Segmented
              className="hidden md:inline-flex"
              label="Период"
              value={range}
              onChange={setRange}
              options={RANGES.map((r) => ({ value: r.key, label: r.label }))}
            />
          )}
          <Notifications onOpenView={onOpenView} />
          <IconButton onClick={toggle} aria-label={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ rotate: -60, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 60, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="grid place-items-center"
              >
                {theme === 'dark' ? <Sun className="size-[17px]" strokeWidth={1.9} /> : <Moon className="size-[17px]" strokeWidth={1.9} />}
              </motion.span>
            </AnimatePresence>
          </IconButton>
          <button onClick={() => onOpenView('settings')} aria-label="Настройки профиля" className="rounded-full md:hidden">
            <Avatar name="Марина Лебедева" size={28} />
          </button>
        </div>
      </div>
      {showRange && (
        <div className="px-4 pb-2.5 md:hidden">
          <Segmented
            className="flex w-full [&>button]:flex-1"
            label="Период (мобильный)"
            value={range}
            onChange={setRange}
            options={RANGES.map((r) => ({ value: r.key, label: r.label }))}
          />
        </div>
      )}
    </header>
  )
}

/* ---------- Command palette ---------- */

interface Cmd {
  id: string
  group: string
  label: string
  sub?: string
  icon: 'view' | 'order' | 'client' | 'product' | 'deal' | 'action'
  view?: View
  run: () => void
  channel?: Order['channel']
}

export function CommandPalette({
  open,
  onClose,
  orders,
  go,
  actions,
}: {
  open: boolean
  onClose: () => void
  orders: Order[]
  go: (v: View) => void
  actions: { label: string; sub: string; run: () => void }[]
}) {
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      setQ('')
      setActive(0)
      window.setTimeout(() => inputRef.current?.focus(), 20)
    }
  }, [open])

  const results = useMemo(() => {
    const s = q.trim().toLowerCase()
    const match = (...xs: (string | undefined)[]) => !s || xs.some((x) => x?.toLowerCase().includes(s))
    const out: Cmd[] = []
    NAV.filter((n) => match(n.label)).forEach((n) =>
      out.push({ id: `v-${n.id}`, group: 'Разделы', label: n.label, icon: 'view', run: () => go(n.id) }),
    )
    if (s) {
      orders
        .filter((o) => match(o.id, o.customer, o.product, o.city))
        .slice(0, 4)
        .forEach((o) =>
          out.push({ id: `o-${o.id}`, group: 'Заказы', label: `${o.id} · ${o.customer}`, sub: `${rub(o.amount)} · ${CHANNEL_NAME[o.channel]}`, icon: 'order', channel: o.channel, run: () => go('overview') }),
        )
      CLIENTS.filter((c) => match(c.name, c.email, c.city))
        .slice(0, 4)
        .forEach((c) =>
          out.push({ id: `c-${c.id}`, group: 'Клиенты', label: c.name, sub: `${c.city} · ${num(c.orders)} заказов · ${rub(c.ltv)}`, icon: 'client', run: () => go('clients') }),
        )
      PRODUCTS.filter((p) => match(p.name, p.sku, p.category))
        .slice(0, 4)
        .forEach((p) => out.push({ id: `p-${p.id}`, group: 'Товары', label: p.name, sub: `${p.sku} · ${rub(p.price)}`, icon: 'product', run: () => go('products') }))
      DEALS.filter((d) => match(d.title, d.company, d.id))
        .slice(0, 3)
        .forEach((d) => out.push({ id: `d-${d.id}`, group: 'Сделки', label: d.title, sub: `${d.company} · ${rub(d.amount)}`, icon: 'deal', run: () => go('deals') }))
    }
    actions
      .filter((a) => match(a.label, a.sub))
      .forEach((a, i) => out.push({ id: `a-${i}`, group: 'Действия', label: a.label, sub: a.sub, icon: 'action', run: a.run }))
    return out
  }, [q, orders, go, actions])

  useEffect(() => setActive(0), [q])
  useEffect(() => {
    listRef.current?.querySelector(`[data-idx="${active}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const choose = useCallback(
    (c: Cmd | undefined) => {
      if (!c) return
      c.run()
      onClose()
    },
    [onClose],
  )

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(results.length - 1, a + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(0, a - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      choose(results[active])
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  const icons = { view: ArrowRight, order: ShoppingBag, client: Users, product: Boxes, deal: Handshake, action: RefreshCw }
  let lastGroup = ''

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-start justify-center bg-black/45 px-3 pt-[12vh] backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.14 }}
          onPointerDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Поиск по CRM"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 520, damping: 38 }}
            className="w-full max-w-[600px] overflow-hidden rounded-2xl bg-(--panel) shadow-(--shadow-pop)"
            onKeyDown={onKey}
          >
            <div className="flex items-center gap-3 border-b border-(--border) px-4">
              <Search className="size-[18px] text-(--text-3)" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Найти заказ, клиента, товар или действие"
                aria-label="Поисковый запрос"
                role="combobox"
                aria-expanded="true"
                aria-controls="cmd-list"
                aria-activedescendant={results[active] ? `cmd-${results[active].id}` : undefined}
                className="h-13 flex-1 bg-transparent text-[15px] outline-none placeholder:text-(--text-3) focus-visible:outline-none"
              />
              <Kbd>Esc</Kbd>
            </div>
            <div ref={listRef} id="cmd-list" role="listbox" className="scroll-thin max-h-[min(420px,60vh)] overflow-y-auto p-2">
              {results.length === 0 && (
                <div className="px-3 py-10 text-center">
                  <p className="text-[13.5px] font-medium">Ничего не найдено</p>
                  <p className="mt-1 text-[12.5px] text-(--text-3)">Попробуйте номер заказа, например «WB-48305», или имя клиента</p>
                </div>
              )}
              {results.map((r, i) => {
                const head = r.group !== lastGroup
                lastGroup = r.group
                const Icon = icons[r.icon]
                return (
                  <div key={r.id}>
                    {head && <p className="px-2.5 pt-2.5 pb-1 text-[11.5px] font-medium text-(--text-3)">{r.group}</p>}
                    <button
                      id={`cmd-${r.id}`}
                      data-idx={i}
                      role="option"
                      aria-selected={i === active}
                      onMouseMove={() => setActive(i)}
                      onClick={() => choose(r)}
                      className={cn('flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left', i === active && 'bg-(--active)')}
                    >
                      <span className="grid size-7 shrink-0 place-items-center rounded-md border border-(--border) bg-(--panel-2) text-(--text-2)">
                        {r.channel ? <ChannelDot channel={r.channel} /> : <Icon className="size-3.5" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13.5px] font-medium">{r.label}</span>
                        {r.sub && <span className="num block truncate text-[12px] text-(--text-3)">{r.sub}</span>}
                      </span>
                      {i === active && <CornerDownLeft className="size-3.5 text-(--text-3)" />}
                    </button>
                  </div>
                )
              })}
            </div>
            <div className="hidden items-center gap-4 border-t border-(--border) px-4 py-2.5 text-[11.5px] text-(--text-3) sm:flex">
              <span className="flex items-center gap-1.5"><Kbd>↑</Kbd><Kbd>↓</Kbd> выбор</span>
              <span className="flex items-center gap-1.5"><Kbd>↵</Kbd> открыть</span>
              <span className="ml-auto">Поиск по {num(orders.length + CLIENTS.length + PRODUCTS.length + DEALS.length)} записям</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
