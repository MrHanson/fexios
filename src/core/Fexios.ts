import mergeConfig from '@/core/mergeConfig'

import InterceptorManager from './InterceptorManager'
import fetchUtil from './fetchUtil'
import { FexiosRequestConfig, FexiosResponse } from 'typings'

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

  request(config: FexiosRequestConfig): Promise<FexiosResponse> {
    config = mergeConfig(this.defaults, config)

    this.interceptors.request.task.forEach(interceptor => {
      console.log(interceptor)
    })

    this.interceptors.response.task.forEach(interceptor => {
      console.log(interceptor)
    })

    return fetchUtil(config)
  }
 
  getUri(config: FexiosRequestConfig): string {
    /**
     * to do:
     * get uri from config
     */
  }

  get(url: string, config?: FexiosRequestConfig): Promise<FexiosResponse> {
  }

  delete(url: string, config?: FexiosRequestConfig): Promise<FexiosResponse> {
  }

  head(url: string, config?: FexiosRequestConfig): Promise<FexiosResponse> {
  }

  options(url: string, config?: FexiosRequestConfig): Promise<FexiosResponse> {
  }

  post(url: string, data?: any, config?: FexiosRequestConfig): Promise<FexiosResponse> {
  }

  put(url: string, data?: any, config?: FexiosRequestConfig): Promise<FexiosResponse> {
  }

  patch(url: string, data?: any, config?: FexiosRequestConfig): Promise<FexiosResponse> {
  }
}

export default Fexios
