<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue'
import { useEventListener } from '@vueuse/core'
import type { ReferenceElement } from 'reka-ui'

const props = defineProps<{
  reference?: ReferenceElement
  class?: any
}>()

const highlightRect = ref<{ left: number, top: number, width: number, height: number }>()

function hasRect(target?: ReferenceElement): target is ReferenceElement & { getBoundingClientRect: () => DOMRect } {
  return !!target && typeof (target as any).getBoundingClientRect === 'function'
}

function updateHighlight() {
  if (typeof window === 'undefined' || !hasRect(props.reference)) {
    highlightRect.value = undefined
    return
  }

  const rect = props.reference.getBoundingClientRect()

  // outline-offset-2 in Tailwind equals 8px (0.5rem)
  // We need to expand the overlay to account for the outline offset
  const outlineOffset = 8

  // For position: fixed, use viewport coordinates directly (no scroll offset needed)
  // Adjust dimensions and position to account for outline-offset so the outline is fully visible
  highlightRect.value = {
    left: rect.left - outlineOffset,
    top: rect.top - outlineOffset,
    width: rect.width + (outlineOffset * 2),
    height: rect.height + (outlineOffset * 2)
  }
}

useEventListener(() => window, 'resize', updateHighlight)
useEventListener(() => window, 'scroll', updateHighlight, { passive: true })

watch(() => props.reference, () => {
  nextTick(updateHighlight)
}, { immediate: true })

onMounted(() => {
  updateHighlight()
})
</script>

<template>
  <div
    v-if="highlightRect"
    :style="{
      position: 'fixed',
      left: `${highlightRect.left}px`,
      top: `${highlightRect.top}px`,
      width: `${highlightRect.width}px`,
      height: `${highlightRect.height}px`,
      pointerEvents: 'none',
      zIndex: 2147483646
    }"
    :class="props.class"
  />
</template>
