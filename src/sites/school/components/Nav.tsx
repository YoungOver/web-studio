import { useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { Menu, X } from 'lucide-react'
import { GlowButton } from './GlowButton'
import { scrollToId } from '../lib/motion'

const LINKS = [
  { id: 'kursy', label: 'Курсы' },
  { id: 'kak', label: 'Как учимся' },
  { id: 'ceny', label: 'Цены' },
  { id: 'otzyvy', label: 'Отзывы' },
]

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        aria-hidden="true"
        className="kk-key kk-key--blue h-9 w-9 shrink-0 rounded-[10px] text-[1.05rem] font-black"
        style={{ boxShadow: 'inset 0 1px 0 rgb(255 255 255 / .4), 0 3px 0 #2536b5' }}
      >
        К
      </span>
      <span className="text-[1.2rem] font-extrabold tracking-[-0.04em]">Код-Кемп</span>
    </span>
  )
}

export function Nav() {
  const bar = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let solid = false
    const onScroll = () => {
      const next = window.scrollY > 24
      if (next !== solid && bar.current) {
        solid = next
        bar.current.dataset.solid = String(next)
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setOpen(false)
    scrollToId(id)
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 pt-3">
      <div className="kk-wrap">
        <div
          ref={bar}
          data-solid="false"
          className="flex h-[60px] items-center justify-between gap-4 rounded-[20px] border border-transparent px-3 pl-4 transition-[background-color,border-color,box-shadow] duration-300 data-[solid=true]:border-white/70 data-[solid=true]:bg-white/75 data-[solid=true]:shadow-[0_10px_30px_-18px_rgba(20,22,31,.35)] data-[solid=true]:backdrop-blur-xl"
        >
          <a href="#top" onClick={go('top')} className="rounded-xl" aria-label="Код-Кемп, наверх">
            <Logo />
          </a>

          <nav aria-label="Основная навигация" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {LINKS.map((l) => (
                <li key={l.id}>
                  <a
                    href={`#${l.id}`}
                    onClick={go(l.id)}
                    className="rounded-xl px-3.5 py-2 text-[0.97rem] font-semibold text-[#2a2e3d] transition-colors hover:bg-[#14161f]/[0.06]"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <GlowButton target="zayavka" size="sm" className="hidden sm:inline-flex">
              Пробный урок бесплатно
            </GlowButton>
            <button
              type="button"
              className="kk-key h-11 w-11 md:hidden"
              aria-expanded={open}
              aria-controls="kk-mobile-menu"
              aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {open && (
          <div
            id="kk-mobile-menu"
            className="mt-2 rounded-[22px] border border-white bg-white/95 p-3 shadow-[0_24px_50px_-24px_rgba(20,22,31,.45)] backdrop-blur-xl md:hidden"
          >
            <ul className="grid gap-1">
              {LINKS.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} onClick={go(l.id)} className="block rounded-xl px-4 py-3 text-lg font-bold hover:bg-[#eef1f7]">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-2 px-1 pb-1">
              <GlowButton target="zayavka" magnetic={false} onClick={() => setOpen(false)} className="w-full [&>a]:w-full">
                Пробный урок бесплатно
              </GlowButton>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
