import { useState } from 'react'
import type { FormEvent } from 'react'
import { Check } from 'lucide-react'
import { TOURNAMENTS } from '../data'
import type { Tournament } from '../data'
import { Magnetic } from './Magnetic'

function Item({ t }: { t: Tournament }) {
  return (
    <div className="flex shrink-0 items-center gap-6 pr-10 sm:gap-10 sm:pr-16">
      <span
        className="rs-display text-[clamp(3.5rem,9vw,8.5rem)] whitespace-nowrap"
        style={{ color: t.color, textShadow: `0 0 50px ${t.color}66` }}
      >
        {t.game}
      </span>
      <div className="flex flex-col gap-1 whitespace-nowrap">
        <span className="rs-display text-xl sm:text-2xl">{t.date}</span>
        <span className="text-[#EDEAF6]">
          {t.title}, призовой фонд {t.prize}
        </span>
        <span className="text-sm text-[#9A93B5]">{t.format}</span>
      </div>
      <span className="ml-4 size-3 shrink-0 rotate-45 bg-[#2A2342] sm:ml-8" aria-hidden />
    </div>
  )
}

export function Tournaments() {
  const [open, setOpen] = useState(false)
  const [game, setGame] = useState(TOURNAMENTS[0].game)
  const [team, setTeam] = useState('')
  const [sent, setSent] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (team.trim().length < 2) {
      setError('Напишите название команды, хотя бы два символа')
      return
    }
    const t = TOURNAMENTS.find((x) => x.game === game) ?? TOURNAMENTS[0]
    setError(null)
    setSent(`Команда «${team.trim()}» записана на ${t.game}, ${t.date}. Капитану напишем в Telegram за день до старта.`)
  }

  return (
    <section id="tournaments" aria-labelledby="tournaments-title" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <h2 id="tournaments-title" className="rs-display text-[clamp(2.75rem,7.5vw,7.5rem)]">
            Турниры
          </h2>
          <p className="max-w-sm text-[#9A93B5] lg:pb-3 lg:text-right">
            Каждую субботу в 19:00 в VIP-зоне. Матчи идут на Twitch, комментатор в зале.
          </p>
        </div>
      </div>

      <div className="rs-marquee-wrap relative mt-12 overflow-hidden border-y border-[#2A2342] py-8 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)] sm:py-10">
        <div className="rs-marquee">
          <div className="flex">
            {TOURNAMENTS.map((t) => (
              <Item key={t.game} t={t} />
            ))}
          </div>
          <div className="rs-marquee-dup flex" aria-hidden>
            {TOURNAMENTS.map((t) => (
              <Item key={t.game} t={t} />
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-[1400px] px-4 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
          <p className="max-w-xl text-lg leading-relaxed text-[#EDEAF6]/85">
            Взнос 2 500 ₽ с команды, в него входят пять мест в VIP на время турнира. Регистрация закрывается за два дня до старта.
          </p>
          <div className="min-w-0 lg:justify-self-end">
            {!open && !sent && (
              <Magnetic>
                <button type="button" onClick={() => setOpen(true)} className="rs-cta h-14 px-8 text-base" aria-expanded={open} aria-controls="rs-team-form">
                  Записать команду
                </button>
              </Magnetic>
            )}
            {sent && (
              <p className="flex max-w-lg items-start gap-3 rounded-2xl border border-[#22E7FF]/40 bg-[#22E7FF]/[0.06] p-5" aria-live="polite">
                <Check className="mt-0.5 size-5 shrink-0 text-[#22E7FF]" strokeWidth={3} />
                {sent}
              </p>
            )}
            {open && !sent && (
              <form
                id="rs-team-form"
                onSubmit={submit}
                noValidate
                className="grid w-full max-w-lg gap-3 rounded-[24px] border border-[#2A2342] bg-[#120E1F]/90 p-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
              >
                <label className="grid gap-2 text-sm text-[#9A93B5]">
                  Турнир
                  <select
                    value={game}
                    onChange={(e) => setGame(e.target.value)}
                    className="h-12 rounded-xl border border-[#2A2342] bg-[#06050A] px-3 text-base text-white focus:border-[#22E7FF] focus:outline-none"
                  >
                    {TOURNAMENTS.map((t) => (
                      <option key={t.game} value={t.game}>
                        {t.game}, {t.date}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-sm text-[#9A93B5]">
                  Название команды
                  <input
                    value={team}
                    onChange={(e) => setTeam(e.target.value)}
                    aria-invalid={!!error}
                    aria-describedby={error ? 'rs-team-error' : undefined}
                    placeholder="Например, Ligovka Five"
                    className="h-12 rounded-xl border border-[#2A2342] bg-[#06050A] px-3 text-base text-white placeholder:text-[#9A93B5]/50 focus:border-[#22E7FF] focus:outline-none"
                  />
                </label>
                {error && (
                  <p id="rs-team-error" className="text-sm text-[#FF7BE6] sm:col-span-2">
                    {error}
                  </p>
                )}
                <button type="submit" className="rs-cta h-12 px-6 text-sm sm:col-span-2">
                  Записать команду
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
