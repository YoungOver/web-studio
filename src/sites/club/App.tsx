import { useEffect } from 'react'
import '@fontsource-variable/unbounded'
import '@fontsource-variable/onest'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './club.css'
import { useReducedMotion, useSmoothScroll } from './hooks'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Zones } from './components/Zones'
import { SeatMap } from './components/SeatMap'
import { Pricing } from './components/Pricing'
import { Tournaments } from './components/Tournaments'
import { Faq } from './components/Faq'
import { Footer } from './components/Footer'

function Backdrop() {
  return (
    <>
      <div className="rs-blobs" aria-hidden>
        <div className="rs-blob rs-blob-a" />
        <div className="rs-blob rs-blob-b" />
        <div className="rs-blob rs-blob-c" />
      </div>
      <div className="rs-grain" aria-hidden />
    </>
  )
}

export default function App() {
  // Reduced motion only turns off smooth scroll and scroll-jacking (pinning);
  // the hero scene, ambient motion and interactions stay on.
  const reduced = useReducedMotion()
  useSmoothScroll(!reduced)

  useEffect(() => {
    document.title = 'RESPAWN, компьютерный клуб 24/7 на Лиговском'
    // Pinned sections measure text; re-measure once the web fonts are in.
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
  }, [])

  return (
    <div className="rs-root relative min-h-screen">
      <Backdrop />
      <a
        href="#seats"
        className="sr-only z-[80] rounded-full bg-[#EDEAF6] px-5 py-3 text-[#06050A] focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Перейти к выбору места
      </a>
      <Nav />
      <main className="relative z-10">
        <Hero />
        <Zones reduced={reduced} />
        <SeatMap />
        <Pricing />
        <Tournaments />
        <Faq />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  )
}
