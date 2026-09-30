import { useState } from 'react'
import { BorderBeam } from '@/components/magicui/border-beam'
import { SERVICES, type Service } from '../data'

function Details({ s, featured, active, onBook }: { s: Service; featured: boolean; active: boolean; onBook: (id: string) => void }) {
  return (
    <>
      <p className="text-[0.95rem] text-[#8c939e]">
        Срок <span className="font-bold text-[#d9dee5]">{s.days}</span>
        {featured && <span className="ml-3 text-[#8fb3ff]">выбирают чаще всего</span>}
      </p>
      {featured ? (
        <div className="relative mt-3 overflow-hidden rounded-2xl border border-[#2b2f36] bg-[#15171b] px-4 py-3 text-[0.98rem] leading-relaxed text-[#c3c9d1]">
          <p>{s.text}</p>
          <BorderBeam size={110} duration={7} colorFrom="#3b7bff" colorTo="#d9dee5" borderWidth={1.5} />
        </div>
      ) : (
        <p className="mt-2 text-[0.98rem] leading-relaxed text-[#aab1bb]">{s.text}</p>
      )}
      <button
        type="button"
        tabIndex={active ? 0 : -1}
        onClick={() => onBook(s.id)}
        className="mt-4 text-[0.95rem] font-bold text-white underline decoration-[#3b7bff] decoration-2 underline-offset-[6px] hover:text-[#9fc0ff]"
      >
        {s.cta}
      </button>
    </>
  )
}

export function Services({ onBook }: { onBook: (service: string) => void }) {
  const [open, setOpen] = useState('ppf')

  return (
    <section id="services" className="relative scroll-mt-20 py-24 lg:py-36" aria-labelledby="services-title">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-end">
          <h2 id="services-title" className="gl-display min-w-0 text-[clamp(2.3rem,6vw,5.5rem)] text-[#eef1f5]">
            Что делаем
          </h2>
          <p className="max-w-[26rem] text-[1.05rem] leading-relaxed text-[#8c939e]">
            Цены для седана. Точную сумму называем после осмотра: она зависит от состояния лака и площади.
          </p>
        </div>

        <ul className="mt-14 border-b border-[#2b2f36] lg:mt-20">
          {SERVICES.map((s) => {
            const isOpen = open === s.id
            const featured = s.id === 'ppf'
            return (
              <li key={s.id} className="gl-svc relative border-t border-[#2b2f36]" data-open={isOpen} onMouseEnter={() => setOpen(s.id)}>
                <span aria-hidden className="gl-svc-glow" />
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 py-6 md:min-h-[10.5rem] md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_9rem] md:gap-x-10 lg:py-8">
                  <h3 className="m-0 min-w-0">
                    <button
                      type="button"
                      className="block w-full min-w-0 text-left"
                      aria-expanded={isOpen}
                      aria-controls={`svc-${s.id}`}
                      onClick={() => setOpen(s.id)}
                      onFocus={() => setOpen(s.id)}
                    >
                      <span className="gl-svc-name gl-display block text-[clamp(1.75rem,4.6vw,4rem)]">{s.name}</span>
                    </button>
                  </h3>
                  <div className="gl-svc-detail hidden min-w-0 md:block" aria-hidden={!isOpen}>
                    <Details s={s} featured={featured} active={isOpen} onBook={onBook} />
                  </div>
                  <span className="gl-svc-price text-right text-[0.95rem] font-bold sm:text-[1.15rem]">{s.price}</span>
                </div>
                {/* touch / narrow screens: expands below the row */}
                <div id={`svc-${s.id}`} className="gl-svc-panel md:hidden">
                  <div className="min-h-0 overflow-hidden">
                    <div className="pb-7">
                      <Details s={s} featured={featured} active={isOpen} onBook={onBook} />
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
