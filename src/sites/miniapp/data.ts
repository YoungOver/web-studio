export type Category = 'coffee' | 'other' | 'dessert'

export type ArtKind =
  | 'cappuccino'
  | 'flatwhite'
  | 'latte'
  | 'raf'
  | 'americano'
  | 'tonic'
  | 'matcha'
  | 'cocoa'
  | 'tea'
  | 'lemonade'
  | 'croissant'
  | 'cheesecake'
  | 'cookie'
  | 'canele'

export type Product = {
  id: string
  name: string
  desc: string
  about: string
  price: number
  category: Category
  art: ArtKind
  tint: string
  sizes?: boolean
  milk?: boolean
  syrups?: boolean
  shot?: boolean
  warm?: boolean
  tag?: string
}

export const categories: { id: Category; label: string }[] = [
  { id: 'coffee', label: 'Кофе' },
  { id: 'other', label: 'Не кофе' },
  { id: 'dessert', label: 'Десерты' },
]

export const products: Product[] = [
  {
    id: 'cap', name: 'Капучино', desc: 'Двойной эспрессо, пена', price: 220, category: 'coffee', art: 'cappuccino', tint: '#f3e6d8',
    about: 'Двойной эспрессо на бразильском зерне, молоко взбиваем до шелковистой пены. Самый заказываемый напиток утром.',
    sizes: true, milk: true, syrups: true, shot: true, tag: 'Хит',
  },
  {
    id: 'fw', name: 'Флэт уайт', desc: 'Крепче капучино', price: 250, category: 'coffee', art: 'flatwhite', tint: '#efe2d3',
    about: 'Двойная ристретто и тонкий слой молока. Для тех, кому в капучино не хватает кофе.',
    sizes: true, milk: true, syrups: true, shot: true,
  },
  {
    id: 'latte', name: 'Латте', desc: 'Мягкий, много молока', price: 230, category: 'coffee', art: 'latte', tint: '#f1e9df',
    about: 'Эспрессо и много горячего молока с лёгкой пенкой. Хорошо дружит с сиропами.',
    sizes: true, milk: true, syrups: true, shot: true,
  },
  {
    id: 'raf', name: 'Раф ванильный', desc: 'Сливки, ваниль, эспрессо', price: 290, category: 'coffee', art: 'raf', tint: '#f5ecdc',
    about: 'Эспрессо, сливки и ванильный сахар, взбитые вместе паром. Десерт в стакане.',
    sizes: true, milk: true, syrups: true, shot: true, tag: 'Новинка',
  },
  {
    id: 'amer', name: 'Американо', desc: 'Чистый вкус зерна', price: 170, category: 'coffee', art: 'americano', tint: '#ece3da',
    about: 'Двойной эспрессо, долитый горячей водой. Чистый вкус зерна без молока.',
    sizes: true, syrups: true, shot: true,
  },
  {
    id: 'tonic', name: 'Эспрессо-тоник', desc: 'Со льдом и цедрой', price: 280, category: 'coffee', art: 'tonic', tint: '#f4ead6',
    about: 'Тоник, лёд и эспрессо сверху. Освежает лучше лимонада и бодрит лучше тоника.',
    sizes: true, syrups: true, shot: true,
  },
  {
    id: 'matcha', name: 'Матча латте', desc: 'Японский чай, молоко', price: 290, category: 'other', art: 'matcha', tint: '#e5eddb',
    about: 'Церемониальная матча, взбитая вручную, и горячее молоко. Без кофеина, но бодрит.',
    sizes: true, milk: true, syrups: true,
  },
  {
    id: 'cocoa', name: 'Какао', desc: 'С маршмеллоу', price: 240, category: 'other', art: 'cocoa', tint: '#efe3db',
    about: 'Бельгийский какао-порошок, молоко и маленькие маршмеллоу сверху.',
    sizes: true, milk: true, syrups: true,
  },
  {
    id: 'tea', name: 'Облепиховый чай', desc: 'Мёд и апельсин', price: 250, category: 'other', art: 'tea', tint: '#f8e8d2',
    about: 'Облепиха, перетёртая с мёдом, апельсин и чёрный чай. Согревает в любую погоду.',
    sizes: true,
  },
  {
    id: 'lemon', name: 'Лимонад маракуйя', desc: 'Со льдом и мятой', price: 260, category: 'other', art: 'lemonade', tint: '#f7efd3',
    about: 'Пюре маракуйи, лайм, мята и газированная вода со льдом.',
    sizes: true,
  },
  {
    id: 'crois', name: 'Круассан', desc: 'Сливочное масло 82%', price: 190, category: 'dessert', art: 'croissant', tint: '#f6ead8',
    about: 'Печём каждое утро в самой кофейне. Слоёное тесто на французском масле.',
    warm: true, tag: 'Утром',
  },
  {
    id: 'cheese', name: 'Чизкейк', desc: 'Нью-Йорк с ягодами', price: 280, category: 'dessert', art: 'cheesecake', tint: '#f5e7e3',
    about: 'Классический нью-йоркский чизкейк на песочной основе с соусом из лесных ягод.',
  },
  {
    id: 'cookie', name: 'Печенье', desc: 'С тёмным шоколадом', price: 140, category: 'dessert', art: 'cookie', tint: '#f0e6da',
    about: 'Мягкое внутри и хрустящее по краю, с кусочками бельгийского шоколада 70%.',
    warm: true,
  },
  {
    id: 'canele', name: 'Канеле', desc: 'Ром и ваниль', price: 160, category: 'dessert', art: 'canele', tint: '#f3e4d4',
    about: 'Бордоский десерт: карамельная корочка снаружи и нежный заварной центр.',
  },
]

