import { Check } from 'lucide-react'
import { BorderBeam } from '@/components/magicui/border-beam'
import { CAR_CLASSES, PACKAGES, type CarClass } from '../data'
import { AnimatedPrice, Segmented } from './ui'

export function Pricing({ carClass, setCarClass, onBook }: { carClass: CarClass; setCarClass: (c: CarClass) => void; onBook: (service: string) => void }) {
  return (
    <section id="prices" className="relative isolate scroll-mt-20 overflow-hidden py-24 lg:py-36" aria-labelledby="prices-title">
      <div aria-hidden className="gl-blob -z-10 left-1/2 top-[58%] h-[420px] w-[min(760px,90vw)] -translate-x-1/2 -translate-y-1/2 bg-[#3b7bff] opacity-[0.16]" />
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <h2 id="prices-title" className="gl-display text-[clamp(2.3rem,6vw,5.5rem)] text-[#eef1f5]">
              Пакеты
            </h2>
            <p className="mt-5 max-w-[30rem] text-[1.05rem] leading-relaxed text-[#8c939e]">
              Цена фиксируется после осмотра и дальше не меняется. Мойка перед работой уже включена.
            </p>
          </div>
          <Segmented options={CAR_CLASSES} value={carClass} onChange={setCarClass} label="Класс автомобиля" size="lg" />
        </div>

        <div className="mt-14 grid gap-5 lg:mt-20 lg:grid-cols-3 lg:items-center lg:gap-0">
          {PACKAGES.map((p, i) => {
            const f = !!p.featured
            return (
              <article
                key={p.id}
                className={`relative flex min-w-0 flex-col ${
                  f
                    ? 'z-10 rounded-[30px] border border-[#3b414a] bg-[linear-gradient(180deg,#20242b,#15171b)] p-7 shadow-[0_40px_120px_-40px_rgba(59,123,255,0.55)] sm:p-9 lg:py-14'
                    : `rounded-[26px] border border-[#2b2f36] bg-[#0e0f12]/60 p-7 sm:p-8 ${i === 0 ? 'lg:rounded-r-none lg:border-r-0' : 'lg:rounded-l-none lg:border-l-0'}`
                }`}
              >
                {f && <BorderBeam size={180} duration={9} colorFrom="#3b7bff" colorTo="#e6ebf2" borderWidth={1.5} />}
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className={`gl-display text-[clamp(1.7rem,2.6vw,2.3rem)] ${f ? 'gl-chrome-quiet' : 'text-[#d9dee5]'}`}>{p.name}</h3>
                </div>
                <p className="mt-2 text-[0.95rem] text-[#8c939e]">{p.lead}</p>
                <p className={`mt-7 font-bold tracking-[-0.02em] text-white ${f ? 'text-[clamp(2.2rem,3.4vw,3rem)]' : 'text-[clamp(1.9rem,2.8vw,2.4rem)]'}`}>
                  <AnimatedPrice value={p.price[carClass]} />
                </p>
                <ul className="mt-7 flex flex-col gap-3">
                  {p.items.map((it) => (
                    <li key={it} className="flex gap-3 text-[0.98rem] leading-snug text-[#b7bdc6]">
                      <Check aria-hidden size={18} className={`mt-0.5 shrink-0 ${f ? 'text-[#3b7bff]' : 'text-[#5d636d]'}`} />
                      <span className="min-w-0">{it}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => onBook(p.id === 'armor' ? 'ppf' : p.id === 'ceramic' ? 'ceramic' : 'polish')}
                  className={`mt-9 h-13 w-full px-6 text-[1rem] ${f ? 'gl-cta' : 'gl-ghost justify-center'}`}
                >
                  Выбрать «{p.name}»
                </button>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
