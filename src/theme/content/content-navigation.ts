import type { ModuleOptions } from '../../module'

export default (options: Required<ModuleOptions>) => {
  const colors = options.theme.colors || []
  const variants = ['pill', 'link'] as const

  const colorVariants = Object.fromEntries(
    colors.map(color => [
      color,
      {
        trigger: `focus-visible:ring-${color}`,
        link: `focus-visible:before:ring-${color}`
      }
    ])
  )

  const highlightColorVariants = Object.fromEntries(
    colors.map(color => [color, ''])
  )

  const compoundVariants = [
    {
      highlight: true,
      level: true,
      class: {
        link: [
          'after:absolute after:-left-1.5 after:inset-y-0.5 after:block after:w-px after:rounded-full',
          'after:transition-colors'
        ]
      }
    },
    ...variants.map(variant => ({
      disabled: false,
      active: false,
      variant,
      class: {
        link: [
          'hover:text-highlighted data-[state=open]:text-highlighted',
          'transition-colors',
          variant === 'pill' ? 'hover:before:bg-elevated/50' : ''
        ].filter(Boolean),
        linkLeadingIcon: [
          'group-hover:text-default group-data-[state=open]:text-default',
          'transition-colors before:transition-colors'
        ]
      }
    })),
    ...colors.flatMap(color => [
      ...variants.map(variant => ({
        color,
        variant,
        active: true,
        class: {
          link: color === 'neutral' ? 'text-highlighted' : `text-${color}`,
          linkLeadingIcon: `${color === 'neutral' ? 'text-highlighted' : `text-${color}`} group-data-[state=open]:${color === 'neutral' ? 'text-highlighted' : `text-${color}`}`
        }
      })),
      {
        highlightColor: color,
        highlight: true,
        level: true,
        active: true,
        class: {
          link: `after:bg-${color === 'neutral' ? 'inverted' : color}`
        }
      }
    ]),
    {
      variant: 'pill',
      active: true,
      highlight: false,
      class: {
        link: 'before:bg-elevated'
      }
    },
    {
      variant: 'pill',
      active: true,
      highlight: true,
      class: {
        link: ['hover:before:bg-elevated/50', 'before:transition-colors']
      }
    }
  ]

  return {
    slots: {
      root: '',
      content: 'data-[state=open]:animate-[accordion-down_200ms_ease-out] data-[state=closed]:animate-[accordion-up_200ms_ease-out] overflow-hidden focus:outline-none',
      list: 'isolate -mx-2.5 -mt-1.5',
      item: '',
      listWithChildren: 'ms-5 border-s border-default',
      itemWithChildren: 'flex flex-col data-[state=open]:mb-1.5',
      trigger: 'font-semibold',
      link: 'group relative w-full px-2.5 py-1.5 before:inset-y-px before:inset-x-0 flex items-center gap-1.5 text-sm before:absolute before:z-[-1] before:rounded-md focus:outline-none focus-visible:outline-none focus-visible:before:ring-inset focus-visible:before:ring-2',
      linkLeadingIcon: 'shrink-0 size-5',
      linkTrailing: 'ms-auto inline-flex gap-1.5 items-center',
      linkTrailingBadge: 'shrink-0',
      linkTrailingBadgeSize: 'sm',
      linkTrailingIcon: 'size-5 transform transition-transform duration-200 shrink-0 group-data-[state=open]:rotate-180',
      linkTitle: 'truncate',
      linkTitleExternalIcon: 'size-3 align-top text-dimmed'
    },
    variants: {
      color: {
        ...colorVariants,
        neutral: {
          trigger: 'focus-visible:ring-inverted',
          link: 'focus-visible:before:ring-inverted'
        }
      },
      highlightColor: {
        ...highlightColorVariants,
        neutral: ''
      },
      variant: Object.fromEntries(variants.map(v => [v, ''])),
      active: {
        true: {
          link: 'font-medium'
        },
        false: {
          link: 'text-muted',
          linkLeadingIcon: 'text-dimmed'
        }
      },
      disabled: {
        true: {
          link: 'cursor-not-allowed opacity-75'
        }
      },
      highlight: {
        true: {}
      },
      level: {
        true: {
          item: 'ps-1.5 -ms-px',
          itemWithChildren: 'ps-1.5 -ms-px'
        }
      }
    },
    compoundVariants,
    defaultVariants: {
      color: 'primary',
      highlightColor: 'primary',
      variant: 'pill'
    }
  }
}
