import { ArrowDownRight, Clock, MapPin, Wifi } from 'lucide-react'
import { BlurFade } from '@/components/magicui/blur-fade'
import { SpinningText } from '@/components/magicui/spinning-text'
import { Lens } from '@/components/magicui/lens'
import { Marquee } from '@/components/magicui/marquee'
import { cn } from '@/lib/utils'

const d = 'font-[Bricolage_Grotesque] tracking-[-0.03em]'
const CHERRY = '#b3122e'
const img = (n: string) => `./img/${n}.jpg`

function Nav() {
  return (
    <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
      <a href="#" className={cn(d, 'text-3xl font-extrabold')}>зерно<span style={{ color: CHERRY }}>.</span></a>
      <nav className="hidden gap-8 text-sm font-medium md:flex">
        <a href="#menu">Меню</a><a href="#beans">Зерно домой</a><a href="#visit">Как найти</a>
      </nav>
      <a href="#menu" className="rounded-full border-2 border-black px-5 py-2 text-sm font-bold transition hover:bg-black hover:text-white">Заказать с собой</a>
    </header>
  )
}

function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-6 pb-16">
      <BlurFade delay={0.05}>
        <h1 className={cn(d, 'text-[15vw] font-extrabold leading-[.82] md:text-[11rem]')}>
          кофе,<br />ради <span style={{ color: CHERRY }}>которого</span><br />встают раньше
        </h1>
      </BlurFade>
      <div className="mt-10 grid gap-8 md:grid-cols-[1.6fr_1fr]">
        <BlurFade delay={0.2} className="relative">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem]">
            <img src={img('coffee_interior')} alt="Зал кофейни" className="size-full object-cover" />
          </div>
          <div className="absolute -right-6 -top-10 hidden md:block">
            <div className="relative grid size-36 place-items-center rounded-full bg-[#b3122e] text-white">
              <SpinningText radius={6} duration={14} className="text-[11px] font-bold uppercase">обжарка каждую среду • свежее зерно • </SpinningText>
              <span className={cn(d, 'absolute text-2xl font-extrabold')}>ср</span>
            </div>
          </div>
        </BlurFade>
        <BlurFade delay={0.3} className="flex flex-col justify-between gap-6">
          <p className="text-xl leading-relaxed">
            Своя обжарка на Литейном. Эспрессо, воронка и печёное с утра. До 10:00 капучино за <b>190 ₽</b>, чтобы было ради чего выйти из дома.
          </p>
          <div className="overflow-hidden rounded-[2rem]"><img src={img('latte_cap')} alt="Капучино" className="aspect-[4/3] w-full object-cover" /></div>
          <a href="#menu" className="flex items-center justify-between border-b-2 border-black pb-3 text-lg font-bold">Смотреть меню <ArrowDownRight /></a>
        </BlurFade>
      </div>
    </section>
  )
}

function Ticker() {
  return (
    <section className="bg-black py-6 text-white">
      <Marquee className="[--duration:26s]">
        {['эспрессо', 'флэт уайт', 'воронка v60', 'раф лаванда', 'круассаны с 8:00', 'зерно домой'].map((x) => (
          <span key={x} className={cn(d, 'mx-6 flex items-center gap-6 text-5xl font-extrabold')}>
            {x}<span className="size-4 rounded-full" style={{ background: CHERRY }} />
          </span>
        ))}
      </Marquee>
    </section>
  )
}

function Menu() {
  const groups: [string, [string, string, string][]][] = [
    ['Эспрессо', [['Эспрессо', 'двойной, Бразилия', '160'], ['Капучино', '300 мл', '250'], ['Флэт уайт', 'меньше молока', '270'], ['Раф лаванда', 'на сливках', '310']]],
    ['Альтернатива', [['Воронка V60', 'Эфиопия, ягоды', '320'], ['Кемекс на двоих', '600 мл', '480'], ['Колд брю', '12 часов настаивания', '290'], ['Эспрессо-тоник', 'с грейпфрутом', '300']]],
    ['Еда', [['Круассан', 'масляный, с 8:00', '180'], ['С ветчиной и сыром', 'тёплый', '290'], ['Сырники', 'со сметаной', '340'], ['Баскский чизкейк', 'кусок', '320']]],
  ]
  return (
    <section id="menu" className="mx-auto max-w-7xl px-6 py-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 className={cn(d, 'text-6xl font-extrabold md:text-8xl')}>меню</h2>
        <p className="max-w-sm text-lg">Молоко на выбор: коровье, овсяное или безлактозное, +40 ₽.</p>
      </div>
      <div className="mt-12 grid gap-10 md:grid-cols-3">
        {groups.map(([g, items], k) => (
          <BlurFade key={g} inView delay={k * 0.1}>
            <h3 className="border-b-2 border-black pb-3 text-sm font-bold uppercase tracking-widest" style={{ color: CHERRY }}>{g}</h3>
            <ul>
              {items.map(([n, s, p]) => (
                <li key={n} className="flex items-baseline justify-between border-b border-black/10 py-4">
                  <div><div className={cn(d, 'text-2xl font-bold')}>{n}</div><div className="text-sm text-black/55">{s}</div></div>
                  <span className={cn(d, 'text-2xl font-bold')}>{p}</span>
                </li>
              ))}
            </ul>
          </BlurFade>
        ))}
      </div>
    </section>
  )
}

