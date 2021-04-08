import { buildFullPath, buildQsPath } from '@/helpers/utils'
import { warn } from '@/helpers/debug'

import { FexiosRequestConfig, FexiosResponse, ResponseType } from 'typings'

if (!window.fetch) {
  warn('Your browser doesn\'t fetch, maybe u need the polyfill(https://github.com/github/fetch)')
}

export default function fetchUtil(config: FexiosRequestConfig): Promise<FexiosResponse> {
  const {
    url,
    method = 'post',
    baseURL,
    headers: requestHeaders,
    params,
    data,
    timeout = 5000,
    credentials = 'omit'
  } = config

  let finalPath = baseURL ? buildFullPath(baseURL, url) : url
  return new Promise((resolve, reject) => {
    if (!finalPath) {
      reject('parameter requestUrl is missing!')
      return
    }

    if (params) {
      finalPath = buildQsPath(finalPath, params)
    }
    const initConfig = {
      method,
      headers: requestHeaders,
      body: null,
      credentials
    }
    if (!['get', 'headers'].includes(method.toLocaleLowerCase())) initConfig.body = data

    // to do: set timeout for fetch request

    window
      .fetch(finalPath, initConfig)
      .then(oriResponse => {
        const { body, headers, status, statusText } = oriResponse
        
        // format response headers
        const responseHeaders: { [k: string]: string } = {}
        headers.forEach((v, k) => responseHeaders[k] = v)

        const response = {
          data: body,
          status,
          statusText,
          headers: responseHeaders,
          config
        }
        resolve(response)
      })
  })
}