import { useState } from 'react'
import { Camera, FileSignature, Hammer, KeyRound, Ruler, ShieldCheck } from 'lucide-react'
import { AnimatedGridPattern } from '@/components/magicui/animated-grid-pattern'
import { BlurFade } from '@/components/magicui/blur-fade'
import { NumberTicker } from '@/components/magicui/number-ticker'
import { TracingBeam } from '@/components/aceternity/tracing-beam'
import { cn } from '@/lib/utils'

const f = 'font-[Onest]'
const mono = 'font-[JetBrains_Mono]'
const BP = '#1d4ed8'
const img = (n: string) => `./img/${n}.jpg`

const rates = { 'Косметический': 6500, 'Капитальный': 12500, 'Дизайнерский': 19000 } as const
type Kind = keyof typeof rates

function Calculator() {
  const [area, setArea] = useState(42)
  const [kind, setKind] = useState<Kind>('Капитальный')
  const total = area * rates[kind]
  const weeks = Math.round(area / (kind === 'Косметический' ? 9 : kind === 'Капитальный' ? 5 : 3.5))
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-blue-900/5">
      <div className={cn(mono, 'text-xs uppercase text-slate-500')}>Смета за 30 секунд</div>
      <div className="mt-5 flex flex-wrap gap-2">
        {(Object.keys(rates) as Kind[]).map((k) => (
          <button key={k} onClick={() => setKind(k)} className={cn('min-w-[30%] flex-1 rounded-xl border px-1 py-2.5 text-xs font-medium transition sm:px-2 sm:text-sm', k === kind ? 'border-transparent text-white' : 'border-slate-200 text-slate-700 hover:border-slate-400')} style={k === kind ? { background: BP } : undefined}>{k}</button>
        ))}
      </div>
      <label className="mt-6 flex items-center justify-between text-sm text-slate-600">Площадь квартиры <span className={cn(mono, 'text-slate-900')}>{area} м²</span></label>
      <input type="range" min={20} max={140} value={area} onChange={(e) => setArea(+e.target.value)} className="mt-3 w-full accent-blue-700" aria-label="Площадь квартиры" />
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-slate-50 p-4"><div className="text-xs text-slate-500">Работы, от</div><div className={cn(f, 'mt-1 text-2xl font-extrabold text-slate-900')}>{total.toLocaleString('ru-RU')} ₽</div></div>
        <div className="rounded-2xl bg-slate-50 p-4"><div className="text-xs text-slate-500">Срок</div><div className={cn(f, 'mt-1 text-2xl font-extrabold text-slate-900')}>~{weeks} нед.</div></div>
      </div>
      <a href="#lead" className="mt-5 block rounded-xl py-3.5 text-center font-semibold text-white transition hover:opacity-90" style={{ background: BP }}>Получить точную смету</a>
      <p className="mt-3 text-center text-xs text-slate-400">Цена в договоре фиксируется после замера</p>
    </div>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#f6f8fc]">
      <AnimatedGridPattern numSquares={40} maxOpacity={0.12} duration={3} className="[mask-image:radial-gradient(700px_circle_at_30%_30%,white,transparent)] fill-blue-600/20 stroke-blue-600/15" />
      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <a href="#" className={cn(f, 'flex items-center gap-2 text-xl font-extrabold text-slate-900')}><span className="grid size-8 place-items-center rounded-lg text-white" style={{ background: BP }}><Ruler className="size-4" /></span>Прораб рядом</a>
        <a href="tel:+78120004545" className={cn(mono, 'hidden text-sm text-slate-700 sm:block')}>+7 (812) 000-45-45</a>
      </header>
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 pt-10 pb-24 lg:grid-cols-[1.1fr_.9fr] [&>*]:min-w-0">
        <div>
          <BlurFade delay={0.05}><span className={cn(mono, 'rounded-md border border-blue-200 bg-white px-2 py-1 text-xs text-blue-800')}>ДОГОВОР · ФИКС-ЦЕНА · ГАРАНТИЯ 3 ГОДА</span></BlurFade>
          <BlurFade delay={0.15}>
            <h1 className={cn(f, 'mt-6 text-[2.6rem] font-extrabold leading-[1.02] tracking-tight text-slate-900 sm:text-5xl md:text-7xl')}>
              Ремонт по смете, которая <span className="relative whitespace-nowrap" style={{ color: BP }}>не растёт<svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" preserveAspectRatio="none"><path d="M2 9 Q 100 -2 198 9" stroke={BP} strokeWidth="3" fill="none" strokeDasharray="6 5" /></svg></span>
            </h1>
          </BlurFade>
          <BlurFade delay={0.25}><p className="mt-7 max-w-lg text-lg text-slate-600">Фиксируем цену до начала работ. Каждый этап принимаете по фото и видео и платите только за принятое.</p></BlurFade>
          <BlurFade delay={0.35}>
            <div className="mt-10 flex gap-6 sm:gap-10">
              {[[312, 'квартир сдали'], [45, 'дней средний срок'], [0, '₽ за замер']].map(([v, l]) => (
                <div key={l}><div className={cn(f, 'text-4xl font-extrabold text-slate-900')}><NumberTicker value={v as number} className="text-slate-900" /></div><div className="text-sm text-slate-500">{l}</div></div>
              ))}
            </div>
          </BlurFade>
        </div>
        <BlurFade delay={0.25}><Calculator /></BlurFade>
      </div>
    </section>
  )
}

