export function warn(msg: string): void {
  console.warn(
    `%c Fexios warn %c ${msg}`,
    'background:#f90;padding:1px;border-radius:3px;color:#fff',
    'background:transparent'
  )
}

export function error(msg: string): void {
  console.error(
    `%c Fexios warn %c ${msg}`,
    'background:#f90;padding:1px;border-radius:3px;color:#fff',
    'background:transparent'
  )
}