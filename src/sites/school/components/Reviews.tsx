import type { ReactNode } from 'react'

const PARENTS = [
  {
    q: 'Сын полгода сидел в Roblox, теперь сам делает игры в Unity и показывает их младшей сестре. На демо-дне я впервые поняла, чем он занят за компьютером.',
    who: 'Ольга',
    meta: 'мама Тимура, 13 лет',
  },
  {
    q: 'Группа маленькая, преподаватель знает, где у Вари затык, и после каждого модуля пишет мне короткий отчёт. Ради этого и пришли.',
    who: 'Андрей',
    meta: 'папа Вари, 12 лет',
  },
  {
    q: 'Пропустили две недели из-за болезни. Записи уроков и чат с наставником помогли догнать группу без репетитора.',
    who: 'Марина',
    meta: 'мама Димы, 15 лет',
  },
  {
    q: 'Боялась, что это ещё один способ сидеть в телефоне. Оказалось наоборот: дочь стала планировать время, чтобы успеть доделать проект.',
    who: 'Екатерина',
    meta: 'мама Сони, 16 лет',
  },
]

const TEENS = [
  { q: 'Мой бот напоминает про домашку. Им пользуется полкласса.', who: 'Лёша, 14 лет', course: 'Python', tone: 'bg-[#3d5afe] text-white' },
  { q: 'Мой платформер на itch.io прошли 300 человек.', who: 'Максим, 15 лет', course: 'Unity', tone: 'bg-[#ffc400] text-[#14161f]' },
  { q: 'Сделала сайт для нашей группы, у него уже свой домен.', who: 'Соня, 16 лет', course: 'Веб', tone: 'bg-[#00c389] text-[#14161f]' },
  { q: 'Думал, будет как в школе. А тут можно спорить с преподом, если твой код работает.', who: 'Кирилл, 12 лет', course: 'Unity', tone: 'bg-[#ff5a36] text-white' },
  { q: 'Первую игру собрал за три недели. Брат не поверил, что это я.', who: 'Артём, 12 лет', course: 'Unity', tone: 'bg-white text-[#14161f] ring-1 ring-[#d9deea]' },
  { q: 'Сначала было страшно только первую неделю. Потом затянуло.', who: 'Вика, 13 лет', course: 'Python', tone: 'bg-[#14161f] text-white' },
]

const AV = ['bg-[#3d5afe] text-white', 'bg-[#ffc400]', 'bg-[#00c389]', 'bg-[#ff5a36] text-white']

function Row({ children, reverse, dur, label }: { children: ReactNode; reverse?: boolean; dur: string; label: string }) {
  return (
    <div className="kk-marquee-host relative overflow-hidden py-3 [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]">
      <div className="kk-marquee" data-reverse={reverse} style={{ ['--kk-dur' as string]: dur }}>
        <ul aria-label={label} className="flex shrink-0 gap-4 pr-4">
          {children}
        </ul>
        <ul aria-hidden="true" className="flex shrink-0 gap-4 pr-4">
          {children}
        </ul>
      </div>
    </div>
  )
}

export function Reviews() {
  return (
    <section id="otzyvy" className="relative py-20 sm:py-28" aria-labelledby="otz-h">
      <div className="kk-wrap">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:items-end">
          <h2 id="otz-h" className="kk-h2">
            Родители видят результат, ученики хотят ещё
          </h2>
          <p className="kk-lead lg:justify-self-end">Отзывы собираем после демо-дней. Верхний ряд пишут родители, нижний сами ребята.</p>
        </div>
      </div>

      <div className="mt-12 grid gap-3">
        <Row dur="80s" label="Отзывы родителей">
          {PARENTS.concat(PARENTS).map((r, i) => (
            <li key={i} aria-hidden={i >= PARENTS.length || undefined} className="w-[min(84vw,420px)] shrink-0 snap-start">
              <figure className="flex h-full flex-col justify-between gap-6 rounded-[26px] bg-white p-6 shadow-[0_24px_40px_-32px_rgba(20,22,31,.5)] sm:p-7">
                <blockquote className="text-[1.05rem] leading-relaxed text-[#2a2e3d]">«{r.q}»</blockquote>
                <figcaption className="flex items-center gap-3">
                  <span aria-hidden="true" className={`kk-key h-11 w-11 shrink-0 cursor-default rounded-[12px] text-lg font-black ${AV[i % 4]}`}>
                    {r.who[0]}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-bold">{r.who}</span>
                    <span className="block text-[0.9rem] text-[#5b6172]">{r.meta}</span>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </Row>
        <Row dur="64s" reverse label="Отзывы учеников">
          {TEENS.map((r) => (
            <li key={r.who} className="w-[min(78vw,340px)] shrink-0 snap-start">
              <figure className={`flex h-full flex-col justify-between gap-8 rounded-[22px] p-6 ${r.tone}`}>
                <blockquote className="text-[1.3rem] leading-[1.2] font-bold tracking-[-0.02em]">{r.q}</blockquote>
                <figcaption className="flex items-center justify-between gap-3 text-[0.92rem]">
                  <span className="font-semibold">{r.who}</span>
                  <span className="rounded-full border border-current/25 px-2.5 py-0.5 opacity-80">{r.course}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </Row>
      </div>
    </section>
  )
}
