import type { Ref } from 'vue'
import { ref } from 'vue'
import { createSharedComposable } from '@vueuse/core'

function _useContentSearch(): {
  open: Ref<boolean>
} {
  const open = ref(false)
  return {
    open
  }
}

export const useContentSearch = /* @__PURE__ */ createSharedComposable(_useContentSearch)
