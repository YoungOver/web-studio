import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, CircleAlert, CircleCheck, CircleDashed, KeyRound, Loader2, RefreshCw, Webhook } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Integration, IntStatus } from './data'
import { ago } from './format'
import { Button, Panel, PanelHeader, Switch, useToast } from './ui'

export interface IntState extends Integration {
  syncing: boolean
  lastSync: number | null
  enabled: boolean
}

interface LogRow {
  id: number
  at: number
  name: string
  text: string
  ok: boolean
}

const STATUS: Record<IntStatus, { label: string; cls: string; Icon: typeof CircleCheck }> = {
  ok: { label: 'Подключено', cls: 'bg-(--good-soft) text-(--good)', Icon: CircleCheck },
  error: { label: 'Ошибка', cls: 'bg-(--bad-soft) text-(--bad)', Icon: CircleAlert },
  off: { label: 'Не подключено', cls: 'bg-(--hover) text-(--text-3)', Icon: CircleDashed },
}

const SYNC_TEXT: Record<string, string> = {
  amo: 'Обновлено 38 сделок и 112 контактов',
  b24: 'Передано 12 новых лидов',
  ozon: 'Загружено 214 заказов, остатки по 148 SKU',
  wb: 'Токен обновлён, загружено 186 заказов',
  tg: 'Тестовое сообщение доставлено в чат «Продажи»',
  '1c': 'Выгружено 1 248 документов, склады сопоставлены',
}

