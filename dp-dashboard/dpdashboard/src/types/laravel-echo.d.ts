declare module 'laravel-echo' {
  import type { Channel } from 'pusher-js'
  export default class Echo<T extends string = string> {
    constructor(options: Record<string, unknown>)
    private(channel: string): Channel & { notification(callback: (payload: unknown) => void): void }
    disconnect(): void
    leave(channel: string): void
  }
}
