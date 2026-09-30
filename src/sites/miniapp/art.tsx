import { useId, type ReactNode } from 'react'
import type { ArtKind } from './data'

const useUid = () => 'a' + useId().replace(/[^a-zA-Z0-9]/g, '')

type CupArt = 'heart' | 'tulip' | 'rosetta' | 'bubbles' | 'marsh' | 'specks'

const cupSpec: Partial<Record<ArtKind, { crema: [string, string, string]; foam: string; art: CupArt; ceramic: [string, string] }>> = {
  cappuccino: { crema: ['#c98f55', '#8a5128', '#5a2f14'], foam: '#fbf4ea', art: 'heart', ceramic: ['#ffffff', '#e4ddd4'] },
  flatwhite: { crema: ['#b87a45', '#7a4420', '#4d260f'], foam: '#f8efe2', art: 'tulip', ceramic: ['#3b3632', '#1f1c19'] },
  raf: { crema: ['#f6ead6', '#ead5b4', '#caa57a'], foam: '#fffaf1', art: 'specks', ceramic: ['#ffffff', '#e6dfd6'] },
  americano: { crema: ['#b97a43', '#6e3a18', '#3a1c09'], foam: '#e8c79c', art: 'bubbles', ceramic: ['#f3efe9', '#d8d0c6'] },
  matcha: { crema: ['#b8cf7d', '#7fa047', '#56752a'], foam: '#f7f6e8', art: 'rosetta', ceramic: ['#f5f1ea', '#dcd4c8'] },
  cocoa: { crema: ['#9a5a37', '#6d3a1f', '#44220f'], foam: '#fff', art: 'marsh', ceramic: ['#d9694b', '#b24b31'] },
}

