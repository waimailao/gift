import type {
  BackButton,
  ClosingBehavior,
  HapticFeedback,
  InitDataParsed,
  MiniApp,
  SettingsButton,
  Utils,
  Viewport,
} from '@tma.js/sdk'
import {
  initBackButton,
  initClosingBehavior,
  initHapticFeedback,
  initMiniApp,
  initSettingsButton,
  initUtils,
  postEvent,
  request,
  retrieveLaunchParams,
  setDebug,
} from '@tma.js/sdk'

import { isDev } from '@/constants/is'
import { importScript } from '@/utils/cdn'
import { logError } from '@/services/sentry'
import { useUserStoreRefs } from '@/store/modules/user'

class Client {
  static TG_GAMES_SDK_URL = 'https://telegram.org/js/games.js?11'
  static TG_WIDGET_SDK_URL = 'https://telegram.org/js/telegram-widget.js?11'
  static TG_MINI_APP_SDK_URL = 'https://telegram.org/js/telegram-web-app.js?11'
  static TG_ANALYTICS_SDK_URL = 'https://tganalytics.xyz/index.js?11'

  supported = false

  /**
   * client version
   */
  version = ''

  /**
   * client init data
   */
  initData: InitDataParsed = {} as InitDataParsed
  initDataRaw: string | undefined = ''

  /**
   * client viewport
   */
  viewPort: Viewport = {} as Viewport

  /**
   * client utils
   */
  utils: Utils = {} as Utils

  /**
   * client mini app
   */
  miniApp: MiniApp = {} as MiniApp

  /**
   * client BackButton
   */
  backButton: BackButton = {} as BackButton

  /**
   * client SettingsButton
   */
  settingsButton: SettingsButton = {} as SettingsButton

  /**
   * client ClosingBehavior
   */
  closingBehavior: ClosingBehavior = {} as ClosingBehavior

  /**
   * client HapticFeedback
   */
  hapticFeedback: HapticFeedback = {} as HapticFeedback

  /**
   * set bottom bar color
   * @returns {void}
   */
  async setBottomBarColor(color: string) {
    const _window = window as any
    if (!_window.Telegram)
      await importScript(Client.TG_MINI_APP_SDK_URL)

    return _window.Telegram?.WebApp?.setBottomBarColor(color)
  }

  /**
   * request phone
   * @returns {boolean} send phone success
   */
  async requestPhone() {
    const res = await request({
      method: 'web_app_request_phone',
      event: 'phone_requested',
      timeout: 10000,
    })
    return res.status === 'sent'
  }

  /**
   * request oauth
   * @returns {Promise<Record<string, any>>} tg oauth data
   */
  async requestOAuth() {
    const _window = window as any
    if (!_window.Telegram)
      await importScript(Client.TG_WIDGET_SDK_URL)

    return new Promise(resolve => _window.Telegram?.Login?.auth?.({
      bot_id: import.meta.env.VITE_TELEGRAM_BOT_ID ?? '',
      request_access: 'write',
      embed: 1,
    }, resolve))
  }

  /**
   * request story sharing
   * @returns {void} share story
   */
  async requestStoryShare(mediaURL: string, shareText: string) {
    const _window = window as any
    if (!_window.Telegram)
      await importScript(Client.TG_MINI_APP_SDK_URL)

    return _window.Telegram?.WebApp?.shareToStory(mediaURL, { text: shareText })
  }

  /**
   * request swipe behavior
   * @returns {void} swipe behavior
   */
  async requestSwipeBehavior(isVerticalSwipesEnabled: boolean) {
    const _window = window as any
    if (!_window.Telegram)
      await importScript(Client.TG_MINI_APP_SDK_URL)

    if (isVerticalSwipesEnabled)
      _window.Telegram?.WebApp?.enableVerticalSwipes()
    else
      _window.Telegram?.WebApp?.disableVerticalSwipes()
  }

