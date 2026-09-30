import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { FAQ } from '../data'

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="relative px-4 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <div className="min-w-0">
          <h2 id="faq-title" className="rs-display text-[clamp(2.75rem,6.5vw,6.5rem)]">
            Частые вопросы
          </h2>
          <p className="mt-6 max-w-sm text-[#9A93B5]">
            Не нашли ответ? Напишите в Telegram, администратор на связи круглосуточно.
          </p>
        </div>
        <Accordion type="single" collapsible className="rs-faq min-w-0 border-t border-[#2A2342]">
          {FAQ.map((f, i) => (
            <AccordionItem key={f.q} value={`q${i}`}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent className="max-w-2xl pr-8 text-base leading-relaxed text-[#9A93B5]">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
