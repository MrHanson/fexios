import { FexiosInterceptorManager } from 'typings'

interface ResolvedFn<T = any> {
  (val: T): T | Promise<T>
}

interface RejectedFn {
  (error: any): any
}

interface Interceptor<T = any> {
  onFulfilled: ResolvedFn<T>;
  onRejected?: RejectedFn;
}

export default class InterceptorManager<T = any> implements FexiosInterceptorManager<T> {
  interceptors: Array<Interceptor<T> | null>

  constructor() {
    this.interceptors = []
  }

  use(onFulfilled: ResolvedFn<T>, onRejected: RejectedFn): number {
    this.interceptors.push({
      onFulfilled,
      onRejected
    })

    return this.interceptors.length - 1
  }

  eject(id: number): void {
    if (this.interceptors[id]) {
      this.interceptors[id] = null
    }
  }
}