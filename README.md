# web-studio

Ten production-style marketing sites and app screens built on one codebase: React 19, TypeScript, Vite 8, Tailwind CSS 4, shadcn/ui, Magic UI and Aceternity components, GSAP and Framer Motion, and real-time 3D with Three.js / React Three Fiber.

Every page is a different brand with its own art direction, not a recoloured template.

| | |
|---|---|
| ![](docs/detailing_1440_0.jpg) **Detailing studio**: liquid-chrome WebGL hero, 3D wrap-film configurator | ![](docs/club_1440_0.jpg) **Computer club**: 3D neon logo, seat booking grid |
| ![](docs/clinic_1440_0.jpg) **Dental clinic**: calm editorial layout, online booking | ![](docs/coffee_1440_0.jpg) **Coffee roastery**: oversized type, rotating badge, menu columns |
| ![](docs/school_1440_0.jpg) **Coding school**: 3D keyboard, live code block | ![](docs/ai-saas_1440_0.jpg) **AI SaaS**: shader background, interactive demos |
| ![](docs/shop_1440_0.jpg) **E-commerce**: catalog, cart, checkout modal | ![](docs/dashboard_1440_0.jpg) **Sales dashboard**: Recharts, KPI cards, dark UI |
| ![](docs/repair_1440_0.jpg) **Renovation company**: estimate calculator | ![](docs/miniapp_1440_0.jpg) **Telegram Mini App**: order flow for a coffee shop |

Mobile layouts:

<p>
<img src="docs/clinic_390_0.jpg" width="160"> <img src="docs/coffee_390_0.jpg" width="160"> <img src="docs/club_390_0.jpg" width="160"> <img src="docs/detailing_390_0.jpg" width="160"> <img src="docs/school_390_0.jpg" width="160">
</p>

## Stack

- **UI:** React 19, TypeScript 6, Tailwind CSS 4, shadcn/ui, Radix, Base UI
- **Motion:** GSAP + ScrollTrigger, Framer Motion, Lenis smooth scroll
- **3D and graphics:** Three.js, React Three Fiber, drei, postprocessing, custom GLSL shaders, cobe globe, tsParticles
- **Build:** Vite 8 multi-page build, oxlint, code splitting per page
- **Quality:** respects `prefers-reduced-motion`, keyboard focus states, light assets, audited with the Playwright suite from [web-qa-autotests](https://github.com/YoungOver/web-qa-autotests)

## Structure

```
src/               pages, shared sections, magicui and aceternity based effects
public/img         optimised imagery
scripts/           screenshot and build helpers
*.html             one entry per site
```

## Run

```bash
npm install
npm run dev        # all pages at http://localhost:5173/<page>.html
npm run build      # static multi-page build in dist/
```
