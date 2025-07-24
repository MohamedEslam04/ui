import type { ContentNavigationItem, ContentCollectionItem } from '@nuxt/content'

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

/** @deprecated Use `findPageHeadline` from Nuxt Content: https://ui.nuxt.com/getting-started/content#findpageheadline to migrate */
export function findPageHeadline(
  navigation?: ContentNavigationItem[],
  page?: ContentCollectionItem | null
): string | undefined {
  if (!navigation?.length || !page) {
    return
  }

  for (const link of navigation) {
    if (link.children) {
      for (const childLink of link.children) {
        if (childLink.path === page.path) {
          return link.title
        }
      }

      const headline = findPageHeadline(link.children, page)
      if (headline) {
        return headline
      }
    }
  }
}

/** @deprecated Use `findPageBreadcrumb` from Nuxt Content: https://ui.nuxt.com/getting-started/content#findpagebreadcrumb to migrate */
export function findPageBreadcrumb(
  navigation?: ContentNavigationItem[],
  page?: ContentCollectionItem | null
): ContentNavigationItem[] {
  if (!navigation?.length || !page) {
    return []
  }

  return navigation.reduce((breadcrumb: ContentNavigationItem[], link) => {
    if (page.path && (page.path + '/').startsWith(link.path + '/')) {
      breadcrumb.push(link)

      if (link.children) {
        breadcrumb.push(...findPageBreadcrumb(link.children, page))
      }
    }
    return breadcrumb
  }, [])
}
