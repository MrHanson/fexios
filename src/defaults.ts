import { FexiosRequestConfig } from 'typings'

const defaults: FexiosRequestConfig = {
  timeout: 0,
  headers: {
    'Accept': 'application/json, text/plain, */*'
  },
  transformRequest: [],
  transformResponse: [],

  credentials: 'same-origin',
  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300
  }
}

export default defaults
