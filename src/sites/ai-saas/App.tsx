import { BarChart3, Bot, CalendarCheck, Check, MessageCircle, Mic, Sparkles, Zap } from 'lucide-react'
import { WebsiteShaderCanvas } from '@/components/twentyfirst/shader-aurora-veil'
import { AuroraText } from '@/components/magicui/aurora-text'
import { AnimatedList } from '@/components/magicui/animated-list'
import { InteractiveHoverButton } from '@/components/magicui/interactive-hover-button'
import { BlurFade } from '@/components/magicui/blur-fade'
import { Marquee } from '@/components/magicui/marquee'
import { NumberTicker } from '@/components/magicui/number-ticker'
import { Terminal, TypingAnimation, AnimatedSpan } from '@/components/magicui/terminal'
import { NeonGradientCard } from '@/components/magicui/neon-gradient-card'
import { FlickeringGrid } from '@/components/magicui/flickering-grid'
import { GlowingEffect } from '@/components/aceternity/glowing-effect'
import { InfiniteMovingCards } from '@/components/aceternity/infinite-moving-cards'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { cn } from '@/lib/utils'

const display = 'font-[Manrope] tracking-tight'

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[#06070d]/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className={cn(display, 'flex items-center gap-2 text-lg font-extrabold')}>
          <span className="relative grid size-8 place-items-center rounded-full bg-gradient-to-br from-[#5b8cff] to-[#3ef0c3]">
            <span className="size-2.5 rounded-full bg-[#06070d]" />
          </span>
          Орбита
        </a>
        <nav className="hidden gap-8 text-sm text-white/60 md:flex">
          <a href="#how" className="hover:text-white">Как работает</a>
          <a href="#features" className="hover:text-white">Возможности</a>
          <a href="#prices" className="hover:text-white">Тарифы</a>
          <a href="#faq" className="hover:text-white">Вопросы</a>
        </nav>
        <a href="#prices" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#06070d] transition hover:bg-white/90">Попробовать 7 дней</a>
      </div>
    </header>
  )
}

type Event = { icon: typeof MessageCircle; title: string; text: string; time: string; tone: string }
const events: Event[] = [
  { icon: MessageCircle, title: 'Вопрос из Telegram', text: 'Сколько стоит чистка? Ответил с ценой и окнами', time: 'сейчас', tone: 'from-[#5b8cff] to-[#8fb0ff]' },
  { icon: CalendarCheck, title: 'Новая запись', text: 'Анна, гигиена, чт 18:30 — внесено в CRM', time: '1 мин', tone: 'from-[#3ef0c3] to-[#9df7e0]' },
  { icon: Mic, title: 'Голосовое сообщение', text: 'Расшифровал и перенёс визит на пятницу', time: '3 мин', tone: 'from-[#f5b544] to-[#ffd98a]' },
  { icon: Zap, title: 'Лид с сайта', text: 'Квалифицирован: бюджет подходит, передан менеджеру', time: '6 мин', tone: 'from-[#ff6b8b] to-[#ffa3b6]' },
  { icon: MessageCircle, title: 'Вопрос в 02:14', text: 'Ночью тоже отвечаю: адрес, парковка, как добраться', time: '8 мин', tone: 'from-[#5b8cff] to-[#8fb0ff]' },
]

