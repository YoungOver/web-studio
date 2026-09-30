import { useEffect, useId, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { SERVICES } from '../data'

export type Preset = { service: string; n: number }

function formatPhone(raw: string) {
  let d = raw.replace(/\D/g, '')
  if (d.startsWith('8')) d = '7' + d.slice(1)
  if (!d.startsWith('7')) d = '7' + d
  d = d.slice(0, 11)
  const p = d.slice(1)
  let out = '+7'
  if (p.length > 0) out += ' (' + p.slice(0, 3)
  if (p.length > 3) out += ')'
  if (p.length > 3) out += ' ' + p.slice(3, 6)
  if (p.length > 6) out += '-' + p.slice(6, 8)
  if (p.length > 8) out += '-' + p.slice(8, 10)
  return out
}

function useDays() {
  return useMemo(() => {
    const fmt = new Intl.DateTimeFormat('ru-RU', { weekday: 'short', day: 'numeric', month: 'short' })
    const today = new Date()
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      const label = i === 0 ? 'Сегодня' : i === 1 ? 'Завтра' : fmt.format(d).replace('.', '')
      return { id: d.toISOString().slice(0, 10), label }
    })
  }, [])
}

export function Booking({ preset }: { preset: Preset | null }) {
  const days = useDays()
  const uid = useId()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [car, setCar] = useState('')
  const [service, setService] = useState('ceramic')
  const [day, setDay] = useState(days[1].id)
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  useEffect(() => {
    if (preset) setService(preset.service)
  }, [preset])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const next: typeof errors = {}
    if (name.trim().length < 2) next.name = 'Напишите, как к вам обращаться'
    if (phone.replace(/\D/g, '').length !== 11) next.phone = 'Нужен номер целиком, 10 цифр после +7'
    setErrors(next)
    if (Object.keys(next).length) {
      const first = next.name ? `${uid}-name` : `${uid}-phone`
      document.getElementById(first)?.focus()
      return
    }
    setStatus('sending')
    window.setTimeout(() => setStatus('sent'), 900)
  }

  const reset = () => {
    setName('')
    setPhone('')
    setCar('')
    setErrors({})
    setStatus('idle')
  }

  const serviceName = SERVICES.find((s) => s.id === service)?.name ?? ''
  const dayLabel = days.find((d) => d.id === day)?.label.toLowerCase() ?? ''
  const t = { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] as const }

  return (
    <section id="booking" className="relative isolate scroll-mt-20 overflow-hidden py-24 lg:py-36" aria-labelledby="booking-title">
      <div aria-hidden className="gl-blob -z-10 -left-[10%] top-[10%] h-[460px] w-[460px] bg-[#3b7bff] opacity-25" />
      <div aria-hidden className="gl-blob -z-10 right-[-8%] bottom-[5%] h-[380px] w-[520px] bg-[#8e9aac] opacity-[0.14]" />
      <div className="mx-auto grid max-w-[1440px] gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20 lg:px-10">
        <div className="min-w-0">
          <h2 id="booking-title" className="gl-display text-[clamp(2.3rem,6vw,5.5rem)]">
            <span className="gl-chrome gl-sheen">Запишитесь на осмотр</span>
          </h2>
          <p className="mt-6 max-w-[28rem] text-[1.08rem] leading-relaxed text-[#aab1bb]">
            Осмотр бесплатный и занимает 30 минут. Покажем лак под светом, замерим толщину и назовём точную цену.
          </p>
          <dl className="mt-10 grid max-w-[28rem] grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <dt className="text-[0.92rem] text-[#8c939e]">Позвонить</dt>
              <dd className="mt-1">
                <a href="tel:+74950000000" className="text-[1.25rem] font-bold text-white hover:text-[#9fc0ff]">
                  +7 (495) 000-00-00
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[0.92rem] text-[#8c939e]">Приехать</dt>
              <dd className="mt-1 text-[1.05rem] font-semibold text-[#d9dee5]">ул. Складочная, 1с4</dd>
            </div>
          </dl>
        </div>

        <div className="relative min-w-0 overflow-hidden rounded-[30px] border border-[#2b2f36] bg-[#15171b]/85 p-5 backdrop-blur-xl sm:p-8 lg:p-10">
          <AnimatePresence mode="wait" initial={false}>
            {status !== 'sent' ? (
              <motion.form key="form" onSubmit={submit} noValidate initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={t} className="grid gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="min-w-0">
                    <label htmlFor={`${uid}-name`} className="mb-2 block text-[0.92rem] font-semibold text-[#d9dee5]">
                      Имя
                    </label>
                    <input
                      id={`${uid}-name`}
                      className="gl-field"
                      autoComplete="given-name"
                      placeholder="Как к вам обращаться"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? `${uid}-name-err` : undefined}
                    />
                    {errors.name && (
                      <p id={`${uid}-name-err`} className="mt-2 text-[0.88rem] text-[#ff8a8a]">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div className="min-w-0">
                    <label htmlFor={`${uid}-phone`} className="mb-2 block text-[0.92rem] font-semibold text-[#d9dee5]">
                      Телефон
                    </label>
                    <input
                      id={`${uid}-phone`}
                      className="gl-field tabular-nums"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="+7 (___) ___-__-__"
                      value={phone}
                      onChange={(e) => setPhone(/\d/.test(e.target.value) ? formatPhone(e.target.value) : '')}
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? `${uid}-phone-err` : undefined}
                    />
                    {errors.phone && (
                      <p id={`${uid}-phone-err`} className="mt-2 text-[0.88rem] text-[#ff8a8a]">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="min-w-0">
                    <label htmlFor={`${uid}-car`} className="mb-2 block text-[0.92rem] font-semibold text-[#d9dee5]">
                      Автомобиль
                    </label>
                    <input id={`${uid}-car`} className="gl-field" placeholder="Например, BMW X5 2023" value={car} onChange={(e) => setCar(e.target.value)} />
                  </div>
                  <div className="min-w-0">
                    <label htmlFor={`${uid}-service`} className="mb-2 block text-[0.92rem] font-semibold text-[#d9dee5]">
                      Услуга
                    </label>
                    <select id={`${uid}-service`} className="gl-field" value={service} onChange={(e) => setService(e.target.value)}>
                      {SERVICES.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                      <option value="unsure">Пока не знаю, нужен совет</option>
                    </select>
                  </div>
                </div>

                <fieldset className="min-w-0">
                  <legend className="mb-3 text-[0.92rem] font-semibold text-[#d9dee5]">Удобный день</legend>
                  <div className="flex flex-wrap gap-2">
                    {days.map((d) => (
                      <button key={d.id} type="button" className="gl-chip" aria-pressed={day === d.id} onClick={() => setDay(d.id)}>
                        {d.label}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-[20rem] text-[0.88rem] leading-snug text-[#8c939e]">Перезвоним, чтобы подтвердить время. Номер никуда не передаём.</p>
                  <button type="submit" disabled={status === 'sending'} className="gl-cta h-14 shrink-0 px-8 text-[1.02rem]">
                    {status === 'sending' ? 'Отправляем…' : 'Отправить заявку'}
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={t}
                className="flex min-h-[420px] flex-col items-start justify-center"
                role="status"
              >
                <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden className="drop-shadow-[0_0_24px_rgba(59,123,255,0.8)]">
                  <circle cx="32" cy="32" r="30" fill="#3b7bff" />
                  <motion.path
                    d="M20 33 L28.5 41 L44 24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
                  />
                </svg>
                <p className="gl-display mt-8 text-[clamp(1.8rem,3.4vw,2.8rem)] text-white">Заявка отправлена, перезвоним за 15 минут</p>
                <p className="mt-4 max-w-[30rem] text-[1.02rem] leading-relaxed text-[#aab1bb]">
                  {name.trim()}, мы записали: {serviceName ? serviceName.toLowerCase() : 'консультация'}
                  {car.trim() ? `, ${car.trim()}` : ''}, {dayLabel}. Если удобнее написать, ответим в Telegram.
                </p>
                <button type="button" onClick={reset} className="gl-ghost mt-8 h-12 px-6 text-[0.98rem]">
                  Отправить ещё одну заявку
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
