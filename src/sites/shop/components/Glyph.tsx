import { useId } from 'react'
import { byId, type Product } from '../data'

/** Flat 2D render of a vessel for places the WebGL canvas cannot reach (drawer, menus, flying item). */
export function Glyph({ p, className }: { p: Product; className?: string }) {
  if (p.vessel === 'set') {
    return (
      <svg viewBox="0 0 120 140" className={className} aria-hidden>
        <g transform="translate(-4 0)">
          <Shape p={byId('serum-lavender')} />
        </g>
        <g transform="translate(46 44) scale(.72)">
          <Shape p={byId('cream-oat')} />
        </g>
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 100 140" className={className} aria-hidden>
      <Shape p={p} />
    </svg>
  )
}

function Shape({ p }: { p: Product }) {
  const id = useId().replace(/:/g, '')
  const body =
    p.vessel === 'jar'
      ? 'M18 78 Q18 72 24 72 L76 72 Q82 72 82 78 L82 128 Q82 134 76 134 L24 134 Q18 134 18 128 Z'
      : p.vessel === 'oil'
        ? 'M35 134 Q31 134 31 130 L31 62 Q31 52 42 46 L44 44 L44 34 L56 34 L56 44 L58 46 Q69 52 69 62 L69 130 Q69 134 65 134 Z'
        : p.vessel === 'pump'
          ? 'M30 134 Q26 134 26 130 L26 58 Q26 48 38 44 L43 42 L43 34 L57 34 L57 42 L62 44 Q74 48 74 58 L74 130 Q74 134 70 134 Z'
          : 'M28 134 Q24 134 24 130 L24 70 Q24 56 40 52 L42 50 L42 44 L58 44 L58 50 L60 52 Q76 56 76 70 L76 130 Q76 134 72 134 Z'
  const liquidTop = p.vessel === 'jar' ? 82 : p.vessel === 'oil' ? 70 : p.vessel === 'pump' ? 74 : 82
  const label = p.vessel === 'jar' ? { y: 94, h: 24 } : p.vessel === 'oil' ? { y: 84, h: 34 } : { y: 90, h: 32 }
  const lx = p.vessel === 'oil' ? 34 : p.vessel === 'jar' ? 22 : p.vessel === 'pump' ? 29 : 27
  const lw = 100 - lx * 2
  return (
    <g>
      <defs>
        <clipPath id={`c${id}`}>
          <path d={body} />
        </clipPath>
        <linearGradient id={`g${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".35" />
          <stop offset=".25" stopColor="#fff" stopOpacity=".05" />
          <stop offset=".8" stopColor="#000" stopOpacity=".08" />
          <stop offset="1" stopColor="#000" stopOpacity=".22" />
        </linearGradient>
      </defs>
      <ellipse cx="50" cy="135" rx="30" ry="3.5" fill="#2a241c" opacity=".16" />
      <path d={body} fill={p.glass} opacity={Math.min(0.95, p.glassOpacity + 0.15)} />
      <g clipPath={`url(#c${id})`}>
        <rect x="0" y={liquidTop} width="100" height="70" fill={p.liquid} opacity=".85" />
        <rect x={lx} y={label.y} width={lw} height={label.h} fill="#f3efe8" />
        <rect x={lx + 5} y={label.y + label.h * 0.34} width={lw - 10} height="1.4" fill="#1e1e1c" opacity=".55" />
        <rect x={lx + 11} y={label.y + label.h * 0.58} width={lw - 22} height="1" fill="#1e1e1c" opacity=".3" />
        <path d={body} fill={`url(#g${id})`} />
        <rect x={p.vessel === 'jar' ? 25 : lx - 1} y="40" width="3" height="96" fill="#fff" opacity=".45" />
      </g>
      {p.vessel === 'dropper' && (
        <>
          <rect x="39" y="34" width="22" height="13" rx="2" fill="#b8a98f" />
          <path d="M42 34 L42 26 Q40 22 43 18 Q42 10 50 8 Q58 10 57 18 Q60 22 58 26 L58 34 Z" fill={p.cap} />
        </>
      )}
      {p.vessel === 'jar' && <rect x="16" y="58" width="68" height="16" rx="3" fill={p.cap} />}
      {p.vessel === 'oil' && <rect x="40" y="14" width="20" height="24" rx="4" fill={p.cap} />}
      {p.vessel === 'pump' && (
        <>
          <rect x="40" y="28" width="20" height="9" rx="1.5" fill={p.cap} />
          <rect x="47" y="20" width="6" height="9" fill={p.cap} />
          <rect x="41" y="14" width="18" height="7" rx="2" fill={p.cap} />
          <rect x="57" y="15.5" width="16" height="3.5" rx="1" fill={p.cap} />
        </>
      )}
    </g>
  )
}
