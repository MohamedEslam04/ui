import type { ModuleOptions } from '../../module'

export default (options: Required<ModuleOptions>) => {
  const colors = options.theme.colors || []

  const colorVariants = Object.fromEntries(
    colors.map(color => [
      color,
      `border border-${color}/25 bg-${color}/10 text-${color}`
    ])
  )

  return {
    base: 'px-1.5 py-0.5 text-sm font-mono font-medium rounded-md inline-block',
    variants: {
      color: {
        ...colorVariants,
        neutral: 'border border-muted text-highlighted bg-muted'
      }
    },
    defaultVariants: {
      color: 'neutral'
    }
  }
}
