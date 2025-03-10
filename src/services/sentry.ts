import type { App } from 'vue'
import * as Sentry from '@sentry/vue'
import { ENV } from '@/constants/env'
import { isDev, isProd } from '@/constants/is'
import { useUserStoreRefs } from '@/store/modules/user'

export function logError(error: any, extra = {}) {
  if (isDev()) {
    console.error('logError', error)
  }
  else {
    // TODO get user info
    const { user } = useUserStoreRefs()
    Sentry.withScope((scope) => {
      if (user.value) {
        scope.setUser({
          id: user.value.userId,
        })
      }
      else {
        scope.setUser(null)
      }
      Sentry.captureException(error, extra)
    })
  }
}

export function setupSentry(app: App) {
  Sentry.init({
    Vue: app,
    enabled: isProd(),
    dsn: ENV.SENTRY_KEY,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 0.001,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0.001,
  })
}
