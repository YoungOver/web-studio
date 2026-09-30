import { ArrowRight, Dumbbell, Flame, HeartPulse, Timer, Users, Zap } from 'lucide-react'
import { Particles } from '@/components/magicui/particles'
import { Spotlight } from '@/components/aceternity/spotlight'
import { WordRotate } from '@/components/magicui/word-rotate'
import { AnimatedShinyText } from '@/components/magicui/animated-shiny-text'
import { ShimmerButton } from '@/components/magicui/shimmer-button'
import { BorderBeam } from '@/components/magicui/border-beam'
import { NumberTicker } from '@/components/magicui/number-ticker'
import { Marquee } from '@/components/magicui/marquee'
import { BentoCard, BentoGrid } from '@/components/magicui/bento-grid'
import { MagicCard } from '@/components/magicui/magic-card'
import { RetroGrid } from '@/components/magicui/retro-grid'
import { BlurFade } from '@/components/magicui/blur-fade'
import { cn } from '@/lib/utils'

const VOLT = '#c8ff2e'

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto mt-4 flex max-w-6xl items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-5 py-3 backdrop-blur-xl">
        <a href="#" className="flex items-center gap-2 font-display text-lg font-bold tracking-tight">
          <span className="grid size-8 place-items-center rounded-lg bg-volt text-ink"><Zap className="size-4" strokeWidth={3} /></span>
          PULSE
        </a>
        <nav className="hidden gap-8 text-sm text-white/60 md:flex">
          <a href="#programs" className="transition hover:text-white">Программы</a>
          <a href="#coaches" className="transition hover:text-white">Тренеры</a>
          <a href="#prices" className="transition hover:text-white">Абонементы</a>
        </nav>
        <a href="#prices" className="cut bg-volt px-4 py-2 text-sm font-semibold text-ink transition hover:brightness-110">Пробная тренировка</a>
      </div>
    </header>
  )
}

function HeartLine() {
  return (
    <svg viewBox="0 0 300 70" className="h-16 w-full" aria-hidden>
      <defs>
        <linearGradient id="hl" x1="0" x2="1">
          <stop offset="0" stopColor={VOLT} stopOpacity="0" />
          <stop offset=".6" stopColor={VOLT} />
          <stop offset="1" stopColor="#fff" />
        </linearGradient>
      </defs>
      <path d="M0 42 H70 L82 42 L92 12 L104 62 L116 30 L126 42 H190 L200 42 L210 18 L220 56 L230 42 H300" fill="none" stroke="url(#hl)" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  )
}

function AppCard() {
  const slots = [
    { t: '07:30', n: 'Кроссфит', c: 'Артём', left: 3 },
    { t: '12:00', n: 'Бокс', c: 'Дина', left: 6 },
    { t: '19:00', n: 'Силовая', c: 'Марк', left: 1 },
  ]
  return (
    <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-panel/80 p-5 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between text-xs text-white/50">
        <span>Сегодня, среда</span>
        <span className="flex items-center gap-1.5 text-volt"><span className="beat size-2 rounded-full bg-volt" />live</span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white/[.04] p-4">
          <HeartPulse className="size-4 text-flare" />
          <div className="mt-3 font-display text-3xl font-bold"><NumberTicker value={142} className="text-white" /></div>
          <div className="text-xs text-white/50">уд/мин, зона 4</div>
        </div>
        <div className="rounded-2xl bg-white/[.04] p-4">
          <Flame className="size-4 text-volt" />
          <div className="mt-3 font-display text-3xl font-bold"><NumberTicker value={684} className="text-white" /></div>
          <div className="text-xs text-white/50">ккал за тренировку</div>
        </div>
      </div>
      <HeartLine />
      <div className="space-y-2">
        {slots.map((s) => (
          <div key={s.t} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[.03] px-3 py-2.5">
            <span className="font-display text-sm font-bold text-volt">{s.t}</span>
            <div className="flex-1 text-sm">
              <div className="font-medium">{s.n}</div>
              <div className="text-xs text-white/40">тренер {s.c}</div>
            </div>
            <span className={cn('rounded-full px-2 py-0.5 text-[11px]', s.left < 3 ? 'bg-flare/15 text-flare' : 'bg-white/10 text-white/60')}>
              {s.left} {s.left === 1 ? 'место' : 'места'}
            </span>
          </div>
        ))}
      </div>
      <BorderBeam size={120} duration={7} colorFrom={VOLT} colorTo="#ffffff" />
    </div>
  )
}