export const sizes = [
  { id: 'S', ml: 250, delta: 0 },
  { id: 'M', ml: 350, delta: 40 },
  { id: 'L', ml: 450, delta: 80 },
] as const
export type SizeId = (typeof sizes)[number]['id']

export const milks = [
  { id: 'cow', label: 'Обычное', delta: 0 },
  { id: 'oat', label: 'Овсяное', delta: 50 },
  { id: 'coco', label: 'Кокосовое', delta: 50 },
] as const
export type MilkId = (typeof milks)[number]['id']

export const syrups = [
  { id: 'van', label: 'Ваниль' },
  { id: 'car', label: 'Карамель' },
  { id: 'saltcar', label: 'Солёная карамель' },
  { id: 'nut', label: 'Лесной орех' },
  { id: 'coco', label: 'Кокос' },
] as const
export type SyrupId = (typeof syrups)[number]['id']
export const SYRUP_PRICE = 30
export const SHOT_PRICE = 60

export type Shop = {
  id: string
  street: string
  distance: string
  eta: number
  hours: string
  load: string
  pin: [number, number]
}

export const shops: Shop[] = [
  { id: 'rub', street: 'Рубинштейна, 12', distance: '350 м', eta: 7, hours: 'до 23:00', load: 'Спокойно', pin: [118, 70] },
  { id: 'nev', street: 'Невский, 88', distance: '1,2 км', eta: 12, hours: 'до 22:00', load: 'Много заказов', pin: [60, 42] },
  { id: 'lig', street: 'Лиговский, 30', distance: '2,4 км', eta: 5, hours: 'круглосуточно', load: 'Свободно', pin: [214, 88] },
]

export type Line = {
  key: string
  productId: string
  size?: SizeId
  milk?: MilkId
  syrups: SyrupId[]
  shot: boolean
  warm: boolean
  qty: number
}

export const byId = (id: string) => products.find((p) => p.id === id)!

export function unitPrice(l: Omit<Line, 'key' | 'qty'>) {
  const p = byId(l.productId)
  let v = p.price
  if (l.size) v += sizes.find((s) => s.id === l.size)!.delta
  if (l.milk) v += milks.find((m) => m.id === l.milk)!.delta
  v += l.syrups.length * SYRUP_PRICE
  if (l.shot) v += SHOT_PRICE
  return v
}

export function lineKey(l: Omit<Line, 'key' | 'qty'>) {
  return [l.productId, l.size ?? '', l.milk ?? '', [...l.syrups].sort().join('+'), l.shot ? 1 : 0, l.warm ? 1 : 0].join('|')
}

export function defaultLine(productId: string): Omit<Line, 'key' | 'qty'> {
  const p = byId(productId)
  return {
    productId,
    size: p.sizes ? 'M' : undefined,
    milk: p.milk ? 'cow' : undefined,
    syrups: [],
    shot: false,
    warm: false,
  }
}

export function lineSummary(l: Line) {
  const parts: string[] = []
  if (l.size) parts.push(`${l.size}, ${sizes.find((s) => s.id === l.size)!.ml} мл`)
  if (l.milk && l.milk !== 'cow') parts.push(milks.find((m) => m.id === l.milk)!.label.toLowerCase() + ' молоко')
  for (const s of l.syrups) parts.push(syrups.find((x) => x.id === s)!.label.toLowerCase())
  if (l.shot) parts.push('доп. шот')
  if (l.warm) parts.push('подогреть')
  return parts.join(' · ')
}

export const rub = (n: number) => `${n.toLocaleString('ru-RU')} ₽`

export const BONUS_BALANCE = 340
export const BONUS_SPEND = 120
