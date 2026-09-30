import { useEffect, useState, useSyncExternalStore } from 'react'
import Lenis from 'lenis'
import { addEffect } from '@react-three/fiber'

const RM = '(prefers-reduced-motion: reduce)'

export function useReducedMotion() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(RM)
      mq.addEventListener('change', cb)
      return () => mq.removeEventListener('change', cb)
    },
    () => window.matchMedia(RM).matches,
    () => false,
  )
}

export function useMedia(q: string) {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(q)
      mq.addEventListener('change', cb)
      return () => mq.removeEventListener('change', cb)
    },
    () => window.matchMedia(q).matches,
    () => false,
  )
}

let lenis: Lenis | null = null

/**
 * Lenis is stepped from the R3F loop (addEffect runs before any View measures its rect),
 * so the shared fixed canvas never lags a frame behind the DOM while scrolling.
 * A plain rAF loop takes over whenever the WebGL loop is not ticking.
 */
export function useSmoothScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return
    const l = new Lenis({ lerp: 0.11, smoothWheel: true, autoRaf: false })
    lenis = l
    let lastR3F = 0
    const off = addEffect((t) => {
      lastR3F = performance.now()
      l.raf(t)
    })
    let id = 0
    const loop = (t: number) => {
      if (performance.now() - lastR3F > 40) l.raf(t)
      id = requestAnimationFrame(loop)
    }
    id = requestAnimationFrame(loop)
    return () => {
      off()
      cancelAnimationFrame(id)
      l.destroy()
      lenis = null
    }
  }, [enabled])
}

export function lockScroll(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop()
    else lenis.start()
  }
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}

export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset: -64, duration: 1.3 })
  else el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/** Pointer in -1..1, shared by 3D scenes for parallax. */
export const pointer = { x: 0, y: 0 }
let pointerBound = false
export function bindPointer() {
  if (pointerBound) return
  pointerBound = true
  window.addEventListener(
    'pointermove',
    (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1
    },
    { passive: true },
  )
}

export function useScrolled(px = 8) {
  const [s, set] = useState(false)
  useEffect(() => {
    const on = () => set(window.scrollY > px)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [px])
  return s
}
