import Fexios from '@/core/Fexios'
import defaults from '@/defaults'

import { FexiosRequestConfig } from 'typings'
/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Fexios} A new instance of Fexios
 */
function createInstance(defaultConfig: FexiosRequestConfig) {
  const context = new Fexios(defaultConfig)
}

const fexios = createInstance(defaults)

fexios.Fexios = Fexios

export default fexios