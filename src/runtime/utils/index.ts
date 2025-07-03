import { isEqual } from 'ohash/utils'

export function pick<Data extends object, Keys extends keyof Data>(data: Data, keys: Keys[]): Pick<Data, Keys> {
  const result = {} as Pick<Data, Keys>

  for (const key of keys) {
    result[key] = data[key]
  }

  return result
}

export function omit<Data extends object, Keys extends keyof Data>(data: Data, keys: Keys[]): Omit<Data, Keys> {
  const result = { ...data }

  for (const key of keys) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete result[key]
  }

  return result as Omit<Data, Keys>
}

export function get(object: Record<string, any> | undefined, path: (string | number)[] | string, defaultValue?: any): any {
  if (typeof path === 'string') {
    path = path.split('.').map((key) => {
      const numKey = Number(key)
      return Number.isNaN(numKey) ? key : numKey
    })
  }

  let result: any = object

  for (const key of path) {
    if (result === undefined || result === null) {
      return defaultValue
    }

    result = result[key]
  }

  return result !== undefined ? result : defaultValue
}

export function set(object: Record<string, any>, path: (string | number)[] | string, value: any): void {
  if (typeof path === 'string') {
    path = path.split('.').map((key) => {
      const numKey = Number(key)
      return Number.isNaN(numKey) ? key : numKey
    })
  }

  path.reduce((acc, key, i) => {
    if (acc[key] === undefined) acc[key] = {}
    if (i === path.length - 1) acc[key] = value
    return acc[key]
  }, object)
}

export function looseToNumber(val: any): any {
  const n = Number.parseFloat(val)
  return Number.isNaN(n) ? val : n
}

export function compare<T>(value?: T, currentValue?: T, comparator?: string | ((a: T, b: T) => boolean)) {
  if (value === undefined || currentValue === undefined) {
    return false
  }

  if (typeof value === 'string') {
    return value === currentValue
  }

  if (typeof comparator === 'function') {
    return comparator(value, currentValue)
  }

  if (typeof comparator === 'string') {
    return get(value!, comparator) === get(currentValue!, comparator)
  }

  return isEqual(value, currentValue)
}

export function isArrayOfArray<A>(item: A[] | A[][]): item is A[][] {
  return Array.isArray(item[0])
}

// Recursively extracts text from slot children
export function getSlotChildrenText(children: any): string {
  if (!children) return ''
  if (typeof children === 'string') return children
  if (Array.isArray(children)) {
    return children.map(getSlotChildrenText).join('')
  }
  if (typeof children === 'object') {
    if (children.children) {
      return getSlotChildrenText(children.children)
    }
    if (typeof children.default === 'function') {
      return getSlotChildrenText(children.default())
    }
  }
  return ''
}

// Transforms a UI object by invoking functions with a `class` prop
// Enhanced transformUI to be safer, clearer, and more flexible
export function transformUI(
  ui: Record<string, ((args: { class?: string }) => any) | any>,
  uiProp?: Record<string, any>
): Record<string, any> {
  const result: Record<string, any> = {}

  for (const key in ui) {
    const uiValue = ui[key]
    const classValue = normalizeClass(uiProp?.[key])

    result[key] = typeof uiValue === 'function' ? uiValue({ class: classValue }) : uiValue
  }

  return result
}

// Normalize class values (e.g. string[], false, null) to string
function normalizeClass(value: unknown): string | undefined {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) return value.filter(Boolean).join(' ')
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  return undefined
}

// Re-export everything from the content module
export * from './content'
