// Deterministic demo data for «Пульс продаж». Everything is seeded, so the
// dashboard looks identical on every load while still feeling organic.

export function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export type Channel = 'site' | 'ozon' | 'wb' | 'avito'
export const CHANNELS: { id: Channel; name: string; short: string }[] = [
  { id: 'site', name: 'Сайт', short: 'Сайт' },
  { id: 'ozon', name: 'Ozon', short: 'Ozon' },
  { id: 'wb', name: 'Wildberries', short: 'WB' },
  { id: 'avito', name: 'Авито', short: 'Авито' },
]
export const CHANNEL_NAME: Record<Channel, string> = { site: 'Сайт', ozon: 'Ozon', wb: 'Wildberries', avito: 'Авито' }

export type RangeKey = '7d' | '30d' | '90d'
export const RANGES: { key: RangeKey; label: string; days: number; prevLabel: string }[] = [
  { key: '7d', label: '7 дней', days: 7, prevLabel: 'к прошлой неделе' },
  { key: '30d', label: '30 дней', days: 30, prevLabel: 'к прошлым 30 дням' },
  { key: '90d', label: 'Квартал', days: 90, prevLabel: 'к прошлому кварталу' },
]

const DAY = 86_400_000
export const TODAY = (() => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
})()

type ByChannel = Record<Channel, number>
interface Day {
  date: Date
  rev: ByChannel
  orders: ByChannel
  visits: number
}

const BASE: ByChannel = { site: 152_000, ozon: 236_000, wb: 284_000, avito: 58_000 }
const CHECK: ByChannel = { site: 4_350, ozon: 3_180, wb: 2_690, avito: 5_600 }
const WEEKLY = [1.2, 0.9, 0.88, 0.94, 0.98, 1.06, 1.24] // Sun..Sat
const TOTAL_DAYS = 180

const DAYS: Day[] = (() => {
  const r = rng(20260928)
  const out: Day[] = []
  for (let i = 0; i < TOTAL_DAYS; i++) {
    const date = new Date(TODAY.getTime() - (TOTAL_DAYS - 1 - i) * DAY)
    const t = i / (TOTAL_DAYS - 1)
    const trend = 0.8 + 0.34 * t + 0.05 * Math.sin(t * Math.PI * 3)
    const weekly = WEEKLY[date.getDay()]
    const promo = i % 41 === 17 ? 1.42 : i % 41 === 18 ? 1.18 : 1
    const rev = {} as ByChannel
    const orders = {} as ByChannel
    let ordersTotal = 0
    for (const c of CHANNELS) {
      const channelTrend = c.id === 'ozon' ? 1 + 0.18 * t : c.id === 'avito' ? 1.08 - 0.1 * t : 1
      const noise = 1 + (r() - 0.5) * 0.26
      const v = BASE[c.id] * trend * channelTrend * weekly * promo * noise
      rev[c.id] = Math.round(v / 10) * 10
      orders[c.id] = Math.max(1, Math.round(v / (CHECK[c.id] * (0.93 + r() * 0.14))))
      ordersTotal += orders[c.id]
    }
    const visits = Math.round(ordersTotal / (0.0215 + r() * 0.0055 + t * 0.002))
    out.push({ date, rev, orders, visits })
  }
  return out
})()

const sumBy = (days: Day[], f: (d: Day) => number) => days.reduce((s, d) => s + f(d), 0)
const totalRev = (d: Day) => d.rev.site + d.rev.ozon + d.rev.wb + d.rev.avito
const totalOrders = (d: Day) => d.orders.site + d.orders.ozon + d.orders.wb + d.orders.avito

export interface Point {
  key: string
  label: string
  fullLabel: string
  site: number
  ozon: number
  wb: number
  avito: number
  total: number
  orders: number
  ordersBy: ByChannel
  avg: number
  conv: number
}

const dShort = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' })
const dLong = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', weekday: 'short' })
const clean = (s: string) => s.replace('.', '')

