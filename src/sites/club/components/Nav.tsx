import { useEffect, useState } from 'react'
import type { MouseEvent } from 'react'
import { Menu, X } from 'lucide-react'
import { scrollToId } from '../hooks'
import { Magnetic } from './Magnetic'

const LINKS = [
  { id: 'zones', label: 'Зоны' },
  { id: 'seats', label: 'Места' },
  { id: 'prices', label: 'Цены' },
  { id: 'tournaments', label: 'Турниры' },
]

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 32 32" className="size-7 shrink-0" aria-hidden>
        <defs>
          <linearGradient id="rs-logo" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FF2BD6" />
            <stop offset="1" stopColor="#22E7FF" />
          </linearGradient>
        </defs>
        <path d="M26 16a10 10 0 1 1-3-7.1" fill="none" stroke="url(#rs-logo)" strokeWidth="3.4" strokeLinecap="round" />
        <path d="M24.5 3.5v6.2h-6.2" fill="none" stroke="url(#rs-logo)" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="16" cy="16" r="3.2" fill="#FFE14D" />
      </svg>
      <span className="rs-f-display text-[0.95rem] font-black sm:text-[1.05rem] tracking-[-0.04em]">RESPAWN</span>
    </span>
  )
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const s = window.scrollY > 40
      setScrolled((prev) => (prev === s ? prev : s))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (id: string) => (e: MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    scrollToId(id)
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <nav
        aria-label="Основная навигация"
        className={`mx-auto flex max-w-[1400px] items-center justify-between gap-3 rounded-full border py-2 pr-2 pl-4 transition-all duration-500 sm:pl-5 ${
          scrolled || open
            ? 'border-[#2A2342] bg-[#0c0916]/75 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl'
            : 'border-transparent bg-transparent'
        }`}
      >
        <a href="#top" onClick={go('top')} aria-label="RESPAWN, на главную" className="rounded-full">
          <Logo />
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                onClick={go(l.id)}
                className="rounded-full px-4 py-2 text-[0.95rem] text-[#EDEAF6]/80 transition-colors hover:bg-white/5 hover:text-white"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Magnetic strength={0.3}>
            <a href="#seats" onClick={go('seats')} className="rs-cta h-11 px-5 text-[0.85rem] sm:px-6 sm:text-[0.9rem]">
              <span className="sm:hidden">Бронь</span>
              <span className="hidden sm:inline">Забронировать</span>
            </a>
          </Magnetic>
          <button
            type="button"
            className="rs-ghost size-11 md:hidden"
            aria-expanded={open}
            aria-controls="rs-mobile-menu"
            aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div
          id="rs-mobile-menu"
          className="mx-auto mt-2 max-w-[1400px] rounded-3xl border border-[#2A2342] bg-[#0c0916]/90 p-3 backdrop-blur-xl md:hidden"
        >
          <ul className="grid">
            {LINKS.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={go(l.id)}
                  className="block rounded-2xl px-4 py-3.5 rs-f-display text-xl font-bold tracking-[-0.03em] hover:bg-white/5"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