function Cup({ kind }: { kind: ArtKind }) {
  const u = useUid()
  const s = cupSpec[kind]!
  const cx = 58, cy = 60, r = 29.5
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden>
      <defs>
        <radialGradient id={`${u}sh`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.55" stopColor="#5a3515" stopOpacity="0.22" />
          <stop offset="1" stopColor="#5a3515" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${u}sa`} cx="0.36" cy="0.32" r="0.8">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.7" stopColor="#f4f0eb" />
          <stop offset="1" stopColor="#e2dbd2" />
        </radialGradient>
        <radialGradient id={`${u}cu`} cx="0.35" cy="0.3" r="0.85">
          <stop offset="0" stopColor={s.ceramic[0]} />
          <stop offset="1" stopColor={s.ceramic[1]} />
        </radialGradient>
        <radialGradient id={`${u}li`} cx="0.44" cy="0.42" r="0.62">
          <stop offset="0" stopColor={s.crema[0]} />
          <stop offset="0.62" stopColor={s.crema[1]} />
          <stop offset="1" stopColor={s.crema[2]} />
        </radialGradient>
        <clipPath id={`${u}cl`}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
        <filter id={`${u}bl`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
      </defs>
      <ellipse cx="63" cy="67" rx="55" ry="53" fill={`url(#${u}sh)`} />
      <circle cx={cx} cy={cy} r="47" fill={`url(#${u}sa)`} />
      <circle cx={cx} cy={cy} r="39.5" fill="none" stroke="#000" strokeOpacity="0.045" />
      <g transform={`rotate(24 ${cx} ${cy})`}>
        <rect x="87" y="53.5" width="21" height="13" rx="6.5" fill="#5a3515" opacity="0.14" filter={`url(#${u}bl)`} />
        <rect x="86" y="53.5" width="20" height="13" rx="6.5" fill={s.ceramic[1]} />
        <rect x="90.5" y="57.5" width="11" height="5" rx="2.5" fill={s.ceramic[0]} opacity="0.35" />
      </g>
      <circle cx={cx + 3} cy={cy + 4} r="35" fill="#5a3515" opacity="0.2" filter={`url(#${u}bl)`} />
      <circle cx={cx} cy={cy} r="34.5" fill={`url(#${u}cu)`} />
      <circle cx={cx} cy={cy} r={r} fill={`url(#${u}li)`} />
      <g clipPath={`url(#${u}cl)`}>
        <CupArtShape art={s.art} foam={s.foam} crema={s.crema} cx={cx} cy={cy} />
      </g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#000" strokeOpacity="0.2" strokeWidth="1.3" />
      <path d={`M ${cx - 30} ${cy - 10} A 32 32 0 0 1 ${cx - 12} ${cy - 30}`} stroke="#fff" strokeOpacity="0.85" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </svg>
  )
}

function CupArtShape({ art, foam, crema, cx, cy }: { art: CupArt; foam: string; crema: [string, string, string]; cx: number; cy: number }) {
  if (art === 'heart')
    return (
      <g>
        <circle cx={cx} cy={cy} r="29.5" fill="none" stroke={foam} strokeOpacity="0.35" strokeWidth="2" />
        <path
          d={`M ${cx} ${cy + 17} C ${cx - 17} ${cy + 6}, ${cx - 20} ${cy - 6}, ${cx - 12} ${cy - 12} C ${cx - 6} ${cy - 16}, ${cx - 1} ${cy - 12}, ${cx} ${cy - 7} C ${cx + 1} ${cy - 12}, ${cx + 6} ${cy - 16}, ${cx + 12} ${cy - 12} C ${cx + 20} ${cy - 6}, ${cx + 17} ${cy + 6}, ${cx} ${cy + 17} Z`}
          fill={foam}
        />
        <path d={`M ${cx} ${cy - 5} L ${cx} ${cy + 18}`} stroke={crema[1]} strokeOpacity="0.5" strokeWidth="1" />
        <ellipse cx={cx - 6} cy={cy - 5} rx="4" ry="2.2" fill="#fff" opacity="0.55" />
      </g>
    )
  if (art === 'tulip') {
    const heart = `M ${cx} ${cy + 16} C ${cx - 18} ${cy + 5}, ${cx - 19} ${cy - 8}, ${cx - 11} ${cy - 13} C ${cx - 5} ${cy - 16}, ${cx - 1} ${cy - 11}, ${cx} ${cy - 7} C ${cx + 1} ${cy - 11}, ${cx + 5} ${cy - 16}, ${cx + 11} ${cy - 13} C ${cx + 19} ${cy - 8}, ${cx + 18} ${cy + 5}, ${cx} ${cy + 16} Z`
    return (
      <g>
        <path d={heart} fill={foam} transform={`translate(${cx} ${cy + 1}) scale(1.08) translate(${-cx} ${-cy})`} />
        {[0.72, 0.46].map((k) => (
          <path key={k} d={heart} fill="none" stroke={crema[1]} strokeOpacity="0.55" strokeWidth={1.6 / k} transform={`translate(${cx} ${cy + 5 * (1 - k)}) scale(${k}) translate(${-cx} ${-cy})`} />
        ))}
        <path d={`M ${cx} ${cy - 8} L ${cx} ${cy + 18}`} stroke={crema[1]} strokeOpacity="0.55" strokeWidth="1" />
      </g>
    )
  }
  if (art === 'rosetta')
    return (
      <g>
        {Array.from({ length: 8 }).map((_, i) => (
          <path
            key={i}
            d={`M ${cx - (19 - i * 1.9)} ${cy - 15 + i * 4.3} Q ${cx} ${cy - 6 + i * 4.3} ${cx + (19 - i * 1.9)} ${cy - 15 + i * 4.3} Q ${cx} ${cy - 11 + i * 4.3} ${cx - (19 - i * 1.9)} ${cy - 15 + i * 4.3} Z`}
            fill={foam}
            opacity={0.95 - i * 0.03}
          />
        ))}
        <circle cx={cx} cy={cy - 17} r="4.2" fill={foam} />
        <path d={`M ${cx} ${cy - 15} L ${cx} ${cy + 22}`} stroke={crema[1]} strokeOpacity="0.65" strokeWidth="1.1" />
      </g>
    )
  if (art === 'bubbles')
    return (
      <g>
        <circle cx={cx} cy={cy} r="24" fill="none" stroke={foam} strokeOpacity="0.25" strokeWidth="6" />
        {[[-12, -8, 1.6], [-6, -14, 1], [9, -10, 1.3], [14, 2, 1.8], [4, 12, 1.1], [-10, 10, 1.4], [-16, 0, 0.9], [0, -3, 0.8], [8, 6, 0.7]].map(([x, y, rr], i) => (
          <circle key={i} cx={cx + x} cy={cy + y} r={rr} fill={foam} opacity="0.7" />
        ))}
      </g>
    )
  if (art === 'marsh')
    return (
      <g>
        {[[-10, -9, 12], [6, -12, -8], [12, 3, 20], [-3, 4, 5], [-14, 6, -15], [3, 15, 30], [-7, 17, 0]].map(([x, y, rot], i) => (
          <g key={i} transform={`rotate(${rot} ${cx + x} ${cy + y})`}>
            <rect x={cx + x - 4.2} y={cy + y - 4.2} width="8.4" height="8.4" rx="2.6" fill={i % 3 === 1 ? '#fde3e8' : '#fffdf9'} />
            <rect x={cx + x - 4.2} y={cy + y + 1.8} width="8.4" height="2.4" rx="1.2" fill="#000" opacity="0.06" />
          </g>
        ))}
      </g>
    )
  return (
    <g>
      <path d={`M ${cx - 16} ${cy + 4} C ${cx - 14} ${cy - 16}, ${cx + 16} ${cy - 16}, ${cx + 14} ${cy + 2} C ${cx + 12} ${cy + 14}, ${cx - 6} ${cy + 14}, ${cx - 6} ${cy + 2} C ${cx - 6} ${cy - 6}, ${cx + 6} ${cy - 6}, ${cx + 5} ${cy + 2}`} stroke={foam} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.9" />
      {[[-8, -18], [10, -16], [18, -4], [-19, 8], [4, 18], [-12, 16], [16, 12], [-2, -8], [8, 4]].map(([x, y], i) => (
        <circle key={i} cx={cx + x} cy={cy + y} r="0.8" fill="#3b2412" opacity="0.7" />
      ))}
    </g>
  )
}

type GlassSpec = { stops: [number, string][]; ice?: boolean; top: number; garnish?: 'orange' | 'lime' | 'berries'; seeds?: boolean; straw?: string; bubbles?: boolean }
const glassSpec: Partial<Record<ArtKind, GlassSpec>> = {
  latte: { top: 24, stops: [[0, '#fdf8f0'], [0.2, '#f5eadb'], [0.3, '#c99c6e'], [0.46, '#dcbd9a'], [0.66, '#eddcc6'], [1, '#efe2cf']] },
  tonic: { top: 26, ice: true, garnish: 'orange', bubbles: true, straw: '#2f2a26', stops: [[0, '#5b3016'], [0.2, '#8e5227'], [0.42, '#d7a867'], [0.7, '#f1e2bd'], [1, '#f6ecd0']] },
  tea: { top: 30, garnish: 'berries', stops: [[0, '#f8a23b'], [0.5, '#ea7a1d'], [1, '#c85812']] },
  lemonade: { top: 24, ice: true, garnish: 'lime', seeds: true, straw: '#1f7a4d', bubbles: true, stops: [[0, '#ffe38a'], [0.45, '#ffc545'], [1, '#ff9f2a']] },
}

function Glass({ kind }: { kind: ArtKind }) {
  const u = useUid()
  const s = glassSpec[kind]!
  const glass = 'M 33 16 L 87 16 L 81.5 101 Q 81 106 76 106 L 44 106 Q 39 106 38.5 101 Z'
  const inner = `M 36 ${s.top} L 84 ${s.top} L 79 100 Q 78.6 103 75 103 L 45 103 Q 41.4 103 41 100 Z`
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id={`${u}lq`} x1="0" y1={s.top} x2="0" y2="104" gradientUnits="userSpaceOnUse">
          {s.stops.map(([o, c], i) => <stop key={i} offset={o} stopColor={c} />)}
        </linearGradient>
        <linearGradient id={`${u}gl`} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="0.25" stopColor="#fff" stopOpacity="0.08" />
          <stop offset="0.8" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.35" />
        </linearGradient>
        <radialGradient id={`${u}sh`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.3" stopColor="#5a3515" stopOpacity="0.28" />
          <stop offset="1" stopColor="#5a3515" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${u}cl`}><path d={inner} /></clipPath>
      </defs>
      <ellipse cx="62" cy="107" rx="34" ry="7" fill={`url(#${u}sh)`} />
      {s.straw && <rect x="64" y="2" width="5" height="70" rx="2.5" fill={s.straw} transform="rotate(12 66 40)" />}
      <path d={glass} fill="#fff" fillOpacity="0.45" />
      <g clipPath={`url(#${u}cl)`}>
        <rect x="30" y={s.top} width="60" height="90" fill={`url(#${u}lq)`} />
        {s.ice && (
          <g>
            {[[40, s.top + 2, 14, -10], [58, s.top + 6, 15, 8], [46, s.top + 20, 15, 14], [64, s.top + 26, 13, -6]].map(([x, y, w, r], i) => (
              <rect key={i} x={x} y={y} width={w} height={w} rx="3" fill="#fff" fillOpacity="0.32" stroke="#fff" strokeOpacity="0.8" strokeWidth="0.8" transform={`rotate(${r} ${x + w / 2} ${y + w / 2})`} />
            ))}
          </g>
        )}
        {s.seeds && [[46, 64], [58, 72], [70, 60], [52, 84], [66, 88], [60, 56], [44, 78], [74, 76]].map(([x, y], i) => (
          <ellipse key={i} cx={x} cy={y} rx="1.6" ry="1.2" fill="#2b1b0c" opacity="0.8" />
        ))}
        {s.bubbles && [[48, 92, 1], [56, 80, 0.8], [70, 94, 1.1], [62, 66, 0.7], [74, 54, 0.9], [44, 50, 0.7]].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill="none" stroke="#fff" strokeOpacity="0.8" strokeWidth="0.6" />
        ))}
        {s.garnish === 'berries' && [[46, s.top + 4], [54, s.top + 7], [62, s.top + 3], [70, s.top + 6], [58, s.top + 12], [50, s.top + 14], [66, s.top + 15]].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="3.6" fill="#ff9a1f" />
            <circle cx={x - 1} cy={y - 1.2} r="1" fill="#fff" opacity="0.7" />
          </g>
        ))}
        <rect x="30" y={s.top} width="60" height="2" fill="#fff" opacity="0.5" />
      </g>
      <path d={glass} fill={`url(#${u}gl)`} />
      <path d={glass} fill="none" stroke="#fff" strokeOpacity="0.95" strokeWidth="1.2" />
      <path d={glass} fill="none" stroke="#6b4a2f" strokeOpacity="0.12" strokeWidth="0.6" />
      <ellipse cx="60" cy="16" rx="27" ry="2.2" fill="none" stroke="#fff" strokeWidth="1.2" />
      {s.garnish === 'orange' && (
        <g transform="rotate(-18 84 22)">
          <path d="M 70 22 Q 84 14 98 22 Q 84 27 70 22 Z" fill="#f59a2a" />
          <path d="M 72 22 Q 84 17 96 22" stroke="#ffd48a" strokeWidth="1" fill="none" />
        </g>
      )}
      {s.garnish === 'lime' && (
        <g transform="translate(84 20)">
          <circle r="12" fill="#6fae3a" />
          <circle r="10.3" fill="#d6ee9a" />
          {Array.from({ length: 8 }).map((_, i) => (
            <path key={i} d="M 0 0 L 8.6 -2.2 A 9 9 0 0 1 8.6 2.2 Z" fill="#b8dd66" transform={`rotate(${i * 45})`} />
          ))}
          <circle r="1.6" fill="#eef8cf" />
          <path d="M -14 -12 q 6 -10 14 -6 q -6 8 -14 6 z" fill="#2f8a47" />
        </g>
      )}
      <rect x="37" y="22" width="3" height="70" rx="1.5" fill="#fff" opacity="0.55" transform="rotate(-3.5 38 57)" />
    </svg>
  )
}

