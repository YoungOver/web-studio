export type CarClass = 'sedan' | 'crossover' | 'suv'

export const CAR_CLASSES: { id: CarClass; label: string }[] = [
  { id: 'sedan', label: 'Седан' },
  { id: 'crossover', label: 'Кроссовер' },
  { id: 'suv', label: 'Внедорожник' },
]

export type Finish = 'gloss' | 'satin' | 'matte'

export const FINISHES: { id: Finish; label: string; roughness: number; clearcoat: number; clearcoatRoughness: number; metalness: number }[] = [
  { id: 'gloss', label: 'Глянец', roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.03, metalness: 0.55 },
  { id: 'satin', label: 'Сатин', roughness: 0.46, clearcoat: 0.55, clearcoatRoughness: 0.38, metalness: 0.45 },
  { id: 'matte', label: 'Мат', roughness: 0.78, clearcoat: 0.04, clearcoatRoughness: 0.9, metalness: 0.2 },
]

export type Film = {
  id: string
  name: string
  color: string
  glow: string
  kind: 'ppf' | 'color'
  note: string
}

export const FILMS: Film[] = [
  { id: 'graphite', name: 'Графит', color: '#2f3237', glow: '#5b6270', kind: 'color', note: 'Тёмно-серый с мелким металликом' },
  { id: 'nardo', name: 'Нардо', color: '#83878b', glow: '#9aa0a8', kind: 'color', note: 'Плотный серый без металлика' },
  { id: 'polar', name: 'Полярный', color: '#e6e9ec', glow: '#c9d3de', kind: 'color', note: 'Холодный белый, не желтеет' },
  { id: 'emerald', name: 'Изумруд', color: '#0c4d3b', glow: '#1f8f6c', kind: 'color', note: 'Глубокий зелёный с перламутром' },
  { id: 'burgundy', name: 'Бургунди', color: '#521221', glow: '#9c2640', kind: 'color', note: 'Тёмно-красный, почти вишня' },
  { id: 'clear', name: 'Прозрачная PPF', color: '#1a3a86', glow: '#3b7bff', kind: 'ppf', note: 'Показана на синем заводском лаке' },
]

export const FILM_PRICE: Record<Film['kind'], Record<CarClass, number>> = {
  ppf: { sedan: 280000, crossover: 330000, suv: 390000 },
  color: { sedan: 190000, crossover: 225000, suv: 265000 },
}

export const FILM_META: Record<Film['kind'], { title: string; brand: string; days: string }> = {
  ppf: { title: 'Полная оклейка PPF', brand: 'Полиуретан XPEL Ultimate Plus или SunTek Reaction', days: '4–5 дней' },
  color: { title: 'Смена цвета плёнкой', brand: 'Полиуретан SunTek Color или винил Hexis', days: '5–7 дней' },
}

export type Service = {
  id: string
  name: string
  price: string
  days: string
  text: string
  cta: string
}

export const SERVICES: Service[] = [
  { id: 'polish', cta: 'Записаться на полировку', name: 'Полировка', price: 'от 18 000 ₽', days: '1–2 дня', text: 'Убираем голограммы и мелкие царапины. Толщину лака меряем до и после, результат видно на замерах.' },
  { id: 'ceramic', cta: 'Записаться на керамику', name: 'Керамика', price: 'от 32 000 ₽', days: '2 дня', text: 'Два слоя керамики и финишный слой. Гарантия 3 года, раз в полгода бесплатно проверяем покрытие.' },
  { id: 'ppf', cta: 'Записаться на оклейку PPF', name: 'Плёнка PPF', price: 'от 90 000 ₽', days: '3–5 дней', text: 'XPEL или SunTek на зону риска или весь кузов. Края заворачиваем, стыков на капоте нет.' },
  { id: 'vinyl', cta: 'Записаться на смену цвета', name: 'Винил и смена цвета', price: 'от 190 000 ₽', days: '5–7 дней', text: 'Глянец, сатин или мат, больше 300 цветов. Снимается без следов на заводском лаке.' },
  { id: 'interior', cta: 'Записаться на химчистку', name: 'Химчистка салона', price: 'от 14 000 ₽', days: '1 день', text: 'Кожа, алькантара, потолок. Паром и экстрактором, кожу после чистки кондиционируем.' },
]

