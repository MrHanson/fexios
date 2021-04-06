import mergeConfig from '@/core/mergeConfig'

import { FexiosRequestConfig } from 'typings'
class Fexios {
  constructor(instanceConfig: FexiosRequestConfig) {
    this.defaults = instanceConfig
  }

  request(config: FexiosRequestConfig): Promise<any> {
    /**
     * to do:
     * use fetch to request
     */
  }
 
  getUri(config: FexiosRequestConfig): string {
    /**
     * to do:
     * get uri from config
     */
  }

  [k: string]: (url: string, config: any) => Promise<any>
}


['delete','get','head','options','post','put','patch']
  .forEach(function(method) {
    Fexios.prototype[method] = function(url: string, config): Promise<any> {
      return this.request(mergeConfig(config, {
        method: method,
        url: url,
        data: (config || {}).data
      }))
    }
  })


export default Fexios