function toPoint(days: Day[], key: string, label: string, fullLabel: string): Point {
  const rev: ByChannel = { site: 0, ozon: 0, wb: 0, avito: 0 }
  const ord: ByChannel = { site: 0, ozon: 0, wb: 0, avito: 0 }
  for (const d of days) for (const c of CHANNELS) { rev[c.id] += d.rev[c.id]; ord[c.id] += d.orders[c.id] }
  const total = rev.site + rev.ozon + rev.wb + rev.avito
  const orders = ord.site + ord.ozon + ord.wb + ord.avito
  const visits = sumBy(days, (d) => d.visits)
  return { key, label, fullLabel, ...rev, total, orders, ordersBy: ord, avg: total / orders, conv: orders / visits }
}

export interface Kpi {
  id: 'revenue' | 'orders' | 'avg' | 'conv'
  label: string
  value: number
  prev: number
  delta: number
  spark: number[]
  hint: string
}

export interface Summary {
  range: RangeKey
  points: Point[]
  kpis: Kpi[]
  funnel: { label: string; value: number; hint: string }[]
  channels: { id: Channel; rev: number; orders: number; share: number; delta: number }[]
  products: ProductRow[]
  revenue: number
}

export interface Product {
  id: string
  sku: string
  name: string
  category: string
  price: number
  share: number
  stock: number
  channels: Channel[]
}

export const PRODUCTS: Product[] = [
  { id: 'p1', sku: 'TD-1042', name: 'Плед вязаный «Сканди», 150×200', category: 'Текстиль', price: 3_490, share: 0.16, stock: 214, channels: ['site', 'ozon', 'wb'] },
  { id: 'p2', sku: 'TD-2210', name: 'Увлажнитель воздуха Mist S2', category: 'Климат', price: 5_990, share: 0.12, stock: 38, channels: ['site', 'ozon', 'wb', 'avito'] },
  { id: 'p3', sku: 'TD-1180', name: 'Постельное бельё, сатин, евро', category: 'Текстиль', price: 6_490, share: 0.09, stock: 96, channels: ['site', 'wb'] },
  { id: 'p4', sku: 'TD-3301', name: 'Настольная лампа Arc, латунь', category: 'Свет', price: 7_900, share: 0.07, stock: 12, channels: ['site', 'ozon', 'avito'] },
  { id: 'p5', sku: 'TD-4415', name: 'Свеча «Кедр и табак», 220 г', category: 'Ароматы', price: 1_290, share: 0.2, stock: 540, channels: ['site', 'ozon', 'wb'] },
  { id: 'p6', sku: 'TD-5120', name: 'Френч-пресс «Утро», 1 л', category: 'Кухня', price: 2_190, share: 0.11, stock: 173, channels: ['ozon', 'wb'] },
  { id: 'p7', sku: 'TD-1206', name: 'Набор полотенец, 4 шт.', category: 'Текстиль', price: 2_790, share: 0.1, stock: 0, channels: ['site', 'wb'] },
  { id: 'p8', sku: 'TD-6031', name: 'Ваза керамическая «Дюна»', category: 'Декор', price: 1_890, share: 0.08, stock: 61, channels: ['site', 'ozon', 'avito'] },
  { id: 'p9', sku: 'TD-6107', name: 'Корзина плетёная, джут, M', category: 'Хранение', price: 1_590, share: 0.07, stock: 288, channels: ['wb', 'avito'] },
  { id: 'p10', sku: 'TD-3318', name: 'Гирлянда «Тёплый свет», 10 м', category: 'Свет', price: 990, share: 0.09, stock: 402, channels: ['site', 'ozon', 'wb'] },
]

export interface ProductRow extends Product {
  units: number
  revenue: number
  delta: number
}

const summaryCache = new Map<RangeKey, Summary>()

