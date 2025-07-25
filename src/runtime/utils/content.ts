import type { ContentNavigationItem } from '@nuxt/content'

type MapContentNavigationItemOptions = {
  labelAttribute?: string
  deep?: number
}

export function mapContentNavigationItem(
  item: ContentNavigationItem,
  options?: MapContentNavigationItemOptions,
  currentDepth = 0
): Omit<ContentNavigationItem, 'title' | 'path'> & {
  label?: string
  to?: string
  children: any[]
} {
  const navMap = {
    [options?.labelAttribute || 'title']: 'label',
    path: 'to'
  }

  const link = Object.keys(item).reduce(
    (link2: any, key) => {
      if (item[key as keyof typeof item]) {
        const mappedKey = navMap[key] || key
        link2[mappedKey] = item[key as keyof typeof item]
      }
      return link2
    },
    {} as Record<string, any>
  )

  const shouldRecurse
    = typeof options?.deep === 'undefined' || currentDepth < options.deep

  if (shouldRecurse && Array.isArray(item.children)) {
    link.children = item.children.map(child =>
      mapContentNavigationItem(child, options, currentDepth + 1)
    )
  } else {
    link.children = []
  }

  return link
}

export function mapContentNavigation(
  navigation: ContentNavigationItem[],
  options?: MapContentNavigationItemOptions
): (Omit<ContentNavigationItem, 'title' | 'path'> & {
  label?: string
  to?: string
  children: any[]
})[] {
  return navigation.map(item => mapContentNavigationItem(item, options))
}

type FindPageOptions = { indexAsChild?: boolean }
export function findPageHeadline(navigation?: ContentNavigationItem[], path?: string | undefined | null, options?: FindPageOptions): string | undefined {
  if (!navigation?.length || !path) {
    return
  }

  for (const link of navigation) {
    if (options?.indexAsChild) {
      if (link.children) {
        const headline = findPageHeadline(link.children, path, options)
        if (headline) {
          return headline
        }
        for (const child of link.children) {
          if (child.path === path) {
            return link.title
          }
        }
      }
    }
    else {
      if (link.children) {
        for (const child of link.children) {
          const isIndex = child.stem?.endsWith('/index')
          if (child.path === path && !isIndex) {
            return link.title
          }
        }
        const headline = findPageHeadline(link.children, path, options)
        if (headline) {
          return headline
        }
      }
    }
  }
}

type FindPageBreadcrumbOptions = { current?: boolean, indexAsChild?: boolean }
export function findPageBreadcrumb(navigation?: ContentNavigationItem[], path?: string | undefined | null, options?: FindPageBreadcrumbOptions): ContentNavigationItem[] {
  if (!navigation?.length || !path) {
    return []
  }

  return navigation.reduce((breadcrumb: ContentNavigationItem[], link: ContentNavigationItem) => {
    if (path && (path + '/').startsWith(link.path + '/')) {
      if (path !== link.path || options?.current || (options?.indexAsChild && link.children)) {
        breadcrumb.push(link)
      }
      if (link.children) {
        breadcrumb.push(...findPageBreadcrumb(link.children.filter(c => c.path !== link.path || (c.path === path && options?.current && options?.indexAsChild)), path, options))
      }
    }
    return breadcrumb
  }, [])
}
