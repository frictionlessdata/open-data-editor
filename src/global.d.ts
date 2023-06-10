declare module '*.jpg' {
  export default '' as string
}

declare module '*.png' {
  export default '' as string
}

declare module '*.yaml' {
  const data: any
  export default data
}

declare module 'dirty-json' {
  function parse(value: string): any
  export default { parse }
}