  /**
   * request analytics
   * @returns {void} analytics init
   */
  async requestAnalytics() {
    const _window = window as any
    if (!_window.telegramAnalytics)
      await importScript(Client.TG_ANALYTICS_SDK_URL)

    _window.telegramAnalytics.init({
      token: 'eyJhcHBfbmFtZSI6Illlc2NvaW4iLCJhcHBfdXJsIjoiaHR0cHM6Ly93d3cueWVzY29pbi5nb2xkIiwiYXBwX2RvbWFpbiI6Imh0dHBzOi8vd3d3Lnllc2NvaW4uZ29sZCJ9!jt7UFX5GXqmzH79vwnPry28ldPvN1P3Iu+kKP0DELoY=',
      appName: 'GIFT',
    })
  }

  /**
   * telegram vibration
   * @param { enum } VibrationType  震动类型
   * @method  requestVibration      请求震动
   */
  async requestVibration(vibrationType: VibrationType) {
    if (this.hapticFeedback.supports('impactOccurred'))
      this.hapticFeedback.impactOccurred(vibrationType)
  }

  /**
   * telegram share
   */
  shareURL(url: string, text: string) {
    if (this.supported) {
      try {
        this.utils.shareURL(url, text)
      }
      catch (error) {
        this.miniApp.close()
        console.log('open telegram link error: ', error)
      }
    }
    else { window.open(url) }
  }

  shareLink(url: string, useShareLink = true) {
    const link = useShareLink ? `https://t.me/share/url?url=${encodeURIComponent(url)}` : url
    if (this.supported) {
      try {
        this.utils.openTelegramLink(link)
      }
      catch (error) {
        this.miniApp.close()
        console.log('open telegram link error: ', error)
      }
    }
    else { window.open(link) }
  }

  shareOuterLink(url: string) {
    if (this.supported) {
      try {
        this.utils.openLink(url, { tryBrowser: true })
      }
      catch (error) {
        window.open(url)
        console.log('open outer url error: ', error)
      }
    }
    else { window.open(url) }
  }
}

export enum VibrationType {
  Light = 'light',
  Medium = 'medium',
  Heavy = 'heavy',
  Rigid = 'rigid',
  Soft = 'soft',
}

export const TGClient = new Client()

export function setupTelegram() {
  try {
    const { version, initData, initDataRaw } = retrieveLaunchParams()
    if (initData && initData.user) {
      TGClient.initData = initData
      const userStore = useUserStoreRefs()
      userStore.tgUser.value = {
        ...initData.user,
        username: initData.user.username || `${initData.user.firstName} ${initData.user.lastName}`,
      }
      // expand viewport
      postEvent('web_app_expand')
      // init utils
      const utils = initUtils()
      TGClient.utils = utils

      // init mini app
      const [miniApp] = initMiniApp()
      if (miniApp) {
        miniApp.setHeaderColor('#070E26')
        miniApp.setBgColor('#070E26')
        TGClient.miniApp = miniApp
        TGClient.setBottomBarColor('#070E26')
      }
      // init back button
      const [backButton] = initBackButton()
      if (backButton)
        TGClient.backButton = backButton

      // init settings button
      const [settingsButton] = initSettingsButton()
      if (settingsButton) {
        settingsButton.show()
        TGClient.settingsButton = settingsButton
      }
      // init closing behavior
      const [closingBehavior] = initClosingBehavior()
      if (closingBehavior) {
        closingBehavior.enableConfirmation()
        TGClient.closingBehavior = closingBehavior
      }
      // init hapticFeedback
      const hapticFeedback = initHapticFeedback()
      TGClient.hapticFeedback = hapticFeedback

      // init swipe behavior
      TGClient.requestSwipeBehavior(false)
      // init analytics
      TGClient.requestAnalytics()
    }
    // set TGClient
    TGClient.supported = true
    TGClient.version = version
    TGClient.initDataRaw = initDataRaw
    setDebug(isDev())

    if (!initData)
      throw new Error('Unable to retrieve any launch parameters.')
  }
  catch (error) {
    if ((error as any).message !== 'Unable to retrieve any launch parameters.')
      logError(error)
  }
}
