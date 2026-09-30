export type ZoneId = 'standard' | 'vip' | 'ps5' | 'stream'

export type Zone = {
  id: ZoneId
  name: string
  short: string
  capacity: string
  price: number
  unit: string
  nightPrice: number
  accent: string
  specs: string[]
  note: string
}

export const ZONES: Zone[] = [
  {
    id: 'standard',
    name: 'Standard',
    short: 'Standard',
    capacity: '30 ПК в общем зале',
    price: 150,
    unit: '₽ в час',
    nightPrice: 700,
    accent: '#22E7FF',
    specs: ['RTX 5070 и Ryzen 7 9800X3D', 'Мониторы 27" на 360 Гц', 'Wooting 60HE и Logitech G Pro X2', 'Кресла DXRacer'],
    note: 'Общий зал на 30 мест. Садитесь рядом с друзьями или в тихий угол у окна.',
  },
  {
    id: 'vip',
    name: 'VIP Bootcamp',
    short: 'VIP',
    capacity: 'Комната 5×5 на 10 мест',
    price: 250,
    unit: '₽ в час за место',
    nightPrice: 1100,
    accent: '#FF2BD6',
    specs: ['RTX 5080 и Ryzen 7 9800X3D', 'ZOWIE XL2586X+ на 540 Гц', 'Отдельная комната с дверью', 'Свой свет, кондиционер и доска для тактик'],
    note: 'Две линии по пять мест друг напротив друга. Для команды на буткемп или матч.',
  },
  {
    id: 'ps5',
    name: 'PS5-лаунж',
    short: 'PS5',
    capacity: 'Зал до 4 человек',
    price: 400,
    unit: '₽ в час за зал',
    nightPrice: 2500,
    accent: '#8B5CFF',
    specs: ['PS5 Pro и четыре геймпада', 'OLED 65" на 120 Гц', 'Большой диван', 'EA FC 26, Tekken 8, Mortal Kombat 1'],
    note: 'Диван, большой экран и файтинги на четверых. Цена за весь зал.',
  },
  {
    id: 'stream',
    name: 'Стрим-комната',
    short: 'Стрим',
    capacity: 'Одно место со студией',
    price: 500,
    unit: '₽ в час',
    nightPrice: 3000,
    accent: '#FFE14D',
    specs: ['RTX 5090 и Ryzen 9 9950X3D', 'Elgato 4K60 Pro и две камеры', 'Shure SM7B и звукоизоляция', 'Кольцевой и заполняющий свет'],
    note: 'Готовая студия: подключили аккаунт — и в эфир. OBS уже настроен.',
  },
]

export const ZONE_BY_ID: Record<ZoneId, Zone> = Object.fromEntries(ZONES.map((z) => [z.id, z])) as Record<ZoneId, Zone>

export type Seat = {
  id: string
  zone: ZoneId
  busy: boolean
  /** "Занято до 01:30" or "Свободно" helper */
  until: string | null
}

// Deterministic PRNG so the map looks the same on every visit.
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rand = mulberry32(1571)
const UNTIL = ['23:00', '23:30', '00:00', '01:30', '02:00', '04:00', '06:00', '08:00']

function makeSeat(id: string, zone: ZoneId, busyChance: number): Seat {
  const busy = rand() < busyChance
  return { id, zone, busy, until: busy ? UNTIL[Math.floor(rand() * UNTIL.length)] : null }
}

const pad = (n: number) => String(n).padStart(2, '0')

export const STANDARD_SEATS: Seat[] = Array.from({ length: 30 }, (_, i) => makeSeat(`A${pad(i + 1)}`, 'standard', 0.55))
export const VIP_SEATS: Seat[] = Array.from({ length: 10 }, (_, i) => makeSeat(`B${pad(i + 1)}`, 'vip', 0.45))
export const ROOM_SEATS: Seat[] = [
  { id: 'P1', zone: 'ps5', busy: false, until: null },
  { id: 'S1', zone: 'stream', busy: true, until: '00:00' },
]

export const ALL_SEATS: Seat[] = [...STANDARD_SEATS, ...VIP_SEATS, ...ROOM_SEATS]
export const FREE_PC_COUNT = [...STANDARD_SEATS, ...VIP_SEATS].filter((s) => !s.busy).length

export type PriceRow = { name: string; detail: string; price: number; unit: string }
export type PricePlan = { featured: PriceRow & { perks: string[] }; rows: PriceRow[]; hours: string }

