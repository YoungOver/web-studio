import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from 'react'
import { animate, AnimatePresence, motion } from 'motion/react'
import { ArrowDownRight, ArrowUpRight, Check, CircleAlert, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Channel } from './data'
import { initials, signedPct } from './format'

/* ---------- Theme ---------- */

export type Theme = 'dark' | 'light'
export interface Palette {
  site: string
  ozon: string
  wb: string
  avito: string
  surface: string
  grid: string
  axis: string
  cursor: string
}
export const PALETTES: Record<Theme, Palette> = {
  dark: { site: '#3987e5', ozon: '#d95926', wb: '#199e70', avito: '#c98500', surface: '#111316', grid: '#1c2025', axis: '#6b727c', cursor: '#3a4048' },
  light: { site: '#2a78d6', ozon: '#eb6834', wb: '#1baf7a', avito: '#eda100', surface: '#ffffff', grid: '#efefeb', axis: '#858a92', cursor: '#c9c9c3' },
}

export const ThemeCtx = createContext<{ theme: Theme; pal: Palette; toggle: () => void }>({
  theme: 'dark',
  pal: PALETTES.dark,
  toggle: () => {},
})
export const useTheme = () => useContext(ThemeCtx)

/* ---------- Toasts ---------- */

interface Toast {
  id: number
  title: string
  body?: string
  tone: 'good' | 'bad' | 'info'
}
const ToastCtx = createContext<(t: Omit<Toast, 'id'>) => void>(() => {})
export const useToast = () => useContext(ToastCtx)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const seq = useRef(0)
  const push = useCallback((t: Omit<Toast, 'id'>) => {
    const id = ++seq.current
    setToasts((xs) => [...xs.slice(-2), { ...t, id }])
    window.setTimeout(() => setToasts((xs) => xs.filter((x) => x.id !== id)), 4200)
  }, [])
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-3 bottom-[84px] z-[80] flex flex-col items-end gap-2 md:inset-x-auto md:right-5 md:bottom-5"
      >
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 24, transition: { duration: 0.18 } }}
              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              className="pointer-events-auto flex w-full max-w-[360px] items-start gap-3 rounded-xl bg-(--panel) p-3.5 pr-3 shadow-(--shadow-pop)"
            >
              <span
                className={cn(
                  'mt-0.5 grid size-5 shrink-0 place-items-center rounded-full',
                  t.tone === 'good' && 'bg-(--good-soft) text-(--good)',
                  t.tone === 'bad' && 'bg-(--bad-soft) text-(--bad)',
                  t.tone === 'info' && 'bg-(--accent-soft) text-(--accent)',
                )}
              >
                {t.tone === 'bad' ? <CircleAlert className="size-3.5" /> : <Check className="size-3.5" strokeWidth={2.6} />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-medium">{t.title}</p>
                {t.body && <p className="mt-0.5 text-[12.5px] text-(--text-2)">{t.body}</p>}
              </div>
              <button
                aria-label="Закрыть"
                onClick={() => setToasts((xs) => xs.filter((x) => x.id !== t.id))}
                className="rounded-md p-0.5 text-(--text-3) hover:bg-(--hover) hover:text-(--text)"
              >
                <X className="size-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  )
}

/* ---------- Primitives ---------- */

export function Panel({ className, children, id }: { className?: string; children: ReactNode; id?: string }) {
  return (
    <section id={id} className={cn('rounded-2xl border border-(--border) bg-(--panel) shadow-(--shadow-card)', className)}>
      {children}
    </section>
  )
}

