import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { STEPS } from '../data'

const pad = (n: number) => String(n).padStart(2, '0')

export function Process() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const section = root.current
      if (!section) return
      const steps = gsap.utils.toArray<HTMLElement>('[data-step]', section)
      const beam = section.querySelector<HTMLElement>('[data-beam]')
      const counter = section.querySelector<HTMLElement>('[data-counter]')
      const pinEl = section.querySelector<HTMLElement>('[data-pin]')
      const list = section.querySelector<HTMLElement>('[data-list]')
      if (!beam || !pinEl || !list) return

      let last = -2
      const setActive = (idx: number) => {
        if (idx === last) return
        last = idx
        steps.forEach((el, i) => {
          el.dataset.active = String(i <= idx)
        })
        if (counter) counter.textContent = pad(Math.max(1, idx + 1))
      }

      const mm = gsap.matchMedia()

      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        setActive(0)
        gsap.set(beam, { scaleY: 0 })
        const tween = gsap.to(beam, {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${window.innerHeight * 2.4}`,
            pin: pinEl,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => setActive(Math.min(steps.length - 1, Math.floor(self.progress * steps.length * 0.999 + 0.12))),
          },
        })
        return () => {
          tween.scrollTrigger?.kill()
          tween.kill()
        }
      })

      // narrow screens, and reduced-motion users on desktop: no pin, the beam simply follows the scroll
      mm.add('(max-width: 1023px), (prefers-reduced-motion: reduce)', () => {
        setActive(-1)
        gsap.set(beam, { scaleY: 0 })
        const tween = gsap.to(beam, {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: list, start: 'top 70%', end: 'bottom 55%', scrub: 0.5 },
        })
        const triggers = steps.map((el, i) =>
          ScrollTrigger.create({
            trigger: el,
            start: 'top 68%',
            onEnter: () => setActive(i),
            onLeaveBack: () => setActive(i - 1),
          }),
        )
        return () => {
          tween.scrollTrigger?.kill()
          tween.kill()
          triggers.forEach((t) => t.kill())
        }
      })

      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section id="process" ref={root} className="relative scroll-mt-20" aria-labelledby="process-title">
      <div data-pin className="flex items-center py-24 lg:min-h-screen lg:py-16">
        <div className="mx-auto grid w-full max-w-[1440px] gap-14 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20 lg:px-10">
          <div className="min-w-0">
            <h2 id="process-title" className="gl-display text-[clamp(2.3rem,6vw,5.5rem)] text-[#eef1f5]">
              Как проходит
              <br />
              работа
            </h2>
            <p className="mt-6 max-w-[26rem] text-[1.05rem] leading-relaxed text-[#8c939e]">
              От одного до семи дней, в зависимости от услуги. На каждом этапе присылаем фото в Telegram.
            </p>
            <p className="mt-10 hidden items-baseline gap-3 lg:flex" aria-hidden>
              <span data-counter className="gl-display gl-chrome text-[clamp(6rem,11vw,11rem)] leading-none">
                01
              </span>
              <span className="gl-display text-[2rem] text-[#3b414a]">/{pad(STEPS.length)}</span>
            </p>
          </div>

          <ol data-list className="relative min-w-0">
            <span aria-hidden className="absolute bottom-3 left-[11px] top-3 w-px bg-[#2b2f36]" />
            <span
              aria-hidden
              data-beam
              className="absolute bottom-3 left-[10px] top-3 w-[3px] origin-top rounded-full"
              style={{
                background: 'linear-gradient(180deg, #8fb3ff, #3b7bff 60%, #2b5fd9)',
                boxShadow: '0 0 12px rgba(59,123,255,0.9), 0 0 32px rgba(59,123,255,0.5)',
              }}
            />
            {STEPS.map((s, i) => (
              <li key={s.title} data-step data-active="true" className="gl-step relative grid grid-cols-[24px_minmax(0,1fr)] gap-5 pb-10 last:pb-0 sm:gap-8 lg:pb-12">
                <span aria-hidden className="gl-step-dot relative z-10 mt-2 size-6 rounded-full border-2 border-[#3b414a] bg-[#0e0f12]" />
                <div className="min-w-0">
                  <h3 className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <span className="text-[0.95rem] font-bold text-[#8fb3ff] tabular-nums">{pad(i + 1)}</span>
                    <span className="text-[clamp(1.3rem,2.2vw,1.9rem)] font-bold leading-tight tracking-[-0.01em] text-white">{s.title}</span>
                  </h3>
                  <p className="mt-2 max-w-[34rem] text-[1rem] leading-relaxed text-[#9aa1ab]">{s.text}</p>
                  <p className="mt-2 text-[0.92rem] font-semibold text-[#d9dee5]">{s.time}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
