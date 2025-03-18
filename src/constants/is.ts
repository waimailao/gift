import {NEW_IMAGES} from "@/assets";

export function isDev() {
  return import.meta.env.DEV
}

export const TG_ICON = [
  { value: 5782984811920491178, icon: NEW_IMAGES.GIFT_5782984811920491178 },
  { value: 5963238670868677492, icon: NEW_IMAGES.GIFT_5963238670868677492 },
  { value: 5168103777563050263, icon: NEW_IMAGES.GIFT_5168103777563050263 },
  { value: 5170314324215857265, icon: NEW_IMAGES.GIFT_5170314324215857265 },
  { value: 5782988952268964995, icon: NEW_IMAGES.GIFT_5782988952268964995 },
  { value: 6028601630662853006, icon: NEW_IMAGES.GIFT_6028601630662853006 },
  { value: 5170144170496491616, icon: NEW_IMAGES.GIFT_5170144170496491616 },
  { value: 5170521118301225164, icon: NEW_IMAGES.GIFT_5170521118301225164 },
  { value: 5783075783622787539, icon: NEW_IMAGES.GIFT_5783075783622787539 },
  { value: 5170145012310081615, icon: NEW_IMAGES.GIFT_5170145012310081615 },
  { value: 5170564780938756245, icon: NEW_IMAGES.GIFT_5170564780938756245 },
  { value: 5895544372761461960, icon: NEW_IMAGES.GIFT_5895544372761461960 },
  { value: 5170233102089322756, icon: NEW_IMAGES.GIFT_5170233102089322756 },
  { value: 5170690322832818290, icon: NEW_IMAGES.GIFT_5170690322832818290 },
  { value: 5960747083030856414, icon: NEW_IMAGES.GIFT_5960747083030856414 },
  { value: 5170250947678437525, icon: NEW_IMAGES.GIFT_5170250947678437525 },
  { value: 5168043875654172773, icon: NEW_IMAGES.GIFT_5168043875654172773 },
]

export function isProd() {
  return import.meta.env.PROD
}

export function isiOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
}

export function isMobile() {
  return navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)
}

export function isMacOS() {
  return navigator.userAgent.match(/Mac OS X/i)
}

export function isWindowsOS() {
  return navigator.userAgent.match(/Windows/i)
}

export function isValidRouterPath(url: string): boolean {
  const RoutesPaths = [
    '',
    '/',
    '/Play',
    '/My',
  ]
  return RoutesPaths.includes(url)
}
export function isValidRouterName(url: string): boolean {
  const RouterNames = [
    'Home',
    'Play',
    'My',
  ]
  return RouterNames.includes(url)
}

export function isHttpUrl(url: string): boolean {
  const pattern = /^https?:\/\/[^\s$.?#].\S*$/
  return pattern.test(url)
}

export function isTelegramUrl(url: string) {
  const telegramPrefix = 'https://t.me'
  return url.startsWith(telegramPrefix)
}

