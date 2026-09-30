/** CSS-only keycap cluster: shown when WebGL is unavailable or the 3D scene fails. */
const CAPS = [
  { l: 'К', c: 'kk-key--blue', r: -8, x: 6, y: 8, w: 1 },
  { l: 'О', c: '', r: 5, x: 30, y: 2, w: 1 },
  { l: 'Д', c: 'kk-key--coral', r: -4, x: 54, y: 10, w: 1 },
  { l: '{', c: 'kk-key--yellow', r: 9, x: 76, y: 4, w: 1 },
  { l: ';', c: '', r: -10, x: 10, y: 38, w: 1 },
  { l: '<', c: 'kk-key--coral', r: 6, x: 34, y: 36, w: 1 },
  { l: '/', c: 'kk-key--blue', r: -6, x: 56, y: 42, w: 1 },
  { l: '}', c: 'kk-key--mint', r: 10, x: 78, y: 36, w: 1 },
  { l: 'Enter', c: 'kk-key--mint', r: -3, x: 16, y: 68, w: 2 },
  { l: '>', c: 'kk-key--yellow', r: 7, x: 60, y: 70, w: 1 },
]

export function StaticKeycaps() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <div className="relative mx-auto h-full w-full max-w-[560px]">
        {CAPS.map((k) => (
          <span
            key={k.l}
            className={`kk-key ${k.c} absolute text-[clamp(1.4rem,4vw,2.4rem)] font-black`}
            style={{
              left: `${k.x}%`,
              top: `${k.y}%`,
              width: k.w === 2 ? 'clamp(120px, 34%, 200px)' : 'clamp(56px, 17%, 96px)',
              aspectRatio: k.w === 2 ? '2.1 / 1' : '1 / 1',
              transform: `rotate(${k.r}deg)`,
              borderRadius: 18,
              boxShadow: '0 8px 0 var(--cap-edge), 0 24px 30px -16px rgba(20,22,31,.45)',
              fontSize: k.w === 2 ? 'clamp(1rem, 2.4vw, 1.4rem)' : undefined,
            }}
          >
            {k.l}
          </span>
        ))}
      </div>
    </div>
  )
}
