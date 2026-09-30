import { useState } from 'react'
import { Tabs as TabsPrimitive } from 'radix-ui'
import { Check } from 'lucide-react'
import { NumberTicker } from '@/components/magicui/number-ticker'
import { BorderBeam } from '@/components/magicui/border-beam'
import { PRICES } from '../data'
import { scrollToId } from '../hooks'

type TabKey = keyof typeof PRICES

const TABS: { key: TabKey; label: string }[] = [
  { key: 'day', label: 'День' },
  { key: 'night', label: 'Ночь' },
  { key: 'pass', label: 'Абонемент' },
]

const tickerStyle = { color: 'inherit', letterSpacing: 'inherit' } as const

export function Pricing() {
  const [tab, setTab] = useState<TabKey>('night')

  return (
    <section id="prices" aria-labelledby="prices-title" className="relative px-4 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-[1400px]">
        <TabsPrimitive.Root value={tab} onValueChange={(v) => setTab(v as TabKey)}>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <h2 id="prices-title" className="rs-display text-[clamp(2.75rem,7.5vw,7.5rem)]">
              Цены
            </h2>
            <div className="flex flex-col gap-3 lg:items-end lg:pb-3">
              <TabsPrimitive.List
                aria-label="Тарифы"
                className="inline-grid w-full grid-cols-3 gap-1 rounded-full border border-[#2A2342] bg-[#120E1F]/80 p-1.5 backdrop-blur sm:w-auto"
              >
                {TABS.map((t) => (
                  <TabsPrimitive.Trigger
                    key={t.key}
                    value={t.key}
                    className="h-12 min-w-0 rounded-full px-2 text-sm sm:text-[0.95rem] font-medium text-[#9A93B5] transition-all hover:text-white data-[state=active]:bg-[linear-gradient(100deg,#FF2BD6,#b04dff_50%,#22E7FF)] data-[state=active]:text-[#0b0612] data-[state=active]:shadow-[0_0_30px_-4px_rgba(255,43,214,0.7)] sm:px-7"
                  >
                    {t.label}
                  </TabsPrimitive.Trigger>
                ))}
              </TabsPrimitive.List>
              <p className="text-sm text-[#9A93B5]">{PRICES[tab].hours}</p>
            </div>
          </div>

          {TABS.map(({ key }) => {
            const plan = PRICES[key]
            return (
              <TabsPrimitive.Content key={key} value={key} className="mt-10 outline-none lg:mt-14">
                <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-6">
                  <article className="relative isolate min-w-0 overflow-hidden rounded-[32px] border border-[#2A2342] bg-[#120E1F] p-7 sm:p-10">
                    <div className="pointer-events-none absolute -top-1/3 -right-1/4 -z-10 size-[520px] rounded-full bg-[#FF2BD6]/25 blur-[90px]" />
                    <div className="pointer-events-none absolute -bottom-1/3 -left-1/4 -z-10 size-[420px] rounded-full bg-[#22E7FF]/15 blur-[90px]" />
                    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                      <h3 className="rs-display text-[clamp(1.6rem,2.6vw,2.2rem)]">{plan.featured.name}</h3>
                      <p className="text-[#9A93B5]">{plan.featured.detail}</p>
                    </div>
                    <p className="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                      <span className="rs-display rs-gradient-text text-[clamp(3rem,7vw,7rem)] leading-[0.9] whitespace-nowrap">
                        <NumberTicker value={plan.featured.price} style={tickerStyle} />
                        {' '}₽
                      </span>
                      <span className="text-lg whitespace-nowrap text-[#9A93B5] sm:text-xl">{plan.featured.unit.replace(/^₽\s*/, '')}</span>
                    </p>
                    <ul className="mt-9 grid gap-3">
                      {plan.featured.perks.map((p) => (
                        <li key={p} className="flex items-start gap-3">
                          <Check className="mt-0.5 size-5 shrink-0 text-[#22E7FF]" strokeWidth={2.5} />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                    <button type="button" onClick={() => scrollToId('seats')} className="rs-cta mt-10 h-14 w-full px-8 text-base sm:w-auto">
                      Выбрать место
                    </button>
                    <BorderBeam size={220} duration={9} colorFrom="#FF2BD6" colorTo="#22E7FF" borderWidth={1.5} />
                  </article>

                  <ul className="flex min-w-0 flex-col justify-center divide-y divide-[#2A2342] border-y border-[#2A2342]">
                    {plan.rows.map((r) => (
                      <li key={r.name} className="flex items-center justify-between gap-4 py-6 sm:py-7">
                        <div className="min-w-0">
                          <h3 className="rs-display text-[clamp(1.15rem,1.8vw,1.5rem)]">{r.name}</h3>
                          <p className="mt-1.5 text-sm text-[#9A93B5]">{r.detail}</p>
                        </div>
                        <p className="shrink-0 text-right">
                          <span className="rs-display text-[clamp(1.8rem,3vw,2.75rem)]">
                            <NumberTicker value={r.price} style={tickerStyle} />
                          </span>
                          <span className="mt-1 block text-sm text-[#9A93B5]">{r.unit}</span>
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsPrimitive.Content>
            )
          })}
        </TabsPrimitive.Root>
      </div>
    </section>
  )
}