function BeforeAfter() {
  const [pos, setPos] = useState(52)
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className={cn(f, 'text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl')}>Из бетона в дом, где хочется жить</h2>
        <p className="mt-3 text-slate-500">Потяните ползунок: от черновой отделки к чистовой. Иллюстрация, фото разных объектов.</p>
        <div className="relative mt-10 aspect-[16/8] select-none overflow-hidden rounded-3xl">
          <img src={img('int_window')} alt="Чистовая отделка" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
            <img src={img('reno_room')} alt="Черновая отделка" className="absolute inset-0 size-full object-cover" />
          </div>
          <div className="pointer-events-none absolute inset-y-0 w-1 bg-white shadow-[0_0_20px_rgba(0,0,0,.35)]" style={{ left: `${pos}%` }}>
            <div className="absolute top-1/2 left-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-slate-700 shadow-lg">⇆</div>
          </div>
          <span className={cn(mono, 'absolute left-4 top-4 rounded bg-black/60 px-2 py-1 text-xs text-white')}>ЧЕРНОВАЯ</span>
          <span className={cn(mono, 'absolute right-4 top-4 rounded bg-white/85 px-2 py-1 text-xs text-slate-900')}>ЧИСТОВАЯ</span>
          <input type="range" min={0} max={100} value={pos} onChange={(e) => setPos(+e.target.value)} className="absolute inset-0 size-full cursor-ew-resize opacity-0" aria-label="Сравнить до и после" />
        </div>
      </div>
    </section>
  )
}

function Stages() {
  const s = [
    { I: Ruler, t: 'Замер и обмерный план', d: 'Приезжаем в удобное время, снимаем размеры лазером, фиксируем пожелания. Бесплатно.' },
    { I: FileSignature, t: 'Смета и договор', d: 'Цена за каждую работу, график этапов и штраф за просрочку прописаны в договоре.' },
    { I: Hammer, t: 'Черновые работы', d: 'Демонтаж, электрика, сантехника, стяжка. Скрытые работы снимаем на видео до закрытия стен.' },
    { I: Camera, t: 'Отчёт каждый день', d: 'Фото и видео в общем чате. Этап оплачиваете только после приёмки.' },
    { I: KeyRound, t: 'Сдача и гарантия', d: 'Уборка, акт приёмки и гарантия 3 года на электрику и сантехнику.' },
  ]
  return (
    <section className="bg-[#f6f8fc] py-24">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className={cn(f, 'mb-14 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl')}>Как проходит ремонт</h2>
        <TracingBeam className="px-6">
          <div className="space-y-12 pl-6">
            {s.map(({ I, t, d }, i) => (
              <div key={t} className="rounded-3xl border border-slate-200 bg-white p-7">
                <div className="flex items-center gap-4">
                  <span className="grid size-12 place-items-center rounded-2xl text-white" style={{ background: BP }}><I className="size-5" /></span>
                  <div>
                    <div className={cn(mono, 'text-xs text-slate-400')}>ЭТАП {i + 1}</div>
                    <h3 className={cn(f, 'text-xl font-bold text-slate-900')}>{t}</h3>
                  </div>
                </div>
                <p className="mt-4 text-slate-600">{d}</p>
              </div>
            ))}
          </div>
        </TracingBeam>
      </div>
    </section>
  )
}

function Works() {
  const w = [
    ['int_living', 'Двушка на Выборгской', '58 м² · капитальный · 9 недель'],
    ['int_couch', 'Студия на Лиговском', '31 м² · дизайнерский · 8 недель'],
    ['int_tv', 'Трёшка в Мурино', '76 м² · капитальный · 12 недель'],
  ]
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className={cn(f, 'text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl')}>Недавние объекты</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {w.map(([i, t, m], k) => (
            <BlurFade key={t} inView delay={k * 0.1}>
              <figure className="group overflow-hidden rounded-3xl border border-slate-200">
                <div className="overflow-hidden"><img src={img(i)} alt={t} className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105" /></div>
                <figcaption className="p-5"><div className={cn(f, 'text-lg font-bold text-slate-900')}>{t}</div><div className={cn(mono, 'mt-1 text-xs text-slate-500')}>{m}</div></figcaption>
              </figure>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  )
}

function Lead() {
  return (
    <section id="lead" className="px-6 pb-16">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] p-10 text-white md:p-16" style={{ background: BP }}>
        <AnimatedGridPattern numSquares={25} maxOpacity={0.15} className="fill-white/20 stroke-white/10" />
        <div className="relative grid gap-10 md:grid-cols-2">
          <div>
            <h2 className={cn(f, 'text-4xl font-extrabold tracking-tight md:text-5xl')}>Пришлите планировку, посчитаем за час</h2>
            <p className="mt-4 flex items-center gap-2 text-blue-100"><ShieldCheck className="size-5" />Смета ни к чему не обязывает</p>
          </div>
          <form className="grid gap-3" onSubmit={(e) => e.preventDefault()}>
            <input placeholder="Ваше имя" className="rounded-xl bg-white/15 px-5 py-3.5 placeholder:text-blue-100 focus:bg-white/25 focus:outline-none" />
            <input placeholder="Телефон" className="rounded-xl bg-white/15 px-5 py-3.5 placeholder:text-blue-100 focus:bg-white/25 focus:outline-none" />
            <button className="rounded-xl bg-white py-3.5 font-semibold transition hover:bg-blue-50" style={{ color: BP }}>Получить смету</button>
          </form>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-6xl text-sm text-slate-400"></p>
    </section>
  )
}

export default function App() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <Hero />
      <BeforeAfter />
      <Stages />
      <Works />
      <Lead />
    </div>
  )
}