export function PanelHeader({ title, sub, right, className }: { title: ReactNode; sub?: ReactNode; right?: ReactNode; className?: string }) {
  return (
    <div className={cn('flex flex-wrap items-start justify-between gap-3 px-5 pt-4.5', className)}>
      <div className="min-w-0">
        <h2 className="text-[14.5px] font-semibold tracking-[-0.005em]">{title}</h2>
        {sub && <p className="mt-0.5 text-[12.5px] text-(--text-3)">{sub}</p>}
      </div>
      {right}
    </div>
  )
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost'; size?: 'sm' | 'md' }
export function Button({ variant = 'secondary', size = 'md', className, ...rest }: BtnProps) {
  return (
    <button
      {...rest}
      className={cn(
        'inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg font-medium whitespace-nowrap transition-[background,color,box-shadow,opacity] duration-150 disabled:pointer-events-none disabled:opacity-60',
        size === 'md' ? 'h-8.5 px-3 text-[13px]' : 'h-7 px-2.5 text-[12.5px]',
        variant === 'primary' && 'bg-(--accent) text-(--accent-fg) shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] hover:bg-(--accent-strong)',
        variant === 'secondary' && 'border border-(--border) bg-(--panel) text-(--text) hover:border-(--border-strong) hover:bg-(--panel-2)',
        variant === 'ghost' && 'text-(--text-2) hover:bg-(--hover) hover:text-(--text)',
        className,
      )}
    />
  )
}

export function IconButton({ className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={cn(
        'relative grid size-8.5 shrink-0 place-items-center rounded-lg text-(--text-2) transition-colors hover:bg-(--hover) hover:text-(--text)',
        className,
      )}
    />
  )
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
  className,
  size = 'md',
}: {
  value: T
  options: { value: T; label: string }[]
  onChange: (v: T) => void
  label: string
  className?: string
  size?: 'sm' | 'md'
}) {
  return (
    <div role="radiogroup" aria-label={label} className={cn('inline-flex rounded-lg border border-(--border) bg-(--panel-2) p-0.5', className)}>
      {options.map((o) => {
        const on = o.value === value
        return (
          <button
            key={o.value}
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={cn(
              'relative rounded-md font-medium whitespace-nowrap transition-colors',
              size === 'md' ? 'h-7 px-3 text-[12.5px]' : 'h-6 px-2.5 text-[12px]',
              on ? 'text-(--text)' : 'text-(--text-3) hover:text-(--text-2)',
            )}
          >
            {on && (
              <motion.span
                layoutId={`seg-${label}`}
                transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                className="absolute inset-0 rounded-md bg-(--panel) shadow-[0_1px_2px_rgba(0,0,0,0.12),0_0_0_1px_var(--border-strong)]"
              />
            )}
            <span className="relative">{o.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export function Delta({ value, invert = false, className }: { value: number; invert?: boolean; className?: string }) {
  const up = value >= 0
  const good = invert ? !up : up
  const Icon = up ? ArrowUpRight : ArrowDownRight
  return (
    <span
      className={cn(
        'num inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[12px] font-medium',
        good ? 'bg-(--good-soft) text-(--good)' : 'bg-(--bad-soft) text-(--bad)',
        className,
      )}
    >
      <Icon className="size-3.5" strokeWidth={2.2} />
      {signedPct(value)}
    </span>
  )
}

export function Sparkline({ data, color, height = 36, id }: { data: number[]; color: string; height?: number; id: string }) {
  const w = 120
  const h = height
  if (data.length < 2) return null
  const min = Math.min(...data)
  const max = Math.max(...data)
  const span = max - min || 1
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - 3 - ((v - min) / span) * (h - 8)] as const)
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const area = `${line} L${w},${h} L0,${h} Z`
  const last = pts[pts.length - 1]
  return (
    <div className="relative h-full w-full">
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-full w-full overflow-visible" aria-hidden>
      <defs>
        <linearGradient id={`sp-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.22" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sp-${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.6" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
      <span
        className="absolute size-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-(--panel)"
        style={{ left: '100%', top: `${(last[1] / h) * 100}%`, background: color }}
      />
    </div>
  )
}

export function Skeleton({ className, style }: { className?: string; style?: CSSProperties }) {
  return <div className={cn('skeleton', className)} style={style} />
}

export function Avatar({ name, size = 28, className }: { name: string; size?: number; className?: string }) {
  const { theme } = useTheme()
  let h = 0
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 360
  const hue = [212, 26, 160, 262, 340, 190][h % 6]
  const style =
    theme === 'dark'
      ? { background: `hsl(${hue} 28% 22%)`, color: `hsl(${hue} 55% 80%)`, width: size, height: size }
      : { background: `hsl(${hue} 55% 92%)`, color: `hsl(${hue} 45% 32%)`, width: size, height: size }
  return (
    <span
      style={{ ...style, fontSize: size * 0.38 }}
      className={cn('inline-grid shrink-0 place-items-center rounded-full font-semibold tracking-[0.01em] select-none', className)}
    >
      {initials(name)}
    </span>
  )
}

export function ChannelDot({ channel, className }: { channel: Channel; className?: string }) {
  const { pal } = useTheme()
  return <span className={cn('inline-block size-2 shrink-0 rounded-[3px]', className)} style={{ background: pal[channel] }} />
}

export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        'inline-grid h-5 min-w-5 place-items-center rounded-[5px] border border-(--border) bg-(--panel-2) px-1 font-sans text-[11px] font-medium text-(--text-3)',
        className,
      )}
    >
      {children}
    </kbd>
  )
}

/** Close a popover on outside click / Escape. */
export function useDismiss(open: boolean, close: () => void, refs: RefObject<HTMLElement | null>[]) {
  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (refs.some((r) => r.current?.contains(e.target as Node))) return
      close()
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, close])
}

/** Smoothly tweened number, formatted by the caller. */
export function AnimatedNumber({ value, format, className }: { value: number; format: (n: number) => string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const from = useRef(value * 0.94)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      node.textContent = format(value)
      from.current = value
      return
    }
    const ctl = animate(from.current, value, {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        node.textContent = format(v)
      },
    })
    from.current = value
    return () => ctl.stop()
  }, [value, format])
  return (
    <span ref={ref} className={cn('num', className)}>
      {format(value)}
    </span>
  )
}

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-5 w-9 shrink-0 rounded-full transition-colors duration-200',
        checked ? 'bg-(--accent)' : 'bg-(--border-strong)',
      )}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 600, damping: 36 }}
        className={cn('absolute top-0.5 size-4 rounded-full bg-white shadow-sm', checked ? 'right-0.5' : 'left-0.5')}
      />
    </button>
  )
}
