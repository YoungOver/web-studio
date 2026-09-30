import { useLayoutEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, prefersReducedMotion } from '../lib/motion'

const STEPS = [
  {
    title: 'Пробный урок',
    text: '45 минут с преподавателем: ребёнок пишет маленькую программу, а вы видите, интересно ли ему. Бесплатно.',
    key: 'kk-key--blue',
  },
  {
    title: 'Мини-группа до 6 человек',
    text: 'Два урока в неделю по 90 минут. Преподаватель видит экран каждого и помогает сразу, а не после урока.',
    key: 'kk-key--mint',
  },
  {
    title: 'Проект каждые 2 месяца',
    text: 'Бот, игра или сайт, который можно отправить друзьям ссылкой. Весь код хранится на GitHub.',
    key: 'kk-key--yellow',
  },
  {
    title: 'Демо-день для родителей',
    text: 'Раз в два месяца ученики показывают проекты в прямом эфире, а родители задают вопросы.',
    key: 'kk-key--coral',
  },
]

export function Process() {
  const root = useRef<HTMLElement>(null)
  const box = useRef<HTMLDivElement>(null)
  const dots = useRef<(HTMLSpanElement | null)[]>([])
  const steps = useRef<(HTMLLIElement | null)[]>([])
  const [geo, setGeo] = useState({ w: 0, h: 0, d: '', stops: [] as number[] })

  // Build the connecting path from the real positions of the step markers
  useLayoutEffect(() => {
    const el = box.current
    if (!el) return
    const measure = () => {
      const r = el.getBoundingClientRect()
      const pts = dots.current
        .filter((d): d is HTMLSpanElement => !!d)
        .map((d) => {
          const b = d.getBoundingClientRect()
          return { x: b.left - r.left + b.width / 2, y: b.top - r.top + b.height / 2 }
        })
      if (pts.length < 2) return
      let d = `M ${pts[0].x} ${Math.max(0, pts[0].y - 70)} L ${pts[0].x} ${pts[0].y}`
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1]
        const b = pts[i]
        const dy = b.y - a.y
        const wig = Math.abs(b.x - a.x) < 4 ? (i % 2 ? 46 : -46) : 0
        d += ` C ${a.x + wig} ${a.y + dy * 0.55} ${b.x + wig} ${b.y - dy * 0.55} ${b.x} ${b.y}`
      }
      const first = pts[0].y - 70
      const last = pts[pts.length - 1].y
      const stops = pts.map((p) => (p.y - first) / Math.max(1, last - first))
      setGeo({ w: r.width, h: r.height, d, stops })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useGSAP(
    () => {
      if (!geo.d) return
      const path = root.current?.querySelector<SVGPathElement>('[data-draw]')
      if (!path) return
      const setActive = (p: number) => {
        steps.current.forEach((s, i) => {
          if (s) s.dataset.active = String(p >= geo.stops[i] - 0.02)
        })
      }
      if (prefersReducedMotion()) {
        // no scrubbing: draw the whole path once when the block enters the viewport
        gsap.fromTo(
          path,
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            duration: 1.8,
            ease: 'power2.inOut',
            scrollTrigger: { trigger: box.current, start: 'top 70%', once: true },
            onUpdate() {
              setActive(this.progress())
            },
          },
        )
        return
      }
      gsap.fromTo(
        path,
        { strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: box.current,
            start: 'top 72%',
            end: 'bottom 62%',
            scrub: 0.6,
            onUpdate: (self) => setActive(self.progress),
          },
        },
      )
    },
    { scope: root, dependencies: [geo.d], revertOnUpdate: true },
  )

  return (
    <section ref={root} id="kak" className="relative py-20 sm:py-28" aria-labelledby="kak-h">
      <div className="kk-wrap">
        <div className="max-w-[46rem]">
          <h2 id="kak-h" className="kk-h2">
            Как проходит учёба
          </h2>
          <p className="kk-lead mt-5">Четыре шага от первого урока до проекта, который не стыдно показать бабушке.</p>
        </div>

        <div ref={box} className="relative mt-14">
          {geo.d && (
            <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" width={geo.w} height={geo.h} viewBox={`0 0 ${geo.w} ${geo.h}`} aria-hidden="true">
              <defs>
                <linearGradient id="kk-path-grad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={geo.h}>
                  <stop offset="0" stopColor="#3d5afe" />
                  <stop offset="0.38" stopColor="#00c389" />
                  <stop offset="0.68" stopColor="#ffc400" />
                  <stop offset="1" stopColor="#ff5a36" />
                </linearGradient>
              </defs>
              <path d={geo.d} fill="none" stroke="#d3d9e6" strokeWidth={3} strokeDasharray="2 10" strokeLinecap="round" />
              <path
                data-draw
                d={geo.d}
                fill="none"
                stroke="url(#kk-path-grad)"
                strokeWidth={7}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="1 1"
                strokeDashoffset={1}
              />
            </svg>
          )}

          <ol className="relative grid gap-10 md:gap-12">
            {STEPS.map((s, i) => {
              const right = i % 2 === 1
              return (
                <li
                  key={s.title}
                  ref={(el) => {
                    steps.current[i] = el
                  }}
                  data-active="false"
                  className="kk-step grid grid-cols-[64px_minmax(0,1fr)] items-start gap-5 md:grid-cols-2 md:gap-0"
                >
                  <div className={`flex md:px-10 ${right ? 'md:order-2 md:justify-start' : 'md:justify-end'}`}>
                    <span
                      ref={(el) => {
                        dots.current[i] = el
                      }}
                      className={`kk-step-dot kk-key ${s.key} h-16 w-16 cursor-default rounded-[18px] text-[1.7rem] font-black md:h-20 md:w-20 md:text-[2.1rem]`}
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>
                  </div>
                  <div
                    className={`kk-step-body min-w-0 pt-1 md:pt-2 ${right ? 'md:order-1 md:pl-4 md:pr-10 md:text-right' : 'md:pr-4 md:pl-10'} ${i > 0 ? 'md:-mt-2' : ''}`}
                  >
                    <h3 className="text-[clamp(1.45rem,1.1rem+1.3vw,2.25rem)] leading-[1.05] font-extrabold tracking-[-0.035em]">
                      <span className="sr-only">Шаг {i + 1}. </span>
                      {s.title}
                    </h3>
                    <p className={`mt-3 max-w-[27rem] text-[1.02rem] leading-relaxed text-[#5b6172] ${right ? 'md:ml-auto' : ''}`}>{s.text}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
