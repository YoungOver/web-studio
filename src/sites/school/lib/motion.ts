import { useEffect, useSyncExternalStore } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }

export const lenisRef: { current: Lenis | null } = { current: null }

const RM_QUERY = '(prefers-reduced-motion: reduce)'

function subscribeRM(cb: () => void) {
  const mq = window.matchMedia(RM_QUERY)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia(RM_QUERY).matches
}

export function useReducedMotion() {
  return useSyncExternalStore(subscribeRM, prefersReducedMotion, () => false)
}

/** Lenis smooth scroll wired into the GSAP ticker so ScrollTrigger stays in sync. */
export function useSmoothScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return
    const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1 })
    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      gsap.ticker.lagSmoothing(500, 33)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [enabled])
}

export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenisRef.current) {
    lenisRef.current.scrollTo(el, { offset: -76, duration: 1.2 })
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY - 76
    window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }
}

export function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}