function Plate({ children }: { children: ReactNode }) {
  const u = useUid()
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden>
      <defs>
        <radialGradient id={`${u}sh`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.55" stopColor="#5a3515" stopOpacity="0.2" />
          <stop offset="1" stopColor="#5a3515" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${u}pl`} cx="0.36" cy="0.32" r="0.8">
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.75" stopColor="#f5f1ec" />
          <stop offset="1" stopColor="#e4ddd4" />
        </radialGradient>
      </defs>
      <ellipse cx="63" cy="66" rx="56" ry="54" fill={`url(#${u}sh)`} />
      <circle cx="60" cy="60" r="49" fill={`url(#${u}pl)`} />
      <circle cx="60" cy="60" r="38" fill="none" stroke="#000" strokeOpacity="0.05" />
      {children}
    </svg>
  )
}

function Croissant() {
  const u = useUid()
  const body =
    'M 20 76 Q 16 66 27 60 C 36 34, 84 34, 93 60 Q 104 66 100 76 C 92 72, 86 70, 80 72 C 72 62, 48 62, 40 72 C 34 70, 28 72, 20 76 Z'
  const ribs = [
    'M 34 50 Q 42 58 41 70',
    'M 46 41 Q 52 52 50 64',
    'M 60 38 Q 62 50 60 62',
    'M 74 41 Q 68 52 70 64',
    'M 86 50 Q 78 58 79 70',
  ]
  return (
    <Plate>
      <defs>
        <radialGradient id={`${u}cr`} cx="0.5" cy="0.2" r="0.9">
          <stop offset="0" stopColor="#f6c77e" />
          <stop offset="0.5" stopColor="#dd9442" />
          <stop offset="1" stopColor="#a8591b" />
        </radialGradient>
        <clipPath id={`${u}cc`}><path d={body} /></clipPath>
      </defs>
      <path d={body} fill="#5a3515" opacity="0.18" transform="translate(3 5)" />
      <path d={body} fill={`url(#${u}cr)`} />
      <g clipPath={`url(#${u}cc)`}>
        {ribs.map((d, i) => (
          <g key={i}>
            <path d={d} stroke="#8a4613" strokeOpacity="0.55" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <path d={d} stroke="#ffe0a6" strokeOpacity="0.55" strokeWidth="1.4" fill="none" strokeLinecap="round" transform="translate(2.4 -0.6)" />
          </g>
        ))}
        <ellipse cx="60" cy="46" rx="22" ry="5" fill="#fff3d6" opacity="0.35" />
      </g>
      <path d={body} fill="none" stroke="#8a4613" strokeOpacity="0.35" strokeWidth="0.8" />
      {[[48, 88], [70, 90], [58, 94], [80, 84], [38, 86]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="0.9" fill="#d69b55" opacity="0.7" />
      ))}
    </Plate>
  )
}