export const PRICES: Record<'day' | 'night' | 'pass', PricePlan> = {
  day: {
    hours: 'С 08:00 до 22:00, оплата за каждый час',
    featured: {
      name: 'Standard',
      detail: 'Место в общем зале',
      price: 150,
      unit: '₽ в час',
      perks: ['RTX 5070, монитор 360 Гц', 'Первый час можно отменить бесплатно', 'Чай и вода из кулера без доплаты'],
    },
    rows: [
      { name: 'VIP Bootcamp', detail: 'За одно место в комнате 5×5', price: 250, unit: '₽ в час' },
      { name: 'PS5-лаунж', detail: 'Весь зал, до 4 человек', price: 400, unit: '₽ в час' },
      { name: 'Стрим-комната', detail: 'Студия с RTX 5090', price: 500, unit: '₽ в час' },
    ],
  },
  night: {
    hours: 'С 22:00 до 08:00, один платёж за всю ночь',
    featured: {
      name: 'Ночь в Standard',
      detail: '10 часов в общем зале',
      price: 700,
      unit: '₽ за ночь',
      perks: ['Выходит 70 ₽ за час', 'Энергетик в подарок после 03:00', 'Можно выйти и вернуться до 08:00'],
    },
    rows: [
      { name: 'Ночь в VIP', detail: 'За одно место, 10 часов', price: 1100, unit: '₽ за ночь' },
      { name: 'Ночь в PS5-лаунже', detail: 'Весь зал, до 4 человек', price: 2500, unit: '₽ за ночь' },
      { name: 'Ночь в стрим-комнате', detail: 'Эфир до утра', price: 3000, unit: '₽ за ночь' },
    ],
  },
  pass: {
    hours: 'Часы списываются в любое время суток',
    featured: {
      name: '30 часов',
      detail: 'Standard, действует 60 дней',
      price: 3500,
      unit: '₽ за пакет',
      perks: ['Выходит 117 ₽ за час', 'Бронь без предоплаты', 'Можно делить с другом по номеру телефона'],
    },
    rows: [
      { name: '10 часов', detail: 'Standard, 30 дней', price: 1300, unit: '₽' },
      { name: '8 ночей', detail: 'Standard, 45 дней', price: 4900, unit: '₽' },
      { name: '20 часов VIP', detail: 'Одно место, 60 дней', price: 4200, unit: '₽' },
    ],
  },
}

export type Tournament = { game: string; title: string; date: string; prize: string; format: string; color: string }

export const TOURNAMENTS: Tournament[] = [
  { game: 'CS2', title: 'Кубок Лиговки', date: '10 октября', prize: '150 000 ₽', format: '5×5, 16 команд', color: '#FFE14D' },
  { game: 'Dota 2', title: 'Captains Mode', date: '17 октября', prize: '100 000 ₽', format: '5×5, 12 команд', color: '#FF2BD6' },
  { game: 'Valorant', title: 'Осенний спринт', date: '24 октября', prize: '80 000 ₽', format: '5×5, 16 команд', color: '#22E7FF' },
  { game: 'Fortnite', title: 'Solo Cash Cup', date: '31 октября', prize: '40 000 ₽', format: 'Соло, 40 игроков', color: '#8B5CFF' },
]

export const FAQ: { q: string; a: string }[] = [
  {
    q: 'Можно прийти со своей мышкой и клавиатурой?',
    a: 'Да. На каждом месте есть свободные USB-порты и 3,5 мм для гарнитуры. Драйверы Logitech, Razer, SteelSeries и Wooting уже установлены, остальное администратор поставит за пару минут.',
  },
  {
    q: 'Со скольки лет пускаете?',
    a: 'Днём — с 14 лет. С 22:00 до 08:00 только с 18 лет, на входе попросим паспорт. Подростков младше 14 пускаем вместе со взрослым.',
  },
  {
    q: 'Можно с едой и напитками?',
    a: 'Свою еду и безалкогольные напитки можно. На баре есть снеки, энергетики, кофе и горячая пицца. Напитки ставьте на подстаканник сбоку стола, не рядом с клавиатурой.',
  },
  {
    q: 'Как оплатить?',
    a: 'Картой, по СБП или наличными на ресепшене. Бронь оплачивается на месте, предоплата нужна только для VIP-комнаты целиком и ночных турниров.',
  },
  {
    q: 'Что будет, если я опоздаю?',
    a: 'Держим место 20 минут от начала брони. Если задерживаетесь дольше, напишите в Telegram — продлим бесплатно, если после вас никто не записан.',
  },
]