function Beans() {
  return (
    <section id="beans" className="bg-[#111] text-white">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 md:grid-cols-2">
        <Lens zoomFactor={2.2} lensSize={180} ariaLabel="Увеличить зерно">
          <img src={img('beans_pile')} alt="Свежеобжаренное зерно" className="aspect-square w-full rounded-[2rem] object-cover" />
        </Lens>
        <div>
          <span className="text-sm font-bold uppercase tracking-widest" style={{ color: '#ff4d6a' }}>Зерно домой</span>
          <h2 className={cn(d, 'mt-4 text-5xl font-extrabold md:text-7xl')}>Обжарили в среду, вы пьёте в четверг</h2>
          <p className="mt-6 max-w-md text-lg text-white/70">Наведите на фото: так выглядит зерно без маслянистого блеска пережога. Смолем под вашу кофеварку бесплатно.</p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[['Бразилия Серрадо', 'шоколад, орех', '890 ₽'], ['Эфиопия Иргачеффе', 'черника, жасмин', '1 190 ₽']].map(([n, t, p]) => (
              <div key={n} className="rounded-2xl border border-white/15 p-5">
                <div className={cn(d, 'text-xl font-bold')}>{n}</div>
                <div className="text-sm text-white/55">{t}</div>
                <div className={cn(d, 'mt-4 text-2xl font-extrabold')}>{p} <span className="text-sm font-normal text-white/45">/ 250 г</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Gallery() {
  const cards = [
    { title: 'Бариста Паша, чемпион Петербурга', src: img('latte_barista') },
    { title: 'Утро у окна', src: img('coffee_counter') },
    { title: 'Портафильтры после обжарки', src: img('beans_porta') },
    { title: 'Доска меню меняется по сезону', src: img('coffee_menu') },
    { title: 'Капучино на овсяном', src: img('latte_hand') },
    { title: 'Зал на 24 места', src: img('coffee_interior') },
  ]
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <h2 className={cn(d, 'mb-12 text-6xl font-extrabold md:text-8xl')}>как у нас</h2>
      <div className="group/grid grid grid-cols-2 gap-4 md:grid-cols-3">
        {cards.map((c, i) => (
          <figure key={c.title} className={cn('group relative overflow-hidden rounded-3xl transition duration-500 group-hover/grid:blur-[2px] group-hover/grid:scale-[.98] hover:!scale-100 hover:!blur-none', i % 3 === 1 ? 'md:translate-y-10' : '')}>
            <img src={c.src} alt={c.title} className="aspect-[4/5] w-full object-cover" loading="eager" />
            <figcaption className={cn(d, 'absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-5 text-xl font-bold text-white opacity-0 transition group-hover:opacity-100')}>{c.title}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

function Visit() {
  return (
    <section id="visit" className="mx-auto max-w-7xl px-6 pb-16">
      <div className="grid overflow-hidden rounded-[2rem] text-white md:grid-cols-2" style={{ background: CHERRY }}>
        <div className="p-10 md:p-14">
          <h2 className={cn(d, 'text-5xl font-extrabold md:text-7xl')}>заходите</h2>
          <ul className="mt-8 space-y-4 text-lg">
            <li className="flex gap-3"><MapPin className="mt-1 shrink-0" />Литейный пр., 00, вход со двора</li>
            <li className="flex gap-3"><Clock className="mt-1 shrink-0" />Будни 7:30–21:00, выходные 9:00–21:00</li>
            <li className="flex gap-3"><Wifi className="mt-1 shrink-0" />Розетки у каждого стола, тишина до обеда</li>
          </ul>
          <a href="#" className="mt-10 inline-block rounded-full bg-white px-7 py-4 font-bold" style={{ color: CHERRY }}>Проложить маршрут</a>
        </div>
        <img src={img('coffee_counter')} alt="Стойка кофейни" className="h-full min-h-72 w-full object-cover" />
      </div>
      <p className="mt-8 text-sm text-black/45"></p>
    </section>
  )
}

export default function App() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-black">
      <Nav />
      <Hero />
      <Ticker />
      <Menu />
      <Beans />
      <Gallery />
      <Visit />
    </div>
  )
}

