import { fetchRequest } from './fetchUtil'

import type { FexiosPromise, FexiosRequestConfig, FexiosTransformer } from 'typings'

function transform(
  config: any,
  fns?: FexiosTransformer | FexiosTransformer[]
) {
  if (!fns) {
    return config
  }

  if (!Array.isArray(fns)) {
    fns = [fns]
  }
  fns.forEach(fn => {
    config = fn(config)
  })

  return config
}

export default function dispatchRequest(config: FexiosRequestConfig): FexiosPromise {
  const { transformRequest, transformResponse } = config
  transform(config, transformRequest)
  return fetchRequest(config).then(res => transform(res, transformResponse))
}
