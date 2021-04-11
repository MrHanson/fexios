import Fexios from '@/core/Fexios'
import defaults from '@/defaults'
import { mergeConfig } from './helpers/utils'

import type { FexiosRequestConfig, FexiosStatic } from 'typings'
/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Fexios} A new instance of Fexios
 */
function createInstance(defaultConfig: FexiosRequestConfig) {
  const context = new Fexios(defaultConfig)
  const fexios = Fexios.prototype.request.bind(context)

  return fexios as FexiosStatic
}

const fexios = createInstance(defaults)

fexios.create = function(config: FexiosRequestConfig) {
  return createInstance(mergeConfig(defaults, config))
}

fexios.all = function(promises) {
  return Promise.all(promises)
}

export default fexios