function Cheesecake() {
  return (
    <Plate>
      <path d="M 40 88 L 34 40 A 46 46 0 0 1 86 38 Z" fill="#5a3515" opacity="0.12" transform="translate(3 4)" />
      <path d="M 40 88 L 34 40 A 46 46 0 0 1 86 38 Z" fill="#f6e5c3" />
      <path d="M 34 40 A 46 46 0 0 1 86 38" stroke="#c98c4a" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M 43 52 C 50 42, 64 40, 72 46 C 78 52, 64 58, 58 64 C 52 70, 44 64, 43 52 Z" fill="#b3203a" />
      <path d="M 46 52 C 52 46, 62 45, 68 48" stroke="#e35a70" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      {[[52, 50, 3.6, '#6d1030'], [62, 49, 3.2, '#3a2a6b'], [56, 58, 3, '#8f1734'], [66, 53, 2.6, '#c81f3f']].map(([x, y, r, c], i) => (
        <g key={i}>
          <circle cx={x as number} cy={y as number} r={r as number} fill={c as string} />
          <circle cx={(x as number) - 1} cy={(y as number) - 1} r="0.9" fill="#fff" opacity="0.6" />
        </g>
      ))}
      <path d="M 70 44 q 4 -6 9 -3 q -3 5 -9 3 z" fill="#3f8a4a" />
    </Plate>
  )
}

