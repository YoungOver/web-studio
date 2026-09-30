import { IconBrandTelegram, IconBrandWhatsapp } from '@tabler/icons-react'

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[#2b2f36] pt-16 lg:pt-24" aria-label="Контакты">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="text-[0.92rem] font-semibold text-[#8c939e]">Адрес</h2>
            <p className="mt-2 text-[1.08rem] font-semibold leading-snug text-[#d9dee5]">
              Москва, ул. Складочная, 1с4
              <br />
              <span className="font-normal text-[#8c939e]">5 минут от МЦД Савёловская, парковка у бокса</span>
            </p>
          </div>
          <div>
            <h2 className="text-[0.92rem] font-semibold text-[#8c939e]">Часы работы</h2>
            <p className="mt-2 text-[1.08rem] font-semibold text-[#d9dee5]">
              Каждый день, 9:00–21:00
            </p>
          </div>
          <div>
            <h2 className="text-[0.92rem] font-semibold text-[#8c939e]">Телефон</h2>
            <a href="tel:+74950000000" className="mt-2 inline-block text-[1.08rem] font-semibold text-[#d9dee5] hover:text-white">
              +7 (495) 000-00-00
            </a>
          </div>
          <div>
            <h2 className="text-[0.92rem] font-semibold text-[#8c939e]">Написать</h2>
            <ul className="mt-2 flex flex-wrap gap-2">
              <li>
                <a href="https://t.me/" target="_blank" rel="noreferrer" className="gl-ghost h-11 px-4 text-[0.95rem]">
                  <IconBrandTelegram size={18} aria-hidden /> Telegram
                </a>
              </li>
              <li>
                <a href="https://wa.me/74950000000" target="_blank" rel="noreferrer" className="gl-ghost h-11 px-4 text-[0.95rem]">
                  <IconBrandWhatsapp size={18} aria-hidden /> WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <p aria-hidden className="gl-display gl-chrome-quiet mt-16 select-none text-center text-[clamp(3.4rem,17vw,17rem)] leading-[0.8] tracking-[-0.03em] opacity-90 lg:mt-24">
        ГЛЯНЕЦ
      </p>
      <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-4 py-6 text-[0.85rem] text-[#5d636d] sm:flex-row sm:justify-between sm:px-6 lg:px-10">
        <p>© 2026 Детейлинг-центр «Глянец»</p>
        <p>Цены на сайте не являются публичной офертой</p>
      </div>
    </footer>
  )
}
