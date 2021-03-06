import { buildFullPath, buildQsPath } from '@/helpers/utils'
import { warn } from '@/helpers/debug'

import type { FexiosRequestConfig, FexiosResponse } from 'typings'

if (!window.fetch) {
  warn('Your browser doesn\'t fetch, maybe u need the polyfill(https://github.com/github/fetch)')
}

if (!window.AbortController) {
  warn('Your browser doesn\'t AbortController')
}

interface AbortConfig {
  signal: AbortController['signal']
  abort: AbortController['abort']
}

export function getAbort(abortPath?: string): AbortConfig {
  // use AbortController to cancel fetch request
  const controller = new AbortController()
  const signal = controller.signal
  signal.addEventListener('abort', () => warn(`request ${abortPath || ''} has been canceled`))

  return {
    signal,
    abort: controller.abort
  }
}

export function fetchRequest (config: FexiosRequestConfig, abortConfig?: AbortConfig): Promise<FexiosResponse> {
  const {
    url,
    method = 'get',
    baseURL,
    headers: requestHeaders = {},
    params,
    data,
    timeout = 5000,
    timeoutErrorMessage = 'request timeout!',
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

    const { signal, abort: abortRequest } = abortConfig || getAbort(finalPath)

    const initConfig = {
      method,
      headers: requestHeaders,
      body: null,
      credentials,
      signal
    }

    const lowerCaseMethod = method.toLocaleLowerCase()
    if (['post', 'put', 'patch'].includes(lowerCaseMethod)) {
      initConfig.body = data
      if (!requestHeaders['Content-Type']) initConfig.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }

    let timeoutId: any
    const fetchTask = window.fetch(finalPath, initConfig)
    const timeoutTask = new Promise((_, rj) => {
      timeoutId = setTimeout(function() {
        timeoutId && clearTimeout(timeoutId)
        abortRequest()
        rj(new Error(timeoutErrorMessage))
      }, timeout)
    })

    Promise.race([fetchTask, timeoutTask])
      .then(oriResponse => {
        timeoutId
        const { body, headers, status, statusText } = oriResponse as Response

        // format response headers
        const responseHeaders: { [k: string]: string } = {}
        headers.forEach((v: string, k: string) => responseHeaders[k] = v)

        const response = {
          data: body,
          status,
          statusText,
          headers: responseHeaders,
          config
        }

        const validateStatus = config.validateStatus
        if (!status || !validateStatus || validateStatus(status)) {
          resolve(response)
        } else {
          reject(new Error('Request failded with status code ' + response.status))
        }
      })
      .catch(err => {
        reject(err)
      })
  })
}