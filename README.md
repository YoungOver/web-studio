# web-studio

Десять маркетинговых сайтов и экранов приложений на общей кодовой базе: React 19,
TypeScript, Vite 8, Tailwind CSS 4, shadcn/ui, компоненты Magic UI и Aceternity, GSAP и
Framer Motion, 3D в реальном времени на Three.js и React Three Fiber.

Каждая страница сделана под свой бренд со своей арт-дирекцией, а не перекрашенный шаблон.

| | |
|---|---|
| ![](docs/detailing_1440_0.jpg) **Детейлинг-студия**: WebGL-обложка с жидким хромом, 3D-конфигуратор плёнки | ![](docs/club_1440_0.jpg) **Компьютерный клуб**: неоновый 3D-логотип, бронирование мест |
| ![](docs/clinic_1440_0.jpg) **Стоматология**: спокойная журнальная вёрстка, онлайн-запись | ![](docs/coffee_1440_0.jpg) **Обжарка кофе**: крупная типографика, вращающийся бейдж, меню колонками |
| ![](docs/school_1440_0.jpg) **Школа программирования**: 3D-клавиатура, живой блок кода | ![](docs/ai-saas_1440_0.jpg) **AI-сервис**: шейдерный фон, интерактивные демо |
| ![](docs/shop_1440_0.jpg) **Интернет-магазин**: каталог, корзина, оформление заказа | ![](docs/dashboard_1440_0.jpg) **Дашборд продаж**: Recharts, карточки KPI, тёмная тема |
| ![](docs/repair_1440_0.jpg) **Ремонт квартир**: калькулятор сметы | ![](docs/miniapp_1440_0.jpg) **Telegram Mini App**: оформление заказа в кофейне |

Мобильная вёрстка:

<p>
<img src="docs/clinic_390_0.jpg" width="160"> <img src="docs/coffee_390_0.jpg" width="160"> <img src="docs/club_390_0.jpg" width="160"> <img src="docs/detailing_390_0.jpg" width="160"> <img src="docs/school_390_0.jpg" width="160">
</p>

## Стек

- **Интерфейс:** React 19, TypeScript 6, Tailwind CSS 4, shadcn/ui, Radix, Base UI
- **Анимация:** GSAP и ScrollTrigger, Framer Motion, плавная прокрутка Lenis
- **3D и графика:** Three.js, React Three Fiber, drei, postprocessing, свои GLSL-шейдеры, глобус cobe, tsParticles
- **Сборка:** многостраничная сборка Vite 8, oxlint, разбиение кода по страницам
- **Качество:** учитывается `prefers-reduced-motion`, видимый фокус с клавиатуры, лёгкие ассеты, аудит набором Playwright из [web-qa-autotests](https://github.com/YoungOver/web-qa-autotests)

## Структура

```
src/               страницы, общие секции, эффекты на основе magicui и aceternity
public/img         оптимизированные изображения
scripts/           скриншоты и вспомогательные скрипты сборки
*.html             отдельная точка входа на каждый сайт
```

## Запуск

```bash
npm install
npm run dev        # все страницы на http://localhost:5173/<страница>.html
npm run build      # статическая многостраничная сборка в dist/
```