function Hero() {
  return (
    <section className="grain relative overflow-hidden pt-36 pb-24">
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill={VOLT} />
      <Particles className="absolute inset-0" quantity={90} color={VOLT} size={0.5} />
      <div className="aurora pointer-events-none absolute -right-40 top-10 size-[520px] rounded-full bg-volt/20" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-[1.15fr_.85fr]">
        <div>
          <BlurFade delay={0.05}>
            <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm">
              <AnimatedShinyText>Открыли второй зал на Петроградке</AnimatedShinyText>
            </div>
          </BlurFade>
          <BlurFade delay={0.15}>
            <h1 className="mt-6 font-display text-5xl font-black uppercase leading-[.95] tracking-tight md:text-7xl">
              Стань
              <WordRotate words={['сильнее', 'быстрее', 'выносливее']} className="text-volt" />
              за 12 недель
            </h1>
          </BlurFade>
          <BlurFade delay={0.25}>
            <p className="mt-6 max-w-lg text-lg text-white/60">
              Тренировки в группах до 8 человек. Тренер ведёт твой прогресс, пульс и нагрузку видно в приложении прямо на занятии.
            </p>
          </BlurFade>
          <BlurFade delay={0.35}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <ShimmerButton background="#c8ff2e" shimmerColor="#ffffff" className="font-semibold text-ink">
                <span className="flex items-center gap-2 text-ink">Записаться бесплатно <ArrowRight className="size-4" /></span>
              </ShimmerButton>
              <div className="text-sm text-white/50"><span className="font-semibold text-white">4,9</span> на Яндекс Картах · 1 200+ отзывов</div>
            </div>
          </BlurFade>
        </div>
        <BlurFade delay={0.3} className="flex justify-center lg:justify-end"><AppCard /></BlurFade>
      </div>
    </section>
  )
}

function Disciplines() {
  const items = ['Кроссфит', 'Бокс', 'Функциональный тренинг', 'Силовая', 'Растяжка', 'HIIT', 'Мобилити', 'Кардио']
  return (
    <section className="border-y border-white/5 bg-panel/50 py-6">
      <Marquee pauseOnHover className="[--duration:30s]">
        {items.map((i) => (
          <span key={i} className="mx-6 flex items-center gap-6 font-display text-2xl font-bold uppercase text-white/80">
            {i}<Zap className="size-5 text-volt" />
          </span>
        ))}
      </Marquee>
    </section>
  )
}

function Stats() {
  const s = [
    { v: 12, suf: ' недель', l: 'длится программа' },
    { v: 8, suf: ' человек', l: 'максимум в группе' },
    { v: 94, suf: '%', l: 'доходят до финала' },
    { v: 3400, suf: '+', l: 'выпускников' },
  ]
  return (
    <section className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-20 md:grid-cols-4">
      {s.map((x) => (
        <div key={x.l} className="border-l border-volt/40 pl-5">
          <div className="font-display text-4xl font-bold"><NumberTicker value={x.v} className="text-white" />{x.suf}</div>
          <div className="mt-1 text-sm text-white/50">{x.l}</div>
        </div>
      ))}
    </section>
  )
}

function ProgressBars() {
  const weeks = [22, 30, 28, 41, 47, 45, 58, 63, 61, 72, 80, 88]
  return (
    <div className="absolute inset-x-6 top-6 flex h-28 items-end gap-2 [mask-image:linear-gradient(to_top,transparent,black_40%)]">
      {weeks.map((h, i) => (
        <div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-volt/10 to-volt/70 transition-all duration-500 group-hover:to-volt" style={{ height: `${h}%` }} />
      ))}
    </div>
  )
}

