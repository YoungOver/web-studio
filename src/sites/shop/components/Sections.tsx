import { motion } from 'motion/react'
import { ArrowRight, Box, CreditCard, Mail, MapPin, RefreshCcw, Star } from 'lucide-react'
import { REVIEWS } from '../data'
import { Sprig } from './Header'

const ease = [0.2, 0.8, 0.2, 1] as const
const reveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.9, ease },
}

const INGREDIENTS = [
  'Гидролат крымской лаванды',
  'Бакучиол 1 %',
  'Сквалан из оливок',
  'Масло шиповника холодного отжима',
  'Ниацинамид 4 %',
  'Коллоидный овёс',
  'Масло кедрового ореха',
  'Церамиды NP и AP',
]

export function IngredientStrip() {
  const row = (
    <div className="flex shrink-0 items-center">
      {INGREDIENTS.map((t) => (
        <span key={t} className="flex items-center">
          <span className="lv-serif px-7 text-[clamp(1.4rem,2.4vw,2.2rem)] whitespace-nowrap italic">{t}</span>
          <Sprig className="h-7 w-5 text-[var(--lav)]" />
        </span>
      ))}
    </div>
  )
  return (
    <div className="relative border-y border-[var(--line)] py-6" aria-label="Ключевые ингредиенты">
      <div className="lv-marquee flex w-max">
        {row}
        {row}
      </div>
    </div>
  )
}

const PRINCIPLES = [
  { n: '01', t: 'Проценты на этикетке', d: 'Пишем концентрацию каждого актива. Если бакучиола 1 %, так и напишем, а не «с экстрактом».' },
  { n: '02', t: 'Малые партии', d: 'Варим по 300 флаконов раз в две недели. Ни одно средство не лежит на складе дольше месяца.' },
  { n: '03', t: 'Стекло и возврат', d: 'Флаконы из стекла, пипетки без пластика. Сдайте пустой флакон курьеру — получите 10 % скидки.' },
]

