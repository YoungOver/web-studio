import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Check, Minus, Plus } from 'lucide-react'
import { NumberTicker } from '@/components/magicui/number-ticker'
import { ROOM_SEATS, STANDARD_SEATS, VIP_SEATS, ZONE_BY_ID } from '../data'
import type { Seat } from '../data'
import { scrollToId } from '../hooks'

type Tip = { seat: Seat; x: number; y: number }
type Mode = 'hours' | 'night'

const STARTS = ['18:00', '20:00', '22:00', '00:00']

function addHours(start: string, h: number) {
  const [hh, mm] = start.split(':').map(Number)
  return `${String((hh + h) % 24).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
}

function digits(s: string) {
  return s.replace(/\D/g, '')
}

export function SeatMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [tip, setTip] = useState<Tip | null>(null)
  const [selected, setSelected] = useState<Seat | null>(null)
  const [mine, setMine] = useState<string[]>([])
  const [mode, setMode] = useState<Mode>('hours')
  const [hours, setHours] = useState(3)
  const [start, setStart] = useState('22:00')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<{ seat: string; time: string } | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const panelRef = useRef<HTMLElement>(null)
  const [panelInView, setPanelInView] = useState(false)

  useEffect(() => {
    const el = panelRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setPanelInView(e.isIntersecting), { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 6000)
    return () => window.clearTimeout(t)
  }, [toast])

  const zone = selected ? ZONE_BY_ID[selected.zone] : null
  const total = zone ? (mode === 'night' ? zone.nightPrice : zone.price * hours) : 0
  const startTime = mode === 'night' ? '22:00' : start
  const endTime = mode === 'night' ? '08:00' : addHours(start, hours)

  const stateOf = (s: Seat) => {
    if (mine.includes(s.id)) return 'mine'
    if (selected?.id === s.id) return 'selected'
    return s.busy ? 'busy' : 'free'
  }

  const showTip = (seat: Seat, el: HTMLElement) => {
    const box = mapRef.current?.getBoundingClientRect()
    const r = el.getBoundingClientRect()
    if (!box) return
    const half = 96
    const x = Math.min(Math.max(r.left - box.left + r.width / 2, half), box.width - half)
    setTip({ seat, x, y: r.top - box.top })
  }

  const pick = (seat: Seat) => {
    if (seat.busy || mine.includes(seat.id)) return
    setSelected((cur) => (cur?.id === seat.id ? null : seat))
    setDone(null)
    setError(null)
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!selected) return
    const d = digits(phone)
    const ok = d.length === 10 || (d.length === 11 && (d.startsWith('7') || d.startsWith('8')))
    if (!ok) {
      setError('Введите номер целиком: +7 и ещё 10 цифр')
      return
    }
    setError(null)
    setMine((m) => [...m, selected.id])
    setDone({ seat: selected.id, time: startTime })
    setToast(`Бронь на ${selected.id} отправлена, ждём в ${startTime}`)
    setSelected(null)
  }

  const seatButton = (s: Seat, extra = '') => {
    const state = stateOf(s)
    const z = ZONE_BY_ID[s.zone]
    const label =
      state === 'busy'
        ? `Место ${s.id}, занято до ${s.until}`
        : state === 'mine'
          ? `Место ${s.id}, ваша бронь`
          : `Место ${s.id}, свободно, ${z.price} ₽ в час`
    return (
      <button
        key={s.id}
        type="button"
        data-state={state}
        aria-label={label}
        aria-pressed={state === 'selected'}
        aria-disabled={state === 'busy' || state === 'mine'}
        onClick={() => pick(s)}
        onPointerEnter={(e) => showTip(s, e.currentTarget)}
        onPointerLeave={() => setTip(null)}
        onFocus={(e) => showTip(s, e.currentTarget)}
        onBlur={() => setTip(null)}
        className={`rs-seat ${extra}`}
      >
        {s.id}
      </button>
    )
  }

  const rows = useMemo(() => Array.from({ length: 5 }, (_, r) => STANDARD_SEATS.slice(r * 6, r * 6 + 6)), [])

  return (
    <section id="seats" aria-labelledby="seats-title" className="relative px-4 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <h2 id="seats-title" className="rs-display text-[clamp(2.75rem,7.5vw,7.5rem)]">
            Выбери место
          </h2>
          <p className="max-w-sm text-[#9A93B5] lg:pb-3 lg:text-right">
            Схема показывает загрузку прямо сейчас. Жёлтые места свободны, бронь держим 20 минут.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_400px]">
          {/* Map */}
          <div ref={mapRef} className="relative min-w-0 rounded-[28px] border border-[#2A2342] bg-[#0d0a17]/80 p-4 backdrop-blur-sm sm:p-7">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#9A93B5]" aria-label="Обозначения">
              <li className="flex items-center gap-2">
                <span className="size-3.5 rounded-[4px] border-[1.5px] border-[#FFE14D] bg-[#FFE14D]/15" aria-hidden /> Свободно
              </li>
              <li className="flex items-center gap-2">
                <span className="size-3.5 rounded-[4px] border border-[#2A2342] bg-[repeating-linear-gradient(135deg,#2A2342_0_2px,#120E1F_2px_4px)]" aria-hidden /> Занято
              </li>
              <li className="flex items-center gap-2">
                <span className="size-3.5 rounded-[4px] bg-[#FF2BD6]" aria-hidden /> Выбрано
              </li>
              {mine.length > 0 && (
                <li className="flex items-center gap-2">
                  <span className="size-3.5 rounded-[4px] bg-[#22E7FF]" aria-hidden /> Ваша бронь
                </li>
              )}
            </ul>

            <div className="mt-7 grid gap-8 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] md:gap-10 lg:grid-cols-1 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
              {/* Standard hall */}
              <div className="min-w-0">
                <div className="mb-4 flex items-baseline justify-between gap-3">
                  <h3 className="rs-display text-lg">Общий зал</h3>
                  <span className="text-sm text-[#9A93B5]">Standard, 150 ₽/ч</span>
                </div>
                <div className="grid gap-2.5" role="group" aria-label="Общий зал, места A01–A30">
                  {rows.map((row, r) => (
                    <div key={r} className="flex gap-1.5 sm:gap-2">
                      <div className="grid flex-1 grid-cols-3 gap-1.5 sm:gap-2">{row.slice(0, 3).map((s) => seatButton(s))}</div>
                      <div className="w-3 shrink-0 sm:w-6" aria-hidden />
                      <div className="grid flex-1 grid-cols-3 gap-1.5 sm:gap-2">{row.slice(3).map((s) => seatButton(s))}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-3 text-xs text-[#9A93B5]" aria-hidden>
                  <span className="h-px flex-1 bg-[#2A2342]" />
                  вход и бар
                  <span className="h-px flex-1 bg-[#2A2342]" />
                </div>
              </div>

              <div className="flex min-w-0 flex-col gap-8">
                {/* VIP */}
                <div className="rounded-2xl border border-[#FF2BD6]/35 bg-[#FF2BD6]/[0.04] p-4">
                  <div className="mb-4 flex items-baseline justify-between gap-3">
                    <h3 className="rs-display text-lg">VIP 5×5</h3>
                    <span className="text-sm text-[#9A93B5]">250 ₽/ч</span>
                  </div>
                  <div role="group" aria-label="VIP-комната, места B01–B10" className="grid gap-2">
                    <div className="grid grid-cols-5 gap-1.5 sm:gap-2">{VIP_SEATS.slice(0, 5).map((s) => seatButton(s))}</div>
                    <div className="h-3 rounded-full bg-[#FF2BD6]/25 shadow-[0_0_16px_rgba(255,43,214,0.45)]" aria-hidden />
                    <div className="grid grid-cols-5 gap-1.5 sm:gap-2">{VIP_SEATS.slice(5).map((s) => seatButton(s))}</div>
                  </div>
                </div>

                {/* Rooms */}
                <div>
                  <div className="mb-4 flex items-baseline justify-between gap-3">
                    <h3 className="rs-display text-lg">Комнаты целиком</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5" role="group" aria-label="Комнаты">
                    {ROOM_SEATS.map((s) => {
                      const z = ZONE_BY_ID[s.zone]
                      return (
                        <div key={s.id} className="flex min-w-0 flex-col gap-2">
                          {seatButton(s, '!aspect-[16/10] !rounded-2xl !text-sm')}
                          <span className="truncate text-xs text-[#9A93B5]">
                            {z.name}, {z.price} ₽/ч
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {tip && (
              <div
                role="tooltip"
                className="pointer-events-none absolute z-20 w-max max-w-[192px] -translate-x-1/2 -translate-y-full rounded-xl border border-[#2A2342] bg-[#1a1430] px-3 py-2 text-[0.8rem] leading-snug shadow-[0_12px_40px_-10px_rgba(0,0,0,0.9)]"
                style={{ left: tip.x, top: tip.y - 8 }}
              >
                <b className="font-semibold">{tip.seat.id}</b>{' '}
                {mine.includes(tip.seat.id) ? (
                  <span className="text-[#22E7FF]">ваша бронь</span>
                ) : tip.seat.busy ? (
                  <span className="text-[#9A93B5]">занято до {tip.seat.until}</span>
                ) : (
                  <span className="text-[#FFE14D]">свободно, {ZONE_BY_ID[tip.seat.zone].price} ₽/ч</span>
                )}
              </div>
            )}
          </div>

          {/* Booking panel */}
          <aside
            ref={panelRef}
            id="booking-panel"
            aria-label="Бронирование"
            className="relative min-w-0 self-start rounded-[28px] border border-[#2A2342] bg-[#120E1F]/90 p-6 backdrop-blur-sm sm:p-8 lg:sticky lg:top-24"
          >
            {done && !selected ? (
              <div className="flex flex-col gap-5" aria-live="polite">
                <span className="flex size-14 items-center justify-center rounded-full bg-[#22E7FF] text-[#06050A] shadow-[0_0_40px_rgba(34,231,255,0.6)]">
                  <Check className="size-7" strokeWidth={3} />
                </span>
                <p className="rs-display text-[1.9rem] leading-[1.05]">
                  Бронь на {done.seat} отправлена, ждём в {done.time}
                </p>
                <p className="text-[#9A93B5]">Администратор позвонит в течение пяти минут, чтобы подтвердить. Оплата на месте.</p>
                <button type="button" onClick={() => setDone(null)} className="rs-ghost h-12 px-5">
                  Выбрать ещё место
                </button>
              </div>
            ) : !selected || !zone ? (
              <div className="flex min-h-[320px] flex-col justify-between gap-6">
                <div>
                  <p className="rs-display text-[1.9rem] leading-[1.05]">Нажмите на жёлтое место на схеме</p>
                  <p className="mt-4 text-[#9A93B5]">
                    Здесь появится цена и выбор времени. Для компании больше пяти человек удобнее забронировать VIP-комнату целиком по телефону.
                  </p>
                </div>
                <a href="tel:+78120000000" className="text-lg font-medium text-[#EDEAF6] underline decoration-[#FF2BD6] decoration-2 underline-offset-4">
                  +7 (812) 000-00-00
                </a>
              </div>
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-6" noValidate>
                <div>
                  <p className="rs-display text-[clamp(2.6rem,4vw,3.4rem)]">Место {selected.id}</p>
                  <p className="mt-2 text-[#9A93B5]">
                    {zone.name}, {zone.price} {zone.unit}
                  </p>
                </div>

                <div role="radiogroup" aria-label="Тариф" className="grid grid-cols-2 gap-1 rounded-full border border-[#2A2342] bg-[#06050A]/60 p-1">
                  {(
                    [
                      ['hours', 'По часам'],
                      ['night', 'Ночь 22–08'],
                    ] as const
                  ).map(([m, label]) => (
                    <button
                      key={m}
                      type="button"
                      role="radio"
                      aria-checked={mode === m}
                      onClick={() => setMode(m)}
                      className={`h-11 rounded-full text-sm font-medium transition-colors ${
                        mode === m ? 'bg-[#EDEAF6] text-[#06050A]' : 'text-[#9A93B5] hover:text-white'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {mode === 'hours' ? (
                  <>
                    <div className="flex items-center justify-between gap-4">
                      <span id="rs-hours-label" className="text-[#9A93B5]">
                        Сколько играть
                      </span>
                      <div className="flex items-center gap-2" role="group" aria-labelledby="rs-hours-label">
                        <button
                          type="button"
                          aria-label="Меньше на час"
                          onClick={() => setHours((h) => Math.max(1, h - 1))}
                          disabled={hours <= 1}
                          className="rs-ghost size-11 disabled:opacity-40"
                        >
                          <Minus className="size-4" />
                        </button>
                        <output aria-live="polite" className="rs-display w-[4.5rem] text-center text-xl">
                          {hours} ч
                        </output>
                        <button
                          type="button"
                          aria-label="Больше на час"
                          onClick={() => setHours((h) => Math.min(12, h + 1))}
                          disabled={hours >= 12}
                          className="rs-ghost size-11 disabled:opacity-40"
                        >
                          <Plus className="size-4" />
                        </button>
                      </div>
                    </div>
                    <fieldset>
                      <legend className="mb-3 text-[#9A93B5]">Начало</legend>
                      <div className="grid grid-cols-4 gap-1.5">
                        {STARTS.map((t) => (
                          <button
                            key={t}
                            type="button"
                            aria-pressed={start === t}
                            onClick={() => setStart(t)}
                            className={`h-11 rounded-xl border text-sm tabular-nums transition-colors ${
                              start === t
                                ? 'border-[#FF2BD6] bg-[#FF2BD6]/15 text-white'
                                : 'border-[#2A2342] text-[#9A93B5] hover:border-[#9A93B5]/50 hover:text-white'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </fieldset>
                  </>
                ) : (
                  <p className="rounded-2xl border border-[#2A2342] bg-[#06050A]/40 p-4 text-[0.95rem] leading-relaxed text-[#9A93B5]">
                    Десять часов с 22:00 до 08:00 по цене {zone.nightPrice} ₽. После 22:00 вход только с 18 лет.
                  </p>
                )}

                <div>
                  <label htmlFor="rs-phone" className="mb-2 block text-[#9A93B5]">
                    Телефон для подтверждения
                  </label>
                  <input
                    id="rs-phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="+7 900 000-00-00"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    aria-invalid={!!error}
                    aria-describedby={error ? 'rs-phone-error' : undefined}
                    className="h-12 w-full rounded-xl border border-[#2A2342] bg-[#06050A]/70 px-4 text-base text-white placeholder:text-[#9A93B5]/60 focus:border-[#22E7FF] focus:outline-none"
                  />
                  {error && (
                    <p id="rs-phone-error" className="mt-2 text-sm text-[#FF7BE6]">
                      {error}
                    </p>
                  )}
                </div>

                <div className="flex items-end justify-between gap-4 border-t border-[#2A2342] pt-5">
                  <div>
                    <p className="text-sm text-[#9A93B5]">
                      С {startTime} до {endTime}
                    </p>
                    <p className="rs-display mt-1 text-[2.4rem] leading-none">
                      <NumberTicker value={total} style={{ color: '#EDEAF6', letterSpacing: '-0.035em' }} /> ₽
                    </p>
                  </div>
                </div>

                <button type="submit" className="rs-cta h-14 w-full text-base">
                  Забронировать
                </button>
              </form>
            )}
          </aside>
        </div>
      </div>

      {/* Mobile quick bar */}
      {selected && zone && !panelInView && (
        <div className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-between gap-3 rounded-full border border-[#2A2342] bg-[#120E1F]/90 py-2 pr-2 pl-5 backdrop-blur-xl lg:hidden">
          <span className="min-w-0 truncate text-sm">
            <b className="font-semibold">{selected.id}</b> <span className="text-[#9A93B5]">за {total} ₽</span>
          </span>
          <button type="button" onClick={() => scrollToId('booking-panel')} className="rs-cta h-11 shrink-0 px-5 text-sm">
            Оформить
          </button>
        </div>
      )}

      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[70] flex justify-center px-4">
        {toast && (
          <div className="flex max-w-md items-center gap-3 rounded-full border border-[#22E7FF]/40 bg-[#0c1a22]/95 px-5 py-3 text-sm shadow-[0_0_40px_-8px_rgba(34,231,255,0.6)] backdrop-blur-xl">
            <Check className="size-4 shrink-0 text-[#22E7FF]" strokeWidth={3} />
            {toast}
          </div>
        )}
      </div>
    </section>
  )
}
