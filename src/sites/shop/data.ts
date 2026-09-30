export type Category = 'face' | 'body' | 'hair' | 'sets'
export type Skin = 'dry' | 'normal' | 'combo' | 'oily' | 'sensitive'
export type Concern = 'dryness' | 'dullness' | 'breakouts' | 'redness'
export type Vessel = 'dropper' | 'jar' | 'pump' | 'oil' | 'set'
export type Volume = 15 | 30 | 50

export interface Product {
  id: string
  num: string
  kind: string
  title: string
  category: Category
  vessel: Vessel
  /** glass tint */
  glass: string
  glassOpacity: number
  liquid: string
  cap: string
  capKind: 'matte' | 'metal' | 'wood'
  /** card backdrop */
  tone: string
  badge?: 'Хит' | 'Новинка' | 'Выгодно'
  short: string
  description: string
  key: { name: string; pct: string; note: string }[]
  inci: string
  howTo: string[]
  skin: Skin[]
  concerns: Concern[]
  scented: boolean
  prices: Record<Volume, number>
  rating: number
  reviews: number
  popularity: number
  added: number
}

export const CATEGORY_LABEL: Record<Category, string> = {
  face: 'Лицо',
  body: 'Тело',
  hair: 'Волосы',
  sets: 'Наборы',
}

export const SKIN_LABEL: Record<Skin, string> = {
  dry: 'Сухая',
  normal: 'Нормальная',
  combo: 'Комбинированная',
  oily: 'Жирная',
  sensitive: 'Чувствительная',
}

