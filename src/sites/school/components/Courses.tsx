import { useState } from 'react'
import { Code2, X } from 'lucide-react'
import { highlight } from '../lib/highlight'
import type { Lang } from '../lib/highlight'

type Course = {
  id: string
  title: string
  age: string
  text: string
  result: string
  months: string
  format: string
  price: string
  file: string
  lang: Lang
  code: string
}

const COURSES: Course[] = [
  {
    id: 'py',
    title: 'Python и Telegram-боты',
    age: '11+',
    text: 'Учим язык, на котором пишут в Яндексе и NASA. Начинаем с черепашьей графики, к концу курса у ребёнка свой бот с кнопками и базой данных.',
    result: 'Бот для класса: расписание, напоминания о домашке, мини-викторины.',
    months: '9 месяцев',
    format: '2 урока в неделю по 90 минут',
    price: '5 900 ₽ в месяц',
    file: 'bot.py',
    lang: 'py',
    code: `from aiogram import Bot, Dispatcher, F
from aiogram.types import Message

dp = Dispatcher()

@dp.message(F.text == "/start")
async def start(msg: Message):
    await msg.answer("Привет! Я бот 7Б")

@dp.message(F.text == "дз")
async def homework(msg: Message):
    tasks = await db.homework(date.today())
    await msg.answer("\\n".join(tasks))`,
  },
  {
    id: 'unity',
    title: 'Игры на Unity',
    age: '12+',
    text: 'Платформер, раннер и шутер с видом сверху. Пишем на C#, рисуем уровни и выкладываем игры на itch.io.',
    result: '3 игры, в которые можно дать поиграть друзьям по ссылке.',
    months: '12 месяцев',
    format: '2 урока в неделю по 90 минут',
    price: '5 900 ₽ в месяц',
    file: 'Player.cs',
    lang: 'cs',
    code: `void Update() {
    float x = Input.GetAxis("Horizontal");
    rb.velocity = new Vector2(x * speed, rb.velocity.y);

    if (Input.GetButtonDown("Jump") && onGround)
        rb.AddForce(Vector2.up * jump, ForceMode2D.Impulse);
}`,
  },
  {
    id: 'web',
    title: 'Веб-разработка',
    age: '13+',
    text: 'HTML, CSS и JavaScript без конструкторов. Верстаем, оживляем страницы и публикуем сайт на своём домене.',
    result: 'Сайт-портфолио и онлайн-игра в браузере.',
    months: '9 месяцев',
    format: '2 урока в неделю по 90 минут',
    price: '5 900 ₽ в месяц',
    file: 'like.js',
    lang: 'js',
    code: `const btn = document.querySelector("#like");
let likes = 0;

btn.addEventListener("click", () => {
  likes++;
  btn.textContent = \`♥ \${likes}\`;
  btn.animate([{ scale: 1.3 }, { scale: 1 }], 300);
});`,
  },
]

type Tone = 'blue' | 'yellow' | 'paper'

const TONES: Record<Tone, { card: string; muted: string; rule: string; key: string }> = {
  blue: {
    card: 'bg-[#3d5afe] text-white shadow-[0_40px_80px_-40px_rgba(61,90,254,.8)]',
    muted: 'text-white/75',
    rule: 'border-white/25',
    key: 'kk-key--yellow',
  },
  yellow: {
    card: 'bg-[#ffc400] text-[#14161f]',
    muted: 'text-[#14161f]/70',
    rule: 'border-[#14161f]/15',
    key: 'kk-key--ink',
  },
  paper: {
    card: 'bg-white text-[#14161f] ring-1 ring-[#d9deea]',
    muted: 'text-[#5b6172]',
    rule: 'border-[#d9deea]',
    key: 'kk-key--mint',
  },
}

