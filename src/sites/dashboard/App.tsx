import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import '@fontsource-variable/inter-tight'
import '@fontsource-variable/jetbrains-mono'
import './dashboard.css'
import { DEALS, INTEGRATIONS, getSummary, initialOrders, makeOrder, type Deal, type Order, type RangeKey } from './data'
import { rub } from './format'
import { Clients, Products, SettingsPage } from './pages'
import { Deals } from './deals'
import { Integrations, type IntState } from './integrations'
import { Overview } from './overview'
import { CommandPalette, MobileNav, NAV, Sidebar, Topbar, type View } from './shell'
import { PALETTES, ThemeCtx, ToastProvider, useToast, type Theme } from './ui'

const store = {
  get(k: string) {
    try {
      return window.localStorage.getItem(k)
    } catch {
      return null
    }
  },
  set(k: string, v: string) {
    try {
      window.localStorage.setItem(k, v)
    } catch {
      /* private mode */
    }
  },
}

// deep links: #deals or ?view=deals (and ?theme=light)
const params = new URLSearchParams(window.location.search)
const viewFromHash = (): View => {
  const h = (window.location.hash.replace('#', '') || params.get('view') || '') as View
  return NAV.some((n) => n.id === h) ? h : 'overview'
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(() => ((params.get('theme') ?? store.get('pulse-theme')) === 'light' ? 'light' : 'dark'))
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.style.background = theme === 'dark' ? '#0a0b0d' : '#f6f6f4'
    root.style.colorScheme = theme
    store.set('pulse-theme', theme)
  }, [theme])
  const themeValue = useMemo(
    () => ({ theme, pal: PALETTES[theme], toggle: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')) }),
    [theme],
  )
  return (
    <ThemeCtx.Provider value={themeValue}>
      <div className="dash min-h-dvh" data-theme={theme}>
        <ToastProvider>
          <Dashboard />
        </ToastProvider>
      </div>
    </ThemeCtx.Provider>
  )
}

function Dashboard() {
  const toast = useToast()
  const [view, setViewState] = useState<View>(viewFromHash)
  const [range, setRangeState] = useState<RangeKey>('30d')
  const [loading, setLoading] = useState(true)
  const [collapsed, setCollapsed] = useState(() => store.get('pulse-sidebar') === '1')
  const [cmdOpen, setCmdOpen] = useState(false)
  const [orders, setOrders] = useState<Order[]>(() => initialOrders(Date.now()))
  const [paused, setPaused] = useState(false)
  const [today, setToday] = useState({ count: 312, sum: 1_045_200 })
  const [deals, setDeals] = useState<Deal[]>(DEALS)
  const [ints, setInts] = useState<IntState[]>(() =>
    INTEGRATIONS.map((i) => ({ ...i, syncing: false, enabled: i.status !== 'off', lastSync: i.lastSyncMin === null ? null : Date.now() - i.lastSyncMin * 60_000 })),
  )
  const loadTimer = useRef(0)
  const mainRef = useRef<HTMLDivElement>(null)

  const s = getSummary(range)

  // first paint: brief skeleton, like a real API round trip
  useEffect(() => {
    loadTimer.current = window.setTimeout(() => setLoading(false), 900)
    return () => window.clearTimeout(loadTimer.current)
  }, [])

  const setRange = useCallback((r: RangeKey) => {
    setRangeState(r)
    setLoading(true)
    window.clearTimeout(loadTimer.current)
    loadTimer.current = window.setTimeout(() => setLoading(false), 650)
  }, [])

  const setView = useCallback((v: View) => {
    setViewState(v)
    if (window.location.hash !== `#${v}`) window.history.replaceState(null, '', `#${v}`)
    window.scrollTo({ top: 0 })
  }, [])

  useEffect(() => {
    const onHash = () => setViewState(viewFromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => store.set('pulse-sidebar', collapsed ? '1' : '0'), [collapsed])

  // ⌘K / Ctrl+K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setCmdOpen((o) => !o)
      } else if (e.key === '/' && !cmdOpen) {
        const t = e.target as HTMLElement
        if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable) return
        e.preventDefault()
        setCmdOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [cmdOpen])

  // live order stream
  const seq = useRef(101)
  useEffect(() => {
    if (paused) return
    let t = 0
    const tick = () => {
      t = window.setTimeout(
        () => {
          const o = makeOrder(seq.current++, Date.now())
          setOrders((xs) => [o, ...xs].slice(0, 30))
          setToday((x) => ({ count: x.count + 1, sum: x.sum + o.amount }))
          tick()
        },
        3200 + Math.random() * 2400,
      )
    }
    tick()
    return () => window.clearTimeout(t)
  }, [paused])

  const errorCount = ints.filter((i) => i.status === 'error').length

  const actions = useMemo(
    () => [
      { label: 'Переключить тему', sub: 'Светлая или тёмная', run: () => document.querySelector<HTMLButtonElement>('[aria-label="Светлая тема"],[aria-label="Тёмная тема"]')?.click() },
      { label: 'Период: 7 дней', sub: 'Пересчитать все показатели', run: () => { setRange('7d'); setView('overview') } },
      { label: 'Период: 30 дней', sub: 'Пересчитать все показатели', run: () => { setRange('30d'); setView('overview') } },
      { label: 'Период: квартал', sub: 'Пересчитать все показатели', run: () => { setRange('90d'); setView('overview') } },
      {
        label: 'Выгрузить отчёт',
        sub: 'XLSX по продажам за выбранный период',
        run: () => toast({ tone: 'good', title: 'Отчёт выгружен', body: `Выручка ${rub(s.revenue)}` }),
      },
    ],
    [setRange, setView, toast, s.revenue],
  )

  return (
    <div className="flex min-h-dvh">
      <Sidebar view={view} setView={setView} collapsed={collapsed} setCollapsed={setCollapsed} errorCount={errorCount} dealCount={deals.filter((d) => d.stage !== 'paid').length} />
      <div ref={mainRef} className="flex min-w-0 flex-1 flex-col">
        <Topbar view={view} range={range} setRange={setRange} onSearch={() => setCmdOpen(true)} onOpenView={setView} />
        <main className="mx-auto w-full max-w-[1480px] flex-1 px-4 pt-4 pb-28 md:px-6 md:pt-6 md:pb-10">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              {view === 'overview' && (
                <Overview s={s} loading={loading} range={range} orders={orders} paused={paused} setPaused={setPaused} today={today} go={setView} />
              )}
              {view === 'deals' && <Deals deals={deals} setDeals={setDeals} />}
              {view === 'clients' && <Clients />}
              {view === 'products' && <Products s={s} loading={loading} range={range} />}
              {view === 'integrations' && <Integrations items={ints} setItems={setInts} />}
              {view === 'settings' && <SettingsPage />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <MobileNav view={view} setView={setView} />
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} orders={orders} go={setView} actions={actions} />
    </div>
  )
}
