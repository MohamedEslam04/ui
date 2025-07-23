import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

type UseQuerySectionOptions = {
  key?: string
  offset?: number
  behavior?: ScrollBehavior
  autoScroll?: boolean
  clearQuery?: boolean
}

export const useQuerySection = (options: UseQuerySectionOptions = {}) => {
  const router = useRouter()
  const route = useRoute()

  const key = options.key || 'section'
  const offset = options.offset || 0
  const behavior = options.behavior || 'smooth'

  const getSection = (): string | null => {
    return (route.query[key] as string) || null
  }

  const setSection = (section: string) => {
    router.replace({
      query: {
        ...route.query,
        [key]: section
      }
    })
  }

  const clearSection = () => {
    const query = { ...route.query }
    delete query[key]
    router.replace({ query })
  }

  const scrollToSection = (customId?: string) => {
    if (!import.meta.client) return

    const sectionId = customId || getSection()
    if (!sectionId) return

    const el = document.getElementById(sectionId)
    if (!el) return

    const top = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top, behavior })

    if (options.clearQuery) clearSection()
  }

  if (options.autoScroll && import.meta.client) {
    onMounted(() => scrollToSection())
  }

  return {
    setSection,
    getSection,
    clearSection,
    scrollToSection
  }
}
