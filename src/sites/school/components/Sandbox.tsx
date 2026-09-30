import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Minus, Play, Plus } from 'lucide-react'
import { TOKEN_COLORS } from '../lib/highlight'

type Params = { n: number; angle: number; k: number }

const LIMITS = {
  n: { min: 10, max: 200, step: 1, color: '#8fa2ff', label: 'сколько отрезков нарисовать' },
  angle: { min: 1, max: 179, step: 1, color: '#ff8a6b', label: 'на сколько градусов поворачивать' },
  k: { min: 1, max: 10, step: 1, color: '#5fe0b0', label: 'насколько удлинять каждый отрезок' },
} as const

type Key = keyof typeof LIMITS

const PRESETS: { name: string; p: Params }[] = [
  { name: 'Спираль', p: { n: 120, angle: 91, k: 2 } },
  { name: 'Звезда', p: { n: 90, angle: 144, k: 4 } },
  { name: 'Треугольники', p: { n: 150, angle: 121, k: 2 } },
  { name: 'Соты', p: { n: 160, angle: 59, k: 2 } },
]

const STOPS: [number, number, number][] = [
  [61, 90, 254],
  [0, 195, 137],
  [255, 196, 0],
  [255, 90, 54],
]

function colorAt(t: number) {
  const x = Math.min(0.9999, Math.max(0, t)) * (STOPS.length - 1)
  const i = Math.floor(x)
  const f = x - i
  const a = STOPS[i]
  const b = STOPS[i + 1]
  return `rgb(${Math.round(a[0] + (b[0] - a[0]) * f)}, ${Math.round(a[1] + (b[1] - a[1]) * f)}, ${Math.round(a[2] + (b[2] - a[2]) * f)})`
}

function turtle({ n, angle, k }: Params) {
  const pts: [number, number][] = [[0, 0]]
  const heads: number[] = [-Math.PI / 2]
  let x = 0
  let y = 0
  let h = -Math.PI / 2
  for (let i = 0; i < n; i++) {
    const d = i * k
    x += Math.cos(h) * d
    y += Math.sin(h) * d
    pts.push([x, y])
    h -= (angle * Math.PI) / 180
    heads.push(h)
  }
  return { pts, heads }
}

const fmt = new Intl.NumberFormat('ru-RU')

