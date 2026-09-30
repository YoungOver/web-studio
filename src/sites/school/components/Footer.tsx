import type { MouseEvent } from 'react'
import { Phone, Send } from 'lucide-react'
import { Logo } from './Nav'
import { scrollToId } from '../lib/motion'

const NAV = [
  { id: 'kursy', label: 'Курсы' },
  { id: 'kak', label: 'Как учимся' },
  { id: 'pesochnica', label: 'Песочница' },
  { id: 'ceny', label: 'Цены' },
  { id: 'otzyvy', label: 'Отзывы' },
  { id: 'faq', label: 'Вопросы' },
]

export function Footer() {
  const go = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    scrollToId(id)
  }

  return (
    <footer className="relative overflow-hidden pt-16 sm:pt-20">
      <div className="kk-wrap">
        <div className="grid gap-10 border-t border-[#d3d9e6] pt-12 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div className="min-w-0">
            <Logo />
            <p className="mt-4 max-w-[22rem] text-[0.98rem] leading-relaxed text-[#5b6172]">
              Онлайн-школа программирования для подростков 11–17 лет. Учим с 2019 года.
            </p>
          </div>

          <nav aria-label="Разделы" className="min-w-0">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5">
              {NAV.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} onClick={go(l.id)} className="rounded font-semibold text-[#2a2e3d] hover:text-[#3d5afe]">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <address className="grid min-w-0 content-start gap-3 not-italic">
            <a href="tel:+78000000000" className="inline-flex w-fit items-center gap-2.5 rounded text-[1.25rem] font-extrabold tracking-[-0.02em] hover:text-[#3d5afe]">
              <Phone size={20} aria-hidden="true" />
              +7 (800) 000-00-00
            </a>
            <a href="https://t.me/kodkemp_school" className="inline-flex w-fit items-center gap-2.5 rounded font-semibold hover:text-[#3d5afe]">
              <Send size={18} aria-hidden="true" />
              Telegram: @kodkemp_school
            </a>
            <p className="text-[0.92rem] text-[#5b6172]">Звонок по России бесплатный, с 9 до 21 по Москве.</p>
          </address>
        </div>

        <div className="mt-12 flex flex-col gap-2 text-[0.85rem] leading-relaxed text-[#6b7183] md:flex-row md:justify-between md:gap-8">
          <p>ООО «Код-Кемп», ИНН 0000000000. Лицензия на образовательную деятельность № Л035-00000-00/00000000 от 01.01.2020.</p>
          <p className="shrink-0">© 2026 Код-Кемп</p>
        </div>
      </div>

      <p
        aria-hidden="true"
        className="kk-display mt-10 translate-y-[18%] text-center text-[clamp(4.5rem,19vw,19rem)] whitespace-nowrap text-[#14161f] select-none"
      >
        Код-Кемп
      </p>
    </footer>
  )
}