export const PRODUCTS: Product[] = [
  {
    id: 'serum-lavender',
    num: '01',
    kind: 'Сыворотка',
    title: 'Лаванда и бакучиол',
    category: 'face',
    vessel: 'dropper',
    glass: '#c3b6da',
    glassOpacity: 0.5,
    liquid: '#c4b2de',
    cap: '#2c2a33',
    capKind: 'matte',
    tone: '#e3dde6',
    badge: 'Хит',
    short: 'Ровный тон и мягкость без раздражения',
    description:
      'Растительная альтернатива ретинолу. Бакучиол выравнивает рельеф и тон, гидролат лаванды успокаивает, а сквалан из оливок держит влагу до утра. Подходит для ежедневного применения, в том числе летом.',
    key: [
      { name: 'Бакучиол', pct: '1 %', note: 'обновляет кожу без шелушения' },
      { name: 'Гидролат лаванды', pct: '42 %', note: 'успокаивает и снимает покраснения' },
      { name: 'Сквалан из оливок', pct: '8 %', note: 'восстанавливает липидный барьер' },
    ],
    inci: 'Lavandula Angustifolia Flower Water, Squalane, Glycerin, Bakuchiol, Sodium Hyaluronate, Panthenol, Tocopherol, Lavandula Angustifolia Oil, Xanthan Gum, Sodium Levulinate, Potassium Sorbate.',
    howTo: [
      'Вечером нанесите 3–4 капли на чистую, слегка влажную кожу.',
      'Распределите мягкими прижимающими движениями, избегая век.',
      'Через минуту закрепите кремом № 03 или маслом № 05.',
    ],
    skin: ['dry', 'normal', 'combo', 'sensitive'],
    concerns: ['dullness', 'redness'],
    scented: true,
    prices: { 15: 1490, 30: 2300, 50: 3390 },
    rating: 4.9,
    reviews: 412,
    popularity: 1,
    added: 3,
  },
  {
    id: 'serum-niacinamide',
    num: '02',
    kind: 'Сыворотка',
    title: 'Ниацинамид и цинк',
    category: 'face',
    vessel: 'dropper',
    glass: '#9fb097',
    glassOpacity: 0.5,
    liquid: '#dfe6c9',
    cap: '#3f4a3c',
    capKind: 'matte',
    tone: '#dfe3d8',
    short: 'Меньше блеска и расширенных пор',
    description:
      'Лёгкая сыворотка-гель для жирной и комбинированной кожи. Ниацинамид 4 % и цинк регулируют себум, экстракт зелёного чая снижает воспаления. Не утяжеляет макияж и не оставляет плёнки.',
    key: [
      { name: 'Ниацинамид', pct: '4 %', note: 'сужает поры и выравнивает тон' },
      { name: 'Цинк PCA', pct: '1 %', note: 'регулирует выработку себума' },
      { name: 'Экстракт зелёного чая', pct: '3 %', note: 'антиоксидант, снимает воспаления' },
    ],
    inci: 'Aqua, Niacinamide, Camellia Sinensis Leaf Extract, Zinc PCA, Glycerin, Betaine, Sodium Hyaluronate, Allantoin, Xanthan Gum, Sodium Benzoate, Citric Acid.',
    howTo: [
      'Утром и вечером нанесите 2–3 капли на очищенную кожу.',
      'Сосредоточьтесь на Т-зоне и участках с расширенными порами.',
      'Утром обязательно завершите уход солнцезащитным кремом.',
    ],
    skin: ['oily', 'combo', 'normal'],
    concerns: ['breakouts', 'dullness'],
    scented: false,
    prices: { 15: 1290, 30: 1990, 50: 2890 },
    rating: 4.8,
    reviews: 287,
    popularity: 3,
    added: 5,
  },
  {
    id: 'oil-night',
    num: '05',
    kind: 'Масло для лица',
    title: 'Ночное восстановление',
    category: 'face',
    vessel: 'dropper',
    glass: '#b87a3f',
    glassOpacity: 0.72,
    liquid: '#e2a64a',
    cap: '#1e1e1c',
    capKind: 'matte',
    tone: '#e9dccb',
    badge: 'Новинка',
    short: 'Питание и сияние к утру',
    description:
      'Смесь пяти масел холодного отжима: шиповник, жожоба, конопля, камелия и облепиха. Впитывается за пару минут, не оставляет жирного блеска на подушке. Утром кожа выглядит отдохнувшей.',
    key: [
      { name: 'Масло шиповника', pct: '30 %', note: 'природный источник ретиноидов' },
      { name: 'Масло жожоба', pct: '28 %', note: 'близко по составу к кожному себуму' },
      { name: 'Облепиховое масло', pct: '2 %', note: 'каротиноиды для ровного тона' },
    ],
    inci: 'Rosa Canina Fruit Oil, Simmondsia Chinensis Seed Oil, Cannabis Sativa Seed Oil, Camellia Japonica Seed Oil, Hippophae Rhamnoides Fruit Oil, Tocopherol, Lavandula Angustifolia Oil, Linalool.',
    howTo: [
      'Разогрейте 2–3 капли в ладонях.',
      'Прижмите ладони к лицу и шее, не растирая.',
      'Используйте последним шагом вечернего ухода.',
    ],
    skin: ['dry', 'normal', 'sensitive'],
    concerns: ['dryness', 'dullness'],
    scented: true,
    prices: { 15: 1690, 30: 2690, 50: 3890 },
    rating: 4.9,
    reviews: 96,
    popularity: 4,
    added: 8,
  },
  {
    id: 'cream-oat',
    num: '03',
    kind: 'Крем для лица',
    title: 'Овёс и сквалан',
    category: 'face',
    vessel: 'jar',
    glass: '#f2efe9',
    glassOpacity: 0.86,
    liquid: '#f6f1e8',
    cap: '#cbbfae',
    capKind: 'wood',
    tone: '#e6e1d8',
    short: 'Спасает кожу, которая на всё реагирует',
    description:
      'Плотный, но не тяжёлый крем без отдушки. Коллоидная овсяная мука и церамиды восстанавливают барьер, пантенол снимает стянутость после умывания. Хорошо ложится под макияж.',
    key: [
      { name: 'Коллоидный овёс', pct: '2 %', note: 'успокаивает зуд и покраснения' },
      { name: 'Церамиды NP, AP', pct: '0,5 %', note: 'восстанавливают барьер кожи' },
      { name: 'Пантенол', pct: '5 %', note: 'снимает стянутость' },
    ],
    inci: 'Aqua, Squalane, Caprylic/Capric Triglyceride, Glycerin, Panthenol, Cetearyl Olivate, Sorbitan Olivate, Avena Sativa Kernel Flour, Ceramide NP, Ceramide AP, Cholesterol, Tocopherol, Sodium Levulinate.',
    howTo: [
      'Возьмите шпателем небольшое количество, размером с горошину.',
      'Распределите по лицу и шее утром и вечером.',
      'На очень сухие участки нанесите второй тонкий слой.',
    ],
    skin: ['dry', 'normal', 'combo', 'sensitive'],
    concerns: ['dryness', 'redness'],
    scented: false,
    prices: { 15: 1190, 30: 1890, 50: 2590 },
    rating: 4.8,
    reviews: 351,
    popularity: 2,
    added: 2,
  },
  {
    id: 'body-oil',
    num: '07',
    kind: 'Масло для тела',
    title: 'Лаванда и кедр',
    category: 'body',
    vessel: 'oil',
    glass: '#8c7aa8',
    glassOpacity: 0.62,
    liquid: '#e6cf8f',
    cap: '#b59b7c',
    capKind: 'wood',
    tone: '#e0dbe3',
    short: 'Сухое масло после душа',
    description:
      'Сухое масло на основе миндаля и сквалана с эфирными маслами лаванды и сибирского кедра. Наносится на влажную кожу, впитывается за минуту и оставляет тонкий древесный шлейф.',
    key: [
      { name: 'Миндальное масло', pct: '45 %', note: 'смягчает сухие участки' },
      { name: 'Масло кедрового ореха', pct: '12 %', note: 'питает и укрепляет кожу' },
      { name: 'Эфирное масло лаванды', pct: '0,8 %', note: 'аромат, который расслабляет' },
    ],
    inci: 'Prunus Amygdalus Dulcis Oil, Squalane, Pinus Sibirica Seed Oil, Coco-Caprylate, Lavandula Angustifolia Oil, Cedrus Atlantica Bark Oil, Tocopherol, Linalool, Limonene.',
    howTo: [
      'После душа промокните кожу полотенцем, оставив её влажной.',
      'Нанесите 5–6 капель на ладони и распределите по телу.',
      'Дайте впитаться минуту, прежде чем одеваться.',
    ],
    skin: ['dry', 'normal', 'combo', 'oily', 'sensitive'],
    concerns: ['dryness'],
    scented: true,
    prices: { 15: 890, 30: 1490, 50: 2190 },
    rating: 4.7,
    reviews: 164,
    popularity: 5,
    added: 4,
  },
  {
    id: 'body-cream',
    num: '08',
    kind: 'Крем для тела',
    title: 'Ши и розмарин',
    category: 'body',
    vessel: 'jar',
    glass: '#55644f',
    glassOpacity: 0.9,
    liquid: '#efe7d6',
    cap: '#1e1e1c',
    capKind: 'matte',
    tone: '#dadfd4',
    badge: 'Выгодно',
    short: 'Плотное питание для сухой кожи',
    description:
      'Баттер-крем с нерафинированным маслом ши и экстрактом розмарина. Тает при контакте с кожей, снимает шелушение на локтях и коленях. Хватает на два месяца ежедневного ухода.',
    key: [
      { name: 'Масло ши', pct: '18 %', note: 'глубокое питание' },
      { name: 'Экстракт розмарина', pct: '1 %', note: 'тонизирует и освежает' },
      { name: 'Мочевина', pct: '5 %', note: 'мягко убирает шелушение' },
    ],
    inci: 'Aqua, Butyrospermum Parkii Butter, Helianthus Annuus Seed Oil, Glycerin, Urea, Cetearyl Alcohol, Glyceryl Stearate, Rosmarinus Officinalis Leaf Extract, Tocopherol, Sodium Benzoate.',
    howTo: [
      'Нанесите на сухую кожу после душа.',
      'Уделите внимание локтям, коленям и стопам.',
      'Для интенсивного ухода оставьте на ночь под хлопковыми носками.',
    ],
    skin: ['dry', 'normal', 'combo', 'oily', 'sensitive'],
    concerns: ['dryness'],
    scented: true,
    prices: { 15: 690, 30: 1190, 50: 1690 },
    rating: 4.8,
    reviews: 203,
    popularity: 6,
    added: 1,
  },
  {
    id: 'hair-oil',
    num: '11',
    kind: 'Масло для волос',
    title: 'Аргана и розмарин',
    category: 'hair',
    vessel: 'pump',
    glass: '#7b5431',
    glassOpacity: 0.78,
    liquid: '#d9a04c',
    cap: '#1e1e1c',
    capKind: 'matte',
    tone: '#e5dcd1',
    short: 'Гладкие кончики без утяжеления',
    description:
      'Лёгкое масло для длины и кончиков. Аргана и сквалан запаивают сечение, розмарин стимулирует кожу головы, если использовать масло как маску перед мытьём.',
    key: [
      { name: 'Аргановое масло', pct: '35 %', note: 'блеск и эластичность' },
      { name: 'Эфирное масло розмарина', pct: '0,5 %', note: 'тонизирует кожу головы' },
      { name: 'Сквалан', pct: '20 %', note: 'разглаживает без плёнки' },
    ],
    inci: 'Argania Spinosa Kernel Oil, Squalane, Coco-Caprylate, Camellia Oleifera Seed Oil, Rosmarinus Officinalis Leaf Oil, Tocopherol, Limonene.',
    howTo: [
      'Одно-два нажатия распределите по влажной длине.',
      'Избегайте корней, если волосы склонны к жирности.',
      'Как маска: нанесите на 30 минут перед мытьём головы.',
    ],
    skin: ['dry', 'normal', 'combo', 'oily', 'sensitive'],
    concerns: ['dryness'],
    scented: true,
    prices: { 15: 790, 30: 1390, 50: 1990 },
    rating: 4.7,
    reviews: 129,
    popularity: 7,
    added: 6,
  },
  {
    id: 'set-evening',
    num: '12',
    kind: 'Набор',
    title: 'Вечерний ритуал',
    category: 'sets',
    vessel: 'set',
    glass: '#b9a8d4',
    glassOpacity: 0.5,
    liquid: '#b49ad6',
    cap: '#2c2a33',
    capKind: 'matte',
    tone: '#e2dfe7',
    badge: 'Выгодно',
    short: 'Сыворотка № 01 и крем № 03 в льняной косметичке',
    description:
      'Два главных средства вечернего ухода по цене со скидкой 15 %. Сыворотка обновляет кожу, крем закрепляет результат. В комплекте льняная косметичка и открытка с инструкцией.',
    key: [
      { name: 'Сыворотка № 01', pct: '1 шт.', note: 'бакучиол и гидролат лаванды' },
      { name: 'Крем № 03', pct: '1 шт.', note: 'овёс, церамиды и сквалан' },
      { name: 'Льняная косметичка', pct: 'в подарок', note: 'ручная работа, Иваново' },
    ],
    inci: 'Составы средств указаны на страницах сыворотки № 01 и крема № 03.',
    howTo: [
      'Очистите кожу мягким средством и промокните полотенцем.',
      'Нанесите 3–4 капли сыворотки № 01.',
      'Через минуту закрепите кремом № 03.',
    ],
    skin: ['dry', 'normal', 'combo', 'sensitive'],
    concerns: ['dullness', 'redness', 'dryness'],
    scented: true,
    prices: { 15: 2250, 30: 3550, 50: 5080 },
    rating: 5.0,
    reviews: 58,
    popularity: 8,
    added: 7,
  },
]

