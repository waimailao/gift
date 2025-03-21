import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(duration)
dayjs.extend(localizedFormat)
dayjs.extend(updateLocale)
dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(timezone)

export async function setDayjsLocale(locale: string) {
  switch (locale) {
    case 'ru':
      await import('dayjs/locale/ru')
      break
    case 'ko':
      await import('dayjs/locale/ko')
      break
    case 'tr':
      await import('dayjs/locale/tr')
      break
    case 'es':
      await import('dayjs/locale/es')
      break
    case 'id':
      await import('dayjs/locale/id')
      break
    case 'bn':
      await import('dayjs/locale/bn')
      break
    case 'vi':
      await import('dayjs/locale/vi')
      break
    case 'hi':
      await import('dayjs/locale/hi')
      break
    case 'fr':
      await import('dayjs/locale/fr')
      break
    default: await import('dayjs/locale/en')
  }
  dayjs.locale(locale, {
    weekStart: 0,
  })
}

// check if the current time is 00:00:00 UTC
export function isUTCZeroTime(): boolean {
  const now = dayjs().utc()
  return now.hour() === 0 && now.minute() === 0 && now.second() === 0
}

// 已配置插件的 dayjs 实例
export { dayjs }
