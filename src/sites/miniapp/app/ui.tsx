import { AnimatePresence, motion, useDragControls, type HTMLMotionProps } from 'motion/react'
import { forwardRef, type ReactNode } from 'react'
import { Minus, Plus } from 'lucide-react'

export const spring = { type: 'spring', stiffness: 420, damping: 34, mass: 0.9 } as const
export const softSpring = { type: 'spring', stiffness: 260, damping: 30 } as const

export function haptic(ms = 8) {
  try {
    navigator.vibrate?.(ms)
  } catch {
    /* no haptics on this device */
  }
}

export const Press = forwardRef<HTMLButtonElement, HTMLMotionProps<'button'> & { scale?: number }>(function Press(
  { scale = 0.96, onClick, ...rest },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      type="button"
      whileTap={{ scale }}
      transition={spring}
      onClick={(e) => {
        haptic()
        onClick?.(e)
      }}
      {...rest}
    />
  )
})

export function Bump({ value, className }: { value: ReactNode; className?: string }) {
  return (
    <span className={`relative inline-flex overflow-hidden ${className ?? ''}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={String(value)}
          initial={{ y: '-70%', opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: '70%', opacity: 0, scale: 0.8 }}
          transition={spring}
          className="inline-block"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export function Switch({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation()
        haptic()
        onChange(!on)
      }}
      className="relative h-[31px] w-[51px] shrink-0 rounded-full transition-colors duration-200"
      style={{ background: on ? 'var(--tg-btn)' : '#e3e3e8' }}
    >
      <motion.span
        className="absolute top-[2px] left-[2px] h-[27px] w-[27px] rounded-full bg-white"
        style={{ boxShadow: '0 3px 8px rgba(0,0,0,.15), 0 1px 1px rgba(0,0,0,.08)' }}
        animate={{ x: on ? 20 : 0 }}
        transition={spring}
      />
    </button>
  )
}

export function Stepper({ value, onInc, onDec, size = 'md', tone = 'blue' }: { value: number; onInc: () => void; onDec: () => void; size?: 'sm' | 'md'; tone?: 'blue' | 'soft' }) {
  const h = size === 'sm' ? 28 : 36
  const blue = tone === 'blue'
  return (
    <div
      className="flex items-center rounded-full"
      style={{ height: h, background: blue ? 'var(--tg-btn)' : 'var(--tg-sec)', color: blue ? '#fff' : 'var(--tg-text)' }}
      onClick={(e) => e.stopPropagation()}
    >
      <Press aria-label="Убрать" scale={0.82} onClick={onDec} className="grid h-full place-items-center" style={{ width: h }}>
        <Minus size={size === 'sm' ? 14 : 16} strokeWidth={2.6} />
      </Press>
      <Bump value={value} className="tg-num min-w-[14px] justify-center text-[14px] font-semibold" />
      <Press aria-label="Добавить" scale={0.82} onClick={onInc} className="grid h-full place-items-center" style={{ width: h }}>
        <Plus size={size === 'sm' ? 14 : 16} strokeWidth={2.6} />
      </Press>
    </div>
  )
}

export function Sheet({ open, onClose, children, label }: { open: boolean; onClose: () => void; children: ReactNode; label: string }) {
  const controls = useDragControls()
  return (
    <AnimatePresence>
      {open && (
        <div className="absolute inset-0 z-40" role="dialog" aria-label={label}>
          <motion.div
            className="absolute inset-0 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 flex max-h-[92%] flex-col overflow-hidden rounded-t-[16px] bg-[var(--tg-bg)]"
            style={{ boxShadow: '0 -10px 40px rgba(0,0,0,.12)' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 38 }}
            drag="y"
            dragControls={controls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.05, bottom: 0.9 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 110 || info.velocity.y > 600) onClose()
            }}
          >
            <div
              className="absolute inset-x-0 top-0 z-20 flex h-6 cursor-grab touch-none justify-center pt-[7px] active:cursor-grabbing"
              onPointerDown={(e) => controls.start(e)}
            >
              <span className="h-[5px] w-9 rounded-full bg-black/15" />
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export function Section({ title, aside, children }: { title: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <section className="mt-5">
      <div className="mb-[7px] flex items-baseline justify-between px-4 text-[13px] text-[var(--tg-hint)]">
        <span>{title}</span>
        {aside}
      </div>
      <div className="mx-3 overflow-hidden rounded-[14px] bg-[var(--tg-bg)]">{children}</div>
    </section>
  )
}

export function Row({ icon, title, sub, right, onClick, last }: { icon?: ReactNode; title: ReactNode; sub?: ReactNode; right?: ReactNode; onClick?: () => void; last?: boolean }) {
  const inner = (
    <>
      {icon && <div className="shrink-0">{icon}</div>}
      <div className="relative flex min-h-[52px] flex-1 items-center gap-3 py-[9px] pr-4">
        <div className="min-w-0 flex-1 text-left">
          <div className="text-[16px] leading-[21px]">{title}</div>
          {sub && <div className="mt-[1px] text-[13px] leading-[17px] text-[var(--tg-hint)]">{sub}</div>}
        </div>
        {right}
        {!last && <span className="absolute right-0 bottom-0 left-0 h-px bg-[var(--tg-sep)]" style={{ transform: 'scaleY(.6)' }} />}
      </div>
    </>
  )
  if (onClick)
    return (
      <button type="button" onClick={() => { haptic(); onClick() }} className="flex w-full items-center gap-3 pl-4 text-left transition-colors active:bg-black/[.04]">
        {inner}
      </button>
    )
  return <div className="flex items-center gap-3 pl-4">{inner}</div>
}

export function IconTile({ bg, children }: { bg: string; children: ReactNode }) {
  return (
    <span className="grid h-[30px] w-[30px] place-items-center rounded-[8px] text-white" style={{ background: bg }}>
      {children}
    </span>
  )
}