export const byId = (id: string) => PRODUCTS.find((p) => p.id === id)!

export const VOLUMES: Volume[] = [15, 30, 50]

export const volumeLabel = (p: Product, v: Volume) => (p.vessel === 'set' ? `2 × ${v} мл` : `${v} мл`)

export const rub = (n: number) => `${n.toLocaleString('ru-RU').replace(/,/g, ' ')} ₽`

export const FREE_DELIVERY = 3500
export const DELIVERY_COST = 290
export const PROMO: Record<string, number> = { LAVANDA10: 0.1, 'ЛАВАНДА10': 0.1, 'НАБОР': 0.1 }

export const MEGA: Record<Category, { cols: { title: string; items: string[] }[]; feature: string; note: string }> = {
  face: {
    cols: [
      { title: 'Средства', items: ['Сыворотки', 'Масла для лица', 'Кремы', 'Гидролаты', 'Бальзамы для губ'] },
      { title: 'По задаче', items: ['Увлажнение', 'Сияние и ровный тон', 'Жирный блеск', 'Чувствительная кожа'] },
    ],
    feature: 'oil-night',
    note: 'Новинка сезона',
  },
  body: {
    cols: [
      { title: 'Средства', items: ['Масла для тела', 'Кремы и баттеры', 'Скрабы', 'Крем для рук'] },
      { title: 'По задаче', items: ['Сухая кожа', 'Шелушение', 'Расслабление перед сном'] },
    ],
    feature: 'body-oil',
    note: 'Выбор покупателей',
  },
  hair: {
    cols: [
      { title: 'Средства', items: ['Масла для волос', 'Маски', 'Тоники для кожи головы'] },
      { title: 'По задаче', items: ['Секущиеся кончики', 'Блеск', 'Рост и густота'] },
    ],
    feature: 'hair-oil',
    note: 'Для длины и кончиков',
  },
  sets: {
    cols: [
      { title: 'Наборы', items: ['Вечерний ритуал', 'Мини-форматы в дорогу', 'Подарочные наборы', 'Подарочные сертификаты'] },
      { title: 'Повод', items: ['Первое знакомство', 'Подарок маме', 'Для него'] },
    ],
    feature: 'set-evening',
    note: 'Экономия 15 %',
  },
}