export function getSummary(range: RangeKey): Summary {
  const hit = summaryCache.get(range)
  if (hit) return hit
  const days = RANGES.find((x) => x.key === range)!.days
  const cur = DAYS.slice(-days)
  const prev = DAYS.slice(-days * 2, -days)

  let points: Point[]
  if (days <= 30) {
    points = cur.map((d) => {
      const s = clean(dShort.format(d.date))
      return toPoint([d], s, s, dLong.format(d.date))
    })
  } else {
    points = []
    for (let end = cur.length; end > 0; end -= 7) {
      const chunk = cur.slice(Math.max(0, end - 7), end)
      const a = chunk[0].date
      const b = chunk[chunk.length - 1].date
      const label = clean(dShort.format(a))
      points.unshift(toPoint(chunk, label, label, `${clean(dShort.format(a))} — ${clean(dShort.format(b))}`))
    }
  }

  const rev = sumBy(cur, totalRev)
  const revPrev = sumBy(prev, totalRev)
  const ord = sumBy(cur, totalOrders)
  const ordPrev = sumBy(prev, totalOrders)
  const vis = sumBy(cur, (d) => d.visits)
  const visPrev = sumBy(prev, (d) => d.visits)
  const pct = (a: number, b: number) => (a - b) / b

  const kpis: Kpi[] = [
    { id: 'revenue', label: 'Выручка', value: rev, prev: revPrev, delta: pct(rev, revPrev), spark: points.map((p) => p.total), hint: 'Оплаченные заказы по всем каналам, без учёта возвратов' },
    { id: 'orders', label: 'Заказы', value: ord, prev: ordPrev, delta: pct(ord, ordPrev), spark: points.map((p) => p.orders), hint: 'Количество оплаченных заказов' },
    { id: 'avg', label: 'Средний чек', value: rev / ord, prev: revPrev / ordPrev, delta: pct(rev / ord, revPrev / ordPrev), spark: points.map((p) => p.avg), hint: 'Выручка, делённая на число заказов' },
    { id: 'conv', label: 'Конверсия', value: ord / vis, prev: ordPrev / visPrev, delta: pct(ord / vis, ordPrev / visPrev), spark: points.map((p) => p.conv), hint: 'Доля визитов, завершившихся оплатой' },
  ]

  const r = rng(days * 97)
  const checkout = Math.round(ord / (0.53 + r() * 0.05))
  const cart = Math.round(checkout / (0.41 + r() * 0.05))
  const funnel = [
    { label: 'Визиты', value: vis, hint: 'Сайт и карточки маркетплейсов' },
    { label: 'Корзина', value: cart, hint: 'Добавили товар в корзину' },
    { label: 'Оформление', value: checkout, hint: 'Начали оформление заказа' },
    { label: 'Оплата', value: ord, hint: 'Успешно оплатили' },
  ]

  const channels = CHANNELS.map((c) => {
    const cr = sumBy(cur, (d) => d.rev[c.id])
    const pr = sumBy(prev, (d) => d.rev[c.id])
    return { id: c.id, rev: cr, orders: sumBy(cur, (d) => d.orders[c.id]), share: cr / rev, delta: pct(cr, pr) }
  })

  const shareSum = PRODUCTS.reduce((s, p) => s + p.share, 0)
  const products: ProductRow[] = PRODUCTS.map((p, i) => {
    const pr = rng(days * 131 + i * 17)
    const units = Math.round((p.share / shareSum) * ord * 0.62 * (0.85 + pr() * 0.3))
    return { ...p, units, revenue: units * p.price, delta: (pr() - 0.36) * 0.5 }
  }).sort((a, b) => b.revenue - a.revenue)

  const s: Summary = { range, points, kpis, funnel, channels, products, revenue: rev }
  summaryCache.set(range, s)
  return s
}

/* ---------- People, orders ---------- */

const FIRST = ['Анна', 'Дмитрий', 'Екатерина', 'Илья', 'Мария', 'Алексей', 'Ольга', 'Сергей', 'Юлия', 'Никита', 'Татьяна', 'Павел', 'Ксения', 'Артём', 'Виктория', 'Роман', 'Полина', 'Григорий', 'Алина', 'Максим']
const LAST_M = ['Королёв', 'Орлов', 'Смирнов', 'Волков', 'Лебедев', 'Никитин', 'Соколов', 'Морозов', 'Зайцев', 'Павлов', 'Егоров', 'Фролов']
const FEMALE = new Set(['Анна', 'Екатерина', 'Мария', 'Ольга', 'Юлия', 'Татьяна', 'Ксения', 'Виктория', 'Полина', 'Алина'])
const CITIES = ['Москва', 'Санкт-Петербург', 'Казань', 'Екатеринбург', 'Новосибирск', 'Нижний Новгород', 'Краснодар', 'Самара', 'Пермь', 'Воронеж', 'Тюмень', 'Калининград']

