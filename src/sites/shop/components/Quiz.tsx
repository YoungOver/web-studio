import { useMemo, useRef, useState } from 'react'
import { View } from '@react-three/drei'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowRight, Check, RotateCcw } from 'lucide-react'
import { QUIZ, SET_DISCOUNT, recommend, rub, type Concern, type Product, type QuizAnswers } from '../data'
import { useShop } from '../store'
import { ProductScene } from '../three/Scenes'

const ease = [0.2, 0.8, 0.2, 1] as const
const CONCERN: Record<Concern, string> = { dryness: 'сухость', dullness: 'тусклый тон', breakouts: 'высыпания', redness: 'покраснения' }

export function Quiz() {
  const [step, setStep] = useState(0)
  const [a, setA] = useState<QuizAnswers>({})
  const [dir, setDir] = useState(1)
  const done = step >= QUIZ.length
  const result = useMemo(() => (done ? recommend(a) : []), [done, a])

  const pick = (v: string) => {
    const q = QUIZ[step]
    setA((x) => ({ ...x, [q.id]: v }))
    setDir(1)
    setTimeout(() => setStep((s) => s + 1), 220)
  }
  const back = () => {
    setDir(-1)
    setStep((s) => Math.max(0, s - 1))
  }
  const reset = () => {
    setDir(-1)
    setA({})
    setStep(0)
  }

  return (
    <section id="quiz" className="relative mx-auto max-w-[1440px] px-4 pt-24 sm:px-8 lg:pt-32">
      <div className="relative overflow-hidden rounded-[28px] bg-[var(--olive)] text-[#efece4] sm:rounded-[36px]">
        <svg className="pointer-events-none absolute -top-24 -right-24 h-[520px] w-[520px] opacity-[0.07]" viewBox="0 0 200 200" aria-hidden>
          {Array.from({ length: 14 }).map((_, i) => (
            <circle key={i} cx="100" cy="100" r={12 + i * 6.5} fill="none" stroke="#fff" strokeWidth=".6" />
          ))}
        </svg>
        <div className="relative grid gap-10 p-6 sm:p-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:p-16">
          <div className="flex flex-col">
            <p className="text-[0.9rem] text-[#b9bfae]">Четыре вопроса, один набор</p>
            <h2 className="lv-serif mt-3 text-[clamp(2.3rem,4.4vw,4rem)] leading-[0.98] tracking-[-0.025em]">
              Подбор ухода <em className="text-[var(--lav-2)]">за 30 секунд</em>
            </h2>
            <p className="mt-5 max-w-[26rem] text-[1rem] leading-relaxed text-[#c9cdbf]">
              Четыре вопроса — и мы соберём набор из средств, которые работают вместе. Со скидкой 10 % на весь набор.
            </p>
            <div className="mt-6 flex min-h-8 flex-wrap gap-1.5">
              <AnimatePresence>
                {QUIZ.map((q) => {
                  const o = q.options.find((x) => x.value === a[q.id])
                  if (!o) return null
                  const label = q.id === 'skin' ? `Кожа: ${o.label.toLowerCase()}` : q.id === 'steps' ? `${o.label} шага` : o.label
                  return (
                    <motion.span
                      key={q.id}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      className="rounded-full border border-white/15 bg-white/[0.07] px-3 py-1.5 text-[0.8125rem] text-[#e4e1d8]"
                    >
                      {label}
                    </motion.span>
                  )
                })}
              </AnimatePresence>
            </div>
            <div className="mt-auto pt-10">
              <div className="flex gap-1.5" aria-hidden>
                {QUIZ.map((_, i) => (
                  <span key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-white/15">
                    <motion.span
                      className="block h-full rounded-full bg-[var(--lav-2)]"
                      initial={false}
                      animate={{ width: i < step ? '100%' : '0%' }}
                      transition={{ duration: 0.5, ease }}
                    />
                  </span>
                ))}
              </div>
              <p className="mt-3 text-[0.875rem] text-[#b9bfae]">
                {done ? 'Готово, вот ваш набор' : `Вопрос ${step + 1} из ${QUIZ.length}`}
              </p>
            </div>
          </div>

          <div className="relative min-h-[420px]">
            <AnimatePresence mode="wait" custom={dir}>
              {!done ? (
                <motion.div
                  key={step}
                  custom={dir}
                  initial={{ opacity: 0, x: dir * 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: dir * -40 }}
                  transition={{ duration: 0.4, ease }}
                >
                  <p className="lv-serif text-[clamp(1.6rem,2.6vw,2.3rem)] leading-[1.1]">{QUIZ[step].q}</p>
                  <p className="mt-2.5 text-[0.9rem] text-[#b9bfae]">{QUIZ[step].hint}</p>
                  <div className={`mt-7 grid gap-3 ${QUIZ[step].options.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
                    {QUIZ[step].options.map((o, i) => {
                      const on = a[QUIZ[step].id] === o.value
                      return (
                        <button
                          key={o.value}
                          onClick={() => pick(o.value)}
                          className={`group relative flex min-h-[104px] flex-col items-start rounded-2xl border p-5 text-left transition-colors duration-200 ${
                            on ? 'border-[var(--lav-2)] bg-white/12' : 'border-white/15 bg-white/[0.04] hover:border-white/35 hover:bg-white/[0.08]'
                          }`}
                        >
                          <span className="lv-num absolute top-4 right-4 text-[0.8rem] text-white/35">0{i + 1}</span>
                          <span className="text-[1.1rem] font-semibold">{o.label}</span>
                          <span className="mt-1 text-[0.875rem] text-[#b9bfae]">{o.sub}</span>
                          <span
                            className={`mt-auto grid size-6 place-items-center rounded-full border transition-colors ${
                              on ? 'border-[var(--lav-2)] bg-[var(--lav-2)] text-[var(--olive)]' : 'border-white/25 group-hover:border-white/50'
                            }`}
                          >
                            {on ? <Check className="size-3.5" /> : <ArrowRight className="size-3 opacity-0 transition-opacity group-hover:opacity-70" />}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                  {step > 0 && (
                    <button onClick={back} className="mt-6 inline-flex items-center gap-2 text-[0.9rem] text-[#c9cdbf] hover:text-white">
                      <ArrowLeft className="size-4" /> Назад
                    </button>
                  )}
                </motion.div>
              ) : (
                <Result key="r" items={result} a={a} onReset={reset} />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

function why(p: Product, a: QuizAnswers) {
  const c = a.concern as Concern | undefined
  if (c && p.concerns.includes(c)) return `Работает с задачей «${CONCERN[c]}»`
  if (p.kind.startsWith('Крем')) return 'Закрепляет результат и держит влагу'
  if (p.category === 'body') return 'Завершает ритуал после душа'
  return 'Мягко дополняет остальные шаги'
}

function Result({ items, a, onReset }: { items: Product[]; a: QuizAnswers; onReset: () => void }) {
  const { add, applyPromo } = useShop()
  const [added, setAdded] = useState(false)
  const btn = useRef<HTMLButtonElement>(null)
  const sum = items.reduce((s, p) => s + p.prices[30], 0)
  const total = Math.round(sum * (1 - SET_DISCOUNT))
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5, ease }}>
      <p className="lv-serif text-[clamp(1.6rem,2.6vw,2.3rem)] leading-[1.1]">Ваш набор из {items.length === 2 ? 'двух' : items.length === 3 ? 'трёх' : 'четырёх'} шагов</p>
      <div className={`mt-6 grid gap-3 ${items.length === 4 ? 'sm:grid-cols-4' : items.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
        {items.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease }}
            className="flex overflow-hidden rounded-2xl bg-[#f1ede6] text-[var(--ink)] sm:flex-col"
          >
            <div className="relative aspect-square w-28 shrink-0 sm:w-auto" style={{ background: `linear-gradient(180deg, #f3efe9, ${p.tone})` }}>
              <View className="absolute inset-0" index={1}>
                <ProductScene p={p} phase={i} spinSpeed={0.5} />
              </View>
              <span className="lv-num absolute top-2.5 left-3 z-10 text-[0.75rem] text-[var(--ink)]/55 max-sm:hidden">Шаг {i + 1}</span>
            </div>
            <div className="flex flex-1 flex-col p-3 sm:p-4">
              <span className="text-[0.75rem] text-[var(--muted)]">
                <span className="sm:hidden">Шаг {i + 1} · </span>
                {p.kind} № {p.num}
              </span>
              <span className="lv-serif mt-0.5 text-[1.05rem] leading-tight sm:text-[1.2rem]">{p.title}</span>
              <span className="mt-1.5 text-[0.78rem] leading-snug text-[var(--muted)]">{why(p, a)}</span>
              <span className="lv-num mt-auto pt-2 text-[0.95rem]">{rub(p.prices[30])}</span>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-6 flex flex-col gap-4 border-t border-white/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[0.875rem] text-[#b9bfae]">
            Набор по 30 мл, скидка 10 % <span className="lv-num ml-1 line-through opacity-70">{rub(sum)}</span>
          </p>
          <p className="lv-num mt-1 text-[2rem] leading-none">{rub(total)}</p>
        </div>
        <div className="grid grid-cols-[auto_1fr] gap-2.5 sm:flex">
          <button onClick={onReset} className="lv-btn h-13 border border-white/20 px-5 py-4 text-[#efece4] hover:bg-white/10">
            <RotateCcw className="size-4" /> Заново
          </button>
          <button
            ref={btn}
            onClick={() => {
              items.forEach((p, i) => add(p.id, 30, 1, i === 0 ? btn.current?.getBoundingClientRect() : null))
              applyPromo('НАБОР')
              setAdded(true)
            }}
            className="lv-btn h-13 bg-[#efece4] px-6 py-4 text-[var(--olive)] hover:bg-white"
          >
            {added ? (
              <>
                <Check className="size-4" /> Набор в корзине
              </>
            ) : (
              'Добавить набор в корзину'
            )}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
