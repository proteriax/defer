export { Deferred as Defer }

export interface Deferred<T> extends Promise<T> {
  [Symbol.toStringTag]: "Promise"
  resolve: (value?: T | PromiseLike<T>) => void
  reject: (reason?: any) => void
}

export class Deferred<T = void> implements Promise<T> {
  public status: Status = Status.Pending
  public value?: T
  public error?: any

  constructor() {
    const promise = new Promise<T>((resolve, reject) => {
      this.resolve = async raw => {
        const value = await raw
        this.status = Status.Resolved
        this.value = value
        resolve(value!)
      }
      this.reject = reason => {
        this.status = Status.Rejected
        this.error = reason
        reject(reason)
      }
    })
    this.then = promise.then.bind(promise)
    this.catch = promise.catch.bind(promise)
    this.finally = promise.finally.bind(promise)
  }
}

export type Status = "Pending" | "Resolved" | "Rejected"

export const Status = {
  Pending: "Pending" as const,
  Resolved: "Resolved" as const,
  Rejected: "Rejected" as const,
}
