import { FexiosRequestConfig, FexiosResponse } from 'typings'

if (!window.fetch) {
  console.warn('⚠️ Your browser doesn\'t fetch, maybe u need the polyfill(https://github.com/github/fetch)')
}

export default function fetch(config: FexiosRequestConfig): Promise<FexiosResponse> {
  const { url, method = 'post', headers, data, timeout = 5000  } = config

  // to do: timeout a fetch request
  return new Promise((resolve, reject) => {
    const reponse = {
      data: {},
      status: 200,
      statusText: 'ok',
      headers: {},
      config
    }

    resolve(reponse)
  })
}