import type { App } from 'vue'
import { Locale } from 'vant'
import { createI18n } from 'vue-i18n'
import enUS from 'vant/es/locale/lang/en-US'
import ruRU from 'vant/es/locale/lang/ru-RU'
import { LOCALE_LIST } from '@/constants/locale'
import { setDayjsLocale } from '@/utils/date'
import locales from '@/locales/index'

type MessageSchema = typeof locales.en

// get current locale
export function getCurrentLocale(): string {
  const localeIndex = LOCALE_LIST.findIndex(item => item.value === navigator.language)
  if (localeIndex > -1)
    return LOCALE_LIST[localeIndex].value
  else
    return 'en'
}

// i18n init
const locale = getCurrentLocale()
export const i18n = createI18n<[MessageSchema], string>({
  messages: {
    en: locales.en,
    ru: locales.ru,
  },
  // set locale
  locale,
  // set fallback locale
  fallbackLocale: 'en',
  // set global, $t
  globalInjection: true,
  // to use Composition API
  legacy: false,
})

function setVantLocale(lang: string) {
  switch (lang) {
    case 'ru':
      Locale.use('ru-RU', ruRU)
      break
    default: Locale.use('en-US', enUS)
  }
}

// set global locale
export function setGlobalLocale(lang: string) {
  lang = lang || 'en'
  const _locale = i18n.global.locale as any
  if (_locale && _locale.value)
    _locale.value = lang

  // update lib locale
  setVantLocale(lang)
  setDayjsLocale(lang)
}

// config i18n
export function setupI18n(app: App) {
  app.use(i18n)
  setVantLocale(locale)
  setDayjsLocale(locale)
}