export function personName(r: () => number) {
  const f = FIRST[Math.floor(r() * FIRST.length)]
  const l = LAST_M[Math.floor(r() * LAST_M.length)]
  return `${f} ${FEMALE.has(f) ? l + 'а' : l}`
}

export interface Order {
  id: string
  seq: number
  customer: string
  city: string
  channel: Channel
  product: string
  items: number
  amount: number
  at: number
}

const CH_WEIGHTS: [Channel, number][] = [['wb', 0.36], ['ozon', 0.32], ['site', 0.22], ['avito', 0.1]]
function pickChannel(x: number): Channel {
  let acc = 0
  for (const [c, w] of CH_WEIGHTS) { acc += w; if (x < acc) return c }
  return 'site'
}

export function makeOrder(seq: number, at: number): Order {
  const r = rng(seq * 7919 + 13)
  const channel = pickChannel(r())
  const p = PRODUCTS[Math.floor(r() * PRODUCTS.length)]
  const items = r() < 0.72 ? 1 : r() < 0.7 ? 2 : 3
  const extra = r() < 0.35 ? Math.round(r() * 18) * 100 : 0
  return {
    id: `${channel === 'site' ? 'S' : channel === 'ozon' ? 'OZ' : channel === 'wb' ? 'WB' : 'AV'}-${(48_210 + seq).toString()}`,
    seq,
    customer: personName(r),
    city: CITIES[Math.floor(r() * CITIES.length)],
    channel,
    product: p.name,
    items,
    amount: p.price * items + extra,
    at,
  }
}

export function initialOrders(now: number): Order[] {
  const offsets = [0.4, 1.6, 3.1, 4.8, 7.5, 9.2, 12.4, 15.0]
  return offsets.map((m, i) => makeOrder(100 - i, now - m * 60_000))
}

/* ---------- Deals (kanban) ---------- */

export type Stage = 'new' | 'work' | 'await' | 'paid'
export const STAGES: { id: Stage; title: string; tone: string }[] = [
  { id: 'new', title: 'Новый', tone: 'var(--text-3)' },
  { id: 'work', title: 'В работе', tone: 'var(--accent)' },
  { id: 'await', title: 'Ожидает оплаты', tone: 'var(--warn)' },
  { id: 'paid', title: 'Оплачен', tone: 'var(--good)' },
]

export interface Deal {
  id: string
  title: string
  company: string
  amount: number
  stage: Stage
  channel: Channel
  owner: string
  due: string
  tag?: string
  items: number
}

export const MANAGERS = ['Марина Лебедева', 'Кирилл Дьяков', 'Софья Ким', 'Олег Руденко']