function Zones() {
  const z = [['Z5', 'bg-flare', 12], ['Z4', 'bg-orange-400', 34], ['Z3', 'bg-volt', 28], ['Z2', 'bg-sky-400', 18]] as const
  return (
    <div className="absolute inset-x-6 top-6 space-y-2">
      {z.map(([n, c, w]) => (
        <div key={n} className="flex items-center gap-2 text-[11px] text-white/50">
          <span className="w-5">{n}</span>
          <div className="h-2 flex-1 rounded-full bg-white/5"><div className={cn('h-2 rounded-full', c)} style={{ width: `${w * 2.4}%` }} /></div>
        </div>
      ))}
    </div>
  )
}

function Coaches() {
  const c = [['АК', 'from-volt to-lime-600'], ['ДМ', 'from-flare to-orange-600'], ['МС', 'from-sky-400 to-indigo-600'], ['ЕР', 'from-fuchsia-400 to-purple-700']]
  return (
    <div className="absolute left-6 top-8 flex -space-x-3">
      {c.map(([i, g]) => (
        <div key={i} className={cn('grid size-12 place-items-center rounded-full border-2 border-panel bg-gradient-to-br font-display text-xs font-bold text-ink', g)}>{i}</div>
      ))}
      <div className="grid size-12 place-items-center rounded-full border-2 border-panel bg-white/10 text-xs text-white/70">+8</div>
    </div>
  )
}

function BotChat() {
  return (
    <div className="absolute right-6 top-6 w-72 space-y-2 text-[13px] [mask-image:linear-gradient(to_top,transparent,black_35%)]">
      <div className="ml-auto w-fit rounded-2xl rounded-br-sm bg-volt px-3 py-2 text-ink">Хочу на бокс в четверг</div>
      <div className="w-fit rounded-2xl rounded-bl-sm bg-white/10 px-3 py-2">Свободно 19:00 и 20:30. Какое время?</div>
      <div className="ml-auto w-fit rounded-2xl rounded-br-sm bg-volt px-3 py-2 text-ink">19:00</div>
      <div className="w-fit rounded-2xl rounded-bl-sm bg-white/10 px-3 py-2">Записал ✅ Напомню за 2 часа</div>
    </div>
  )
}

function Features() {
  const glow = (cls: string) => <div className={cn('absolute inset-0 opacity-60 transition group-hover:opacity-100', cls)} />
  const features = [
    { Icon: Dumbbell, name: 'Программа под цель', description: 'Похудение, сила или выносливость: план на 12 недель с контрольными замерами.', href: '#', cta: 'Смотреть программу', className: 'lg:col-span-2', background: <>{glow('bg-[radial-gradient(circle_at_80%_20%,rgba(200,255,46,.18),transparent_55%)]')}<ProgressBars /></> },
    { Icon: HeartPulse, name: 'Пульс на экране', description: 'Датчик на груди, зоны нагрузки видны всей группе.', href: '#', cta: 'Как это работает', className: 'lg:col-span-1', background: <>{glow('bg-[radial-gradient(circle_at_20%_80%,rgba(255,77,46,.2),transparent_55%)]')}<Zones /></> },
    { Icon: Users, name: 'Тренеры, а не надзиратели', description: 'Каждого знают по имени и видят технику.', href: '#', cta: 'Команда', className: 'lg:col-span-1', background: <>{glow('bg-[linear-gradient(135deg,rgba(255,255,255,.05),transparent)]')}<Coaches /></> },
    { Icon: Timer, name: 'Запись за 10 секунд', description: 'Бот в Telegram: выбрал время, получил напоминание, пришёл.', href: '#', cta: 'Открыть бота', className: 'lg:col-span-2', background: <>{glow('bg-[radial-gradient(circle_at_70%_70%,rgba(200,255,46,.14),transparent_60%)]')}<BotChat /></> },
  ]
  return (
    <section id="programs" className="mx-auto max-w-6xl px-6 pb-24">
      <BlurFade inView>
        <h2 className="font-display text-4xl font-bold uppercase tracking-tight md:text-5xl">Почему у нас доходят до конца</h2>
      </BlurFade>
      <BentoGrid className="mt-10 lg:grid-cols-3 auto-rows-[18rem]">
        {features.map((f) => <BentoCard key={f.name} {...f} />)}
      </BentoGrid>
    </section>
  )
}

