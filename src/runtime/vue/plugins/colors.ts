import { computed, watchEffect } from 'vue'
import { useHead } from '@unhead/vue'
import type { Plugin } from 'vue'
import { useAppConfig } from '../composables/useAppConfig'
import { generateColorStyles } from '../../utils/colors'

export default {
  install(app) {
    app.runWithContext(() => {
      const appConfig = useAppConfig()

      const root = computed(() => generateColorStyles(appConfig.ui.colors))

      useHead({
        style: [{
          innerHTML: root,
          tagPriority: -2,
          id: 'nuxt-ui-colors'
        }]
      })

      if (typeof document !== 'undefined') {
        watchEffect(() => {
          let styleEl = document.querySelector('#nuxt-ui-colors-vue') as HTMLStyleElement
          if (!styleEl) {
            styleEl = document.createElement('style')
            styleEl.id = 'nuxt-ui-colors-vue'
            document.head.appendChild(styleEl)
          }
          styleEl.innerHTML = root.value
        })
      }
    })
  }
} satisfies Plugin