export function Integrations({ items, setItems }: { items: IntState[]; setItems: (fn: (x: IntState[]) => IntState[]) => void }) {
  const toast = useToast()
  const [, setTick] = useState(0)
  const [log, setLog] = useState<LogRow[]>(() => {
    const now = Date.now()
    return [
      { id: 1, at: now - 60_000, name: 'Ozon Seller API', text: 'Загружено 17 заказов FBS', ok: true },
      { id: 2, at: now - 180_000, name: 'amoCRM', text: 'Обновлено 6 сделок', ok: true },
      { id: 3, at: now - 660_000, name: 'Битрикс24', text: 'Передано 4 лида с сайта', ok: true },
      { id: 4, at: now - 2 * 86_400_000, name: 'Wildberries API', text: 'Ошибка 401: токен недействителен', ok: false },
    ]
  })
  useEffect(() => {
    const t = window.setInterval(() => setTick((x) => x + 1), 10_000)
    return () => window.clearInterval(t)
  }, [])

  const sync = (it: IntState) => {
    setItems((xs) => xs.map((x) => (x.id === it.id ? { ...x, syncing: true } : x)))
    window.setTimeout(() => {
      setItems((xs) => xs.map((x) => (x.id === it.id ? { ...x, syncing: false, status: 'ok', lastSync: Date.now(), enabled: true, error: undefined } : x)))
      const text = SYNC_TEXT[it.id] ?? 'Синхронизация завершена'
      setLog((l) => [{ id: Date.now(), at: Date.now(), name: it.name, text, ok: true }, ...l].slice(0, 7))
      toast({
        tone: 'good',
        title: it.status === 'off' ? `${it.name} подключён` : `${it.name}: синхронизировано`,
        body: text,
      })
    }, 1400 + Math.random() * 600)
  }

  const okCount = items.filter((i) => i.status === 'ok').length
  const errCount = items.filter((i) => i.status === 'error').length
  const now = Date.now()

  return (
    <div className="space-y-4 md:space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3 pt-1">
        <div>
          <h1 className="text-[22px] font-semibold tracking-[-0.02em] md:text-[24px]">Интеграции</h1>
          <p className="mt-1 text-[13.5px] text-(--text-2)">
            {okCount} из {items.length} работают{errCount ? `, ${errCount} требует внимания` : ', ошибок нет'}. Данные обновляются по вебхукам и раз в 5 минут.
          </p>
        </div>
        <Button
          variant="secondary"
          disabled={items.some((i) => i.syncing)}
          onClick={() => items.filter((i) => i.status !== 'off').forEach((i) => sync(i))}
        >
          <RefreshCw className={cn('size-3.5', items.some((i) => i.syncing) && 'spin')} />
          Синхронизировать всё
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-3">
        {items.map((it) => {
          const st = STATUS[it.status]
          return (
            <Panel key={it.id} className={cn('flex flex-col p-4.5', it.status === 'error' && 'border-[color-mix(in_srgb,var(--bad)_35%,var(--border))]')}>
              <div className="flex items-start gap-3">
                <span
                  className="grid size-10 shrink-0 place-items-center rounded-xl text-[12.5px] font-bold tracking-[-0.02em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]"
                  style={{ background: `linear-gradient(145deg, ${it.tint}, color-mix(in srgb, ${it.tint} 70%, #000))` }}
                  aria-hidden
                >
                  {it.mono}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate text-[14.5px] font-semibold">{it.name}</h2>
                  </div>
                  <p className="text-[12px] text-(--text-3)">{it.kind}</p>
                </div>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={it.status}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={cn('inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11.5px] font-medium', st.cls)}
                  >
                    <st.Icon className="size-3.5" />
                    {st.label}
                  </motion.span>
                </AnimatePresence>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-(--text-2)">{it.description}</p>
              {it.error && (
                <p className="mt-3 flex items-center gap-2 rounded-lg bg-(--bad-soft) px-2.5 py-2 text-[12.5px] text-(--bad)">
                  <KeyRound className="size-3.5 shrink-0" />
                  {it.error}
                </p>
              )}
              <dl className="mt-4 grid grid-cols-2 gap-2">
                {it.stats.map((s) => (
                  <div key={s.label} className="rounded-lg border border-(--border) bg-(--panel-2) px-3 py-2">
                    <dt className="text-[11.5px] text-(--text-3)">{s.label}</dt>
                    <dd className="num mt-0.5 text-[14px] font-semibold">{it.status === 'off' ? '—' : s.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 mb-4 flex items-center gap-1.5 text-[12px] text-(--text-3)">
                {it.status === 'off' ? (
                  'Ещё не подключено'
                ) : (
                  <>
                    <span className={cn('size-1.5 rounded-full', it.status === 'error' ? 'bg-(--bad)' : it.enabled ? 'bg-(--good)' : 'bg-(--text-3)')} />
                    Синхронизация{' '}
                    <span className={cn(it.status === 'error' ? 'text-(--bad)' : 'text-(--text-2)')}>{it.lastSync ? ago(now - it.lastSync) : '—'}</span>
                  </>
                )}
              </p>
              <div className="mt-auto flex items-center gap-3 border-t border-(--border) pt-3.5">
                {it.status !== 'off' ? (
                  <label className="flex items-center gap-2 text-[12.5px] text-(--text-2)">
                    <Switch checked={it.enabled} onChange={(v) => setItems((xs) => xs.map((x) => (x.id === it.id ? { ...x, enabled: v } : x)))} label={`Автосинхронизация ${it.name}`} />
                    Авто
                  </label>
                ) : (
                  <span className="text-[12.5px] text-(--text-3)">Настройка за 2 минуты</span>
                )}
                <Button
                  size="sm"
                  variant={it.status === 'ok' ? 'secondary' : 'primary'}
                  disabled={it.syncing}
                  onClick={() => sync(it)}
                  className="ml-auto min-w-[150px]"
                >
                  {it.syncing ? <Loader2 className="spin size-3.5" /> : it.status === 'off' ? <ArrowUpRight className="size-3.5" /> : <RefreshCw className="size-3.5" />}
                  {it.syncing ? 'Синхронизация…' : it.status === 'off' ? 'Подключить' : it.status === 'error' ? 'Переподключить' : 'Синхронизировать'}
                </Button>
              </div>
            </Panel>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-3 md:gap-4 xl:grid-cols-3">
        <Panel className="xl:col-span-2">
          <PanelHeader title="Журнал синхронизации" sub="Последние события по всем подключениям" />
          <ul className="mt-3 border-t border-(--border)">
            <AnimatePresence initial={false}>
              {log.map((l) => (
                <motion.li
                  key={l.id}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden border-b border-(--border) last:border-0"
                >
                  <div className="flex items-center gap-3 px-5 py-2.5 text-[13px]">
                    {l.ok ? <CircleCheck className="size-4 shrink-0 text-(--good)" /> : <CircleAlert className="size-4 shrink-0 text-(--bad)" />}
                    <span className="w-[140px] shrink-0 truncate font-medium">{l.name}</span>
                    <span className="min-w-0 flex-1 truncate text-(--text-2)">{l.text}</span>
                    <span className="shrink-0 text-[12px] text-(--text-3)">{ago(now - l.at)}</span>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </Panel>
        <Panel className="p-5">
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-lg bg-(--accent-soft) text-(--accent)">
              <Webhook className="size-4" />
            </span>
            <h2 className="text-[14.5px] font-semibold">Вебхук для заказов</h2>
          </div>
          <p className="mt-2.5 text-[13px] leading-relaxed text-(--text-2)">
            Отправляйте заказы из любой системы на этот адрес — они появятся в ленте и уйдут в CRM за секунду.
          </p>
          <div className="mono mt-3 truncate rounded-lg border border-(--border) bg-(--panel-2) px-3 py-2 text-(--text-2)">
            https://api.pulse.app/hooks/td-8f3a2c/orders
          </div>
          <Button
            className="mt-3 w-full"
            onClick={() => {
              void navigator.clipboard?.writeText('https://api.pulse.app/hooks/td-8f3a2c/orders').catch(() => {})
              toast({ tone: 'info', title: 'Адрес вебхука скопирован' })
            }}
          >
            Скопировать адрес
          </Button>
        </Panel>
      </div>
    </div>
  )
}
