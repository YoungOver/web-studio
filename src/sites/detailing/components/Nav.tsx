import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { scrollToId } from '../lib'
import { Magnetic } from './Magnetic'

const LINKS = [
  { id: 'services', label: 'Услуги' },
  { id: 'film', label: 'Плёнка' },
  { id: 'process', label: 'Процесс' },
  { id: 'prices', label: 'Цены' },
]

export function Wordmark({ className = '' }: { className?: string }) {
  return <span className={`gl-display gl-chrome-quiet tracking-[0.01em] [filter:drop-shadow(0_2px_10px_rgba(0,0,0,0.75))] ${className}`}>ГЛЯНЕЦ</span>
}

export function Nav() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const on = () => {
      const s = window.scrollY > 40
      setSolid((prev) => (prev === s ? prev : s))
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    scrollToId(id)
  }

  return (
    <header
      data-intro="nav"
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        solid || open ? 'border-b border-white/[0.06] bg-[#0e0f12]/75 backdrop-blur-xl' : 'border-b border-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:h-[72px] lg:px-10" aria-label="Основная навигация">
        <a href="#top" onClick={go('top')} className="shrink-0 text-[1.35rem] leading-none" aria-label="Глянец, на главную">
          <Wordmark />
        </a>

        <ul className="hidden items-center gap-1 rounded-full border border-white/10 bg-[#0e0f12]/55 p-1 backdrop-blur-md md:flex">
          {LINKS.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                onClick={go(l.id)}
                className="rounded-full px-4 py-1.5 text-[0.95rem] font-semibold text-[#b7bdc6] transition-colors hover:bg-white/5 hover:text-white"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Magnetic>
            <a href="#booking" onClick={go('booking')} className="gl-cta h-11 px-5 text-[0.95rem]">
              Записаться
            </a>
          </Magnetic>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full border border-white/10 text-[#d9dee5] md:hidden"
            aria-expanded={open}
            aria-controls="gl-mobile-menu"
            aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            id="gl-mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
            className="overflow-hidden px-4 md:hidden"
          >
            {LINKS.map((l) => (
              <li key={l.id} className="border-t border-white/[0.06]">
                <a href={`#${l.id}`} onClick={go(l.id)} className="gl-display block py-4 text-2xl text-[#d9dee5]">
                  {l.label}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  )
}
