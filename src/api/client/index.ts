import type { AxiosError, BackendResponse } from 'axios'
import axios, { isAxiosError } from 'axios'
import { showDialog } from 'vant'
import { ENV } from '@/constants/env'
import { isDev } from '@/constants/is'
import { logError } from '@/services/sentry'
import { useUserStoreRefs } from '@/store/modules/user'

export const client = axios.create({
  baseURL: ENV.API_CLIENT_URL,
  timeout: 60000,
  headers: {
    // TODO add some default headers
  },
})

client.sign = null
client.showError = (code: number, message: string) => {
  if (client.sign)
    return

  // avoid invalid code
  if (code === 400003 || code === 400037)
    return

  client.sign = 'error'

  showDialog({
    title: 'hint!',
    message,
  }).finally(() => client.sign = null)
}

// auth white list
const WHITE_LIST = [
  '/user/login',
  '/invite/getInviteGiftBoxInfoWithCode',
]

// check backend response error
function isBackendResponseError(error: BackendResponse): error is BackendResponse {
  return (error as BackendResponse).code !== undefined
}

// Interceptors
client.interceptors.request.use((config) => {
  const { token } = useUserStoreRefs()
  if (config.baseURL !== ENV.API_CLIENT_URL) {
    return config
  }
  else if (token.value) {
    config.headers.token = token.value
  }
  else if (!WHITE_LIST.some(path => config.url?.includes(path))) {
    return Promise.reject(new Error('token expired'))
  }

  return config
})

client.interceptors.response.use((response) => {
  // Third Party API
  if (response.config.baseURL !== ENV.API_CLIENT_URL) {
    return response.data
  }
  // Yescoin Client API
  const data = response.data
  if (data.code === 0) {
    return data.data
  }
  else if (data.code === 400008
    || data.code === 400012
    || data.code === 400013
    || data.code === 400020
    || data.code === 400021
    || data.code === 400024
    || data.code === 400025
    || data.code === 400026
    || data.code === 400027
    || data.code === 400035
    || data.code === 400036
    || data.code === 400038
    || data.code === 400039
    || data.code === 400040
    || data.code === 400052
    || data.code === 400056
    || data.code === 400059
    || data.code === 400060) {
    return data.code
  }
  else if (data.code >= 400045 && data.code <= 400051) {
    return { code: data.code, message: data.message }
  }

  if (isDev())
    console.warn('[RESPONSE ERROR]', data)

  if (data.code === 400010) {
    const { token, user } = useUserStoreRefs()
    user.value = null
    token.value = null
  }
  else if (!response.config.silence && data.code > 400000) { client.showError(data.code, data.message) }

  return Promise.reject(data)
}, (error: AxiosError | BackendResponse) => {
  if (isAxiosError(error)) {
    // axios error
  }
  else if (isBackendResponseError(error)) {
    // backend error
    if (error.code === 400010) {
      const { token, user } = useUserStoreRefs()
      user.value = null
      token.value = null
    }
    else if (error.code > 400000) { client.showError(error.code, error.message || 'Unknown Error') }
  }
  logError(error)
  return Promise.reject(error)
})

export function get(url: string, config?: any) {
  return client.get(url, config)
}

export function post(url: string, data: any, config?: any) {
  return client.post(url, data, config)
}

export function put(url: string, data: any, config?: any) {
  return client.put(url, data, config)
}

export function del(url: string, config?: any) {
  return client.delete(url, config)
}
