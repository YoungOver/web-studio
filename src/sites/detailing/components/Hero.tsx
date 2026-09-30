import { useMemo, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ChromeCanvas, usePointerTarget } from './ChromeCanvas'
import { Magnetic } from './Magnetic'
import { hasWebGL, scrollToId, useInView } from '../lib'

const FACTS = [
  { value: '3 года', label: 'гарантия на керамику' },
  { value: 'XPEL и SunTek', label: 'плёнка от официальных дилеров' },
  { value: '4 поста', label: 'в тёплом боксе, без очереди на месяц' },
]

export function Hero() {
  const root = useRef<HTMLElement>(null)
  const inView = useInView(root, '0px', true)
  const webgl = useMemo(() => hasWebGL(), [])
  const pointer = usePointerTarget(root)

  useGSAP(
    () => {
      // the shader runs its own light sweep (2.2 s); type follows it in
      const nav = document.querySelector('[data-intro="nav"]')
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.from('[data-line]', { yPercent: 115, rotate: 2, duration: 1.4, stagger: 0.12 }, 0.35)
        .from('[data-fade]', { y: 24, autoAlpha: 0, duration: 1.1, stagger: 0.08 }, 0.95)
        .from('[data-fact]', { y: 16, autoAlpha: 0, duration: 1, stagger: 0.07 }, 1.15)
      if (nav) tl.from(nav, { y: -24, autoAlpha: 0, duration: 1 }, 0.8)
    },
    { scope: root },
  )

  return (
    <section id="top" ref={root} className="relative isolate flex min-h-[100svh] flex-col overflow-hidden" aria-labelledby="hero-title">
      <div className="absolute inset-0 -z-10" aria-hidden>
        {webgl ? (
          <ChromeCanvas active={inView} pointer={pointer} />
        ) : (
          <div className="gl-chrome-fallback absolute inset-0" />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, #0e0f12 0%, rgba(14,15,18,0.65) 14%, rgba(14,15,18,0) 40%), linear-gradient(90deg, rgba(14,15,18,0.45) 0%, rgba(14,15,18,0) 55%)',
          }}
        />
        <div className="gl-grain absolute inset-0" />
      </div>

      <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-end px-4 pb-8 pt-28 sm:px-6 lg:px-10 lg:pb-12">
        <h1 id="hero-title" className="gl-display min-w-0 text-[clamp(2.6rem,7.6vw,9rem)] [filter:drop-shadow(0_8px_40px_rgba(0,0,0,0.6))]">
          <span className="block overflow-hidden pb-[0.08em]">
            <span data-line className="gl-chrome gl-sheen inline-block">
              Блеск, который
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.08em]">
            <span data-line className="gl-chrome gl-sheen inline-block">
              держится годами
            </span>
          </span>
        </h1>

        <div className="mt-8 grid gap-10 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-end">
          <div className="min-w-0">
            <p data-fade className="max-w-[34rem] text-[1.05rem] leading-relaxed text-[#b7bdc6] sm:text-[1.15rem]">
              Полируем, покрываем керамикой и оклеиваем плёнкой в Москве. Каждую машину принимаем под светом и отдаём с фотоотчётом.
            </p>
            <div data-fade className="mt-7 flex flex-wrap items-center gap-3">
              <Magnetic>
                <a
                  href="#booking"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToId('booking')
                  }}
                  className="gl-cta h-14 px-8 text-[1.05rem]"
                >
                  Записаться на осмотр
                </a>
              </Magnetic>
              <a
                href="#film"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToId('film')
                }}
                className="gl-ghost h-14 px-7 text-[1.02rem]"
              >
                Подобрать плёнку
              </a>
            </div>
          </div>

          <ul className="grid grid-cols-1 gap-x-10 gap-y-4 border-t border-white/10 pt-5 sm:grid-cols-3 lg:border-t-0 lg:pt-0">
            {FACTS.map((f) => (
              <li data-fact key={f.value} className="min-w-0 lg:border-l lg:border-white/10 lg:pl-5">
                <p className="text-[1.15rem] font-bold text-white">{f.value}</p>
                <p className="mt-1 max-w-[15rem] text-[0.92rem] leading-snug text-[#8c939e]">{f.label}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