function CourseCard({ c, tone, featured = false }: { c: Course; tone: Tone; featured?: boolean }) {
  const [open, setOpen] = useState(false)
  const t = TONES[tone]
  const codeId = `code-${c.id}`

  return (
    <article
      className={`group relative flex min-w-0 flex-col overflow-hidden ${featured ? 'rounded-[34px] p-6 sm:p-9 lg:row-span-2 lg:min-h-[640px]' : 'rounded-[26px] p-6 sm:p-8 lg:min-h-[308px]'} ${t.card}`}
    >
      {featured && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-4 -bottom-10 text-[clamp(9rem,22vw,19rem)] leading-none font-black tracking-[-0.08em] text-white/[0.09] select-none"
        >
          {c.age}
        </span>
      )}

      <div className="relative flex items-start justify-between gap-4">
        <h3
          className={`min-w-0 font-extrabold tracking-[-0.04em] ${featured ? 'text-[clamp(2rem,1.2rem+2.8vw,3.6rem)] leading-[0.95]' : 'text-[clamp(1.6rem,1.2rem+1.2vw,2.2rem)] leading-[1]'}`}
        >
          {c.title}
        </h3>
        <span className={`kk-key ${t.key} h-12 min-w-14 shrink-0 cursor-default px-3 text-lg font-black`} aria-label={`Возраст от ${c.age.replace('+', '')} лет`}>
          {c.age}
        </span>
      </div>

      <p className={`relative mt-4 mb-7 max-w-[36rem] text-[1.02rem] leading-relaxed ${t.muted}`}>{c.text}</p>

      {featured && (
        // Always-visible preview of the first lines; the full listing slides up on hover / tap
        <div
          aria-hidden="true"
          className="relative mb-7 h-[190px] min-h-[150px] overflow-hidden rounded-[20px] bg-[#14161f]/90 shadow-[inset_0_0_0_1px_rgba(255,255,255,.08)] [mask-image:linear-gradient(#000_55%,transparent)] lg:h-auto lg:flex-1"
        >
          <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5">
            <i className="block h-2.5 w-2.5 rounded-full bg-[#ff5a36]" />
            <i className="block h-2.5 w-2.5 rounded-full bg-[#ffc400]" />
            <i className="block h-2.5 w-2.5 rounded-full bg-[#00c389]" />
            <span className="kk-mono ml-auto text-[0.78rem] text-white/55">{c.file}</span>
          </div>
          <pre className="kk-mono overflow-hidden px-4 py-4 text-[clamp(0.7rem,0.62rem+0.3vw,0.86rem)] leading-[1.65] text-[#e9ecf5]">
            <code>{highlight(c.code, c.lang)}</code>
          </pre>
        </div>
      )}

      <dl className={`relative mt-auto grid gap-x-6 gap-y-3 border-t pt-5 text-[0.95rem] ${t.rule} ${featured ? 'sm:grid-cols-2' : 'sm:grid-cols-3'}`}>
        {featured && (
          <div className="sm:col-span-2">
            <dt className={t.muted}>Итог курса</dt>
            <dd className="mt-0.5 text-[1.15rem] font-bold">{c.result}</dd>
          </div>
        )}
        <div>
          <dt className={t.muted}>Длительность</dt>
          <dd className="mt-0.5 font-semibold">{c.months}</dd>
        </div>
        <div>
          <dt className={t.muted}>Формат</dt>
          <dd className="mt-0.5 font-semibold">{c.format}</dd>
        </div>
        <div className={featured ? 'sm:col-span-2' : ''}>
          <dt className={t.muted}>Цена</dt>
          <dd className="mt-0.5 font-semibold">{c.price}</dd>
        </div>
      </dl>

      <button
        type="button"
        aria-expanded={open}
        aria-controls={codeId}
        onClick={() => setOpen((v) => !v)}
        className={`relative mt-6 inline-flex w-fit items-center gap-2 rounded-xl text-[0.97rem] font-bold underline decoration-2 underline-offset-[6px] ${tone === 'blue' ? 'decoration-[#ffc400]' : tone === 'yellow' ? 'decoration-[#14161f]' : 'decoration-[#00c389]'}`}
      >
        <Code2 size={18} aria-hidden="true" />
        {open ? 'Скрыть код' : 'Что ребёнок напишет'}
      </button>

      {/* Code sheet: slides up on hover (pointer devices), focus or tap */}
      <div
        id={codeId}
        data-open={open}
        className="absolute inset-x-3 bottom-3 z-10 translate-y-[calc(100%+16px)] rounded-[20px] bg-[#14161f] text-left shadow-[0_30px_60px_-20px_rgba(0,0,0,.6)] transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:translate-y-0 data-[open=true]:translate-y-0"
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2.5">
          <span className="flex items-center gap-1.5" aria-hidden="true">
            <i className="block h-2.5 w-2.5 rounded-full bg-[#ff5a36]" />
            <i className="block h-2.5 w-2.5 rounded-full bg-[#ffc400]" />
            <i className="block h-2.5 w-2.5 rounded-full bg-[#00c389]" />
          </span>
          <span className="kk-mono text-[0.78rem] text-white/55">{c.file}</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className={`rounded-md p-1 text-white/60 hover:text-white ${open ? '' : 'invisible'}`}
            aria-label="Скрыть код"
            tabIndex={open ? 0 : -1}
          >
            <X size={16} />
          </button>
        </div>
        <pre className="kk-mono overflow-x-auto px-4 py-4 text-[clamp(0.7rem,0.62rem+0.3vw,0.86rem)] leading-[1.65] text-[#e9ecf5]">
          <code>{highlight(c.code, c.lang)}</code>
        </pre>
      </div>
    </article>
  )
}

export function Courses() {
  return (
    <section id="kursy" className="relative py-20 sm:py-28" aria-labelledby="kursy-h">
      <div className="kk-wrap">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:items-end">
          <h2 id="kursy-h" className="kk-h2">
            Три курса, и в каждом ребёнок делает свой проект
          </h2>
          <p className="kk-lead lg:justify-self-end">
            Возраст указан как нижняя граница: 14-летнему новичку подойдёт любой курс. Наведите на карточку, чтобы
            увидеть код из программы.
          </p>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-12 lg:gap-5">
          <div className="grid min-w-0 lg:col-span-7 lg:row-span-2">
            <CourseCard c={COURSES[0]} tone="blue" featured />
          </div>
          <div className="grid min-w-0 lg:col-span-5">
            <CourseCard c={COURSES[1]} tone="yellow" />
          </div>
          <div className="grid min-w-0 lg:col-span-5">
            <CourseCard c={COURSES[2]} tone="paper" />
          </div>
        </div>
      </div>
    </section>
  )
}