export interface Review {
  name: string
  city: string
  skin: string
  product: string
  rating: number
  date: string
  text: string
}

export const REVIEWS: Review[] = [
  {
    name: 'Анна',
    city: 'Москва',
    skin: 'чувствительная',
    product: 'Сыворотка № 01',
    rating: 5,
    date: '12 сентября',
    text: 'Искала замену ретинолу, от которого кожа шелушилась неделями. С бакучиолом за месяц выровнялся тон, раздражения не было ни разу. Запах лаванды лёгкий, быстро уходит.',
  },
  {
    name: 'Ольга',
    city: 'Екатеринбург',
    skin: 'сухая',
    product: 'Масло № 05',
    rating: 5,
    date: '3 сентября',
    text: 'Думала, что масло на ночь — это жирная подушка. Нет: три капли, прижать ладонями, через пять минут уже можно спать. Утром кожа мягкая, как после маски.',
  },
  {
    name: 'Марина',
    city: 'Казань',
    skin: 'комбинированная',
    product: 'Сыворотка № 02',
    rating: 4,
    date: '28 августа',
    text: 'Блеска к обеду стало заметно меньше, поры на носу тоже. Минус звезда за пипетку: в конце флакона её сложно набрать, приходится наклонять.',
  },
  {
    name: 'Дарья',
    city: 'Санкт-Петербург',
    skin: 'нормальная',
    product: 'Набор «Вечерний ритуал»',
    rating: 5,
    date: '19 августа',
    text: 'Брала в подарок сестре, в итоге оставила себе и заказала второй. Косметичка правда льняная и плотная, открытка написана от руки.',
  },
  {
    name: 'Екатерина',
    city: 'Новосибирск',
    skin: 'чувствительная',
    product: 'Крем № 03',
    rating: 5,
    date: '9 августа',
    text: 'Единственный крем, который не щиплет после умывания зимой. Текстура плотная, но под тональным не скатывается. Банки хватает месяца на три.',
  },
  {
    name: 'Ирина',
    city: 'Краснодар',
    skin: 'жирная',
    product: 'Масло для тела № 07',
    rating: 5,
    date: '30 июля',
    text: 'Наношу на влажную кожу после душа, впитывается быстро, одежда не пачкается. Кедр с лавандой муж тоже оценил, теперь масло «общее».',
  },
]

