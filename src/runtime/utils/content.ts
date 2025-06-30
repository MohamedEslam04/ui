import type { ContentNavigationItem, ContentCollectionItem } from '@nuxt/content'

type MapContentNavigationItemOptions = {
  labelAttribute?: string
}

type MappedNavigationItem = Omit<ContentNavigationItem, 'title' | 'path'> & {
  label?: string
  to?: string
}

export function mapContentNavigationItem(
  item: ContentNavigationItem,
  options?: MapContentNavigationItemOptions
): MappedNavigationItem {
  const navMap: Record<string, 'label' | 'to'> = {
    [options?.labelAttribute || 'title']: 'label',
    path: 'to'
  }

  return Object.keys(item).reduce((link, key) => {
    const typedKey = key as keyof ContentNavigationItem
    const value = item[typedKey]
    if (value) {
      const mappedKey = navMap[key] || key;
      (link as any)[mappedKey] = value
    }
    return link
  }, {} as MappedNavigationItem)
}

export function mapContentNavigation(
  navigation: ContentNavigationItem[],
  options?: MapContentNavigationItemOptions
): MappedNavigationItem[] {
  return navigation.map(item => mapContentNavigationItem(item, options))
}

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

  return
}

export function findPageBreadcrumb(
  navigation?: ContentNavigationItem[],
  page?: ContentCollectionItem | null
): ContentNavigationItem[] {
  if (!navigation?.length || !page) {
    return []
  }

  return navigation.reduce<ContentNavigationItem[]>((breadcrumb, link) => {
    if (page.path && (page.path + '/').startsWith(link.path + '/')) {
      breadcrumb.push(link)
      if (link.children) {
        breadcrumb.push(...findPageBreadcrumb(link.children, page))
      }
    }
    return breadcrumb
  }, [])
}
