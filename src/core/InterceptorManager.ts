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
  task: Array<Interceptor<T> | null>

  constructor() {
    this.task = []
  }

  use(onFulfilled: ResolvedFn<T>, onRejected: RejectedFn): number {
    this.task.push({
      onFulfilled,
      onRejected
    })

    return this.task.length - 1
  }

  eject(id: number): void {
    if (this.task[id]) {
      this.task[id] = null
    }
  }
}