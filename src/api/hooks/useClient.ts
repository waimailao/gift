import { ref } from 'vue'
import { debounce, throttle } from 'lodash-es'
import { isDev } from '@/constants/is'

export interface ApiClientOption {
  immediate?: boolean
  waitingDelay?: number
  loadingDelay?: number
  debounceWait?: number
  throttleWait?: number
  onError?: (err: any) => void
  [prop: string]: any
}

export function useApiClient(apiClient: any, option: ApiClientOption = {}) {
  const { immediate = true, loadingDelay = 0, waitingDelay = 0, debounceWait = 0, throttleWait = 0, onError } = option
  if (debounceWait > 0 && throttleWait > 0)
    throw new Error('debounceWait and throttleWait cannot be used together')

  const data = ref(null)
  const error = ref(null)
  const timer = ref<ReturnType<typeof setTimeout>>()

  const isFirst = ref(true)
  const isFetching = ref(loadingDelay > 0 ? false : immediate)

  const execute = (...args: any[]) => {
    error.value = null
    if (isFetching.value && !isFirst.value)
      return

    isFirst.value = false
    // set loading delay
    clearTimeout(timer.value)
    if (loadingDelay > 0)
      timer.value = setTimeout(() => isFetching.value = true, loadingDelay)
    else
      isFetching.value = true

    // wrap apiClient with debounce or throttle
    let fetchFunc: any

    const asyncApiClient = async (...args: any[]) => apiClient(...args)
    if (debounceWait > 0)
      fetchFunc = debounce(asyncApiClient, debounceWait)
    else if (throttleWait > 0)
      fetchFunc = throttle(asyncApiClient, throttleWait)
    else
      fetchFunc = asyncApiClient

    // waiting record
    const waitingTimestamp = new Date().getTime()
    // call apiClient
    return fetchFunc(...args)
      .then((res: any) => {
        const diffTimestamp = waitingDelay - (new Date().getTime() - waitingTimestamp)
        if (waitingDelay === 0 || diffTimestamp <= 0)
          data.value = res
        else
          setTimeout(() => data.value = res, diffTimestamp)
      })
      .catch((err: any) => {
        error.value = err
        onError?.(err)
        if (isDev())
          console.warn(err)
      })
      .finally(() => {
        clearTimeout(timer.value)
        const diffTimestamp = waitingDelay - (new Date().getTime() - waitingTimestamp)
        if (waitingDelay === 0 || diffTimestamp <= 0)
          isFetching.value = false
        else
          setTimeout(() => isFetching.value = false, diffTimestamp)
      })
  }

  const refetch = () => {
    data.value = null
    execute()
  }

  if (immediate)
    execute()

  return {
    isFetching,
    error,
    data,
    execute,
    refetch,
  }
}
