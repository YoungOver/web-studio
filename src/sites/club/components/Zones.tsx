import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ZONES } from '../data'
import { ZoneArt } from './ZoneArt'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function Zones({ reduced }: { reduced: boolean }) {
  const h = !reduced
  const pin = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const t = track.current
        const p = pin.current
        if (!t || !p) return
        const distance = () => Math.max(0, t.scrollWidth - window.innerWidth)
        gsap.to(t, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: p,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`
            },
          },
        })
      })
      return () => mm.revert()
    },
    { scope: pin },
  )

  return (
    <section id="zones" aria-labelledby="zones-title" className="relative">
      <div ref={pin} className={`relative overflow-hidden py-24 ${h ? 'lg:flex lg:h-screen lg:flex-col lg:justify-center lg:py-0' : ''}`}>
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <h2 id="zones-title" className="rs-display text-[clamp(2.75rem,7.5vw,7.5rem)]">
              Четыре зоны
            </h2>
            <p className="max-w-sm text-[#9A93B5] lg:pb-3 lg:text-right">
              От общего зала на 30 компьютеров до студии для стрима. Везде одинаково быстрый интернет, 1 Гбит/с.
            </p>
          </div>
        </div>

        <div
          ref={track}
          className={`mt-10 flex flex-col gap-5 px-4 sm:px-8 lg:mt-12 ${
            h ? 'lg:w-max lg:flex-row lg:gap-6 lg:pr-[10vw] lg:pl-[max(2rem,calc((100vw-1400px)/2+2rem))]' : 'mx-auto max-w-[1400px]'
          }`}
        >
          {ZONES.map((z) => (
            <article
              key={z.id}
              aria-labelledby={`zone-${z.id}`}
              className={`relative grid min-w-0 overflow-hidden rounded-[28px] border border-[#2A2342] bg-[#120E1F]/85 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] ${h ? 'lg:h-[min(64vh,600px)] lg:w-[min(78vw,1080px)] lg:shrink-0' : ''}`}
              style={{ boxShadow: `inset 0 1px 0 rgba(255,255,255,0.05), 0 40px 120px -60px ${z.accent}` }}
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-60"
                style={{ background: `radial-gradient(60% 70% at 85% 50%, ${z.accent}22, transparent 70%)` }}
              />
              <div className="relative flex min-w-0 flex-col justify-between gap-8 p-6 sm:p-9">
                <div>
                  <p className="text-sm" style={{ color: z.accent }}>
                    {z.capacity}
                  </p>
                  <h3 id={`zone-${z.id}`} className="rs-display mt-3 text-[clamp(2.1rem,4.4vw,4.25rem)] break-words">
                    {z.name}
                  </h3>
                  <p className="mt-4 max-w-sm text-[0.98rem] leading-relaxed text-[#9A93B5]">{z.note}</p>
                </div>
                <ul className="grid gap-2.5 text-[0.95rem]">
                  {z.specs.map((s) => (
                    <li key={s} className="flex items-start gap-3">
                      <span className="mt-[0.55em] size-1.5 shrink-0 rotate-45" style={{ background: z.accent }} aria-hidden />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
                <p className="flex items-baseline gap-2">
                  <span className="rs-display text-[clamp(2.2rem,3.6vw,3.25rem)]">{z.price} ₽</span>
                  <span className="text-[#9A93B5]">{z.unit.replace('₽ ', '')}</span>
                </p>
              </div>
              <div className="relative min-h-[260px] border-t border-[#2A2342] md:border-t-0 md:border-l" aria-hidden>
                <ZoneArt id={z.id} />
              </div>
            </article>
          ))}
        </div>

        <div className={`mx-auto mt-10 hidden w-full max-w-[1400px] px-8 ${h ? 'lg:block' : ''}`} aria-hidden>
          <div className="h-[2px] w-full overflow-hidden rounded-full bg-[#2A2342]">
            <div ref={bar} className="h-full origin-left scale-x-0 bg-gradient-to-r from-[#FF2BD6] to-[#22E7FF]" />
          </div>
        </div>
      </div>
    </section>
  )
}
