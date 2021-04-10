declare type BufferOptions = {
  name: string
  refreshTime: number
  awaitRefresh: boolean
  showLog: boolean
}

declare namespace service {
  export function call(): Promise<any>
}

declare function service(call: Promise<any>, options: BufferOptions) {}
export = service