export const DEALS: Deal[] = [
  { id: 'D-1287', title: 'Пледы для гостиницы, 120 шт.', company: 'Отель «Северная звезда»', amount: 386_400, stage: 'new', channel: 'site', owner: MANAGERS[0], due: '2 окт', tag: 'Опт', items: 120 },
  { id: 'D-1289', title: 'Подарочные наборы к Новому году', company: 'ООО «Техносфера»', amount: 742_000, stage: 'new', channel: 'site', owner: MANAGERS[1], due: '5 окт', tag: 'Корпоратив', items: 280 },
  { id: 'D-1291', title: 'Свечи для сети кофеен', company: 'Кофейни «Зерно»', amount: 129_000, stage: 'new', channel: 'avito', owner: MANAGERS[2], due: '3 окт', items: 100 },
  { id: 'D-1270', title: 'Текстиль для шоурума', company: 'Студия «Линия»', amount: 214_300, stage: 'work', channel: 'site', owner: MANAGERS[0], due: '30 сен', tag: 'Дизайнер', items: 34 },
  { id: 'D-1274', title: 'Поставка на склад Ozon, Казань', company: 'Ozon FBO', amount: 1_120_000, stage: 'work', channel: 'ozon', owner: MANAGERS[3], due: '4 окт', tag: 'FBO', items: 640 },
  { id: 'D-1277', title: 'Лампы Arc для офиса', company: 'IT-парк «Квадрат»', amount: 173_800, stage: 'work', channel: 'avito', owner: MANAGERS[2], due: '1 окт', items: 22 },
  { id: 'D-1280', title: 'Увлажнители в детский центр', company: 'Центр «Кроха»', amount: 95_840, stage: 'work', channel: 'site', owner: MANAGERS[1], due: '29 сен', items: 16 },
  { id: 'D-1258', title: 'Отгрузка на склад WB, Коледино', company: 'Wildberries FBW', amount: 1_486_500, stage: 'await', channel: 'wb', owner: MANAGERS[3], due: '28 сен', tag: 'FBW', items: 910 },
  { id: 'D-1262', title: 'Корзины для ритейл-сети', company: 'ООО «Дом и сад»', amount: 318_000, stage: 'await', channel: 'site', owner: MANAGERS[0], due: '29 сен', tag: 'Опт', items: 200 },
  { id: 'D-1265', title: 'Бельё сатин, повторный заказ', company: 'Хостел «Мост»', amount: 155_760, stage: 'await', channel: 'avito', owner: MANAGERS[2], due: '30 сен', items: 24 },
  { id: 'D-1241', title: 'Гирлянды к открытию ТЦ', company: 'ТЦ «Галерея Север»', amount: 247_500, stage: 'paid', channel: 'site', owner: MANAGERS[1], due: '26 сен', tag: 'Корпоратив', items: 250 },
  { id: 'D-1247', title: 'Френч-прессы для кофейни', company: 'Кофейня «Утро»', amount: 43_800, stage: 'paid', channel: 'ozon', owner: MANAGERS[2], due: '25 сен', items: 20 },
  { id: 'D-1250', title: 'Декор для фотостудии', company: 'Фотостудия «Свет»', amount: 88_620, stage: 'paid', channel: 'wb', owner: MANAGERS[0], due: '24 сен', items: 38 },
]

/* ---------- Clients ---------- */

export type Segment = 'loyal' | 'new' | 'risk' | 'vip'
export const SEGMENT_LABEL: Record<Segment, string> = { loyal: 'Постоянный', new: 'Новый', risk: 'Под угрозой', vip: 'VIP' }

export interface Client {
  id: string
  name: string
  email: string
  city: string
  channel: Channel
  orders: number
  ltv: number
  lastDays: number
  segment: Segment
}