export function Sandbox() {
  const [p, setP] = useState<Params>(PRESETS[0].p)
  const wrap = useRef<HTMLDivElement>(null)
  const base = useRef<HTMLCanvasElement>(null)
  const head = useRef<HTMLCanvasElement>(null)
  const raf = useRef(0)
  const size = useRef({ w: 0, h: 0, dpr: 1 })
  const seen = useRef(false)

  const path = useMemo(() => turtle(p), [p])

  const draw = useCallback(
    (animate: boolean) => {
      const c = base.current
      const hc = head.current
      if (!c || !hc) return
      const ctx = c.getContext('2d')
      const hctx = hc.getContext('2d')
      if (!ctx || !hctx) return
      cancelAnimationFrame(raf.current)
      const { w, h, dpr } = size.current
      if (!(w > 0 && h > 0)) return
      const { pts, heads } = path
      const segs = pts.length - 1
      if (segs < 1) return

      // auto-fit: bounding box of the whole path -> canvas box
      let minX = Infinity
      let minY = Infinity
      let maxX = -Infinity
      let maxY = -Infinity
      for (const [x, y] of pts) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
      const pad = Math.max(28, Math.min(w, h) * 0.08)
      const fit = Math.min((w - pad * 2) / Math.max(1e-6, maxX - minX), (h - pad * 2) / Math.max(1e-6, maxY - minY), 8)
      const sc = Number.isFinite(fit) && fit > 0 ? fit : 1
      const ox = w / 2 - ((minX + maxX) / 2) * sc
      const oy = h / 2 - ((minY + maxY) / 2) * sc
      const X = (i: number) => ox + pts[i][0] * sc
      const Y = (i: number) => oy + pts[i][1] * sc
      const lw = Math.max(1.8, Math.min(3.2, 380 / segs))

      // full redraw of the frame: faint ghost of the final figure + coloured stroke up to `exact`
      const frame = (exact: number) => {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.globalAlpha = 1
        ctx.globalCompositeOperation = 'source-over'
        ctx.clearRect(0, 0, w, h)
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'

        if (exact < segs) {
          ctx.strokeStyle = 'rgba(20, 22, 31, 0.12)'
          ctx.lineWidth = Math.max(1, lw * 0.6)
          ctx.beginPath()
          ctx.moveTo(X(0), Y(0))
          for (let i = 1; i <= segs; i++) ctx.lineTo(X(i), Y(i))
          ctx.stroke()
        }

        ctx.lineWidth = lw
        const full = Math.min(segs, Math.floor(exact))
        for (let i = 0; i < full; i++) {
          ctx.strokeStyle = colorAt(i / segs)
          ctx.beginPath()
          ctx.moveTo(X(i), Y(i))
          ctx.lineTo(X(i + 1), Y(i + 1))
          ctx.stroke()
        }

        let hx = X(segs)
        let hy = Y(segs)
        let ha = heads[segs]
        if (full < segs) {
          const f = exact - full
          hx = X(full) + (X(full + 1) - X(full)) * f
          hy = Y(full) + (Y(full + 1) - Y(full)) * f
          ha = Math.atan2(Y(full + 1) - Y(full), X(full + 1) - X(full))
          if (f > 0) {
            ctx.strokeStyle = colorAt(full / segs)
            ctx.beginPath()
            ctx.moveTo(X(full), Y(full))
            ctx.lineTo(hx, hy)
            ctx.stroke()
          }
        }

        hctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        hctx.clearRect(0, 0, w, h)
        hctx.translate(hx, hy)
        hctx.rotate(ha)
        hctx.beginPath()
        hctx.moveTo(11, 0)
        hctx.lineTo(-7, 7)
        hctx.lineTo(-3, 0)
        hctx.lineTo(-7, -7)
        hctx.closePath()
        hctx.fillStyle = '#14161f'
        hctx.strokeStyle = '#ffffff'
        hctx.lineWidth = 2
        hctx.fill()
        hctx.stroke()
      }

      if (!animate) {
        frame(segs)
        return
      }

      // linear in segment count, so the small inner turns are visible from the first frames
      const dur = Math.min(2400, Math.max(1100, segs * 14))
      const t0 = performance.now()
      const tick = (now: number) => {
        const prog = Math.min(1, (now - t0) / dur)
        const eased = prog < 1 ? 1 - Math.pow(1 - prog, 1.25) : 1
        frame(eased * segs)
        if (prog < 1) raf.current = requestAnimationFrame(tick)
      }
      frame(0)
      raf.current = requestAnimationFrame(tick)
    },
    [path],
  )

  // keep canvases sized to their box; only touch the bitmap when the size really changes
  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect()
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      const bw = Math.max(1, Math.round(r.width * dpr))
      const bh = Math.max(1, Math.round(r.height * dpr))
      const same = base.current?.width === bw && base.current?.height === bh
      size.current = { w: r.width, h: r.height, dpr }
      if (same) return
      for (const cv of [base.current, head.current]) {
        if (!cv) continue
        cv.width = bw
        cv.height = bh
      }
      draw(false)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [draw])

  // first time it scrolls into view: animated run (the finished figure is already drawn before that)
  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !seen.current) {
          seen.current = true
          draw(true)
          io.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [draw])

  // live redraw on every parameter change
  useEffect(() => {
    draw(false)
  }, [draw])

  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  const set = (key: Key, v: number) => {
    const L = LIMITS[key]
    setP((prev) => ({ ...prev, [key]: Math.min(L.max, Math.max(L.min, v)) }))
  }

  const num = (k: Key) => (
    <span
      key={`${k}-${p[k]}`}
      className="kk-num rounded-[6px] px-1.5 py-0.5 font-bold"
      style={{ color: '#14161f', background: LIMITS[k].color }}
    >
      {p[k]}
    </span>
  )

  const steps = (p.k * p.n * (p.n - 1)) / 2

  return (
    <section id="pesochnica" className="relative py-20 sm:py-28" aria-labelledby="pes-h">
      <div className="kk-wrap">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-end">
          <h2 id="pes-h" className="kk-h2">
            Три числа, и рисунок меняется целиком
          </h2>
          <p className="kk-lead lg:justify-self-end">
            Это программа с третьего урока курса Python. Двигайте ползунки: код и рисунок обновляются вместе, как у
            ученика на экране.
          </p>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-5">
          {/* editor */}
          <div className="flex min-w-0 flex-col overflow-hidden rounded-[30px] bg-[#14161f] text-white shadow-[0_40px_80px_-40px_rgba(20,22,31,.7)]">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-3.5">
              <span className="flex items-center gap-1.5" aria-hidden="true">
                <i className="block h-3 w-3 rounded-full bg-[#ff5a36]" />
                <i className="block h-3 w-3 rounded-full bg-[#ffc400]" />
                <i className="block h-3 w-3 rounded-full bg-[#00c389]" />
              </span>
              <span className="kk-mono text-[0.82rem] text-white/55">spiral.py</span>
              <span className="w-12" aria-hidden="true" />
            </div>

            <pre
              className="kk-mono overflow-x-auto px-5 py-5 text-[clamp(0.78rem,0.7rem+0.35vw,0.98rem)] leading-[1.85] sm:px-7"
              aria-label={`Код программы: n равно ${p.n}, angle равно ${p.angle}, k равно ${p.k}`}
            >
              <code style={{ color: TOKEN_COLORS.plain }}>
                <span style={{ color: TOKEN_COLORS.keyword }}>import</span> turtle{'\n\n'}
                t = turtle.<span style={{ color: TOKEN_COLORS.fn }}>Turtle</span>(){'\n'}
                n = {num('n')}
                {'      '}
                <span style={{ color: TOKEN_COLORS.comment, fontStyle: 'italic' }}># сколько отрезков</span>
                {'\n'}
                angle = {num('angle')}
                {'  '}
                <span style={{ color: TOKEN_COLORS.comment, fontStyle: 'italic' }}># угол поворота</span>
                {'\n'}
                k = {num('k')}
                {'        '}
                <span style={{ color: TOKEN_COLORS.comment, fontStyle: 'italic' }}># шаг роста</span>
                {'\n\n'}
                <span style={{ color: TOKEN_COLORS.keyword }}>for</span> i <span style={{ color: TOKEN_COLORS.keyword }}>in</span>{' '}
                <span style={{ color: TOKEN_COLORS.keyword }}>range</span>(n):{'\n'}
                {'    '}t.<span style={{ color: TOKEN_COLORS.fn }}>forward</span>(i * k){'\n'}
                {'    '}t.<span style={{ color: TOKEN_COLORS.fn }}>left</span>(angle)
              </code>
            </pre>

            <div className="mt-auto grid gap-5 border-t border-white/10 px-5 py-6 sm:px-7">
              {(Object.keys(LIMITS) as Key[]).map((key) => {
                const L = LIMITS[key]
                const pct = ((p[key] - L.min) / (L.max - L.min)) * 100
                const id = `kk-range-${key}`
                return (
                  <div key={key} className="grid gap-2">
                    <label htmlFor={id} className="flex flex-wrap items-baseline justify-between gap-x-3 text-[0.95rem] text-white/70">
                      <span>
                        <span className="kk-mono mr-2 font-bold" style={{ color: L.color }}>
                          {key}
                        </span>
                        {L.label}
                      </span>
                      <span className="text-lg font-bold text-white tabular-nums">{p[key]}</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        className="kk-key kk-key--ink h-9 w-9 shrink-0 rounded-[10px]"
                        onClick={() => set(key, p[key] - L.step)}
                        aria-label={`Уменьшить ${key}`}
                      >
                        <Minus size={16} />
                      </button>
                      <input
                        id={id}
                        type="range"
                        min={L.min}
                        max={L.max}
                        step={L.step}
                        value={p[key]}
                        onChange={(e) => set(key, Number(e.target.value))}
                        className="kk-range"
                        style={{ ['--c' as string]: L.color, ['--p' as string]: `${pct}%` }}
                      />
                      <button
                        type="button"
                        className="kk-key kk-key--ink h-9 w-9 shrink-0 rounded-[10px]"
                        onClick={() => set(key, p[key] + L.step)}
                        aria-label={`Увеличить ${key}`}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* canvas */}
          <div className="flex min-w-0 flex-col gap-4 rounded-[30px] bg-white p-3 ring-1 ring-[#d9deea] sm:p-4">
            <div ref={wrap} className="kk-gridpaper relative aspect-square w-full overflow-hidden rounded-[22px] lg:aspect-auto lg:min-h-[440px] lg:flex-1">
              <canvas ref={base} className="absolute inset-0 h-full w-full" role="img" aria-label="Рисунок черепахи по текущим параметрам" />
              <canvas ref={head} className="absolute inset-0 h-full w-full" aria-hidden="true" />
              <p className="kk-mono absolute bottom-3 left-3 rounded-lg bg-[#14161f] px-2.5 py-1.5 text-[0.74rem] text-[#5fe0b0]">
                {'>>> '}отрезков: {p.n}, путь: {fmt.format(steps)} шагов
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 px-1 pb-1">
              <div className="flex flex-wrap gap-2.5" role="group" aria-label="Готовые примеры">
                {PRESETS.map((pr) => {
                  const on = pr.p.n === p.n && pr.p.angle === p.angle && pr.p.k === p.k
                  return (
                    <button
                      key={pr.name}
                      type="button"
                      data-on={on}
                      aria-pressed={on}
                      onClick={() => setP(pr.p)}
                      className="kk-key h-10 rounded-[11px] px-3.5 text-[0.92rem]"
                    >
                      {pr.name}
                    </button>
                  )
                })}
              </div>
              <button type="button" onClick={() => draw(true)} className="kk-key kk-key--mint h-11 rounded-[13px] px-5 text-[1rem]">
                <Play size={17} fill="currentColor" aria-hidden="true" />
                Запустить
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
