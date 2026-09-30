import { useEffect, useRef } from 'react'
import type { ReactNode, MouseEvent } from 'react'
import { gsap, scrollToId } from '../lib/motion'

type Props = {
  children: ReactNode
  /** Section id to scroll to (renders an <a>). */
  target?: string
  type?: 'button' | 'submit'
  size?: 'sm' | 'md' | 'lg'
  magnetic?: boolean
  className?: string
  onClick?: () => void
  disabled?: boolean
}

export function GlowButton({ children, target, type = 'button', size = 'md', magnetic = true, className = '', onClick, disabled }: Props) {
  const wrap = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = wrap.current
    if (!el || !magnetic || !window.matchMedia('(pointer: fine)').matches) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' })
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      xTo((e.clientX - (r.left + r.width / 2)) * 0.28)
      yTo((e.clientY - (r.top + r.height / 2)) * 0.38)
    }
    const leave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.35)' })
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
      gsap.killTweensOf(el)
    }
  }, [magnetic])

  const cls = `kk-cta ${size === 'sm' ? 'kk-cta--sm' : size === 'lg' ? 'kk-cta--lg' : ''}`

  const handleLink = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!target) return
    e.preventDefault()
    onClick?.()
    scrollToId(target)
  }

  return (
    <span ref={wrap} className={`kk-cta-wrap ${className}`}>
      <span className="kk-cta-glow" aria-hidden="true" />
      {target ? (
        <a href={`#${target}`} className={cls} onClick={handleLink}>
          {children}
        </a>
      ) : (
        <button type={type} className={cls} onClick={onClick} disabled={disabled}>
          {children}
        </button>
      )}
    </span>
  )
}
