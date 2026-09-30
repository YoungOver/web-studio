import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, MoreHorizontal, RotateCw, Send, Settings2, Share } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import { defaultLine, lineKey, rub, shops, unitPrice, BONUS_SPEND, type Line } from '../data'
import { Checkout, pickupSlots, type PayMethod } from './Checkout'
import { Menu } from './Menu'
import { OrderStatus, type Order } from './OrderStatus'
import { PaymentSheet } from './PaymentSheet'
import { ProductSheet } from './ProductSheet'
import { ShopSheet } from './ShopSheet'
import { Bump, Press, haptic, spring } from './ui'

type Screen = 'menu' | 'checkout' | 'status'
const order: Screen[] = ['menu', 'checkout', 'status']

const push = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-28%', opacity: dir > 0 ? 1 : 0.6 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? '-28%' : '100%', opacity: dir > 0 ? 0.6 : 1 }),
}

function orderNumber() {
  const letters = 'АБВК'
  return `${letters[Math.floor(Math.random() * letters.length)]}-${String(20 + Math.floor(Math.random() * 79)).padStart(3, '0')}`
}

export function MiniApp({ statusBar, safeBottom = '0px', topBanner = 8 }: { statusBar?: ReactNode; safeBottom?: string; topBanner?: number }) {
  const [screen, setScreen] = useState<Screen>('menu')
  const [dir, setDir] = useState(1)
  const [shopId, setShopId] = useState(shops[0].id)
  const [lines, setLines] = useState<Line[]>([])
  const [sheet, setSheet] = useState<string | null>(null)
  const [shopSheet, setShopSheet] = useState(false)
  const [paySheet, setPaySheet] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [banner, setBanner] = useState(false)
  const [pickup, setPickup] = useState('asap')
  const [bonusOn, setBonusOn] = useState(false)
  const [pay, setPay] = useState<PayMethod>('tgpay')
  const [current, setCurrent] = useState<Order | null>(null)

  const shop = shops.find((s) => s.id === shopId)!
  const go = (s: Screen) => {
    setDir(order.indexOf(s) > order.indexOf(screen) ? 1 : -1)
    setScreen(s)
  }

  const counts = useMemo(() => {
    const c: Record<string, number> = {}
    for (const l of lines) c[l.productId] = (c[l.productId] ?? 0) + l.qty
    return c
  }, [lines])
  const items = lines.reduce((a, l) => a + l.qty, 0)
  const subtotal = lines.reduce((a, l) => a + unitPrice(l) * l.qty, 0)
  const bonusCap = Math.min(BONUS_SPEND, Math.floor(subtotal * 0.3))
  const total = subtotal - (bonusOn ? bonusCap : 0)

  const addCfg = (cfg: Omit<Line, 'key' | 'qty'>, qty = 1) =>
    setLines((ls) => {
      const key = lineKey(cfg)
      return ls.some((l) => l.key === key) ? ls.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l)) : [...ls, { ...cfg, key, qty }]
    })
  const changeQty = (key: string, d: number) =>
    setLines((ls) => ls.flatMap((l) => (l.key !== key ? [l] : l.qty + d <= 0 ? [] : [{ ...l, qty: l.qty + d }])))
  const quickAdd = (pid: string) => {
    const last = [...lines].reverse().find((l) => l.productId === pid)
    if (last) changeQty(last.key, 1)
    else addCfg(defaultLine(pid))
  }
  const decProduct = (pid: string) => {
    const last = [...lines].reverse().find((l) => l.productId === pid)
    if (last) changeQty(last.key, -1)
  }

  useEffect(() => {
    if (screen === 'checkout' && lines.length === 0 && !paySheet) go('menu')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines.length, screen])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(t)
  }, [toast])

  useEffect(() => {
    if (!banner) return
    const t = setTimeout(() => setBanner(false), 5200)
    return () => clearTimeout(t)
  }, [banner])

  const onPaid = useCallback(() => {
    if (!lines.length) return
    const slot = pickupSlots(shop.eta).find((s) => s.id === pickup)
    setCurrent({
      number: orderNumber(),
      lines,
      total,
      street: shop.street,
      eta: shop.eta,
      pickupLabel: pickup === 'asap' ? `Как можно скорее, ~${shop.eta} мин` : `К ${slot?.id ?? pickup}`,
      payLabel: pay === 'tgpay' ? 'Telegram Pay' : 'карта •••• 4417',
      placedAt: Date.now(),
    })
    setPaySheet(false)
    setLines([])
    setBonusOn(false)
    setPickup('asap')
    setDir(1)
    setScreen('status')
  }, [lines, total, shop, pickup, pay])

  const onReady = useCallback(() => setBanner(true), [])

  const safeB = `var(--safe-b)`
  const bottomPad = 50 + 20 + 16
  const main: { label: ReactNode; onClick: () => void; show: boolean } =
    screen === 'menu'
      ? {
          show: items > 0,
          onClick: () => go('checkout'),
          label: (
            <>
              <span className="absolute left-[10px] grid h-[30px] min-w-[30px] place-items-center rounded-full bg-white/20 px-2 text-[14px]">
                <Bump value={items} className="tg-num" />
              </span>
              Оформить
              <span className="opacity-60">·</span>
              <Bump value={rub(subtotal)} className="tg-num" />
            </>
          ),
        }
      : screen === 'checkout'
        ? {
            show: items > 0,
            onClick: () => setPaySheet(true),
            label: (
              <>
                Оплатить
                <span className="opacity-60">·</span>
                <Bump value={rub(total)} className="tg-num" />
              </>
            ),
          }
        : { show: true, onClick: () => { setBanner(false); go('menu') }, label: 'Вернуться в меню' }

  const leftAction =
    screen === 'checkout'
      ? { label: 'Назад', back: true, onClick: () => go('menu') }
      : { label: 'Закрыть', back: false, onClick: () => setToast('В Telegram эта кнопка закрывает мини-приложение') }

  return (
    <div className="tg relative flex h-full w-full flex-col overflow-hidden bg-[var(--tg-bg)]" style={{ '--safe-b': safeBottom } as CSSProperties}>
      {statusBar}
      <header className="relative z-30 flex h-[52px] shrink-0 items-center justify-between bg-[var(--tg-bg)] px-2">
        <Press scale={0.94} onClick={leftAction.onClick} className="flex h-10 min-w-[84px] items-center px-2 text-[17px] text-[var(--tg-link)]">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={leftAction.label}
              className="flex items-center"
              initial={{ opacity: 0, x: leftAction.back ? 10 : -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={spring}
            >
              {leftAction.back && <ChevronLeft size={26} strokeWidth={2.3} className="-ml-2" />}
              {leftAction.label}
            </motion.span>
          </AnimatePresence>
        </Press>
        <div className="pointer-events-none absolute inset-x-0 flex flex-col items-center leading-none">
          <span className="text-[17px] font-semibold tracking-[-0.01em]">Бариста</span>
          <span className="mt-[3px] text-[12.5px] text-[var(--tg-hint)]">мини-приложение</span>
        </div>
        <div className="flex min-w-[84px] justify-end pr-1">
          <Press
            scale={0.88}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Меню"
            className="grid h-[30px] w-[30px] place-items-center rounded-full bg-[var(--tg-sec)] text-[var(--tg-link)]"
          >
            <MoreHorizontal size={19} strokeWidth={2.4} />
          </Press>
        </div>
      </header>

      <div className="relative min-h-0 flex-1 overflow-hidden bg-[var(--tg-sec)]">
        <AnimatePresence initial={false} custom={dir}>
          <motion.div
            key={screen}
            custom={dir}
            variants={push}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 380, damping: 40 }}
            className="absolute inset-0"
            style={{ boxShadow: '-12px 0 30px rgba(0,0,0,.06)' }}
          >
            {screen === 'menu' && (
              <Menu
                shop={shop}
                onShop={() => setShopSheet(true)}
                counts={counts}
                onOpen={setSheet}
                onAdd={quickAdd}
                onDec={decProduct}
                bottomPad={items > 0 ? bottomPad : 16}
              />
            )}
            {screen === 'checkout' && (
              <Checkout
                lines={lines}
                shop={shop}
                onShop={() => setShopSheet(true)}
                onQty={changeQty}
                pickup={pickup}
                setPickup={setPickup}
                bonusOn={bonusOn}
                setBonusOn={setBonusOn}
                bonus={bonusCap}
                pay={pay}
                setPay={setPay}
                subtotal={subtotal}
                total={total}
                bottomPad={bottomPad}
              />
            )}
            {screen === 'status' && current && <OrderStatus order={current} bottomPad={bottomPad} onReady={onReady} />}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {main.show && (
            <motion.div
              className="absolute inset-x-0 bottom-0 z-20 bg-[var(--tg-bg)] px-3 pt-2"
              style={{ paddingBottom: `calc(8px + ${safeB})`, boxShadow: '0 -0.5px 0 var(--tg-sep)' }}
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              exit={{ y: '110%' }}
              transition={spring}
            >
              <Press
                scale={0.97}
                onClick={main.onClick}
                className="relative flex h-[50px] w-full items-center justify-center gap-[6px] rounded-[12px] bg-[var(--tg-btn)] text-[16px] font-semibold text-[var(--tg-btn-text)]"
              >
                {main.label}
              </Press>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {toast && (
            <motion.div
              className="pointer-events-none absolute inset-x-3 z-50 flex justify-center"
              style={{ bottom: `calc(${items > 0 || screen === 'status' ? 78 : 16}px + ${safeB})` }}
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8 }}
              transition={spring}
            >
              <div className="rounded-[12px] bg-[#1c1c1e]/90 px-4 py-[10px] text-center text-[13.5px] leading-[18px] text-white backdrop-blur">{toast}</div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {menuOpen && (
            <>
              <motion.div className="absolute inset-0 z-40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMenuOpen(false)} />
              <motion.div
                className="absolute top-1 right-2 z-50 w-[230px] origin-top-right overflow-hidden rounded-[13px] bg-white/95 backdrop-blur-xl"
                style={{ boxShadow: '0 12px 40px rgba(0,0,0,.18), 0 0 0 .5px rgba(0,0,0,.06)' }}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={spring}
              >
                {[
                  { icon: Settings2, label: 'Настройки бота' },
                  { icon: Share, label: 'Поделиться' },
                  { icon: RotateCw, label: 'Перезапустить' },
                ].map(({ icon: Icon, label }, i) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      haptic()
                      setMenuOpen(false)
                      if (label === 'Перезапустить') {
                        setLines([])
                        setCurrent(null)
                        setBanner(false)
                        go('menu')
                      } else setToast(`«${label}» открывается нативно в Telegram`)
                    }}
                    className="flex h-[44px] w-full items-center justify-between px-4 text-left text-[16px] active:bg-black/5"
                    style={{ borderTop: i ? '0.5px solid var(--tg-sep)' : 'none' }}
                  >
                    {label}
                    <Icon size={18} strokeWidth={2} className="text-black/70" />
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <ProductSheet
          productId={sheet}
          onClose={() => setSheet(null)}
          onAdd={(cfg, qty) => {
            addCfg(cfg, qty)
            haptic(14)
            setSheet(null)
          }}
        />
        <ShopSheet
          open={shopSheet}
          current={shop}
          onClose={() => setShopSheet(false)}
          onPick={(id) => {
            setShopId(id)
            setTimeout(() => setShopSheet(false), 220)
          }}
        />
        <PaymentSheet open={paySheet} onClose={() => setPaySheet(false)} total={total} pay={pay} items={items} onPaid={onPaid} />
      </div>

      <AnimatePresence>
        {banner && current && (
          <motion.button
            type="button"
            onClick={() => setBanner(false)}
            className="absolute inset-x-2 z-[60] flex items-start gap-3 rounded-[20px] bg-white/80 p-3 text-left backdrop-blur-xl"
            style={{ top: topBanner, boxShadow: '0 16px 40px rgba(0,0,0,.18), 0 0 0 .5px rgba(0,0,0,.05)' }}
            initial={{ y: -140, opacity: 0.4 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -140, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            onDragEnd={(_, i) => i.offset.y < -30 && setBanner(false)}
          >
            <span className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-[9px] bg-gradient-to-b from-[#37aee2] to-[#1e96c8] text-white">
              <Send size={19} strokeWidth={2.2} className="-translate-x-[1px] translate-y-[1px]" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-baseline justify-between">
                <span className="text-[15px] font-semibold">Бариста</span>
                <span className="text-[12.5px] text-black/45">сейчас</span>
              </span>
              <span className="mt-[1px] block text-[14.5px] leading-[19px] text-black/85">
                Заказ {current.number} готов. Заберите его на стойке выдачи, {current.street}.
              </span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
