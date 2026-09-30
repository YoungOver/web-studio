import { STANDARD_SEATS } from '../data'
import type { ZoneId } from '../data'

function StandardArt() {
  return (
    <div className="relative flex h-full w-full items-center justify-center [perspective:900px]">
      <div className="grid w-[92%] grid-cols-6 gap-2.5 [transform:rotateX(34deg)_rotateZ(-4deg)] sm:gap-3.5">
        {STANDARD_SEATS.map((s) => (
          <div key={s.id} className="flex flex-col items-center">
            <div
              className="aspect-[16/10] w-full rounded-[4px] border"
              style={
                s.busy
                  ? {
                      borderColor: 'rgba(34,231,255,0.8)',
                      background: 'linear-gradient(160deg, rgba(34,231,255,0.85), rgba(139,92,255,0.55))',
                      boxShadow: '0 0 18px rgba(34,231,255,0.55)',
                    }
                  : { borderColor: 'rgba(42,35,66,1)', background: 'rgba(18,14,31,0.9)' }
              }
            />
            <div className="h-1.5 w-[3px] bg-[#2A2342]" />
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-x-[10%] bottom-[8%] h-10 rounded-full bg-[#22E7FF]/25 blur-2xl" />
    </div>
  )
}

function VipArt() {
  const chairs = Array.from({ length: 5 })
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <span className="rs-display rs-outline-text pointer-events-none absolute text-[clamp(6rem,18vw,16rem)] leading-none opacity-70 select-none">
        5×5
      </span>
      <div className="relative flex w-[82%] flex-col gap-3">
        <div className="flex justify-between px-[4%]">
          {chairs.map((_, i) => (
            <span key={i} className="h-7 w-[14%] rounded-t-xl border border-[#FF2BD6]/60 bg-[#FF2BD6]/15" />
          ))}
        </div>
        <div className="relative h-16 rounded-lg border border-[#FF2BD6]/70 bg-[#1a0f24] shadow-[0_0_40px_-4px_rgba(255,43,214,0.6),inset_0_0_30px_rgba(255,43,214,0.25)]">
          <div className="absolute inset-x-3 top-1/2 h-[2px] -translate-y-1/2 bg-[#FF2BD6] shadow-[0_0_14px_2px_rgba(255,43,214,0.9)]" />
        </div>
        <div className="flex justify-between px-[4%]">
          {chairs.map((_, i) => (
            <span key={i} className="h-7 w-[14%] rounded-b-xl border border-[#FF2BD6]/60 bg-[#FF2BD6]/15" />
          ))}
        </div>
      </div>
    </div>
  )
}

function Ps5Art() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-5">
      <div className="rs-scanlines relative aspect-video w-[80%] overflow-hidden rounded-xl border border-[#8B5CFF]/60 bg-[radial-gradient(90%_80%_at_30%_30%,#8B5CFF,transparent_60%),radial-gradient(70%_70%_at_80%_80%,#FF2BD6,transparent_65%),#0f0a1d] shadow-[0_0_80px_-10px_rgba(139,92,255,0.8)]">
        <div className="absolute bottom-[14%] left-[8%] h-2 w-[40%] rounded-full bg-white/80" />
        <div className="absolute bottom-[14%] right-[8%] h-2 w-[30%] rounded-full bg-white/30" />
      </div>
      <div className="h-12 w-[64%] rounded-t-[28px] rounded-b-lg border border-[#2A2342] bg-gradient-to-b from-[#241a3d] to-[#120E1F]" />
    </div>
  )
}

function StreamArt() {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="relative aspect-square w-[min(70%,340px)] rounded-full p-[10px] [background:conic-gradient(from_200deg,#FFE14D,#fff6c4,#FFE14D,#b89b1a,#FFE14D)] shadow-[0_0_90px_-10px_rgba(255,225,77,0.7)]">
        <div className="flex h-full w-full items-center justify-center rounded-full bg-[#0d0a16]">
          <div className="aspect-square w-[34%] rounded-full border-[6px] border-[#2A2342] bg-[radial-gradient(circle_at_35%_35%,#4a3f70,#06050A_70%)]" />
        </div>
      </div>
      <span className="absolute top-[12%] right-[10%] flex items-center gap-2 rounded-full bg-[#FF2BD6] px-3 py-1 text-xs font-semibold text-[#0b0612]">
        <span className="size-2 rounded-full bg-[#0b0612]" aria-hidden />
        В эфире
      </span>
    </div>
  )
}

export function ZoneArt({ id }: { id: ZoneId }) {
  switch (id) {
    case 'standard':
      return <StandardArt />
    case 'vip':
      return <VipArt />
    case 'ps5':
      return <Ps5Art />
    case 'stream':
      return <StreamArt />
  }
}
