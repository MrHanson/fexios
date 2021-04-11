import { FexiosRequestConfig } from 'typings'

/**
 * @description Determines whether the specified URL is absolute
 * @param {string} url
 * @returns {boolean}
 */
export function isAbsoluteURL(url?: string): boolean {
  if (!url) return false
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url)
}

/**
 * @description Creates a new URL by combining the specified URLs
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
export function combineURLs(baseURL: string, relativeURL?: string): string {
  return relativeURL
  ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
  : baseURL
}

/**
 * @description Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
 export function buildFullPath(baseURL: string, requestedURL?: string): string {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL)
  }
  return requestedURL || ''
}

/**
 * @description Creates a new URL by combining requestedURL with the query string
 * make sure the requestedURL is the asbolute URL.
 * @param {string} requestedURL
 * @param {object} params the params object need to be converted to query string
 */
export function buildQsPath(requestedURL: string, params?: { [s: string]: string | number }): string {
  const qs = params && Object.entries(params).map(([k, v]) => `${k}=${v}`).join('&')
  return qs ? requestedURL + '?' + qs : requestedURL
}

export function isObject(val: any): boolean {
  return toString.call(val) === '[object Object]'
}

export function deepMerge(...objs: any[]): any {
  const result = Object.create(null)
  function assignValue(val: any, key: string) {
    if (isObject(result[key]) && isObject(val)) {
      result[key] = deepMerge(result[key], val)
    } else if (isObject(val)) {
      result[key] = deepMerge({}, val)
    } else {
      result[key] = val
    }
  }

  for (let i = 0; i < objs.length; i++) {
    const obj = objs[i]
    for (const key in obj) {
      assignValue(obj[key], key)
    }
  }

  return result
}

export function mergeConfig(
  defaultConfig: FexiosRequestConfig = {},
  userConfig: FexiosRequestConfig = {}
): FexiosRequestConfig {
  const config = Object.create(null) // 创建空对象，作为最终的合并结果

  const defaultToUserConfig: Array<keyof FexiosRequestConfig> = [
    'baseURL',
    'transformRequest',
    'transformResponse',
    'timeout',
    'credentials',
    'validateStatus',
  ]
  defaultToUserConfig.forEach(prop => {
    if (typeof userConfig[prop] !== 'undefined') {
      config[prop] = userConfig[prop]
    } else if (typeof defaultConfig[prop] !== 'undefined') {
      config[prop] = defaultConfig[prop]
    }
  })

  const valueFromUserConfig: Array<keyof FexiosRequestConfig> = ['url', 'method', 'headers', 'params', 'data']
  valueFromUserConfig.forEach(prop => {
    if (typeof userConfig[prop] !== 'undefined') config[prop] = userConfig[prop]
  })

  return config
}