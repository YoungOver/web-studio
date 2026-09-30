import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const QA = [
  {
    q: 'Нужен ли опыт программирования?',
    a: 'Нет. Больше половины учеников приходят с нуля. На пробном уроке преподаватель поймёт уровень и посоветует группу: для новичков и для тех, кто уже что-то писал, группы разные.',
  },
  {
    q: 'Какой компьютер нужен?',
    a: 'Для Python и веба хватит любого ноутбука с Windows, macOS или Linux не старше 7 лет и 4 ГБ памяти. Для Unity нужно от 8 ГБ памяти и видеокарта с поддержкой DirectX 11. Планшет или телефон не подойдут. Всё нужное ПО бесплатное, установим вместе на первом уроке.',
  },
  {
    q: 'Что если ребёнок пропустил урок?',
    a: 'Каждый урок записывается, запись появляется в личном кабинете в тот же день. Домашнее задание можно сдать позже, а вопросы задать наставнику в чате группы. Если пропуск долгий, поможем догнать на отдельной встрече.',
  },
  {
    q: 'Вернёте ли деньги, если не понравится?',
    a: 'Да. Если после первого оплаченного месяца решите не продолжать, вернём деньги за него полностью. При оплате за 3 месяца или год вернём стоимость неиспользованных месяцев по обычной цене, без штрафов.',
  },
  {
    q: 'Можно перейти на другой курс?',
    a: 'Можно в любой момент. Оплаченные уроки перенесутся на новый курс, а куратор подберёт группу с похожим уровнем.',
  },
  {
    q: 'Как вы следите за прогрессом?',
    a: 'После каждого модуля родители получают короткий отчёт: что прошли, что получилось, над чем стоит поработать. На демо-днях вы видите проект целиком.',
  },
]

export function Faq() {
  return (
    <section id="faq" className="relative py-20 sm:py-28" aria-labelledby="faq-h">
      <div className="kk-wrap grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <div className="min-w-0">
          <div className="lg:sticky lg:top-28">
          <h2 id="faq-h" className="kk-h2">
            Частые вопросы
          </h2>
          <p className="kk-lead mt-5">
            Не нашли ответ? Напишите в Telegram{' '}
            <a href="https://t.me/kodkemp_school" className="font-semibold text-[#3d5afe] underline underline-offset-4">
              @kodkemp_school
            </a>
            , отвечаем с 9 до 21.
          </p>
          </div>
        </div>

        <Accordion type="single" collapsible defaultValue="q0" className="min-w-0 rounded-[28px] bg-white px-5 sm:px-8">
          {QA.map((it, i) => (
            <AccordionItem key={it.q} value={`q${i}`} className="border-[#e3e7f0]">
              <AccordionTrigger className="items-center py-6 text-left text-[clamp(1.08rem,1rem+0.4vw,1.3rem)] font-bold tracking-[-0.02em] hover:no-underline [&>svg]:size-5 [&>svg]:text-[#3d5afe]">
                {it.q}
              </AccordionTrigger>
              <AccordionContent className="max-w-[40rem] pb-6 text-[1.02rem] leading-relaxed text-[#5b6172]">{it.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
