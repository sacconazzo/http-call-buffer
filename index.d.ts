declare namespace service {
  export function get(): string
}

declare function service(call: Promise<any>, name: string, refreshTime?: number, log?: boolean): void
export = service