export const CLIENTS: Client[] = (() => {
  const r = rng(4242)
  const translit: Record<string, string> = { а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sch', ы: 'y', э: 'e', ю: 'yu', я: 'ya', ь: '', ъ: '' }
  const tr = (s: string) => s.toLowerCase().split('').map((ch) => translit[ch] ?? ch).join('')
  const domains = ['yandex.ru', 'mail.ru', 'gmail.com', 'icloud.com']
  const out: Client[] = []
  const used = new Set<string>()
  for (let i = 0; i < 28; i++) {
    let name = personName(r)
    while (used.has(name)) name = personName(r)
    used.add(name)
    const [f, l] = name.split(' ')
    const orders = 1 + Math.floor(Math.pow(r(), 1.8) * 24)
    const lastDays = Math.floor(Math.pow(r(), 1.6) * 120)
    const ltv = Math.round((orders * (2_400 + r() * 4_200)) / 10) * 10
    const segment: Segment = ltv > 60_000 ? 'vip' : lastDays > 75 && orders > 2 ? 'risk' : orders <= 2 ? 'new' : 'loyal'
    out.push({
      id: `C-${(3_100 + i * 37).toString()}`,
      name,
      email: `${tr(f)}.${tr(l)}@${domains[Math.floor(r() * domains.length)]}`,
      city: CITIES[Math.floor(r() * CITIES.length)],
      channel: pickChannel(r()),
      orders,
      ltv,
      lastDays,
      segment,
    })
  }
  return out.sort((a, b) => b.ltv - a.ltv)
})()

/* ---------- Integrations ---------- */

export type IntStatus = 'ok' | 'error' | 'off'
export interface Integration {
  id: string
  name: string
  kind: string
  mono: string
  tint: string
  description: string
  status: IntStatus
  lastSyncMin: number | null
  stats: { label: string; value: string }[]
  error?: string
}

export const INTEGRATIONS: Integration[] = [
  { id: 'amo', name: 'amoCRM', kind: 'CRM', mono: 'amo', tint: '#3a7bd5', description: 'Двусторонняя синхронизация сделок, контактов и статусов воронки.', status: 'ok', lastSyncMin: 3, stats: [{ label: 'Сделок', value: '1 284' }, { label: 'Контактов', value: '9 412' }] },
  { id: 'b24', name: 'Битрикс24', kind: 'CRM', mono: 'Б24', tint: '#2fa8d8', description: 'Передача заказов с сайта как лидов, задачи менеджерам по SLA.', status: 'ok', lastSyncMin: 11, stats: [{ label: 'Лидов за сутки', value: '46' }, { label: 'Задач', value: '18' }] },
  { id: 'ozon', name: 'Ozon Seller API', kind: 'Маркетплейс', mono: 'OZ', tint: '#2d6cf0', description: 'Заказы FBO и FBS, остатки, цены и отчёт о реализации.', status: 'ok', lastSyncMin: 1, stats: [{ label: 'Заказов сегодня', value: '212' }, { label: 'SKU', value: '148' }] },
  { id: 'wb', name: 'Wildberries API', kind: 'Маркетплейс', mono: 'WB', tint: '#8a3ffc', description: 'Статистика продаж, поставки FBW и обновление остатков по складам.', status: 'error', lastSyncMin: 2_880, stats: [{ label: 'Заказов сегодня', value: '—' }, { label: 'SKU', value: '163' }], error: 'Токен API истёк — нужен новый ключ' },
  { id: 'tg', name: 'Telegram-бот', kind: 'Уведомления', mono: 'TG', tint: '#2aa3e0', description: 'Мгновенные уведомления о крупных заказах и сбоях интеграций в чат команды.', status: 'ok', lastSyncMin: 0, stats: [{ label: 'Сообщений за сутки', value: '318' }, { label: 'Получателей', value: '6' }] },
  { id: '1c', name: '1С:Предприятие', kind: 'Учёт', mono: '1С', tint: '#e0a01c', description: 'Выгрузка заказов и оплат, загрузка номенклатуры и складских остатков.', status: 'off', lastSyncMin: null, stats: [{ label: 'Номенклатура', value: '—' }, { label: 'Склады', value: '—' }] },
]

/* ---------- Notifications ---------- */

export interface Note {
  id: string
  title: string
  body: string
  ago: string
  kind: 'order' | 'error' | 'stock' | 'deal'
  unread: boolean
}

export const NOTES: Note[] = [
  { id: 'n1', title: 'Крупный заказ на сайте', body: 'S-48312 · 38 700 ₽ · Санкт-Петербург', ago: '2 мин', kind: 'order', unread: true },
  { id: 'n2', title: 'Wildberries API: ошибка авторизации', body: 'Синхронизация остатков остановлена 2 дня назад', ago: '14 мин', kind: 'error', unread: true },
  { id: 'n3', title: 'Заканчивается товар', body: 'Настольная лампа Arc — осталось 12 шт.', ago: '1 ч', kind: 'stock', unread: true },
  { id: 'n4', title: 'Сделка перешла в «Оплачен»', body: 'D-1241 · ТЦ «Галерея Север» · 247 500 ₽', ago: '3 ч', kind: 'deal', unread: false },
  { id: 'n5', title: 'Отчёт о реализации Ozon готов', body: 'Период 15–21 сентября, 1 486 строк', ago: 'вчера', kind: 'order', unread: false },
]
