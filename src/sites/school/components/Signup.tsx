import { useId, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Check, Send } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { GlowButton } from './GlowButton'

const AGES = [11, 12, 13, 14, 15, 16, 17]
const INTERESTS = [
  { v: 'python', l: 'Python и Telegram-боты' },
  { v: 'unity', l: 'Игры на Unity' },
  { v: 'web', l: 'Веб-разработка' },
  { v: 'unknown', l: 'Пока не знаем, поможете выбрать' },
]

function formatPhone(raw: string) {
  let d = raw.replace(/\D/g, '')
  if (d.startsWith('8')) d = '7' + d.slice(1)
  if (!d.startsWith('7')) d = '7' + d
  d = d.slice(0, 11)
  const p = d.slice(1)
  let out = '+7'
  if (p.length) out += ' (' + p.slice(0, 3)
  if (p.length >= 3) out += ')'
  if (p.length > 3) out += ' ' + p.slice(3, 6)
  if (p.length > 6) out += '-' + p.slice(6, 8)
  if (p.length > 8) out += '-' + p.slice(8, 10)
  return out
}

type Errors = Partial<Record<'name' | 'phone' | 'age', string>>

const inputCls =
  'h-14 w-full rounded-[14px] border-2 border-[#dfe4ee] bg-[#f6f8fc] px-4 text-[1.05rem] text-[#14161f] outline-none transition-colors placeholder:text-[#8a90a2] focus:border-[#3d5afe] focus:bg-white aria-[invalid=true]:border-[#ff5a36]'

