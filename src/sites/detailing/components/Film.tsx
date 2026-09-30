import { useMemo, useRef, useState } from 'react'
import { CAR_CLASSES, FILMS, FILM_META, FILM_PRICE, FINISHES, type CarClass, type Finish } from '../data'
import { hasWebGL, useInView, useMedia } from '../lib'
import { FilmScene, type MaterialTarget } from './FilmScene'
import { AnimatedPrice, Segmented } from './ui'

export function Film({
  carClass,
  setCarClass,
  onBook,
}: {
  carClass: CarClass
  setCarClass: (c: CarClass) => void
  onBook: (service: string) => void
}) {
  const [finish, setFinish] = useState<Finish>('gloss')
  const [filmId, setFilmId] = useState('graphite')
  const stage = useRef<HTMLDivElement>(null)
  const inView = useInView(stage)
  const fine = useMedia('(pointer: fine)')
  const webgl = useMemo(() => hasWebGL(), [])

  const film = FILMS.find((f) => f.id === filmId) ?? FILMS[0]
  const fin = FINISHES.find((f) => f.id === finish) ?? FINISHES[0]
  const meta = FILM_META[film.kind]
  const price = FILM_PRICE[film.kind][carClass]

  const target = useMemo<MaterialTarget>(
    () => ({
      color: film.color,
      roughness: fin.roughness,
      clearcoat: fin.clearcoat,
      clearcoatRoughness: fin.clearcoatRoughness,
      metalness: film.id === 'nardo' ? fin.metalness * 0.35 : fin.metalness,
    }),
    [film, fin],
  )

  return (
    <section id="film" className="relative scroll-mt-20 py-24 lg:py-36" aria-labelledby="film-title">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-end">
          <h2 id="film-title" className="gl-display min-w-0 text-[clamp(2.3rem,6vw,5.5rem)] text-[#eef1f5]">
            Плёнка до того,
            <br />
            как её наклеят
          </h2>
          <p className="max-w-[26rem] text-[1.05rem] leading-relaxed text-[#8c939e]">
            Выберите цвет и фактуру, покрутите образец. Так же, как у нас в боксе, только без поездки.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:gap-8">
          {/* Stage */}
          <div
            ref={stage}
            className="relative isolate aspect-square min-w-0 overflow-hidden rounded-[28px] border border-[#2b2f36] sm:aspect-[4/3] lg:aspect-auto lg:min-h-[640px]"
            style={{ background: 'radial-gradient(120% 90% at 50% 10%, #1f2329 0%, #121417 55%, #0b0c0e 100%)' }}
          >
            <div
              aria-hidden
              className="gl-blob -z-10 left-1/2 top-[55%] h-[55%] w-[70%] -translate-x-1/2 -translate-y-1/2 opacity-60"
              style={{ backgroundColor: film.glow }}
            />
            {webgl ? (
              <FilmScene target={target} active={inView} interactive={fine} />
            ) : (
              <div
                aria-hidden
                className="absolute left-1/2 top-1/2 h-[42%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-[50%_60%_40%_50%] transition-colors duration-700"
                style={{
                  backgroundColor: film.color,
                  backgroundImage: 'radial-gradient(60% 40% at 45% 25%, rgba(255,255,255,0.55), transparent 70%)',
                }}
              />
            )}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-7">
              <div className="min-w-0">
                <p className="gl-display text-[clamp(1.6rem,3.4vw,2.6rem)] text-white" aria-live="polite">
                  {film.name}
                </p>
                <p className="mt-2 text-[0.95rem] text-[#aab1bb]">
                  {fin.label}. {film.note}
                </p>
              </div>
              {fine && webgl && <p className="hidden shrink-0 text-[0.85rem] text-[#8c939e] sm:block">Потяните, чтобы повернуть</p>}
            </div>
          </div>

          {/* Controls */}
          <div className="flex min-w-0 flex-col gap-8 rounded-[28px] border border-[#2b2f36] bg-[#15171b]/80 p-5 sm:p-7 lg:p-8">
            <fieldset className="min-w-0">
              <legend className="mb-3 text-[0.95rem] font-semibold text-[#d9dee5]">Фактура</legend>
              <Segmented options={FINISHES} value={finish} onChange={setFinish} label="Фактура плёнки" size="lg" />
            </fieldset>

            <fieldset className="min-w-0">
              <legend className="mb-3 text-[0.95rem] font-semibold text-[#d9dee5]">Цвет</legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" role="group" aria-label="Цвет плёнки">
                {FILMS.map((f) => {
                  const on = f.id === filmId
                  return (
                    <button
                      key={f.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setFilmId(f.id)}
                      className={`group flex min-w-0 items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition-colors ${
                        on ? 'border-[#3b7bff] bg-[#3b7bff]/10' : 'border-[#2b2f36] hover:border-[#3b414a]'
                      }`}
                    >
                      <span
                        aria-hidden
                        className="size-8 shrink-0 rounded-full"
                        style={{
                          backgroundColor: f.color,
                          backgroundImage:
                            f.kind === 'ppf'
                              ? 'radial-gradient(circle at 32% 28%, rgba(255,255,255,0.9), transparent 26%), linear-gradient(135deg, rgba(255,255,255,0.35), rgba(255,255,255,0) 60%)'
                              : 'radial-gradient(circle at 32% 28%, rgba(255,255,255,0.75), transparent 30%), radial-gradient(circle at 60% 75%, rgba(0,0,0,0.45), transparent 60%)',
                          boxShadow: on
                            ? `0 0 0 2px #0e0f12, 0 0 0 3px ${f.glow}, 0 0 18px ${f.glow}`
                            : 'inset 0 0 0 1px rgba(255,255,255,0.12)',
                        }}
                      />
                      <span className={`min-w-0 text-[0.92rem] font-semibold leading-tight ${on ? 'text-white' : 'text-[#aab1bb]'}`}>{f.name}</span>
                    </button>
                  )
                })}
              </div>
            </fieldset>

            <fieldset className="min-w-0">
              <legend className="mb-3 text-[0.95rem] font-semibold text-[#d9dee5]">Кузов</legend>
              <Segmented options={CAR_CLASSES} value={carClass} onChange={setCarClass} label="Класс автомобиля" />
            </fieldset>

            <div className="mt-auto border-t border-[#2b2f36] pt-6">
              <p className="text-[0.98rem] text-[#aab1bb]">{meta.title}</p>
              <p className="gl-display mt-2 text-[clamp(2rem,4.2vw,3.25rem)] text-white">
                от <AnimatedPrice value={price} />
              </p>
              <p className="mt-3 text-[0.92rem] leading-relaxed text-[#8c939e]">
                {meta.brand}. Работа занимает {meta.days}.
              </p>
              <button type="button" onClick={() => onBook(film.kind === 'ppf' ? 'ppf' : 'vinyl')} className="gl-cta mt-6 h-13 w-full px-6 text-[1rem] sm:w-auto">
                Записаться на оклейку
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
