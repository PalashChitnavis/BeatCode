const timestamp = () => new Date().toISOString()

export const logger = {
  info:  (msg: string, ...args: unknown[]) => console.log(`[INFO]  [${timestamp()}]`, msg, ...args),
  warn:  (msg: string, ...args: unknown[]) => console.warn(`[WARN]  [${timestamp()}]`, msg, ...args),
  error: (msg: string, ...args: unknown[]) => console.error(`[ERROR] [${timestamp()}]`, msg, ...args),
  debug: (msg: string, ...args: unknown[]) => console.log(`[DEBUG] [${timestamp()}]`, msg, ...args),
}