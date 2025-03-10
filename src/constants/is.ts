export function isDev() {
  return import.meta.env.DEV
}

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
