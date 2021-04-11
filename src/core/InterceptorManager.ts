import type { ResolvedFn, RejectedFn, FexiosInterceptorManager } from 'typings'

interface Interceptor<T = any> {
  resolved: ResolvedFn<T>;
  rejected?: RejectedFn;
}

export default class InterceptorManager<T = any> implements FexiosInterceptorManager<T> {
  task: Array<Interceptor<T> | null>

  constructor() {
    this.task = []
  }

  use(resolved: ResolvedFn<T>, rejected: RejectedFn): number {
    this.task.push({
      resolved,
      rejected
    })

    return this.task.length - 1
  }

  eject(id: number): void {
    if (this.task[id]) {
      this.task[id] = null
    }
  }
}