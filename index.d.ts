/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface FexiosTransformer {
  (data: any, headers?: any): any
}

export interface FexiosBasicCredentials {
  username: string
  password: string
}
export interface FexiosProxyConfig {
  host: string
  port: number
  auth?: {
    username: string
    password:string
  }
  protocol?: string
}

export type Method =
  | 'get' | 'GET'
  | 'delete' | 'DELETE'
  | 'head' | 'HEAD'
  | 'options' | 'OPTIONS'
  | 'post' | 'POST'
  | 'put' | 'PUT'
  | 'patch' | 'PATCH'
  | 'purge' | 'PURGE'
  | 'link' | 'LINK'
  | 'unlink' | 'UNLINK'

export type ResponseType =
  | 'arraybuffer'
  | 'blob'
  | 'document'
  | 'json'
  | 'text'
  | 'stream'

export interface FexiosRequestConfig {
  url?: string
  method?: Method
  baseURL?: string
  transformRequest?: FexiosTransformer | FexiosTransformer[]
  transformResponse?: FexiosTransformer | FexiosTransformer[]
  headers?: any
  params?: any
  paramsSerializer?: (params: any) => string
  data?: any
  timeout?: number
  timeoutErrorMessage?: string
  withCredentials?: boolean
  auth?: FexiosBasicCredentials
  responseType?: ResponseType
  xsrfCookieName?: string
  xsrfHeaderName?: string
  onUploadProgress?: (progressEvent: any) => void
  onDownloadProgress?: (progressEvent: any) => void
  maxContentLength?: number
  validateStatus?: ((status: number) => boolean) | null
  maxBodyLength?: number
  maxRedirects?: number
  cancelToken?: CancelToken
  decompress?: boolean
}

export interface FexiosResponse<T = any>  {
  data: T
  status: number
  statusText: string
  headers: any
  config: FexiosRequestConfig
  request?: any
}

export interface FexiosError<T = any> extends Error {
  config: FexiosRequestConfig
  code?: string
  request?: any
  response?: FexiosResponse<T>
  isFexiosError: boolean
  toJSON: () => object
}

export type FexiosPromise<T = any> = Promise<FexiosResponse<T>>

export interface CancelStatic {
  new (message?: string): Cancel
}

export interface Cancel {
  message: string
}

export interface Canceler {
  (message?: string): void
}

export interface CancelTokenStatic {
  new (executor: (cancel: Canceler) => void): CancelToken
  source(): CancelTokenSource
}

export interface CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel
  throwIfRequested(): void
}

export interface CancelTokenSource {
  token: CancelToken
  cancel: Canceler
}

export interface FexiosInterceptorManager<V> {
  use(onFulfilled?: (value: V) => V | Promise<V>, onRejected?: (error: any) => any): number
  eject(id: number): void
}

export interface FexiosInstance {
  (config: FexiosRequestConfig): FexiosPromise
  (url: string, config?: FexiosRequestConfig): FexiosPromise
  defaults: FexiosRequestConfig
  interceptors: {
    request: FexiosInterceptorManager<FexiosRequestConfig>
    response: FexiosInterceptorManager<FexiosResponse>
  }
  getUri(config?: FexiosRequestConfig): string
  request<T = any, R = FexiosResponse<T>> (config: FexiosRequestConfig): Promise<R>
  get<T = any, R = FexiosResponse<T>>(url: string, config?: FexiosRequestConfig): Promise<R>
  delete<T = any, R = FexiosResponse<T>>(url: string, config?: FexiosRequestConfig): Promise<R>
  head<T = any, R = FexiosResponse<T>>(url: string, config?: FexiosRequestConfig): Promise<R>
  options<T = any, R = FexiosResponse<T>>(url: string, config?: FexiosRequestConfig): Promise<R>
  post<T = any, R = FexiosResponse<T>>(url: string, data?: any, config?: FexiosRequestConfig): Promise<R>
  put<T = any, R = FexiosResponse<T>>(url: string, data?: any, config?: FexiosRequestConfig): Promise<R>
  patch<T = any, R = FexiosResponse<T>>(url: string, data?: any, config?: FexiosRequestConfig): Promise<R>
}

export interface FexiosStatic extends FexiosInstance {
  create(config?: FexiosRequestConfig): FexiosInstance
  Cancel: CancelStatic
  CancelToken: CancelTokenStatic
  isCancel(value: any): boolean
  all<T>(values: (T | Promise<T>)[]): Promise<T[]>
  spread<T, R>(callback: (...args: T[]) => R): (array: T[]) => R
  isFexiosError(payload: any): payload is FexiosError
}

declare const fexios: FexiosStatic

export default fexios
