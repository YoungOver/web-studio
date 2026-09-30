import { View } from '@react-three/drei'
import { motion } from 'motion/react'
import { ArrowDown, Star } from 'lucide-react'
import { byId, rub } from '../data'
import { scrollToId } from '../hooks'
import { useShop } from '../store'
import { HeroScene } from '../three/Scenes'

const ease = [0.2, 0.8, 0.2, 1] as const
const rise = (d: number) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: d, duration: 1, ease },
})

export function Hero() {
  const p = byId('serum-lavender')
  const { openProduct } = useShop()
  return (
    <section id="top" className="relative -mt-[68px] pt-[68px]">
      <div className="mx-auto grid max-w-[1440px] items-stretch px-4 sm:px-8 lg:h-[calc(100svh-36px)] lg:max-h-[960px] lg:min-h-[700px] lg:grid-cols-[1fr_1.05fr]">
        <div className="relative z-10 flex flex-col justify-center max-lg:contents lg:py-16">
          <motion.p {...rise(0.05)} className="relative z-10 flex items-center gap-2.5 text-[0.9rem] text-[var(--muted)] max-lg:order-1 max-lg:pt-8">
            <span className="size-1.5 rounded-full bg-[var(--lav)]" />
            Малые партии ручной работы из Крыма
          </motion.p>
          <h1 className="lv-serif relative z-10 mt-6 max-lg:order-2 text-[clamp(2.9rem,6.1vw,5.9rem)] leading-[0.95] tracking-[-0.03em]">
            <motion.span {...rise(0.12)} className="block">
              Уход, собранный
            </motion.span>
            <motion.span {...rise(0.22)} className="block">
              на <em className="text-[var(--olive)]">лавандовом</em>
            </motion.span>
            <motion.span {...rise(0.32)} className="block">
              поле
            </motion.span>
          </h1>
          <motion.p {...rise(0.45)} className="relative z-10 mt-6 max-w-[30rem] text-[1.0625rem] max-lg:order-4 max-lg:mt-2 leading-[1.65] text-[#45433d]">
            Сыворотки, масла и кремы на маслах холодного отжима. До 99 % ингредиентов природного происхождения, стеклянные флаконы и
            проценты активов прямо на этикетке.
          </motion.p>
          <motion.div {...rise(0.55)} className="relative z-10 mt-9 flex flex-wrap items-center gap-3 max-lg:order-5 max-sm:mt-7 max-sm:[&>button]:flex-1">
            <button onClick={() => scrollToId('quiz')} className="lv-btn lv-btn-primary h-14 px-7 text-[1rem]">
              Подобрать уход
              <span className="grid size-7 place-items-center rounded-full bg-white/12">
                <ArrowDown className="size-3.5" />
              </span>
            </button>
            <button onClick={() => scrollToId('catalog')} className="lv-btn lv-btn-ghost h-14 px-7 text-[1rem]">
              Смотреть каталог
            </button>
          </motion.div>
          <motion.dl {...rise(0.7)} className="relative z-10 mt-10 grid max-w-[34rem] grid-cols-3 gap-5 border-t border-[var(--line)] pt-6 max-lg:order-6 max-sm:mt-9 max-sm:gap-3">
            <div>
              <dt className="lv-num flex items-center gap-1 text-[1.7rem] leading-none">
                4,9 <Star className="size-4 fill-[var(--lav)] text-[var(--lav)]" />
              </dt>
              <dd className="mt-2 text-[0.8125rem] leading-snug text-[var(--muted)]">средняя оценка, 2 140 отзывов</dd>
            </div>
            <div>
              <dt className="lv-num text-[1.7rem] leading-none">0 %</dt>
              <dd className="mt-2 text-[0.8125rem] leading-snug text-[var(--muted)]">силиконов и минеральных масел</dd>
            </div>
            <div>
              <dt className="lv-num text-[1.7rem] leading-none">−10 %</dt>
              <dd className="mt-2 text-[0.8125rem] leading-snug text-[var(--muted)]">за каждый сданный флакон</dd>
            </div>
          </motion.dl>
        </div>

        <div className="relative min-h-[400px] max-lg:order-3 sm:min-h-[560px] lg:min-h-0">
          {/* arch window behind the product */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease }}
            className="absolute top-[4%] bottom-[6%] left-1/2 w-[min(78%,520px)] -translate-x-1/2 rounded-t-full"
            style={{ background: 'linear-gradient(180deg, #ddd6e6 0%, #e5dfe0 45%, #e4ded5 100%)' }}
          >
            <div className="absolute inset-3 rounded-t-full border border-white/50" />
          </motion.div>
          <View className="absolute inset-0" index={1}>
            <HeroScene />
          </View>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1, duration: 0.9, ease }}
            onClick={() => openProduct(p.id)}
            className="group absolute right-0 bottom-[12%] z-10 flex items-center gap-3 rounded-2xl border border-white/60 bg-[rgba(246,243,238,0.72)] py-2.5 pr-4 pl-2.5 text-left shadow-[0_20px_40px_-24px_rgba(30,30,28,0.5)] backdrop-blur-md sm:right-2 lg:right-4"
          >
            <span className="grid size-11 place-items-center rounded-xl bg-[var(--lav-soft)] text-[0.75rem] font-semibold text-[var(--olive)]">
              № {p.num}
            </span>
            <span>
              <span className="block text-[0.8125rem] text-[var(--muted)]">
                {p.kind}, 30 мл
              </span>
              <span className="block text-[0.95rem] font-semibold">{p.title}</span>
            </span>
            <span className="lv-num ml-2 text-[1.05rem]">{rub(p.prices[30])}</span>
          </motion.button>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.3, duration: 0.9, ease }}
            className="absolute top-[16%] left-0 z-10 max-w-[13.5rem] rounded-2xl border border-white/60 bg-[rgba(246,243,238,0.66)] p-3.5 text-[0.8125rem] leading-snug shadow-[0_20px_40px_-24px_rgba(30,30,28,0.5)] backdrop-blur-md max-sm:hidden lg:left-2"
          >
            <span className="flex items-center gap-2 font-semibold">
              <span className="size-1.5 rounded-full bg-[var(--lav)]" /> Бакучиол 1 %
            </span>
            <span className="mt-1 block text-[var(--muted)]">растительная альтернатива ретинолу, без шелушения</span>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
