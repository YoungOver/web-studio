import { lazy, Suspense, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { NumberTicker } from '@/components/magicui/number-ticker'
import { GlowButton } from './GlowButton'
import { gsap, scrollToId } from '../lib/motion'

const KeycapStage = lazy(() => import('./KeycapScene'))

const LINES = ['Подростки', 'пишут код,', 'который', 'работает']

export function Hero() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
      tl.from('[data-line]', { yPercent: 110, duration: 1.1, stagger: 0.09 }, 0.25)
        .from('[data-rise]', { y: 18, opacity: 0, duration: 0.8, stagger: 0.08 }, 0.75)
    },
    { scope: root },
  )

  return (
    <section ref={root} id="top" className="relative overflow-hidden pt-[88px] pb-14 sm:pb-20 lg:pt-[96px]">
      {/* soft studio light behind the keys */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[-10%] right-[-20%] h-[900px] w-[900px] rounded-full opacity-90 max-lg:top-[-8%] max-lg:right-[-60%] max-lg:h-[640px] max-lg:w-[640px]"
        style={{ background: 'radial-gradient(closest-side, #ffffff 0%, rgba(255,255,255,.7) 40%, rgba(238,241,247,0) 100%)' }}
      />

      <div className="kk-wrap relative grid items-center gap-2 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,1fr)] lg:gap-6">
        <div className="relative order-1 h-[clamp(250px,72vw,420px)] lg:order-2 lg:-mr-14 lg:h-[660px]">
          <Suspense fallback={null}>
            <KeycapStage />
          </Suspense>
          <p className="pointer-events-none absolute right-2 bottom-1 hidden rounded-full bg-white/80 px-3 py-1.5 text-[0.82rem] font-medium text-[#5b6172] shadow-[0_6px_16px_-10px_rgba(20,22,31,.4)] backdrop-blur lg:block">
            Клавиши нажимаются
          </p>
        </div>

        <div className="relative order-2 min-w-0 lg:order-1 lg:pb-6">
          <h1 className="kk-display text-[clamp(2.8rem,1.3rem+5.4vw,6rem)]">
            {LINES.map((l, i) => (
              <span key={l} className="block overflow-hidden pb-[0.06em]">
                <span data-line className="block">
                  {l}
                  {i === LINES.length - 1 && <span className="kk-caret" aria-hidden="true" />}
                </span>
              </span>
            ))}
          </h1>

          <p data-rise className="kk-lead mt-6">
            Python, игры на Unity и сайты для ребят 11–17 лет. Занимаемся онлайн в мини-группах до 6 человек, первый
            готовый проект появляется через месяц.
          </p>

          <div data-rise className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-4">
            <GlowButton target="zayavka" size="lg">
              Пробный урок бесплатно
            </GlowButton>
            <a
              href="#kursy"
              onClick={(e) => {
                e.preventDefault()
                scrollToId('kursy')
              }}
              className="rounded-lg px-1 text-[1.02rem] font-semibold text-[#14161f] underline decoration-[#3d5afe] decoration-2 underline-offset-[6px] hover:decoration-[3px]"
            >
              Посмотреть курсы
            </a>
          </div>
          <p data-rise className="mt-4 text-[0.92rem] text-[#5b6172]">
            45 минут с преподавателем. Карта не нужна.
          </p>

          <dl data-rise className="mt-10 grid max-w-[34rem] grid-cols-3 gap-3 border-t border-[#d9deea] pt-6">
            <div className="min-w-0">
              <dt className="sr-only">Учеников</dt>
              <dd className="text-[clamp(1.5rem,1.1rem+1.4vw,2.2rem)] font-extrabold tracking-[-0.04em]">
                <NumberTicker value={1240} className="tracking-[-0.04em] text-[#14161f]" />
              </dd>
              <dd className="mt-1 text-[0.88rem] leading-snug text-[#5b6172]">учеников сейчас</dd>
            </div>
            <div className="min-w-0">
              <dt className="sr-only">Средняя оценка</dt>
              <dd className="text-[clamp(1.5rem,1.1rem+1.4vw,2.2rem)] font-extrabold tracking-[-0.04em]">
                <NumberTicker value={4.9} startValue={3} decimalPlaces={1} className="tracking-[-0.04em] text-[#14161f]" />
              </dd>
              <dd className="mt-1 text-[0.88rem] leading-snug text-[#5b6172]">средняя оценка уроков</dd>
            </div>
            <div className="min-w-0">
              <dt className="sr-only">Проектов</dt>
              <dd className="text-[clamp(1.5rem,1.1rem+1.4vw,2.2rem)] font-extrabold tracking-[-0.04em]">
                <NumberTicker value={3800} className="tracking-[-0.04em] text-[#14161f]" />
              </dd>
              <dd className="mt-1 text-[0.88rem] leading-snug text-[#5b6172]">проектов в портфолио</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}
