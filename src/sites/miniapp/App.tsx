import '@fontsource-variable/onest'
import '@fontsource-variable/inter-tight'
import './styles.css'
import { motion } from 'motion/react'
import { Bell, CreditCard, Gift, MousePointerClick, Timer } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { MiniApp } from './app/MiniApp'
import { PhoneFrame, StatusBar, usePhoneScale } from './PhoneFrame'

function useMedia(q: string) {
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches)
  useEffect(() => {
    const mq = window.matchMedia(q)
    const on = () => setM(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [q])
  return m
}

const benefits: { icon: typeof Timer; title: string; text: string }[] = [
  { icon: Timer, title: 'Заказ без очереди', text: 'Гость выбирает точку и время. Бариста видит заказ сразу после оплаты.' },
  { icon: CreditCard, title: 'Оплата внутри Telegram', text: 'Apple Pay, Google Pay и карта через Telegram Payments, без перехода на сайт.' },
  { icon: Gift, title: 'Бонусы', text: 'Баллы копятся с каждого заказа и списываются одним переключателем.' },
  { icon: Bell, title: 'Уведомление о готовности', text: 'Бот пишет, когда напиток готов: гость подходит к стойке, а не ждёт у неё.' },
]

const stack = ['Telegram WebApp API', 'React', 'TypeScript', 'aiogram 3', 'Telegram Payments', 'PostgreSQL']

function Note({ children, className }: { children: ReactNode; className: string }) {
  return (
    <div className={`pointer-events-none absolute hidden w-[178px] items-center gap-3 min-[1360px]:flex ${className}`}>
      <span className="h-px w-7 bg-[#16130f]/25" />
      <span className="max-w-[150px] text-[13px] leading-[18px] text-[#16130f]/60">{children}</span>
    </div>
  )
}

function Showcase() {
  const scale = usePhoneScale(48)
  const fade = (d: number) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay: d, ease: [0.22, 1, 0.36, 1] as const } })
  return (
    <div className="show show-grain relative min-h-screen overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(900px 700px at 74% 52%, rgba(210,178,142,.55), transparent 62%), radial-gradient(600px 500px at 8% 0%, rgba(255,255,255,.7), transparent 70%)',
        }}
      />
      <div className="relative mx-auto grid min-h-screen max-w-[1320px] items-center gap-x-16 gap-y-14 px-8 py-12 md:px-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:py-6 xl:gap-x-20">
        <div className="max-w-[560px]">
          <motion.div {...fade(0)} className="flex items-center gap-2 text-[14px] text-[#16130f]/65">
            <span className="grid h-[22px] w-[22px] place-items-center rounded-full bg-[#2481cc]">
              <svg width="11" height="11" viewBox="0 0 24 24" aria-hidden>
                <path d="M21.5 3.5 2.8 10.7c-1 .4-1 1.6 0 1.9l4.6 1.5 1.8 5.6c.3.8 1.3 1 1.9.4l2.6-2.4 4.7 3.4c.7.5 1.7.1 1.9-.7l3.2-15.2c.2-1.1-.9-2-2-1.7Z" fill="#fff" />
              </svg>
            </span>
            Telegram Mini App для сети кофеен
          </motion.div>

          <motion.h1 {...fade(0.08)} className="show-display mt-6 text-[44px] leading-[1.02] font-semibold tracking-[-0.04em] md:text-[56px] xl:text-[60px]">
            Кофе без очереди,
            <br />
            <span className="text-[#8a5530]">прямо из Telegram</span>
          </motion.h1>

          <motion.p {...fade(0.16)} className="mt-6 max-w-[500px] text-[17.5px] leading-[1.55] text-[#16130f]/70">
            Гость открывает мини-приложение из чата с ботом, собирает напиток под себя, платит и забирает заказ по номеру. Без установки,
            регистрации и звонков в кофейню.
          </motion.p>

          <motion.div {...fade(0.24)} className="mt-10 grid grid-cols-1 gap-x-8 gap-y-6 border-t lg:mt-9 lg:pt-7 border-[#16130f]/10 pt-8 sm:grid-cols-2">
            {benefits.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-[#16130f] text-[#f3dcc0]">
                  <Icon size={17} strokeWidth={2} />
                </span>
                <div>
                  <div className="text-[15.5px] font-semibold tracking-[-0.01em]">{title}</div>
                  <div className="mt-1 text-[14px] leading-[1.5] text-[#16130f]/60">{text}</div>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div {...fade(0.32)} className="mt-10 lg:mt-8">
            <div className="text-[13px] text-[#16130f]/50">Стек</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {stack.map((s) => (
                <span key={s} className="rounded-full border border-[#16130f]/12 bg-white/55 px-3 py-[6px] text-[13.5px] text-[#16130f]/80 backdrop-blur">
                  {s}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div {...fade(0.4)} className="mt-10 lg:mt-8 flex items-center gap-3 text-[14px] text-[#16130f]/60">
            <MousePointerClick size={18} strokeWidth={1.8} className="shrink-0 text-[#8a5530]" />
            Приложение на экране настоящее: соберите напиток, оформите заказ и дождитесь сообщения от бота.
          </motion.div>
        </div>

        <motion.div
          className="relative mx-auto lg:mx-0 min-[1360px]:pr-[190px]"
          initial={{ opacity: 0, y: 30, rotate: 1.5 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative">
            <PhoneFrame scale={scale}>
              <MiniApp statusBar={<StatusBar />} safeBottom="22px" topBanner={54} />
            </PhoneFrame>
            <Note className="top-[17%] left-full ml-3">Цвета и шрифт подстраиваются под тему Telegram</Note>
            <Note className="top-[52%] left-full ml-3">Карточка напитка открывается нативной шторкой</Note>
            <Note className="bottom-[9%] left-full ml-3">MainButton пересчитывает сумму на лету</Note>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function App() {
  const mobile = useMedia('(max-width: 767px)')
  useEffect(() => {
    const prev = document.documentElement.style.background
    document.documentElement.style.background = mobile ? '#ffffff' : '#efebe4'
    document.title = 'Бариста — Telegram Mini App для кофейни'
    return () => {
      document.documentElement.style.background = prev
    }
  }, [mobile])

  if (mobile)
    return (
      <div className="fixed inset-0 h-[100dvh] w-full">
        <MiniApp safeBottom="env(safe-area-inset-bottom, 0px)" />
      </div>
    )
  return <Showcase />
}
