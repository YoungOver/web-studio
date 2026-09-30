import { useState } from 'react'
import { Check } from 'lucide-react'
import { BorderBeam } from '@/components/magicui/border-beam'
import { GlowButton } from './GlowButton'
import { scrollToId } from '../lib/motion'

const PERIODS = [
  { id: 'm1', label: 'Месяц', months: 1, off: 0 },
  { id: 'm3', label: '3 месяца', months: 3, off: 0.1 },
  { id: 'm12', label: 'Год', months: 12, off: 0.2 },
] as const

type PeriodId = (typeof PERIODS)[number]['id']

const PLANS = [
  {
    name: 'Мини-группа',
    base: 5900,
    note: 'Основной формат для тех, кто начинает.',
    items: ['8 уроков в месяц по 90 минут', 'Группа до 6 человек', 'Проверка домашних заданий', 'Записи всех уроков'],
    featured: false,
  },
  {
    name: 'Группа и наставник',
    base: 7900,
    note: 'Когда хочется двигаться быстрее группы.',
    items: [
      'Всё из мини-группы',
      'Встреча 1-на-1 с наставником раз в неделю, 30 минут',
      'Ревью кода каждого проекта',
      'Отчёт родителям раз в месяц',
    ],
    featured: true,
  },
  {
    name: 'Индивидуально',
    base: 14900,
    note: 'Своя программа и своё расписание.',
    items: ['8 уроков 1-на-1 в месяц по 60 минут', 'Программа под цель: олимпиада, ОГЭ, свой проект', 'Перенос урока за 3 часа'],
    featured: false,
  },
]

const rub = (n: number) => `${new Intl.NumberFormat('ru-RU').format(n)} ₽`
const round10 = (n: number) => Math.round(n / 10) * 10

export function Pricing() {
  const [period, setPeriod] = useState<PeriodId>('m3')
  const per = PERIODS.find((p) => p.id === period) ?? PERIODS[0]

  return (
    <section id="ceny" className="relative py-20 sm:py-28" aria-labelledby="ceny-h">
      <div className="kk-wrap">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <h2 id="ceny-h" className="kk-h2">
              Сколько стоит
            </h2>
            <p className="kk-lead mt-5">Первый урок бесплатный. Платите помесячно или сразу за период со скидкой, неиспользованные месяцы вернём.</p>
          </div>

          <div role="radiogroup" aria-label="Период оплаты" className="flex flex-wrap gap-3 rounded-[20px] bg-[#e1e6f0] p-2.5">
            {PERIODS.map((p) => (
              <label key={p.id} className="relative">
                <input
                  type="radio"
                  name="kk-period"
                  value={p.id}
                  checked={period === p.id}
                  onChange={() => setPeriod(p.id)}
                  className="peer sr-only"
                />
                <span className="kk-key h-12 gap-2 rounded-[13px] px-4 text-[0.98rem]">
                  {p.label}
                  {p.off > 0 && (
                    <span className="rounded-md bg-[#00c389] px-1.5 py-0.5 text-[0.78rem] font-extrabold text-[#14161f]">−{p.off * 100}%</span>
                  )}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-12 grid items-stretch gap-4 lg:grid-cols-[1fr_1.12fr_1fr] lg:gap-5">
          {PLANS.map((plan) => {
            const monthly = round10(plan.base * (1 - per.off))
            const total = monthly * per.months
            return (
              <article
                key={plan.name}
                className={`relative flex min-w-0 flex-col rounded-[28px] p-6 sm:p-8 ${
                  plan.featured
                    ? 'bg-white shadow-[0_40px_80px_-36px_rgba(61,90,254,.55)] lg:-my-5 lg:py-11'
                    : 'bg-transparent ring-1 ring-[#cfd6e4]'
                }`}
              >
                {plan.featured && <BorderBeam size={180} duration={7} borderWidth={2} colorFrom="#3d5afe" colorTo="#ff5a36" />}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-[1.5rem] font-extrabold tracking-[-0.03em]">{plan.name}</h3>
                  {plan.featured && (
                    <span className="rounded-full bg-[#fff3c4] px-3 py-1 text-[0.85rem] font-semibold text-[#6b5200]">Берут чаще всего</span>
                  )}
                </div>
                <p className="mt-2 text-[0.98rem] text-[#5b6172]">{plan.note}</p>

                <div className="mt-7 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-[clamp(2.6rem,2rem+2vw,3.5rem)] leading-none font-black tracking-[-0.05em] tabular-nums">{rub(monthly)}</span>
                  <span className="text-[1rem] text-[#5b6172]">в месяц</span>
                </div>
                <p className="mt-2 min-h-[1.5rem] text-[0.93rem] text-[#5b6172]">
                  {per.off > 0 ? (
                    <>
                      <s className="mr-2">{rub(plan.base)}</s>
                      {rub(total)} за {per.months === 12 ? 'год' : '3 месяца'}
                    </>
                  ) : (
                    'Оплата каждый месяц'
                  )}
                </p>

                <ul className="mt-7 grid gap-3 border-t border-[#dfe4ee] pt-6">
                  {plan.items.map((it) => (
                    <li key={it} className="flex gap-3 text-[1rem] leading-snug">
                      <Check size={20} className={`mt-0.5 shrink-0 ${plan.featured ? 'text-[#3d5afe]' : 'text-[#00a676]'}`} aria-hidden="true" />
                      {it}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-8">
                  {plan.featured ? (
                    <GlowButton target="zayavka" className="w-full [&>a]:w-full" magnetic={false}>
                      Начать с пробного урока
                    </GlowButton>
                  ) : (
                    <a
                      href="#zayavka"
                      onClick={(e) => {
                        e.preventDefault()
                        scrollToId('zayavka')
                      }}
                      className="kk-key h-[3.25rem] w-full rounded-[16px] text-[1rem]"
                    >
                      Начать с пробного урока
                    </a>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
