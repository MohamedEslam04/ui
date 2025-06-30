import type { Ref } from 'vue'
import { ref, watch, onBeforeMount, onBeforeUnmount } from 'vue'

export function useScrollspy(): {
  visibleHeadings: Ref<string[]>
  activeHeadings: Ref<string[]>
  updateHeadings: (headings: Element[]) => void
} {
  const observer = ref<IntersectionObserver | null>(null)
  const visibleHeadings = ref<string[]>([])
  const activeHeadings = ref<string[]>([])

  function observerCallback(entries: IntersectionObserverEntry[]) {
    entries.forEach((entry) => {
      const id = (entry.target as HTMLElement).id
      if (!id) return

      if (entry.isIntersecting) {
        if (!visibleHeadings.value.includes(id)) {
          visibleHeadings.value = [...visibleHeadings.value, id]
        }
      } else {
        visibleHeadings.value = visibleHeadings.value.filter(h => h !== id)
      }
    })
  }

  function updateHeadings(headings: Element[]) {
    headings.forEach((heading) => {
      observer.value?.observe(heading)
    })
  }

  watch(visibleHeadings, (val, oldVal) => {
    activeHeadings.value = val.length === 0 ? oldVal : val
  })

  onBeforeMount(() => {
    observer.value = new IntersectionObserver(observerCallback)
  })

  onBeforeUnmount(() => {
    observer.value?.disconnect()
  })

  return {
    visibleHeadings,
    activeHeadings,
    updateHeadings
  }
}
