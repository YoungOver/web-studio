import { useEffect, useId, useRef } from 'react'
import { motion } from 'motion/react'
import gsap from 'gsap'
import { fmtRub } from '../data'

/** Rolls the number to its new value, writing straight to the DOM (no per-frame React state). */
export function AnimatedPrice({ value, className = '' }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const current = useRef({ v: value })
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const tween = gsap.to(current.current, {
      v: value,
      duration: 0.9,
      ease: 'power3.out',
      onUpdate: () => {
        el.textContent = fmtRub(Math.round(current.current.v / 1000) * 1000)
      },
      onComplete: () => {
        el.textContent = fmtRub(value)
      },
    })
    return () => {
      tween.kill()
    }
  }, [value])
  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {fmtRub(value)}
    </span>
  )
}

/** Pill segmented control with a sliding lit thumb. */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  size = 'md',
}: {
  options: { id: T; label: string }[]
  value: T
  onChange: (v: T) => void
  label: string
  size?: 'md' | 'lg'
}) {
  const layoutId = useId()
  return (
    <div className="gl-seg" data-size={size} role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={value === o.id}
          onClick={() => onChange(o.id)}
        >
          {value === o.id && (
            <motion.span layoutId={layoutId} className="gl-seg-thumb" transition={{ type: 'spring', stiffness: 420, damping: 36 }} />
          )}
          {o.label}
        </button>
      ))}
    </div>
  )
}