function Cookie() {
  const u = useUid()
  return (
    <Plate>
      <defs>
        <radialGradient id={`${u}ck`} cx="0.4" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#e7b67a" />
          <stop offset="0.7" stopColor="#cf904c" />
          <stop offset="1" stopColor="#a86a2d" />
        </radialGradient>
      </defs>
      <circle cx="63" cy="64" r="31" fill="#5a3515" opacity="0.16" />
      <path d="M 60 29 C 78 28, 92 42, 91 60 C 92 78, 78 92, 60 91 C 42 92, 28 78, 29 60 C 28 43, 41 29, 60 29 Z" fill={`url(#${u}ck)`} />
      {[[48, 46, 12], [68, 44, -20], [76, 62, 30], [56, 66, 5], [44, 70, -35], [64, 80, 18], [58, 52, 40]].map(([x, y, r], i) => (
        <path key={i} d={`M ${x - 4} ${y - 2} L ${x + 3} ${y - 4} L ${x + 5} ${y + 2} L ${x - 2} ${y + 4} Z`} fill="#3b1d0c" transform={`rotate(${r} ${x} ${y})`} />
      ))}
      <path d="M 40 58 q 6 -3 10 1 M 70 72 q 5 2 8 -2 M 58 38 q 4 3 9 1" stroke="#9a5e25" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.6" />
    </Plate>
  )
}

