import { buildFullPath, buildQsPath, mergeConfig } from '@/helpers/utils'

import InterceptorManager from './InterceptorManager'
import dispatchRequest from './dispatchRequest'

import type { FexiosRequestConfig, FexiosResponse, ResolvedFn, FexiosPromise, RejectedFn, Method } from 'typings'

interface RequestTask<T = any> {
  resolved: ResolvedFn<T> | ((config: FexiosRequestConfig) => FexiosPromise)
  rejected?: RejectedFn
}
class Fexios {
  defaults: FexiosRequestConfig
  interceptors: {
    request: InterceptorManager<FexiosRequestConfig>,
    response: InterceptorManager<FexiosResponse>
  }

  constructor(instanceConfig: FexiosRequestConfig) {
    this.defaults = instanceConfig
    this.interceptors = {
      request: new InterceptorManager<FexiosRequestConfig>(),
      response: new InterceptorManager<FexiosResponse>()
    }
  }

  request(config: FexiosRequestConfig): Promise<any> {
    config = mergeConfig(this.defaults, config)

    // to do: expose request cancel method

    const taskArr: RequestTask[] = [{
      resolved: dispatchRequest,
      rejected: undefined
    }]

    this.interceptors.request.task.forEach(interceptor => {
      if (interceptor) {
        taskArr.unshift(interceptor)
      }
    })

    this.interceptors.response.task.forEach(interceptor => {
      if (interceptor) {
        taskArr.push(interceptor)
      }
    })

    let promise = Promise.resolve(config)
    while(taskArr.length) {
      const requestTask = taskArr.shift()
      if (requestTask) {
        const { resolved, rejected } = requestTask
        promise = promise.then(resolved, rejected)
      }
    }

    return promise
  }
 
  getUri(config: FexiosRequestConfig): string {
    config = mergeConfig(this.defaults, config)
    const { baseURL, url, params } = config

    if (!url) return ''
    if (!baseURL) return buildQsPath(url, params)

    const fullPath = buildFullPath(baseURL, url)
    return buildQsPath(fullPath, params)
  }

  get(url: string, config?: FexiosRequestConfig): FexiosPromise {
    return this._requestMethodWithoutData('get', url, config)
  }

  delete(url: string, config?: FexiosRequestConfig): FexiosPromise {
    return this._requestMethodWithoutData('delete', url, config)
  }

  head(url: string, config?: FexiosRequestConfig): FexiosPromise {
    return this._requestMethodWithoutData('head', url, config)
  }

  options(url: string, config?: FexiosRequestConfig): FexiosPromise {
    return this._requestMethodWithoutData('options', url, config)
  }

  post(url: string, data?: any, config?: FexiosRequestConfig): FexiosPromise {
    return this._requestMethodWithData('post', url, data, config)
  }

  put(url: string, data?: any, config?: FexiosRequestConfig): FexiosPromise {
    return this._requestMethodWithData('post', url, data, config)
  }

  patch(url: string, data?: any, config?: FexiosRequestConfig): FexiosPromise {
    return this._requestMethodWithData('post', url, data, config)
  }

  _requestMethodWithoutData(method: Method, url: string, config?: FexiosRequestConfig) {
    return this.request(mergeConfig(config, { method, url }))
  }

  _requestMethodWithData(method: Method, url: string, data?: any, config?: FexiosRequestConfig) {
    return this.request(mergeConfig(config, { method, data, url }))
  }
}

export default Fexios
