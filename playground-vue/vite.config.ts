import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { compodium } from '@compodium/vue'
import ui from '../src/vite'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    fs: {
      allow: ['..']
    }
  },
  plugins: [
    vue(),
    ui({
      ui: {
        colors: {
          primary: 'green',
          neutral: 'slate'
        }
      },
      autoImport: {
        imports: ['vue']
      },
      components: {
        dirs: ['../playground/app/components']
      }
    }),
    compodium({
      dir: '../playground/compodium',
      includeLibraryCollections: false,

      componentDirs: [
        { path: '../src/runtime/components', prefix: 'U', pathPrefix: false }
      ],
      extras: {
        colors: {
          neutral: 'slate'
        }
      }
    })

  ],
  optimizeDeps: {
    // prevents reloading page when navigating between components
    include: ['@unhead/vue/client', '@iconify/vue', '@internationalized/date', '@vueuse/shared', '@vueuse/integrations/useFuse', '@tanstack/vue-table', 'reka-ui', 'reka-ui/namespaced', 'embla-carousel-vue', 'embla-carousel-autoplay', 'embla-carousel-auto-scroll', 'embla-carousel-auto-height', 'embla-carousel-class-names', 'embla-carousel-fade', 'embla-carousel-wheel-gestures', 'colortranslator', 'tailwindcss/colors', 'tailwind-variants', 'ufo', 'zod', 'vaul-vue']
  }
})