function Canele() {
  const u = useUid()
  const lobes = 10
  const pts: string[] = []
  for (let i = 0; i <= lobes * 8; i++) {
    const a = (i / (lobes * 8)) * Math.PI * 2
    const r = 27 + Math.cos(a * lobes) * 2.6
    pts.push(`${60 + Math.cos(a) * r},${60 + Math.sin(a) * r}`)
  }
  return (
    <Plate>
      <defs>
        <radialGradient id={`${u}cn`} cx="0.4" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#b8672a" />
          <stop offset="0.6" stopColor="#7c3811" />
          <stop offset="1" stopColor="#4e1f07" />
        </radialGradient>
      </defs>
      <circle cx="63" cy="64" r="29" fill="#5a3515" opacity="0.2" />
      <polygon points={pts.join(' ')} fill={`url(#${u}cn)`} />
      {Array.from({ length: lobes }).map((_, i) => {
        const a = ((i + 0.5) / lobes) * Math.PI * 2
        return <line key={i} x1={60 + Math.cos(a) * 12} y1={60 + Math.sin(a) * 12} x2={60 + Math.cos(a) * 26} y2={60 + Math.sin(a) * 26} stroke="#2e1204" strokeOpacity="0.45" strokeWidth="1.2" />
      })}
      <circle cx="60" cy="60" r="11" fill="#d88a45" />
      <circle cx="60" cy="60" r="6" fill="#6a2c0c" />
      <ellipse cx="52" cy="48" rx="7" ry="3" fill="#fff" opacity="0.18" transform="rotate(-35 52 48)" />
    </Plate>
  )
}

export function Art({ kind }: { kind: ArtKind }) {
  if (cupSpec[kind]) return <Cup kind={kind} />
  if (glassSpec[kind]) return <Glass kind={kind} />
  if (kind === 'croissant') return <Croissant />
  if (kind === 'cheesecake') return <Cheesecake />
  if (kind === 'cookie') return <Cookie />
  return <Canele />
}