export interface QuizQ {
  id: 'skin' | 'concern' | 'steps' | 'scent'
  q: string
  hint: string
  options: { value: string; label: string; sub: string }[]
}

export const QUIZ: QuizQ[] = [
  {
    id: 'skin',
    q: 'Какая у вас кожа к середине дня?',
    hint: 'Умойтесь утром и ничего не наносите — так тип виден точнее.',
    options: [
      { value: 'dry', label: 'Стянутая', sub: 'хочется нанести крем' },
      { value: 'normal', label: 'Комфортная', sub: 'ни блеска, ни сухости' },
      { value: 'combo', label: 'Блестит Т-зона', sub: 'щёки при этом в норме' },
      { value: 'oily', label: 'Блестит везде', sub: 'хочется промокнуть салфеткой' },
    ],
  },
  {
    id: 'concern',
    q: 'Что хочется изменить в первую очередь?',
    hint: 'Выберите одно — так набор получится точнее.',
    options: [
      { value: 'dryness', label: 'Сухость', sub: 'шелушение, стянутость' },
      { value: 'dullness', label: 'Тусклый тон', sub: 'уставший вид, неровный рельеф' },
      { value: 'breakouts', label: 'Высыпания', sub: 'воспаления и расширенные поры' },
      { value: 'redness', label: 'Покраснения', sub: 'кожа реагирует на всё' },
    ],
  },
  {
    id: 'steps',
    q: 'Сколько шагов в уходе вы готовы делать?',
    hint: 'Честно. Регулярность важнее количества банок.',
    options: [
      { value: '2', label: 'Два', sub: 'быстро утром и вечером' },
      { value: '3', label: 'Три', sub: 'полноценный вечерний уход' },
      { value: '4', label: 'Четыре', sub: 'люблю ритуалы' },
    ],
  },
  {
    id: 'scent',
    q: 'Как вы относитесь к ароматам?',
    hint: 'Мы используем только эфирные масла, без синтетических отдушек.',
    options: [
      { value: 'yes', label: 'Люблю лаванду', sub: 'уход должен пахнуть' },
      { value: 'no', label: 'Без запаха', sub: 'чувствительна к ароматам' },
    ],
  },
]

export type QuizAnswers = Partial<Record<QuizQ['id'], string>>

/** Score every single product (sets excluded) and return the top N for the answers. */
export function recommend(a: QuizAnswers): Product[] {
  const n = Number(a.steps ?? 3)
  const skin = a.skin as Skin | undefined
  const concern = a.concern as Concern | undefined
  const scored = PRODUCTS.filter((p) => p.category !== 'sets' && p.category !== 'hair').map((p) => {
    let s = 0
    if (concern && p.concerns.includes(concern)) s += 4
    if (skin) s += p.skin.includes(skin) ? 2 : -3
    if (a.scent === 'no' && p.scented) s -= 3
    if (p.category === 'face') s += 1.5
    s -= p.popularity * 0.05
    return { p, s }
  })
  scored.sort((x, y) => y.s - x.s)
  const picked: Product[] = []
  // always lead with a serum, then add the best of the rest
  const serum = scored.find((x) => x.p.kind === 'Сыворотка')
  if (serum) picked.push(serum.p)
  for (const x of scored) {
    if (picked.length >= n) break
    if (!picked.includes(x.p)) picked.push(x.p)
  }
  return picked
}

export const SET_DISCOUNT = 0.1
