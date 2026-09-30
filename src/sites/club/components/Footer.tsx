import { IconBrandTelegram, IconBrandVk } from '@tabler/icons-react'

export function Footer() {
  return (
    <footer id="contacts" className="relative overflow-hidden border-t border-[#2A2342] px-4 pt-16 pb-8 sm:px-8 lg:pt-24">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="text-sm text-[#9A93B5]">Адрес</h2>
            <p className="rs-display mt-3 text-xl leading-tight">Лиговский пр., 50</p>
            <p className="mt-2 text-[#9A93B5]">Санкт-Петербург, 5 минут от м. Лиговский проспект</p>
          </div>
          <div>
            <h2 className="text-sm text-[#9A93B5]">Часы работы</h2>
            <p className="rs-display mt-3 text-xl leading-tight">Круглосуточно</p>
            <p className="mt-2 text-[#9A93B5]">Без выходных, после 22:00 с 18 лет</p>
          </div>
          <div>
            <h2 className="text-sm text-[#9A93B5]">Телефон</h2>
            <a href="tel:+78120000000" className="rs-display mt-3 inline-block text-xl leading-tight hover:text-[#22E7FF]">
              +7 (812) 000-00-00
            </a>
            <p className="mt-2 text-[#9A93B5]">Бронь, турниры, дни рождения</p>
          </div>
          <div>
            <h2 className="text-sm text-[#9A93B5]">Мы в соцсетях</h2>
            <div className="mt-3 flex gap-2">
              <a href="#" aria-label="RESPAWN в Telegram" className="rs-ghost size-12">
                <IconBrandTelegram className="size-5" />
              </a>
              <a href="#" aria-label="RESPAWN во ВКонтакте" className="rs-ghost size-12">
                <IconBrandVk className="size-5" />
              </a>
            </div>
          </div>
        </div>

        <p
          aria-hidden
          className="rs-display rs-chrome-text mt-20 text-center text-[clamp(3rem,13.5vw,13rem)] leading-[0.8] whitespace-nowrap select-none"
        >
          RESPAWN
        </p>

        <div className="mt-10 flex flex-col gap-2 text-sm text-[#9A93B5] sm:flex-row sm:justify-between">
          <p>© 2026 RESPAWN, компьютерный клуб</p>
          <p>Цены на сайте действуют с 1 сентября 2026 года</p>
        </div>
      </div>
    </footer>
  )
}
