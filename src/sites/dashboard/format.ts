const nf0 = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 })
const nf1 = new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
const nf2 = new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const num = (n: number) => nf0.format(Math.round(n))
export const rub = (n: number) => `${nf0.format(Math.round(n))} ₽`
export const pct = (n: number, digits = 1) => `${(digits === 2 ? nf2 : nf1).format(n * 100)} %`

export function compactRub(n: number) {
  if (Math.abs(n) >= 1e6) return `${nf1.format(n / 1e6)} млн ₽`
  if (Math.abs(n) >= 1e3) return `${nf0.format(n / 1e3)} тыс ₽`
  return rub(n)
}

export function axisRub(n: number) {
  if (n >= 1e6) return `${nf1.format(n / 1e6)} млн`
  if (n >= 1e3) return `${nf0.format(n / 1e3)} тыс`
  return nf0.format(n)
}

export function signedPct(n: number) {
  const s = nf1.format(Math.abs(n) * 100)
  return `${n >= 0 ? '+' : '−'}${s} %`
}

export function plural(n: number, one: string, few: string, many: string) {
  const a = Math.abs(n) % 100
  const b = a % 10
  if (a > 10 && a < 20) return many
  if (b > 1 && b < 5) return few
  if (b === 1) return one
  return many
}

export function ago(ms: number) {
  const s = Math.max(0, Math.round(ms / 1000))
  if (s < 20) return 'только что'
  if (s < 60) return `${s} сек назад`
  const m = Math.round(s / 60)
  if (m < 60) return `${m} мин назад`
  const h = Math.round(m / 60)
  if (h < 24) return `${h} ч назад`
  const d = Math.round(h / 24)
  return `${d} ${plural(d, 'день', 'дня', 'дней')} назад`
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
}