export const STEPS: { title: string; time: string; text: string }[] = [
  { title: 'Приёмка и осмотр под светом', time: '30 минут', text: 'Смотрим кузов под лампами 6500 K, меряем толщину лака, фотографируем каждый скол.' },
  { title: 'Детейлинг-мойка', time: '3 часа', text: 'Трёхфазная мойка, снимаем битум и металлические вкрапления, обрабатываем глиной.' },
  { title: 'Полировка', time: '1–2 дня', text: 'Абразивная и финишная, в два или три шага. Сколько снимать, решаем по замерам.' },
  { title: 'Защитное покрытие', time: '1–3 дня', text: 'Керамика, плёнка или воск. Сушим под ИК-лампами, чтобы покрытие набрало твёрдость.' },
  { title: 'Выдача с фотоотчётом', time: '40 минут', text: 'Показываем машину под тем же светом, отдаём фото до и после и памятку по уходу.' },
]

export type Package = {
  id: string
  name: string
  lead: string
  items: string[]
  price: Record<CarClass, number>
  featured?: boolean
}

export const PACKAGES: Package[] = [
  {
    id: 'fresh',
    name: 'Свежий',
    lead: 'Перед продажей или после зимы',
    items: ['Детейлинг-мойка с глиной', 'Полировка в один шаг', 'Твёрдый воск, держится 3 месяца', 'Химчистка ковриков и багажника'],
    price: { sedan: 19000, crossover: 22000, suv: 26000 },
  },
  {
    id: 'ceramic',
    name: 'Керамика',
    lead: 'Чаще всего берут для новой машины',
    items: ['Полировка в два шага', 'Керамика в два слоя и финишный слой', 'Антидождь на все стёкла', 'Гарантия 3 года с проверками'],
    price: { sedan: 58000, crossover: 67000, suv: 76000 },
    featured: true,
  },
  {
    id: 'armor',
    name: 'Броня',
    lead: 'Для трассы и платных дорог',
    items: ['PPF на капот, бампер, крылья, фары и зеркала', 'Керамика на остальной кузов', 'Керамика на диски', 'Фотоотчёт по каждой детали'],
    price: { sedan: 165000, crossover: 189000, suv: 215000 },
  },
]

export const REVIEWS: { text: string; name: string; car: string }[] = [
  { text: 'Керамику делали в марте. После зимы машина отмывается за десять минут.', name: 'Артём', car: 'BMW M340i' },
  { text: 'Оклеили весь кузов. Края завёрнуты так, что стыков не найти.', name: 'Ирина', car: 'Tesla Model Y' },
  { text: 'Присылали фото каждого этапа, я приехал только забрать.', name: 'Денис', car: 'Mercedes GLE' },
  { text: 'Сняли голограммы после другой студии и показали толщину лака до и после.', name: 'Максим', car: 'Porsche Macan' },
  { text: 'Сатиновый графит. На заправке спрашивают, что за цвет.', name: 'Алексей', car: 'Zeekr 001' },
  { text: 'Белая кожа после ребёнка и собаки. Выглядит как в день покупки.', name: 'Ольга', car: 'Range Rover Velar' },
  { text: 'Оставил заявку в десять вечера, перезвонили в 9:05.', name: 'Тимур', car: 'Mercedes E 300' },
  { text: 'Два года с плёнкой на капоте, ни одного скола от щебня.', name: 'Никита', car: 'BMW X5' },
]

export const fmtRub = (n: number) => `${new Intl.NumberFormat('ru-RU').format(Math.round(n))} ₽`
