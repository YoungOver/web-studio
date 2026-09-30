import '@fontsource/dela-gothic-one'
import '@fontsource-variable/manrope'
import './detailing.css'

import { useCallback, useEffect, useState } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

import type { CarClass } from './data'
import { prefersReducedMotion, scrollToId, setLenis } from './lib'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Film } from './components/Film'
import { Services } from './components/Services'
import { Process } from './components/Process'
import { Pricing } from './components/Pricing'
import { Reviews } from './components/Reviews'
import { Booking, type Preset } from './components/Booking'
import { Footer } from './components/Footer'

gsap.registerPlugin(ScrollTrigger, useGSAP)

function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
    setLenis(lenis)
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      gsap.ticker.lagSmoothing(500, 33)
      lenis.destroy()
      setLenis(null)
    }
  }, [])
}

export default function App() {
  useSmoothScroll()
  const [carClass, setCarClass] = useState<CarClass>('sedan')
  const [preset, setPreset] = useState<Preset | null>(null)

  useEffect(() => {
    document.title = 'Глянец — детейлинг-центр в Москве'
    // fonts change line boxes; re-measure pinned sections once they load
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
  }, [])

  const book = useCallback((service: string) => {
    setPreset((p) => ({ service, n: (p?.n ?? 0) + 1 }))
    scrollToId('booking')
  }, [])

  return (
    <div className="gl-root">
      <a
        href="#booking"
        className="fixed left-4 top-3 z-[60] -translate-y-24 rounded-full bg-[#3b7bff] px-4 py-2 font-semibold text-white focus:translate-y-0"
      >
        Перейти к записи
      </a>
      <Nav />
      <main>
        <Hero />
        <Film carClass={carClass} setCarClass={setCarClass} onBook={book} />
        <Services onBook={book} />
        <Process />
        <Pricing carClass={carClass} setCarClass={setCarClass} onBook={book} />
        <Reviews />
        <Booking preset={preset} />
      </main>
      <Footer />
    </div>
  )
}
