import { Component, Suspense, lazy, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { FREE_PC_COUNT } from '../data'
import { hasWebGL, scrollToId } from '../hooks'
import { Magnetic } from './Magnetic'

gsap.registerPlugin(useGSAP)

const HeroScene = lazy(() => import('../three/HeroScene'))

class SceneBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

/** Static poster: used while the 3D scene loads and when WebGL is unavailable. */
function Poster() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#06050A]" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_20%_35%,rgba(255,43,214,0.35),transparent_70%),radial-gradient(55%_45%_at_85%_40%,rgba(34,231,255,0.28),transparent_70%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[48%] [background:linear-gradient(transparent,rgba(6,5,10,0.4)),repeating-linear-gradient(90deg,rgba(255,43,214,0.28)_0_1px,transparent_1px_64px),repeating-linear-gradient(0deg,rgba(255,43,214,0.22)_0_1px,transparent_1px_64px)] [mask-image:linear-gradient(transparent,black_40%)] [transform:perspective(600px)_rotateX(62deg)] origin-top" />
      <div className="absolute inset-x-0 top-[26%] flex justify-center px-4 sm:top-[24%]">
        <span className="rs-display rs-chrome-text text-[clamp(3rem,14vw,14rem)] leading-none drop-shadow-[0_0_40px_rgba(255,43,214,0.35)]">
          RESPAWN
        </span>
      </div>
    </div>
  )
}

export function Hero() {
  const section = useRef<HTMLElement>(null)
  const pointer = useRef({ x: 0, y: 0 })
  const [active, setActive] = useState(true)
  const [webgl] = useState(() => (typeof window === 'undefined' ? false : hasWebGL()))
  const [compact] = useState(() => (typeof window === 'undefined' ? false : window.innerWidth < 768))

  useEffect(() => {
    const el = section.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { threshold: 0 })
    io.observe(el)
    const move = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => {
      io.disconnect()
      window.removeEventListener('pointermove', move)
    }
  }, [])

  useGSAP(
    () => {
      const tl = gsap.timeline({ delay: webgl ? 1.05 : 0.2 })
      tl.from('.rs-hero-line > span', { yPercent: 115, duration: 1.3, ease: 'expo.out', stagger: 0.12 })
      tl.from('.rs-hero-side', { autoAlpha: 0, y: 24, duration: 1, ease: 'power3.out' }, '-=0.9')
    },
    { scope: section },
  )

  return (
    <section ref={section} id="top" className="relative isolate h-[100svh] min-h-[620px] overflow-hidden bg-[#06050A]" aria-labelledby="hero-title">
      <div className="absolute inset-0 -z-10">
        {webgl ? (
          <SceneBoundary fallback={<Poster />}>
            <Suspense fallback={<Poster />}>
              <HeroScene active={active} pointer={pointer} compact={compact} />
            </Suspense>
          </SceneBoundary>
        ) : (
          <Poster />
        )}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[58%] bg-gradient-to-t from-[#06050A] via-[#06050A]/70 to-transparent" />

      <div className="relative mx-auto flex h-full max-w-[1400px] flex-col justify-end px-4 pb-10 sm:px-8 sm:pb-14 lg:pb-16">
        <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] lg:gap-12">
          <h1 id="hero-title" className="rs-display min-w-0 text-[clamp(2.9rem,8.4vw,8.75rem)]">
            <span className="sr-only">RESPAWN, компьютерный клуб в Петербурге. </span>
            <span className="rs-hero-line block overflow-hidden pb-[0.06em]">
              <span className="rs-gradient-text inline-block">Играй</span>
            </span>
            <span className="rs-hero-line block overflow-hidden pb-[0.08em]">
              <span className="rs-gradient-text inline-block">до утра</span>
            </span>
          </h1>

          <div className="rs-hero-side min-w-0 max-w-md lg:justify-self-end lg:pb-3">
            <p className="text-[1.05rem] leading-relaxed text-[#EDEAF6]/85 sm:text-lg">
              RTX 50-й серии и мониторы 360 Гц. Ночной пакет с 22:00 до 08:00 за 700 ₽.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Magnetic>
                <button type="button" onClick={() => scrollToId('seats')} className="rs-cta pointer-events-auto h-14 px-7 text-base">
                  Выбрать место
                </button>
              </Magnetic>
              <button type="button" onClick={() => scrollToId('prices')} className="rs-ghost pointer-events-auto h-14 px-6 text-base">
                Цены
              </button>
            </div>
            <p className="mt-6 flex items-center gap-3 text-sm text-[#9A93B5]">
              <span className="rs-pulse inline-block size-2.5 shrink-0 rounded-full bg-[#FFE14D]" aria-hidden />
              <span>
                Сейчас свободно <b className="font-semibold text-[#FFE14D]">{FREE_PC_COUNT}</b> компьютеров из 40
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
