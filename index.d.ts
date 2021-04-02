export interface FexiosTransformer {
  (data: any, headers?: any): any
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
    responseType?: ResponseType
    xsrfCookieName?: string
    xsrfHeaderName?: string
    onUploadProgress?: (progressEvent: any) => void
    onDownloadProgress?: (progressEvent: any) => void
    maxContentLength?: number
    validateStatus?: ((status: number) => boolean) | null
    maxBodyLength?: number
    maxRedirects?: number
    socketPath?: string | null
    httpAgent?: any
    httpsAgent?: any
  }

  export interface FexiosResponse<T = any>  {
    data: T
    status: number
    statusText: string
    headers: any
    config: FexiosRequestConfig
    request?: any
  }
  
  export interface Cancel {
    message: string
  }

  export interface CancelToken {
    promise: Promise<Cancel>
    reason?: Cancel
    throwIfRequested(): void
  }