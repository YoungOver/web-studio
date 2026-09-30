import { REVIEWS } from '../data'

function Row({ items, reverse, duration }: { items: typeof REVIEWS; reverse?: boolean; duration: number }) {
  // four copies, animated by -50%: each half is wider than any viewport, so the loop never shows a gap
  const doubled = [...items, ...items, ...items, ...items]
  return (
    <div className="gl-marquee-wrap overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      <div className="gl-marquee" data-reverse={reverse ? 'true' : 'false'} style={{ ['--dur' as string]: `${duration}s` }}>
        {doubled.map((r, i) => (
          <figure
            key={`${r.name}-${i}`}
            aria-hidden={i >= items.length}
            className="m-0 flex w-[min(78vw,25rem)] shrink-0 flex-col justify-between gap-5 border-l border-[#2b2f36] px-6 py-2 sm:px-8"
          >
            <blockquote className="text-[1.12rem] font-medium leading-snug text-[#e3e7ec] sm:text-[1.22rem]">«{r.text}»</blockquote>
            <figcaption className="text-[0.92rem] text-[#8c939e]">
              <span className="font-bold text-[#d9dee5]">{r.name}</span>, {r.car}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}

export function Reviews() {
  const a = REVIEWS.slice(0, 4)
  const b = REVIEWS.slice(4)
  return (
    <section className="relative py-24 lg:py-32" aria-labelledby="reviews-title">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <h2 id="reviews-title" className="gl-display text-[clamp(2.3rem,6vw,5.5rem)] text-[#eef1f5]">
          Владельцы о нас
        </h2>
        <p className="mt-5 max-w-[30rem] text-[1.05rem] leading-relaxed text-[#8c939e]">4,9 на Яндекс Картах, 312 отзывов. Несколько последних.</p>
      </div>
      <div className="mt-14 flex flex-col gap-10 lg:mt-16">
        <Row items={a} duration={55} />
        <Row items={b} duration={62} reverse />
      </div>
    </section>
  )
}