export function Principles() {
  return (
    <section className="mx-auto grid max-w-[1440px] gap-10 px-4 pt-24 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:pt-32">
      <motion.h2 {...reveal} className="lv-serif text-[clamp(2.2rem,4.2vw,3.8rem)] leading-[1.02] tracking-[-0.025em]">
        Косметика, в которой <em className="text-[var(--olive)]">нечего прятать</em>
      </motion.h2>
      <div className="grid gap-8 sm:grid-cols-3 sm:gap-6">
        {PRINCIPLES.map((p, i) => (
          <motion.div key={p.n} {...reveal} transition={{ ...reveal.transition, delay: i * 0.08 }} className="border-t border-[var(--ink)] pt-4">
            <span className="lv-num text-[0.875rem] text-[var(--lav)]">{p.n}</span>
            <p className="mt-3 text-[1.1rem] font-semibold">{p.t}</p>
            <p className="mt-2 text-[0.92rem] leading-relaxed text-[var(--muted)]">{p.d}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

const DIST = [
  { s: 5, v: 86 },
  { s: 4, v: 10 },
  { s: 3, v: 3 },
  { s: 2, v: 1 },
  { s: 1, v: 0 },
]

export function Reviews() {
  return (
    <section id="reviews" className="mx-auto max-w-[1440px] px-4 py-20 sm:px-8 lg:py-28">
      <div className="grid gap-12 lg:grid-cols-[0.75fr_2fr]">
        <motion.div {...reveal} className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-[0.9rem] text-[var(--muted)]">Отзывы</p>
          <p className="lv-num mt-4 text-[5.5rem] leading-[0.85] tracking-[-0.04em]">4,9</p>
          <div className="mt-3 flex gap-0.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} className="size-4 fill-[var(--ink)] text-[var(--ink)]" />
            ))}
          </div>
          <p className="mt-2 text-[0.9rem] text-[var(--muted)]">2 140 отзывов с фото и без, только от покупателей</p>
          <div className="mt-6 space-y-2">
            {DIST.map((d) => (
              <div key={d.s} className="flex items-center gap-3 text-[0.8125rem]">
                <span className="lv-num w-3">{d.s}</span>
                <span className="h-1 flex-1 overflow-hidden rounded-full bg-[rgba(30,30,28,0.09)]">
                  <motion.span
                    className="block h-full rounded-full bg-[var(--olive)]"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${d.v}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, ease, delay: 0.2 }}
                  />
                </span>
                <span className="lv-num w-8 text-right text-[var(--muted)]">{d.v} %</span>
              </div>
            ))}
          </div>
        </motion.div>
        <div className="columns-1 gap-4 sm:columns-2 xl:columns-3">
          {REVIEWS.map((r, i) => (
            <motion.figure
              key={r.name}
              {...reveal}
              transition={{ ...reveal.transition, delay: (i % 3) * 0.06 }}
              className="mb-4 break-inside-avoid rounded-[22px] bg-[var(--paper)] p-6 shadow-[0_1px_0_rgba(30,30,28,0.04)]"
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-0.5">
                  {[0, 1, 2, 3, 4].map((k) => (
                    <Star key={k} className={`size-3.5 text-[var(--ink)] ${k < r.rating ? 'fill-[var(--ink)]' : 'fill-transparent opacity-40'}`} />
                  ))}
                </div>
                <span className="text-[0.78rem] text-[var(--muted)]">{r.date}</span>
              </div>
              <blockquote className="mt-4 text-[0.98rem] leading-[1.65]">{r.text}</blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-[var(--line)] pt-4">
                <span className="lv-serif grid size-10 place-items-center rounded-full bg-[var(--lav-soft)] text-[1.1rem] text-[var(--olive)]">{r.name[0]}</span>
                <span className="text-[0.84rem] leading-snug">
                  <span className="font-semibold">
                    {r.name}, {r.city}
                  </span>
                  <span className="block text-[var(--muted)]">
                    Кожа {r.skin} · {r.product}
                  </span>
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}

const DELIVERY = [
  { icon: Box, t: 'СДЭК', d: 'Пункты выдачи и курьер по всей России. 2–5 дней, от 290 ₽, бесплатно от 3 500 ₽.' },
  { icon: Mail, t: 'Почта России', d: 'Доходит даже в маленькие города. 5–10 дней, от 250 ₽, трек-номер сразу после отправки.' },
  { icon: MapPin, t: 'Самовывоз в Симферополе', d: 'Мастерская на Пушкина, 12. Можно понюхать и попробовать всё вживую.' },
]

export function Delivery() {
  return (
    <section id="delivery" className="mx-auto max-w-[1440px] px-4 sm:px-8">
      <div className="grid gap-4 rounded-[28px] bg-[var(--stone-2)] p-6 sm:rounded-[36px] sm:p-10 lg:grid-cols-[1fr_1.6fr] lg:gap-12 lg:p-14">
        <div>
          <p className="text-[0.9rem] text-[var(--muted)]">Доставка и оплата</p>
          <h2 className="lv-serif mt-3 text-[clamp(2rem,3.6vw,3.2rem)] leading-[1.02] tracking-[-0.02em]">Отправляем на следующий день после заказа</h2>
          <div className="mt-8 rounded-2xl bg-[var(--paper)] p-5">
            <p className="flex items-center gap-2 font-semibold">
              <CreditCard className="size-4 text-[var(--olive)]" strokeWidth={1.7} /> Оплата через ЮKassa
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {['Банковская карта', 'СБП', 'SberPay', 'Т-Pay', '«Долями» — 4 платежа'].map((m) => (
                <span key={m} className="rounded-full border border-[var(--line)] px-3 py-1.5 text-[0.8rem]">
                  {m}
                </span>
              ))}
            </div>
            <p className="mt-3 text-[0.84rem] leading-relaxed text-[var(--muted)]">Чек придёт на почту по 54-ФЗ. Данные карты не хранятся на нашем сайте.</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3 lg:gap-4">
          {DELIVERY.map((d, i) => (
            <motion.div key={d.t} {...reveal} transition={{ ...reveal.transition, delay: i * 0.08 }} className="flex flex-col rounded-2xl bg-[var(--paper)] p-5 sm:min-h-[260px]">
              <span className="grid size-11 place-items-center rounded-full bg-[var(--stone)]">
                <d.icon className="size-5 text-[var(--olive)]" strokeWidth={1.5} />
              </span>
              <p className="mt-6 text-[1.1rem] font-semibold sm:mt-10">{d.t}</p>
              <p className="mt-2 text-[0.88rem] leading-relaxed text-[var(--muted)]">{d.d}</p>
            </motion.div>
          ))}
          <div className="flex items-center gap-4 rounded-2xl border border-dashed border-[rgba(30,30,28,0.22)] p-5 sm:col-span-3">
            <RefreshCcw className="size-5 shrink-0 text-[var(--lav)]" strokeWidth={1.6} />
            <p className="text-[0.9rem] leading-relaxed">
              <b className="font-semibold">Возврат флаконов.</b> <span className="text-[var(--muted)]">Отдайте пустые флаконы курьеру СДЭК при следующем заказе — вернём 10 % от его суммы баллами.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="mt-20 bg-[var(--ink)] text-[#d9d5cc] lg:mt-28">
      <div className="mx-auto max-w-[1440px] px-4 pt-16 pb-8 sm:px-8 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <p className="lv-serif max-w-[22rem] text-[2rem] leading-[1.1] text-[#f1ede5]">Письмо раз в месяц: новые партии и честные советы по уходу</p>
            <form className="mt-6 flex max-w-[26rem] gap-2" onSubmit={(e) => e.preventDefault()}>
              <label className="flex-1">
                <span className="sr-only">Электронная почта</span>
                <input type="email" placeholder="Ваша почта" className="h-12 w-full rounded-full border border-white/15 bg-transparent px-5 text-[0.9rem] text-white outline-none placeholder:text-white/40 focus:border-[var(--lav-2)]" />
              </label>
              <button className="lv-btn h-12 bg-[#ede8e1] px-5 text-[var(--ink)] hover:bg-white" aria-label="Подписаться">
                <ArrowRight className="size-4" />
              </button>
            </form>
            <p className="mt-3 text-[0.8rem] text-white/45">Скидка 7 % на первый заказ после подписки</p>
          </div>
          {[
            { t: 'Магазин', l: ['Лицо', 'Тело', 'Волосы', 'Наборы', 'Подарочные сертификаты'] },
            { t: 'Покупателям', l: ['Доставка и оплата', 'Возврат флаконов', 'Подбор ухода', 'Вопросы и ответы'] },
            { t: 'Мастерская', l: ['О нас', 'Как мы варим', 'Сотрудничество', '+7 800 555-19-71'] },
          ].map((c) => (
            <div key={c.t}>
              <p className="text-[0.84rem] text-white/45">{c.t}</p>
              <ul className="mt-4 space-y-2.5 text-[0.95rem]">
                {c.l.map((x) => (
                  <li key={x}>
                    <a href="#top" onClick={(e) => e.preventDefault()} className="lv-link">
                      {x}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 flex items-end justify-between gap-6 overflow-hidden">
          <p className="lv-serif text-[clamp(5rem,23vw,21rem)] leading-[0.8] tracking-[-0.045em] text-[#f1ede5] italic select-none">Лаванда</p>
          <Sprig className="mb-[1.5vw] h-[9vw] max-h-[130px] w-auto shrink-0 text-[var(--lav-2)] max-sm:hidden" />
        </div>
        <div className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-6 text-[0.8rem] text-white/45 sm:flex-row sm:justify-between">
          <span>© 2026 Лаванда. Концепт интернет-магазина для портфолио: товары, цены и отзывы вымышлены.</span>
          <span>Политика конфиденциальности · Оферта</span>
        </div>
      </div>
    </footer>
  )
}
