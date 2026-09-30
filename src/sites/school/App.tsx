import { useEffect } from 'react'
import '@fontsource-variable/onest'
import '@fontsource-variable/jetbrains-mono'
import 'lenis/dist/lenis.css'
import './school.css'
import { useReducedMotion, useSmoothScroll } from './lib/motion'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Courses } from './components/Courses'
import { Process } from './components/Process'
import { Sandbox } from './components/Sandbox'
import { Reviews } from './components/Reviews'
import { Pricing } from './components/Pricing'
import { Signup } from './components/Signup'
import { Faq } from './components/Faq'
import { Footer } from './components/Footer'

export default function App() {
  const reduced = useReducedMotion()
  useSmoothScroll(!reduced)

  // global html background is dark for sibling sites; paint ours light for overscroll areas
  useEffect(() => {
    const html = document.documentElement
    const prev = { bg: html.style.background, scheme: html.style.colorScheme, title: document.title }
    html.style.background = '#EEF1F7'
    html.style.colorScheme = 'light'
    document.title = 'Код-Кемп — онлайн-школа программирования для подростков 11–17 лет'
    return () => {
      html.style.background = prev.bg
      html.style.colorScheme = prev.scheme
      document.title = prev.title
    }
  }, [])

  return (
    <div className="kk">
      <a
        href="#main"
        className="sr-only z-[100] rounded-xl bg-white px-4 py-3 font-semibold focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Перейти к содержанию
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Courses />
        <Process />
        <Sandbox />
        <Reviews />
        <Pricing />
        <Signup />
        <Faq />
      </main>
      <Footer />
    </div>
  )
}