function Pricing() {
  const plans = [
    { name: 'Старт', price: '4 900', per: '/ месяц', items: ['8 тренировок', 'Замеры раз в месяц', 'Приложение с пульсом'] },
    { name: 'Программа 12', price: '12 900', per: '/ 3 месяца', items: ['Безлимит групповых', 'План питания', 'Замеры каждые 2 недели', 'Персональный чат с тренером'], hot: true },
    { name: 'Персональный', price: '3 200', per: '/ тренировка', items: ['Один на один', 'Программа под травмы', 'Гибкое время'] },
  ]
  return (
    <section id="prices" className="mx-auto max-w-6xl px-6 pb-24">
      <BlurFade inView><h2 className="font-display text-4xl font-bold uppercase tracking-tight md:text-5xl">Абонементы</h2></BlurFade>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {plans.map((p) => (
          <MagicCard key={p.name} className={cn('relative rounded-3xl', p.hot && 'glow')} gradientColor="#1f2a05">
            <div className="flex h-full flex-col p-7">
              {p.hot && <span className="cut absolute -top-px right-6 bg-volt px-3 py-1 text-xs font-bold uppercase text-ink">Выбирают чаще</span>}
              <div className="text-sm font-semibold uppercase tracking-wider text-white/50">{p.name}</div>
              <div className="mt-4">
                <span className={cn('whitespace-nowrap font-display text-4xl font-black', p.hot && 'text-volt')}>{p.price} ₽</span>
                <div className="mt-1 text-sm text-white/40">{p.per}</div>
              </div>
              <ul className="mt-6 flex-1 space-y-3 text-sm text-white/70">
                {p.items.map((i) => <li key={i} className="flex gap-2"><Zap className="mt-0.5 size-4 shrink-0 text-volt" />{i}</li>)}
              </ul>
              <a href="#" className={cn('cut mt-8 block py-3 text-center text-sm font-semibold transition', p.hot ? 'bg-volt text-ink hover:brightness-110' : 'bg-white/10 hover:bg-white/15')}>Выбрать</a>
            </div>
            {p.hot && <BorderBeam size={160} duration={9} colorFrom={VOLT} colorTo="#fff" />}
          </MagicCard>
        ))}
      </div>
    </section>
  )
}

function Cta() {
  return (
    <section className="relative mx-6 mb-10 overflow-hidden rounded-[2rem] border border-white/10 bg-panel py-24 text-center md:mx-auto md:max-w-6xl">
      <RetroGrid className="opacity-40" />
      <div className="relative">
        <h2 className="font-display text-4xl font-black uppercase md:text-6xl">Первая тренировка<br /><span className="text-volt">бесплатно</span></h2>
        <p className="mx-auto mt-5 max-w-md text-white/60">Оставь номер, подберём группу по уровню и времени. Кроссовки и полотенце выдадим.</p>
        <div className="mt-8 flex justify-center">
          <ShimmerButton background="#c8ff2e" shimmerColor="#ffffff"><span className="font-semibold text-ink">Записаться</span></ShimmerButton>
        </div>
      </div>
    </section>
  )
}

export default function App() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-ink text-white">
      <Nav />
      <Hero />
      <Disciplines />
      <Stats />
      <Features />
      <Pricing />
      <Cta />
      <footer className="mx-auto flex max-w-6xl flex-wrap justify-between gap-4 px-6 pb-10 text-sm text-white/40">
        <span>PULSE · Санкт-Петербург, Большой пр. П.С., 00</span>
        
      </footer>
    </div>
  )
}