export function Signup() {
  const uid = useId()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [age, setAge] = useState<number | null>(null)
  const [interest, setInterest] = useState('python')
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)
  const doneRef = useRef<HTMLDivElement>(null)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const next: Errors = {}
    if (name.trim().length < 2) next.name = 'Напишите, как к вам обращаться'
    if (phone.replace(/\D/g, '').length !== 11) next.phone = 'Нужен номер из 10 цифр после +7'
    if (age === null) next.age = 'Выберите возраст ребёнка'
    setErrors(next)
    if (Object.keys(next).length) {
      const first = Object.keys(next)[0]
      document.getElementById(`${uid}-${first}`)?.focus()
      return
    }
    setSent(true)
    requestAnimationFrame(() => doneRef.current?.focus())
  }

  const reset = () => {
    setName('')
    setPhone('')
    setAge(null)
    setInterest('python')
    setErrors({})
    setSent(false)
  }

  return (
    <section id="zayavka" className="relative py-20 sm:py-28" aria-labelledby="zayavka-h">
      <div className="kk-wrap">
        <div className="grid gap-10 overflow-hidden rounded-[36px] bg-[#3d5afe] p-5 text-white sm:p-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-14 lg:p-14">
          <div className="min-w-0 lg:py-4">
            <h2 id="zayavka-h" className="kk-h2">
              Запишитесь на пробный урок
            </h2>
            <p className="mt-5 max-w-[30rem] text-[1.08rem] leading-relaxed text-white/80">
              Урок бесплатный и ни к чему не обязывает. Нужен только компьютер с интернетом.
            </p>
            <ol className="mt-10 grid gap-5">
              {[
                'Позвоним в течение дня и подберём удобное время.',
                'Пришлём ссылку на урок в Telegram.',
                '45 минут урока, после него расскажем, какой курс подойдёт.',
              ].map((t, i) => (
                <li key={t} className="flex items-start gap-4">
                  <span aria-hidden="true" className="kk-key kk-key--yellow h-10 w-10 shrink-0 cursor-default rounded-[11px] text-lg font-black">
                    {i + 1}
                  </span>
                  <span className="pt-1.5 text-[1.05rem] leading-snug">{t}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="min-w-0 rounded-[28px] bg-white p-5 text-[#14161f] shadow-[0_40px_80px_-30px_rgba(10,16,70,.6)] sm:p-8">
            {sent ? (
              <div ref={doneRef} tabIndex={-1} className="flex min-h-[420px] flex-col items-start justify-center gap-6 outline-none" role="status">
                <span className="kk-key kk-key--mint h-20 w-20 cursor-default rounded-[22px]" aria-hidden="true">
                  <Check size={40} strokeWidth={3} />
                </span>
                <div>
                  <p className="text-[clamp(1.8rem,1.3rem+1.6vw,2.6rem)] leading-[1] font-extrabold tracking-[-0.04em]">Записали!</p>
                  <p className="mt-3 max-w-[26rem] text-[1.1rem] leading-relaxed text-[#5b6172]">
                    Пришлём ссылку на пробный урок в Telegram. Если удобнее звонок, наберём {phone} в течение дня.
                  </p>
                </div>
                <button type="button" onClick={reset} className="kk-key h-12 rounded-[14px] px-5 text-[1rem]">
                  Записать ещё одного ребёнка
                </button>
              </div>
            ) : (
              <form noValidate onSubmit={submit} className="grid gap-6">
                <div className="grid gap-2">
                  <label htmlFor={`${uid}-name`} className="font-semibold">
                    Имя родителя
                  </label>
                  <input
                    id={`${uid}-name`}
                    className={inputCls}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    placeholder="Например, Анна"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? `${uid}-name-err` : undefined}
                  />
                  {errors.name && (
                    <p id={`${uid}-name-err`} className="text-[0.92rem] font-medium text-[#d93a17]">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <label htmlFor={`${uid}-phone`} className="font-semibold">
                    Телефон
                  </label>
                  <input
                    id={`${uid}-phone`}
                    className={inputCls}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').length ? formatPhone(e.target.value) : '')}
                    placeholder="+7 (900) 000-00-00"
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? `${uid}-phone-err` : undefined}
                  />
                  {errors.phone && (
                    <p id={`${uid}-phone-err`} className="text-[0.92rem] font-medium text-[#d93a17]">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <fieldset className="grid gap-3" aria-describedby={errors.age ? `${uid}-age-err` : undefined}>
                  <legend className="mb-3 font-semibold">Возраст ребёнка</legend>
                  <div className="flex flex-wrap gap-2.5">
                    {AGES.map((a, i) => (
                      <label key={a} className="relative">
                        <input
                          id={i === 0 ? `${uid}-age` : undefined}
                          type="radio"
                          name={`${uid}-age-r`}
                          value={a}
                          checked={age === a}
                          onChange={() => setAge(a)}
                          className="peer sr-only"
                        />
                        <span className="kk-key h-12 w-12 rounded-[12px] text-[1.05rem] sm:h-[52px] sm:w-[52px]">{a}</span>
                      </label>
                    ))}
                  </div>
                  {errors.age && (
                    <p id={`${uid}-age-err`} className="text-[0.92rem] font-medium text-[#d93a17]">
                      {errors.age}
                    </p>
                  )}
                </fieldset>

                <div className="grid gap-2">
                  <span id={`${uid}-int-l`} className="font-semibold">
                    Что интересно
                  </span>
                  <Select value={interest} onValueChange={setInterest}>
                    <SelectTrigger
                      aria-labelledby={`${uid}-int-l`}
                      className="!h-14 w-full rounded-[14px] border-2 border-[#dfe4ee] bg-[#f6f8fc] px-4 text-[1.05rem] text-[#14161f] shadow-none focus-visible:border-[#3d5afe] focus-visible:ring-0"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper" className="rounded-[14px] border-[#dfe4ee] bg-white p-1 font-['Onest_Variable',sans-serif] text-[#14161f]">
                      {INTERESTS.map((it) => (
                        <SelectItem key={it.v} value={it.v} className="rounded-[10px] py-2.5 text-[1rem]">
                          {it.l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-2">
                  <GlowButton type="submit" size="lg" magnetic={false} className="w-full [&>button]:w-full">
                    <Send size={18} aria-hidden="true" />
                    Записаться на пробный урок
                  </GlowButton>
                  <p className="mt-4 text-[0.85rem] leading-snug text-[#5b6172]">
                    Нажимая кнопку, вы соглашаетесь на обработку персональных данных. Звоним только по поводу урока.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