function LiveFeed() {
  return (
    <div className="relative h-[430px] w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white/[.04] p-4 backdrop-blur-2xl">
      <div className="mb-3 flex items-center justify-between px-1 text-xs text-white/50">
        <span className="flex items-center gap-2"><Bot className="size-4 text-[#3ef0c3]" /> Орбита обрабатывает</span>
        <span className="flex items-center gap-1.5"><span className="size-1.5 animate-pulse rounded-full bg-[#3ef0c3]" /> онлайн</span>
      </div>
      <AnimatedList delay={1600}>
        {events.map((e, i) => (
          <figure key={i} className="flex w-full items-start gap-3 rounded-2xl border border-white/5 bg-[#0d1020]/80 p-3.5">
            <div className={cn('grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-[#06070d]', e.tone)}><e.icon className="size-5" /></div>
            <div className="min-w-0 flex-1">
              <figcaption className="flex items-center justify-between text-sm font-semibold">{e.title}<span className="text-xs font-normal text-white/40">{e.time}</span></figcaption>
              <p className="mt-0.5 text-sm text-white/60">{e.text}</p>
            </div>
          </figure>
        ))}
      </AnimatedList>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#06070d] to-transparent" />
    </div>
  )
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-32 pb-24">
      <WebsiteShaderCanvas preset="aurora-veil" tone="dark" className="absolute inset-0 -z-10 opacity-70" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-[#06070d]/40 to-[#06070d]" />
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-[1.1fr_.9fr]">
        <div>
          <BlurFade delay={0.05}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
              <Sparkles className="size-3.5 text-[#3ef0c3]" /> Работает в Telegram, ВКонтакте, MAX и на сайте
            </span>
          </BlurFade>
          <BlurFade delay={0.15}>
            <h1 className={cn(display, 'mt-6 text-5xl font-extrabold leading-[1.02] md:text-7xl')}>
              Отвечает клиентам за <AuroraText colors={['#5b8cff', '#3ef0c3', '#8fb0ff', '#9df7e0']}>3 секунды</AuroraText>, даже ночью
            </h1>
          </BlurFade>
          <BlurFade delay={0.25}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/60">
              ИИ-администратор отвечает на вопросы, записывает в календарь и отправляет заявки в CRM. Вы подключаете его за день, а он перестаёт терять клиентов, которые пишут в 23:40.
            </p>
          </BlurFade>
          <BlurFade delay={0.35}>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <InteractiveHoverButton className="border-white/20 bg-white text-[#06070d]">Подключить бесплатно</InteractiveHoverButton>
              <div className="flex items-center gap-6 text-sm text-white/50">
                <div><span className={cn(display, 'block text-2xl font-extrabold text-white')}>+<NumberTicker value={38} className="text-white" />%</span>записей</div>
                <div><span className={cn(display, 'block text-2xl font-extrabold text-white')}><NumberTicker value={24} className="text-white" />/7</span>без выходных</div>
              </div>
            </div>
          </BlurFade>
        </div>
        <BlurFade delay={0.3} className="flex justify-center lg:justify-end"><LiveFeed /></BlurFade>
      </div>
    </section>
  )
}

function Channels() {
  const ch = ['Telegram', 'ВКонтакте', 'MAX', 'Виджет на сайте', 'amoCRM', 'Битрикс24', 'YCLIENTS', 'Google Таблицы', 'Яндекс Карты']
  return (
    <section className="border-y border-white/5 py-5">
      <Marquee pauseOnHover className="[--duration:32s]">
        {ch.map((c) => <span key={c} className="mx-8 text-lg font-semibold text-white/40">{c}</span>)}
      </Marquee>
    </section>
  )
}

function Steps() {
  const steps = [
    ['Загружаете знания', 'Прайс, адреса, частые вопросы: подойдут таблица, сайт или просто текст.'],
    ['Подключаете каналы', 'Telegram-бот, группа ВК, виджет на сайт. Настроим вместе за один созвон.'],
    ['Орбита работает', 'Отвечает, записывает, передаёт сложные случаи живому человеку.'],
  ]
  return (
    <section id="how" className="mx-auto max-w-6xl px-6 py-24">
      <BlurFade inView><h2 className={cn(display, 'text-4xl font-extrabold md:text-5xl')}>Запуск за один день</h2></BlurFade>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {steps.map(([t, d], i) => (
          <BlurFade key={t} inView delay={i * 0.1}>
            <div className="relative h-full rounded-3xl border border-white/10 bg-white/[.03] p-7">
              <span className={cn(display, 'text-5xl font-extrabold text-white/10')}>{i + 1}</span>
              <h3 className="mt-4 text-xl font-semibold">{t}</h3>
              <p className="mt-2 text-white/55">{d}</p>
            </div>
          </BlurFade>
        ))}
      </div>
    </section>
  )
}

function GlowCard({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('relative rounded-3xl border border-white/10 p-1.5', className)}>
      <GlowingEffect spread={40} glow disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
      <div className="relative flex h-full flex-col overflow-hidden rounded-[1.25rem] bg-[#0b0d18] p-6">{children}</div>
    </div>
  )
}

