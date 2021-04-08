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
export function buildQsPath(requestedURL: string, params: { [s: string]: string | number }): string {
  const qs = Object.entries(params).map(([k, v]) => `${k}=${v}`).join('&')
  return requestedURL + '?' + qs
}