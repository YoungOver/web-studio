import { useEffect, useState } from 'react'
import '@fontsource-variable/fraunces/opsz.css'
import '@fontsource-variable/fraunces/opsz-italic.css'
import '@fontsource-variable/manrope'
import './shop.css'
import type { Category } from './data'
import { ShopProvider, useShop } from './store'
import { bindPointer, scrollToId, useReducedMotion, useSmoothScroll } from './hooks'
import Stage from './three/Stage'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Catalog } from './components/Catalog'
import { Quiz } from './components/Quiz'
import { CartDrawer } from './components/CartDrawer'
import { ProductModal } from './components/ProductModal'
import { FlyLayer } from './components/FlyLayer'
import { Delivery, Footer, IngredientStrip, Principles, Reviews } from './components/Sections'

const SECTIONS_3D = ['top', 'catalog', 'quiz']

function Shared3D() {
  const { product } = useShop()
  return <Stage sections={SECTIONS_3D} paused={product !== null} />
}

function Page() {
  const [cat, setCat] = useState<Category | 'all'>('all')
  const onCategory = (c: Category) => {
    setCat(c)
    requestAnimationFrame(() => scrollToId('catalog'))
  }
  return (
    <div className="lv-root lv-grain relative min-h-screen">
      <a href="#catalog" className="sr-only z-[90] rounded-full bg-[var(--ink)] px-5 py-3 text-[var(--stone)] focus:not-sr-only focus:fixed focus:top-4 focus:left-4">
        Перейти к каталогу
      </a>
      <Header onCategory={onCategory} />
      <main>
        <Hero />
        <IngredientStrip />
        <Catalog cat={cat} setCat={setCat} />
        <Principles />
        <Quiz />
        <Reviews />
        <Delivery />
      </main>
      <Footer />
      <Shared3D />
      <CartDrawer />
      <ProductModal />
      <FlyLayer />
    </div>
  )
}

export default function App() {
  // Reduced motion only switches off Lenis; 3D and micro-interactions stay.
  const reduced = useReducedMotion()
  useSmoothScroll(!reduced)

  useEffect(() => {
    document.title = 'Лаванда — натуральная косметика: сыворотки, масла, кремы'
    const html = document.documentElement
    const prev = { bg: html.style.background, color: html.style.color }
    html.style.background = '#ede8e1'
    html.style.color = '#1e1e1c'
    document.body.style.background = '#ede8e1'
    bindPointer()
    return () => {
      html.style.background = prev.bg
      html.style.color = prev.color
    }
  }, [])

  return (
    <ShopProvider>
      <Page />
    </ShopProvider>
  )
}
