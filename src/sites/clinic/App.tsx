import { ArrowUpRight, CalendarDays, Clock, MapPin, ShieldCheck, Sparkle, Star } from 'lucide-react'
import { BlurFade } from '@/components/magicui/blur-fade'
import { Highlighter } from '@/components/magicui/highlighter'
import { NumberTicker } from '@/components/magicui/number-ticker'
import { Marquee } from '@/components/magicui/marquee'
import { ContainerScroll } from '@/components/aceternity/container-scroll-animation'
import { InfiniteMovingCards } from '@/components/aceternity/infinite-moving-cards'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { cn } from '@/lib/utils'

const serif = 'font-[Fraunces] tracking-tight'
const INK = '#0e2a2a'
const img = (n: string) => `./img/${n}.jpg`

function Nav() {
  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <a href="#" className={cn(serif, 'text-2xl font-semibold')} style={{ color: INK }}>Лумина</a>
        <nav className="hidden gap-8 text-sm text-[#0e2a2a]/70 md:flex">
          <a href="#services">Лечение</a><a href="#prices">Цены</a><a href="#doctors">Врачи</a><a href="#faq">Вопросы</a>
        </nav>
        <a href="#book" className="rounded-full bg-[#0e2a2a] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#184040]">Записаться</a>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#f5f7f6] pt-28 pb-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-[1fr_1.05fr]">
        <div>
          <BlurFade delay={0.05}>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-[#2e7d6b] shadow-sm">
              <ShieldCheck className="size-4" /> Лечение по плану с фиксированной ценой
            </span>
          </BlurFade>
          <BlurFade delay={0.15}>
            <h1 className={cn(serif, 'mt-6 text-5xl leading-[1.05] md:text-7xl')} style={{ color: INK }}>
              Спокойная стоматология, где <Highlighter action="underline" color="#e7b9a8" strokeWidth={3}>не страшно</Highlighter>
            </h1>
          </BlurFade>
          <BlurFade delay={0.25}>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-[#0e2a2a]/70">
              Сначала 3D-снимок и честный план лечения с ценой. Лечим под микроскопом и с анестезией, которую вы не почувствуете.
            </p>
          </BlurFade>
          <BlurFade delay={0.35}>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#book" className="inline-flex items-center gap-2 rounded-full bg-[#2e7d6b] px-7 py-4 font-medium text-white shadow-lg shadow-[#2e7d6b]/25 transition hover:bg-[#276a5b]">
                Бесплатная консультация <ArrowUpRight className="size-4" />
              </a>
              <a href="#prices" className="rounded-full border border-[#0e2a2a]/15 bg-white px-7 py-4 font-medium text-[#0e2a2a] transition hover:border-[#0e2a2a]/40">Цены на лечение</a>
            </div>
          </BlurFade>
          <BlurFade delay={0.45}>
            <div className="mt-10 flex gap-10 text-sm text-[#0e2a2a]/60">
              <div><div className={cn(serif, 'text-3xl text-[#0e2a2a]')}><NumberTicker value={12} className="text-[#0e2a2a]" /> лет</div>работаем на Петроградской</div>
              <div><div className={cn(serif, 'text-3xl text-[#0e2a2a]')}><NumberTicker value={9400} className="text-[#0e2a2a]" /></div>пациентов вернулись к нам</div>
            </div>
          </BlurFade>
        </div>
        <BlurFade delay={0.2} className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-2xl shadow-[#0e2a2a]/15">
            <img src={img('dental_office')} alt="Кабинет клиники Лумина" className="size-full object-cover" />
          </div>
          <div className="absolute -left-6 top-10 w-60 rounded-2xl bg-white/90 p-4 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs text-[#0e2a2a]/60"><CalendarDays className="size-4 text-[#2e7d6b]" /> Ближайшее окно</div>
            <div className={cn(serif, 'mt-1 text-2xl text-[#0e2a2a]')}>Сегодня, 18:30</div>
            <div className="mt-3 flex gap-1.5">
              {['17:00', '18:30', '19:15'].map((t, i) => (
                <span key={t} className={cn('rounded-lg px-2.5 py-1 text-xs', i === 1 ? 'bg-[#2e7d6b] text-white' : 'bg-[#f5f7f6] text-[#0e2a2a]/70')}>{t}</span>
              ))}
            </div>
          </div>
          <div className="absolute -bottom-6 right-6 flex items-center gap-3 rounded-2xl bg-white/90 p-4 shadow-xl backdrop-blur-md">
            <div className="flex -space-x-2">
              {['smile_1', 'smile_2'].map((s) => <img key={s} src={img(s)} alt="" className="size-10 rounded-full border-2 border-white object-cover" />)}
            </div>
            <div>
              <div className="flex items-center gap-1 text-sm font-semibold text-[#0e2a2a]">4,9 <Star className="size-4 fill-[#e3a34b] text-[#e3a34b]" /></div>
              <div className="text-xs text-[#0e2a2a]/60">1 180 отзывов на Картах</div>
            </div>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}

function Trust() {
  const t = ['3D-томограф Planmeca', 'Микроскоп Zeiss', 'Импланты Straumann', 'Элайнеры Invisalign', 'Лицензия Минздрава', 'Рассрочка 0%']
  return (
    <section className="border-y border-[#0e2a2a]/10 bg-white py-5">
      <Marquee pauseOnHover className="[--duration:34s]">
        {t.map((x) => <span key={x} className="mx-8 flex items-center gap-3 text-[#0e2a2a]/55"><Sparkle className="size-4 text-[#2e7d6b]" />{x}</span>)}
      </Marquee>
    </section>
  )
}

function Services() {
  const s = [
    { t: 'Лечение без боли', d: 'Компьютерная анестезия и микроскоп: сохраняем максимум живого зуба.', i: 'dental_work', c: 'md:col-span-2 md:row-span-2' },
    { t: 'Цифровая диагностика', d: '3D-снимок и сканер вместо слепков.', i: 'dental_scan', c: '' },
    { t: 'Имплантация за день', d: 'Временная коронка в день операции.', i: 'dental_chair', c: '' },
  ]
  return (
    <section id="services" className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <BlurFade inView><h2 className={cn(serif, 'max-w-2xl text-4xl md:text-5xl')} style={{ color: INK }}>Всё лечение в одной клинике, от гигиены до имплантов</h2></BlurFade>
        <div className="mt-12 grid auto-rows-[260px] gap-5 md:grid-cols-3">
          {s.map((x, k) => (
            <BlurFade key={x.t} inView delay={k * 0.1} className={cn('group relative overflow-hidden rounded-3xl', x.c)}>
              <img src={img(x.i)} alt={x.t} className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e2a2a]/85 via-[#0e2a2a]/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <h3 className={cn(serif, 'text-2xl')}>{x.t}</h3>
                <p className="mt-1 max-w-sm text-sm text-white/80">{x.d}</p>
              </div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  )
}

function Tour() {
  return (
    <section className="bg-[#f5f7f6]">
      <ContainerScroll titleComponent={
        <h2 className={cn(serif, 'pb-10 text-4xl leading-tight md:text-6xl')} style={{ color: INK }}>Загляните в клинику<br /><span className="italic text-[#2e7d6b]">до первого визита</span></h2>
      }>
        <img src={img('dental_chair')} alt="Кабинет терапии" className="mx-auto h-full w-full rounded-2xl object-cover object-center" draggable={false} />
      </ContainerScroll>
    </section>
  )
}

function Prices() {
  const tabs: Record<string, [string, string][]> = {
    'Терапия': [['Консультация и план лечения', 'бесплатно'], ['Лечение кариеса под микроскопом', 'от 5 400 ₽'], ['Лечение каналов, 1 канал', 'от 7 900 ₽']],
    'Гигиена': [['Профгигиена Air Flow', '6 500 ₽'], ['Отбеливание ZOOM 4', '24 000 ₽'], ['Детская гигиена', '3 900 ₽']],
    'Импланты': [['Имплант Straumann под ключ', 'от 69 000 ₽'], ['Синус-лифтинг', 'от 38 000 ₽'], ['Коронка на имплант', 'от 32 000 ₽']],
  }
  return (
    <section id="prices" className="bg-white py-24">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className={cn(serif, 'text-center text-4xl md:text-5xl')} style={{ color: INK }}>Цены без сюрпризов</h2>
        <p className="mt-3 text-center text-[#0e2a2a]/60">Итоговую стоимость фиксируем в плане лечения до начала работ</p>
        <Tabs defaultValue="Терапия" className="mt-10">
          <TabsList className="mx-auto">
            {Object.keys(tabs).map((k) => <TabsTrigger key={k} value={k}>{k}</TabsTrigger>)}
          </TabsList>
          {Object.entries(tabs).map(([k, rows]) => (
            <TabsContent key={k} value={k} className="mt-6 divide-y divide-[#0e2a2a]/10 rounded-3xl border border-[#0e2a2a]/10 bg-[#f5f7f6] px-6">
              {rows.map(([n, p]) => (
                <div key={n} className="flex items-center justify-between py-5">
                  <span className="text-[#0e2a2a]">{n}</span>
                  <span className={cn(serif, 'text-xl text-[#2e7d6b]')}>{p}</span>
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}

function Doctors() {
  const d = [
    { n: 'Елена Кравцова', r: 'Терапевт, эндодонтист', y: '14 лет практики', i: 'dental_work' },
    { n: 'Артём Лаптев', r: 'Хирург-имплантолог', y: '11 лет практики', i: 'dental_scan' },
  ]
  return (
    <section id="doctors" className="bg-[#f5f7f6] py-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-[.8fr_1.2fr]">
        <div>
          <h2 className={cn(serif, 'text-4xl md:text-5xl')} style={{ color: INK }}>Врачи, которые объясняют, а не пугают</h2>
          <p className="mt-5 text-[#0e2a2a]/65">На консультации врач показывает снимок, рассказывает варианты и честно говорит, что можно не лечить.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {d.map((x) => (
            <div key={x.n} className="overflow-hidden rounded-3xl bg-white shadow-sm">
              <img src={img(x.i)} alt={x.n} className="aspect-[4/3] w-full object-cover" />
              <div className="p-5">
                <div className={cn(serif, 'text-xl')} style={{ color: INK }}>{x.n}</div>
                <div className="text-sm text-[#0e2a2a]/60">{x.r} · {x.y}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Reviews() {
  const items = [
    { quote: 'Боялась стоматологов 15 лет. Здесь впервые ничего не почувствовала, даже укол.', name: 'Ольга', title: 'лечение кариеса' },
    { quote: 'Показали на 3D-снимке, что имплант можно поставить без наращивания кости. В другой клинике предлагали дороже.', name: 'Сергей', title: 'имплантация' },
    { quote: 'Ребёнок сам просится на гигиену, потому что ему разрешают выбрать мультик на потолке.', name: 'Анна', title: 'детская стоматология' },
    { quote: 'Цена в плане лечения совпала с чеком до рубля. Редкость.', name: 'Михаил', title: 'протезирование' },
  ]
  return (
    <section className="bg-white py-20">
      <InfiniteMovingCards items={items} direction="right" speed="slow" className="[&_li]:border-[#0e2a2a]/10 [&_li]:bg-[#f5f7f6] [&_li]:[background:#f5f7f6] [&_span]:text-[#0e2a2a]" />
    </section>
  )
}

function Faq() {
  const q = [
    ['Консультация правда бесплатная?', 'Да. Осмотр, снимок и план лечения с ценой — бесплатно и ни к чему не обязывают.'],
    ['Можно лечиться в рассрочку?', 'Да, до 12 месяцев без переплаты через банк-партнёр, оформление в клинике за 10 минут.'],
    ['Работаете ли вы с детьми?', 'Да, с 3 лет. Первый визит — знакомство без лечения.'],
  ]
  return (
    <section id="faq" className="bg-white pb-24">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className={cn(serif, 'text-center text-4xl')} style={{ color: INK }}>Частые вопросы</h2>
        <Accordion type="single" collapsible className="mt-8">
          {q.map(([a, b]) => (
            <AccordionItem key={a} value={a}><AccordionTrigger className="text-left text-base">{a}</AccordionTrigger><AccordionContent className="text-[#0e2a2a]/65">{b}</AccordionContent></AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

function Book() {
  return (
    <section id="book" className="px-6 pb-16">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2.5rem] bg-[#0e2a2a] text-white md:grid-cols-2">
        <div className="p-10 md:p-14">
          <h2 className={cn(serif, 'text-4xl md:text-5xl')}>Запишитесь на бесплатную консультацию</h2>
          <p className="mt-4 text-white/70">Перезвоним за 10 минут и подберём время.</p>
          <form className="mt-8 grid gap-3" onSubmit={(e) => e.preventDefault()}>
            <input placeholder="Имя" className="rounded-full bg-white/10 px-5 py-3.5 placeholder:text-white/50 focus:bg-white/15 focus:outline-none" />
            <input placeholder="+7 (___) ___-__-__" className="rounded-full bg-white/10 px-5 py-3.5 placeholder:text-white/50 focus:bg-white/15 focus:outline-none" />
            <button className="mt-2 rounded-full bg-[#e7b9a8] px-6 py-3.5 font-medium text-[#0e2a2a] transition hover:bg-[#f0cbbd]">Записаться</button>
          </form>
          <div className="mt-8 flex flex-wrap gap-6 text-sm text-white/65">
            <span className="flex items-center gap-2"><MapPin className="size-4" />Большой пр. П.С., 00</span>
            <span className="flex items-center gap-2"><Clock className="size-4" />Ежедневно 9:00–21:00</span>
          </div>
        </div>
        <img src={img('smile_2')} alt="Пациентка клиники" className="hidden size-full object-cover md:block" />
      </div>
      <p className="mx-auto mt-8 max-w-6xl text-sm text-[#0e2a2a]/45"></p>
    </section>
  )
}

export default function App() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f5f7f6] text-[#0e2a2a]">
      <Nav />
      <Hero />
      <Trust />
      <Services />
      <Tour />
      <Prices />
      <Doctors />
      <Reviews />
      <Faq />
      <Book />
    </div>
  )
}
