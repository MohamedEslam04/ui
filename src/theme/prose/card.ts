import type { ModuleOptions } from '../../module'

export default (options: Required<ModuleOptions>) => {
  const colors = options.theme.colors || []

  const colorVariants = Object.fromEntries(
    colors.map(color => [
      color,
      {
        icon: `text-${color}`
      }
    ])
  )

  const compoundColorVariants = colors.map(color => ({
    color,
    to: true,
    class: {
      base: `hover:bg-${color}/10 hover:border-${color}`,
      externalIcon: `group-hover:text-${color}`
    }
  }))

  return {
    slots: {
      base: [
        'group relative block my-5 p-4 sm:p-6 border border-default rounded-md bg-default',
        'transition-colors'
      ],
      icon: 'size-6 mb-2 block',
      title: 'text-highlighted font-semibold',
      description: 'text-[15px] text-muted *:first:mt-0 *:last:mb-0 *:my-1',
      externalIcon: [
        'size-4 align-top absolute right-2 top-2 text-dimmed pointer-events-none',
        'transition-colors'
      ]
    },
    variants: {
      color: {
        ...colorVariants,
        neutral: {
          icon: 'text-highlighted'
        }
      },
      to: {
        true: ''
      },
      title: {
        true: {
          description: 'mt-1'
        }
      }
    },
    compoundVariants: [
      ...compoundColorVariants,
      {
        color: 'neutral',
        to: true,
        class: {
          base: 'hover:bg-elevated/50 hover:border-inverted',
          externalIcon: 'group-hover:text-highlighted'
        }
      }
    ],
    defaultVariants: {
      color: 'primary'
    }
  }
}