function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 pb-24">
      <BlurFade inView><h2 className={cn(display, 'text-4xl font-extrabold md:text-5xl')}>Что умеет Орбита</h2></BlurFade>
      <div className="mt-12 grid auto-rows-[minmax(240px,auto)] gap-5 md:grid-cols-6">
        <GlowCard className="md:col-span-4">
          <h3 className="text-xl font-semibold">Интеграции без программиста</h3>
          <p className="mt-2 max-w-md text-white/55">Заявки падают в amoCRM или Битрикс24, записи в YCLIENTS, отчёты в Google Таблицы.</p>
          <Terminal className="mt-5 max-w-none border-white/10 bg-black/40 text-xs">
            <TypingAnimation>&gt; orbita connect yclients</TypingAnimation>
            <AnimatedSpan className="text-[#3ef0c3]">✔ Филиал «Петроградская» найден</AnimatedSpan>
            <AnimatedSpan className="text-[#3ef0c3]">✔ 14 услуг и 6 мастеров синхронизированы</AnimatedSpan>
            <AnimatedSpan className="text-[#8fb0ff]">ℹ Свободные окна обновляются каждые 60 с</AnimatedSpan>
            <TypingAnimation className="text-white/60">Готово. Бот принимает записи.</TypingAnimation>
          </Terminal>
        </GlowCard>
        <GlowCard className="md:col-span-2">
          <Mic className="size-6 text-[#f5b544]" />
          <h3 className="mt-4 text-xl font-semibold">Понимает голосовые</h3>
          <p className="mt-2 text-white/55">Клиенты надиктовывают, Орбита расшифровывает и отвечает текстом.</p>
          <div className="mt-auto flex h-12 items-end gap-1">
            {[8, 20, 34, 18, 40, 26, 12, 30, 44, 22, 14, 36, 24, 10, 28].map((h, i) => (
              <span key={i} className="w-full rounded-full bg-gradient-to-t from-[#f5b544]/30 to-[#f5b544]" style={{ height: h }} />
            ))}
          </div>
        </GlowCard>
        <GlowCard className="md:col-span-2">
          <BarChart3 className="size-6 text-[#5b8cff]" />
          <h3 className="mt-4 text-xl font-semibold">Отчёт каждое утро</h3>
          <p className="mt-2 text-white/55">Сколько обращений, записей и о чём спрашивали чаще всего.</p>
          <div className="mt-auto grid grid-cols-3 gap-2 text-center">
            {[['142', 'диалога'], ['37', 'записей'], ['9', 'к менеджеру']].map(([v, l]) => (
              <div key={l} className="rounded-xl bg-white/5 py-2"><div className={cn(display, 'text-lg font-extrabold')}>{v}</div><div className="text-[11px] text-white/45">{l}</div></div>
            ))}
          </div>
        </GlowCard>
        <GlowCard className="md:col-span-4">
          <h3 className="text-xl font-semibold">Говорит как ваш лучший администратор</h3>
          <p className="mt-2 max-w-md text-white/55">Вежливо, коротко, без канцелярита. Тон и правила задаёте вы, сложные вопросы уходят человеку.</p>
          <div className="mt-5 space-y-2 text-sm">
            <div className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-br-md bg-[#5b8cff] px-4 py-2">А можно сегодня вечером? Зуб ноет</div>
            <div className="w-fit max-w-[85%] rounded-2xl rounded-bl-md bg-white/10 px-4 py-2">Сочувствую! Есть окно в 19:40 у доктора Кравцовой. Записать вас? Если боль сильная, можно принять ибупрофен до визита.</div>
          </div>
        </GlowCard>
      </div>
    </section>
  )
}

function Pricing() {
  const plans = [
    { n: 'Старт', p: '2 900', d: 'Для одной точки', f: ['1 канал', 'До 500 диалогов в месяц', 'Запись в календарь'] },
    { n: 'Бизнес', p: '6 900', d: 'Самый популярный', f: ['Все каналы', 'До 3 000 диалогов', 'Интеграция с CRM', 'Голосовые сообщения'], hot: true },
    { n: 'Сеть', p: '14 900', d: 'Для нескольких филиалов', f: ['Безлимит диалогов', 'Отчёты по филиалам', 'Персональный менеджер'] },
  ]
  return (
    <section id="prices" className="mx-auto max-w-6xl px-6 pb-24">
      <BlurFade inView><h2 className={cn(display, 'text-center text-4xl font-extrabold md:text-5xl')}>Тарифы</h2></BlurFade>
      <p className="mt-3 text-center text-white/55">7 дней бесплатно на любом тарифе, без привязки карты</p>
      <div className="mt-12 grid items-stretch gap-6 md:grid-cols-3">
        {plans.map((pl) => {
          const body = (
            <div className="flex h-full flex-col">
              <div className="text-sm text-white/50">{pl.d}</div>
              <div className={cn(display, 'mt-1 text-2xl font-extrabold')}>{pl.n}</div>
              <div className="mt-5"><span className={cn(display, 'text-5xl font-extrabold')}>{pl.p} ₽</span><span className="text-white/45"> / мес</span></div>
              <ul className="mt-6 flex-1 space-y-3 text-sm text-white/70">
                {pl.f.map((x) => <li key={x} className="flex gap-2"><Check className="size-4 shrink-0 text-[#3ef0c3]" />{x}</li>)}
              </ul>
              <a href="#" className={cn('mt-8 rounded-full py-3 text-center text-sm font-semibold transition', pl.hot ? 'bg-white text-[#06070d] hover:bg-white/90' : 'bg-white/10 hover:bg-white/15')}>Начать бесплатно</a>
            </div>
          )
          return pl.hot ? (
            <NeonGradientCard key={pl.n} className="h-full" neonColors={{ firstColor: '#5b8cff', secondColor: '#3ef0c3' }}>{body}</NeonGradientCard>
          ) : (
            <div key={pl.n} className="rounded-[20px] border border-white/10 bg-white/[.03] p-6">{body}</div>
          )
        })}
      </div>
    </section>
  )
}

