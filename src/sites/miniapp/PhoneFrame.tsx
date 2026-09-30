import { useEffect, useState, type ReactNode } from 'react'

export const SCREEN_W = 390
export const SCREEN_H = 844
const BEZEL = 12
export const FRAME_W = SCREEN_W + BEZEL * 2
export const FRAME_H = SCREEN_H + BEZEL * 2

export function usePhoneScale(margin = 56) {
  const calc = () => (typeof window === 'undefined' ? 1 : Math.min(1, Math.max(0.6, (window.innerHeight - margin) / FRAME_H)))
  const [s, setS] = useState(calc)
  useEffect(() => {
    const on = () => setS(calc())
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return s
}

function useClock() {
  const fmt = () => {
    const d = new Date()
    return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
  }
  const [t, setT] = useState(fmt)
  useEffect(() => {
    const id = setInterval(() => setT(fmt()), 15000)
    return () => clearInterval(id)
  }, [])
  return t
}

export function StatusBar() {
  const time = useClock()
  return (
    <div className="relative z-30 flex h-[54px] shrink-0 items-center justify-between bg-white pr-[30px] pl-[46px] pt-[6px] text-black">
      <span className="text-[16.5px] font-semibold tracking-[-0.01em]" style={{ fontFamily: '-apple-system, "SF Pro Text", "Inter Tight Variable", system-ui' }}>
        {time}
      </span>
      <span className="flex items-center gap-[6px]">
        <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden>
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={i * 4.6} y={9 - i * 3} width="3.2" height={3 + i * 3} rx="0.9" fill="#000" />
          ))}
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden>
          <path d="M8 11.2 L5.6 8.6 A3.6 3.6 0 0 1 10.4 8.6 Z" fill="#000" />
          <path d="M3.3 6.4 A6.6 6.6 0 0 1 12.7 6.4 L11.3 7.9 A4.6 4.6 0 0 0 4.7 7.9 Z" fill="#000" />
          <path d="M1 4.1 A9.8 9.8 0 0 1 15 4.1 L13.6 5.6 A7.8 7.8 0 0 0 2.4 5.6 Z" fill="#000" />
        </svg>
        <svg width="27" height="13" viewBox="0 0 27 13" aria-hidden>
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.8" fill="none" stroke="#000" strokeOpacity="0.4" />
          <rect x="2" y="2" width="17" height="9" rx="2.4" fill="#000" />
          <path d="M25 4.4 v4.2 a2 2 0 0 0 0 -4.2z" fill="#000" fillOpacity="0.45" />
        </svg>
      </span>
    </div>
  )
}

export function PhoneFrame({ children, scale }: { children: ReactNode; scale: number }) {
  return (
    <div style={{ width: FRAME_W * scale, height: FRAME_H * scale }} className="relative shrink-0">
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{ width: FRAME_W, height: FRAME_H, transform: `scale(${scale})` }}
      >
        <span className="absolute top-[150px] -left-[3px] h-[32px] w-[4px] rounded-l-[2px] bg-[#2a2826]" />
        <span className="absolute top-[204px] -left-[3px] h-[62px] w-[4px] rounded-l-[2px] bg-[#2a2826]" />
        <span className="absolute top-[278px] -left-[3px] h-[62px] w-[4px] rounded-l-[2px] bg-[#2a2826]" />
        <span className="absolute top-[236px] -right-[3px] h-[98px] w-[4px] rounded-r-[2px] bg-[#2a2826]" />
        <div
          className="absolute inset-0 rounded-[66px] p-[3px]"
          style={{
            background: 'linear-gradient(145deg, #8d8780 0%, #3e3a36 22%, #1d1b19 50%, #45403b 78%, #9b958d 100%)',
            boxShadow: '0 60px 120px -30px rgba(60,35,15,.45), 0 30px 60px -30px rgba(0,0,0,.35), 0 0 0 1px rgba(0,0,0,.25)',
          }}
        >
          <div className="h-full w-full rounded-[63px] bg-[#050505] p-[9px]">
            <div className="relative h-full w-full overflow-hidden rounded-[54px] bg-white" style={{ isolation: 'isolate' }}>
              {children}
              <div className="pointer-events-none absolute top-[11px] left-1/2 z-[70] h-[36px] w-[124px] -translate-x-1/2 rounded-full bg-black">
                <span className="absolute top-1/2 right-[14px] h-[11px] w-[11px] -translate-y-1/2 rounded-full bg-[#0f1520]" style={{ boxShadow: 'inset 0 0 0 2px #151a22, inset 2px -2px 3px rgba(80,110,160,.35)' }} />
              </div>
              <div className="pointer-events-none absolute bottom-[8px] left-1/2 z-[70] h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-black" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
