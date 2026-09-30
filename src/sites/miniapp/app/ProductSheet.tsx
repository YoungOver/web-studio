import { motion } from 'motion/react'
import { Check, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Art } from '../art'
import { byId, defaultLine, milks, rub, sizes, syrups, unitPrice, SHOT_PRICE, SYRUP_PRICE, type Line, type MilkId, type SizeId, type SyrupId } from '../data'
import { Bump, Press, Sheet, Stepper, Switch, haptic, spring } from './ui'

type Cfg = Omit<Line, 'key' | 'qty'>

function CupGlyph({ scale, active }: { scale: number; active: boolean }) {
  return (
    <svg width={22} height={26} viewBox="0 0 22 26" aria-hidden style={{ transform: `scale(${scale})`, transformOrigin: '50% 100%' }}>
      <path d="M3 7 H19 L17 24 Q16.8 25 15.8 25 H6.2 Q5.2 25 5 24 Z" fill={active ? 'var(--tg-btn)' : '#c9c9ce'} />
      <rect x="2" y="3.5" width="18" height="4" rx="1.6" fill={active ? '#1b6aad' : '#aeaeb3'} />
      <rect x="6" y="12" width="10" height="6" rx="1" fill="#fff" opacity=".35" />
    </svg>
  )
}

export function ProductSheet({ productId, onClose, onAdd }: { productId: string | null; onClose: () => void; onAdd: (cfg: Cfg, qty: number) => void }) {
  const [cfg, setCfg] = useState<Cfg | null>(null)
  const [qty, setQty] = useState(1)
  const [shown, setShown] = useState<string | null>(null)

  useEffect(() => {
    if (productId) {
      setCfg(defaultLine(productId))
      setQty(1)
      setShown(productId)
    }
  }, [productId])

  const p = shown ? byId(shown) : null
  const price = cfg ? unitPrice(cfg) * qty : 0

  const toggleSyrup = (id: SyrupId) =>
    setCfg((c) => (c ? { ...c, syrups: c.syrups.includes(id) ? c.syrups.filter((s) => s !== id) : [...c.syrups, id] } : c))

  return (
    <Sheet open={!!productId} onClose={onClose} label={p?.name ?? 'Напиток'}>
      {p && cfg && (
        <>
          <div className="tg-scroll min-h-0 flex-1">
            <div className="relative mx-2 mt-2 overflow-hidden rounded-[14px]" style={{ background: p.tint }}>
              <motion.div
                key={p.id}
                className="mx-auto h-[210px] w-[210px] py-3"
                initial={{ scale: 0.85, rotate: -8, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ ...spring, delay: 0.08 }}
              >
                <Art kind={p.art} />
              </motion.div>
              <Press
                aria-label="Закрыть"
                scale={0.85}
                onClick={onClose}
                className="absolute top-3 right-3 grid h-[30px] w-[30px] place-items-center rounded-full bg-black/[.08] text-black/60 backdrop-blur"
              >
                <X size={16} strokeWidth={2.6} />
              </Press>
            </div>

            <div className="px-4 pt-4">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-[22px] leading-[27px] font-bold tracking-[-0.02em]">{p.name}</h2>
                <span className="tg-num text-[15px] text-[var(--tg-hint)]">{rub(p.price)}</span>
              </div>
              <p className="mt-[6px] text-[14.5px] leading-[20px] text-[#3c3c43]/75">{p.about}</p>
            </div>

            {p.sizes && (
              <div className="mt-5 px-4">
                <div className="mb-2 text-[13px] text-[var(--tg-hint)]">Объём</div>
                <div className="grid grid-cols-3 gap-2">
                  {sizes.map((s, i) => {
                    const active = cfg.size === s.id
                    return (
                      <Press
                        key={s.id}
                        scale={0.95}
                        onClick={() => setCfg({ ...cfg, size: s.id as SizeId })}
                        className="relative flex h-[84px] flex-col items-center justify-end rounded-[12px] pb-2"
                        style={{ background: active ? '#eaf3fc' : 'var(--tg-sec)' }}
                        aria-pressed={active}
                      >
                        {active && <motion.span layoutId="size-ring" className="absolute inset-0 rounded-[12px] border-2 border-[var(--tg-btn)]" transition={spring} />}
                        <CupGlyph scale={0.8 + i * 0.22} active={active} />
                        <span className="mt-[6px] text-[13px] leading-none font-semibold">
                          {s.id} <span className="font-normal text-[var(--tg-hint)]">· {s.ml} мл</span>
                        </span>
                        <span className="tg-num mt-[3px] text-[11.5px] leading-none text-[var(--tg-hint)]">{s.delta ? `+${s.delta} ₽` : 'базовый'}</span>
                      </Press>
                    )
                  })}
                </div>
              </div>
            )}

            {p.milk && (
              <div className="mt-5 px-4">
                <div className="mb-2 text-[13px] text-[var(--tg-hint)]">Молоко</div>
                <div className="relative flex rounded-[10px] bg-[var(--tg-sec)] p-[2px]">
                  {milks.map((m) => {
                    const active = cfg.milk === m.id
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          haptic()
                          setCfg({ ...cfg, milk: m.id as MilkId })
                        }}
                        className="relative z-0 flex h-[46px] flex-1 flex-col items-center justify-center"
                        aria-pressed={active}
                      >
                        {active && (
                          <motion.span layoutId="milk" className="absolute inset-0 -z-10 rounded-[8px] bg-white" style={{ boxShadow: '0 3px 8px rgba(0,0,0,.08)' }} transition={spring} />
                        )}
                        <span className="text-[14px] leading-[17px] font-medium">{m.label}</span>
                        <span className="tg-num text-[11.5px] leading-[14px] text-[var(--tg-hint)]">{m.delta ? `+${m.delta} ₽` : 'включено'}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {p.syrups && (
              <div className="mt-5 px-4">
                <div className="mb-2 flex justify-between text-[13px] text-[var(--tg-hint)]">
                  <span>Сироп</span>
                  <span className="tg-num">+{SYRUP_PRICE} ₽ за каждый</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {syrups.map((s) => {
                    const on = cfg.syrups.includes(s.id)
                    return (
                      <Press
                        key={s.id}
                        scale={0.93}
                        onClick={() => toggleSyrup(s.id)}
                        aria-pressed={on}
                        className="flex h-[34px] items-center gap-[6px] rounded-full px-[13px] text-[14px] transition-colors duration-200"
                        style={{ background: on ? 'var(--tg-btn)' : 'var(--tg-sec)', color: on ? '#fff' : 'var(--tg-text)' }}
                      >
                        <motion.span
                          initial={false}
                          animate={{ width: on ? 14 : 0, opacity: on ? 1 : 0 }}
                          transition={spring}
                          className="flex overflow-hidden"
                        >
                          <Check size={14} strokeWidth={3} />
                        </motion.span>
                        {s.label}
                      </Press>
                    )
                  })}
                </div>
              </div>
            )}

            {(p.shot || p.warm) && (
              <div className="mx-4 mt-5 rounded-[12px] bg-[var(--tg-sec)]">
                {p.shot && (
                  <label className="flex items-center gap-3 px-4 py-3">
                    <div className="flex-1">
                      <div className="text-[15px]">Дополнительный шот</div>
                      <div className="tg-num text-[12.5px] text-[var(--tg-hint)]">Крепче на 30 мл эспрессо · +{SHOT_PRICE} ₽</div>
                    </div>
                    <Switch label="Дополнительный шот" on={cfg.shot} onChange={(v) => setCfg({ ...cfg, shot: v })} />
                  </label>
                )}
                {p.warm && (
                  <label className="flex items-center gap-3 px-4 py-3">
                    <div className="flex-1">
                      <div className="text-[15px]">Подогреть</div>
                      <div className="text-[12.5px] text-[var(--tg-hint)]">Бесплатно, займёт минуту</div>
                    </div>
                    <Switch label="Подогреть" on={cfg.warm} onChange={(v) => setCfg({ ...cfg, warm: v })} />
                  </label>
                )}
              </div>
            )}
            <div className="h-5" />
          </div>

          <div className="flex items-center gap-3 border-t border-[var(--tg-sep)] bg-[var(--tg-bg)] px-3 pt-[10px]" style={{ paddingBottom: 'calc(10px + var(--safe-b, 0px))' }}>
            <Stepper value={qty} onInc={() => setQty((q) => Math.min(q + 1, 9))} onDec={() => setQty((q) => Math.max(q - 1, 1))} tone="soft" size="md" />
            <Press
              scale={0.97}
              onClick={() => onAdd(cfg, qty)}
              className="flex h-[50px] flex-1 items-center justify-center gap-[6px] rounded-[12px] bg-[var(--tg-btn)] text-[16px] font-semibold text-white"
            >
              Добавить
              <span className="opacity-60">·</span>
              <Bump value={rub(price)} className="tg-num" />
            </Press>
          </div>
        </>
      )}
    </Sheet>
  )
}