function Reviews() {
  const items = [
    { quote: 'Раньше половина вечерних сообщений оставалась без ответа до утра. Сейчас записи приходят даже в выходные.', name: 'Мария', title: 'стоматология, Санкт-Петербург' },
    { quote: 'Подключили за один вечер. Администратор наконец занимается гостями, а не перепиской.', name: 'Игорь', title: 'барбершоп, Казань' },
    { quote: 'Удивило, что понимает голосовые. Наши клиенты 50+ пишут голосом, и это сразу сработало.', name: 'Елена', title: 'массажный кабинет, Сургут' },
    { quote: 'Отчёт по утрам показал, что каждый пятый спрашивает про парковку. Добавили на сайт, звонков стало меньше.', name: 'Алексей', title: 'автосервис, Екатеринбург' },
  ]
  return (
    <section className="pb-24">
      <InfiniteMovingCards items={items} direction="left" speed="slow" />
    </section>
  )
}

function Faq() {
  const qs = [
    ['Нужен ли программист?', 'Нет. Мы подключаем Орбиту вместе с вами на созвоне, дальше тексты и цены вы меняете сами в личном кабинете.'],
    ['Что если Орбита не знает ответ?', 'Она честно скажет, что уточнит, и сразу передаст диалог администратору с кратким пересказом.'],
    ['Где хранятся данные клиентов?', 'На серверах в России. Персональные данные обрабатываются по 152-ФЗ.'],
    ['Можно отключить в любой момент?', 'Да, оплата помесячная, без договора на год.'],
  ]
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 pb-24">
      <h2 className={cn(display, 'text-center text-4xl font-extrabold')}>Частые вопросы</h2>
      <Accordion type="single" collapsible className="mt-10">
        {qs.map(([q, a]) => (
          <AccordionItem key={q} value={q} className="border-white/10">
            <AccordionTrigger className="text-left text-base">{q}</AccordionTrigger>
            <AccordionContent className="text-white/60">{a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}

function Cta() {
  return (
    <section className="relative mx-6 mb-12 overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b0d18] px-6 py-20 text-center md:mx-auto md:max-w-6xl">
      <FlickeringGrid className="absolute inset-0 [mask-image:radial-gradient(500px_circle_at_center,white,transparent)]" squareSize={4} gridGap={6} color="#5b8cff" maxOpacity={0.35} flickerChance={0.1} />
      <div className="relative">
        <h2 className={cn(display, 'text-4xl font-extrabold md:text-6xl')}>Перестаньте терять<br />ночные заявки</h2>
        <p className="mx-auto mt-5 max-w-md text-white/60">Покажем Орбиту на вашем прайсе за 15 минут. Если не подойдёт, просто не продлевайте.</p>
        <div className="mt-8 flex justify-center"><InteractiveHoverButton className="border-white/20 bg-white text-[#06070d]">Записаться на демо</InteractiveHoverButton></div>
      </div>
    </section>
  )
}

export default function App() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#06070d] text-white">
      <Nav />
      <Hero />
      <Channels />
      <Steps />
      <Features />
      <Pricing />
      <Reviews />
      <Faq />
      <Cta />
      <footer className="mx-auto flex max-w-6xl flex-wrap justify-between gap-4 px-6 pb-10 text-sm text-white/35">
        <span>© Орбита, 2026</span>
      </footer>
    </div>
  )
}
