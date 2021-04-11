import { fetchRequest } from './fetchUtil'

import type { FexiosPromise, FexiosRequestConfig } from 'typings'

export default function dispatchRequest(config: FexiosRequestConfig): FexiosPromise {
  return fetchRequest(config)
}
