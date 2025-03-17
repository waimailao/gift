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


// check backend response error
function isBackendResponseError(error: BackendResponse): error is BackendResponse {
  return (error as BackendResponse).code !== undefined
}

// Interceptors
client.interceptors.request.use((config) => {
  const { token } = useUserStoreRefs()
  config.headers.token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ0ZWxlZ3JhbS1naWZ0LWFwaSIsImF1ZCI6InRlbGVncmFtLXVzZXJzIiwiaWF0IjoxNzQyMjE1NjA3LCJuYmYiOjE3NDIyMTU2MDcsImV4cCI6MTc0MjIxOTIwNywidWlkIjoxMSwiYXBwIjoiYXBpIiwiZGF0YSI6eyJ1c2VyX2lkIjoxMSwidGdfaWQiOiIyMjAwNjA3NDk5Iiwibmlja19uYW1lIjoiWXVuX01hIn0sImp0aSI6IjExX2FwaSJ9.M5ItNtbsWilfitiOYlYen8cC3D2NGmybDCW7NNUGpK4'
  if (config.baseURL !== ENV.API_CLIENT_URL) {
    return config
  }
  else if (token.value) {
    // config.headers.token = token.value
    config.headers.token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ0ZWxlZ3JhbS1naWZ0LWFwaSIsImF1ZCI6InRlbGVncmFtLXVzZXJzIiwiaWF0IjoxNzQyMTk3NzcxLCJuYmYiOjE3NDIxOTc3NzEsImV4cCI6MTc0MjIwMTM3MSwidWlkIjo4LCJhcHAiOiJhcGkiLCJkYXRhIjp7InVzZXJfaWQiOjgsInRnX2lkIjoiNjU2MTM1NTU2NyIsIm5pY2tfbmFtZSI6ImNoZW5nbG9uZ193YW5nIn0sImp0aSI6IjhfYXBpIn0.VXMF7dPJcQJOJGdBoG2sMDH669V_Ktl-Tr1mmNn3e-4'
  }
  // else if (!WHITE_LIST.some(path => config.url?.includes(path))) {
  //   return Promise.reject(new Error('token expired'))
  // }

  return config
})

client.interceptors.response.use((response) => {
  // Third Party API
  if (response.config.baseURL !== ENV.API_CLIENT_URL) {
    return response.data
  }
  // Yescoin Client API
  const data = response.data
  console.log(data)
  return data.data
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
