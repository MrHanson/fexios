import { FexiosRequestConfig } from 'typings'

const defaults: FexiosRequestConfig = {
  timeout: 0,
  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*'
    },
    transformRequest: [],
    transformResponse: [],
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN'
  }
}

const methodsNoData = ['get', 'head', 'options']
methodsNoData.forEach(method => {
  defaults.headers[method] = {}
})

const forEachMethodWithData = ['post', 'put', 'patch']
forEachMethodWithData.forEach(method => {
  defaults.headers[method] = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

export default defaults
