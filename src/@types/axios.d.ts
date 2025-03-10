import 'axios'

// 为了确保这个文件被当作一个模块，添加至少一个 `export` 声明
export {}

declare module 'axios' {
  interface AxiosInstance {
    sign: string | null
    showError: (code: number, message: string) => void
  }
  interface InternalAxiosRequestConfig {
    silence: boolean
  }

  interface BackendResponse {
    code: number
    data?: BackendResponseData
    message?: string
  }

  interface BackendResponseData {
    [prop: string]: any
  }
}
