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
  params?: { [s: string]: string | number }
  data?: any
  timeout?: number
  timeoutErrorMessage?: string
  credentials?: 'include' | 'same-origin' | 'omit'
  validateStatus?: ((status: number) => boolean) | null
}

export interface FexiosResponse  {
  data: Response['body']
  status: Response['status']
  statusText: Response['statusText']
  headers: any
  config: FexiosRequestConfig
}

export interface FexiosError extends Error {
  config: FexiosRequestConfig
  code?: string
  request?: any
  response?: FexiosResponse
  isFexiosError: boolean
  toJSON: () => object
}

export type FexiosPromise = Promise<FexiosResponse>

export interface ResolvedFn<T = any> {
  (val: T): T | Promise<T>
}

export interface RejectedFn {
  (error: any): any
}

export interface FexiosInterceptorManager<T> {
  use(resolved?: ResolvedFn<T>, rejected?: RejectedFn): number
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
  request<R = FexiosResponse> (config: FexiosRequestConfig): Promise<R>
  get<R = FexiosResponse>(url: string, config?: FexiosRequestConfig): Promise<R>
  delete<R = FexiosResponse>(url: string, config?: FexiosRequestConfig): Promise<R>
  head<R = FexiosResponse>(url: string, config?: FexiosRequestConfig): Promise<R>
  options<R = FexiosResponse>(url: string, config?: FexiosRequestConfig): Promise<R>
  post<R = FexiosResponse>(url: string, data?: any, config?: FexiosRequestConfig): Promise<R>
  put<R = FexiosResponse>(url: string, data?: any, config?: FexiosRequestConfig): Promise<R>
  patch<R = FexiosResponse>(url: string, data?: any, config?: FexiosRequestConfig): Promise<R>
}

export interface FexiosStatic extends FexiosInstance {
  create(config?: FexiosRequestConfig): FexiosInstance
  isCancel(value: any): boolean
  all<T>(values: (T | Promise<T>)[]): Promise<T[]>
  spread<T, R>(callback: (...args: T[]) => R): (array: T[]) => R
  isFexiosError(payload: any): payload is FexiosError
}

declare const fexios: FexiosStatic

export default fexios
