<script setup lang="ts">
import { splitByCase, upperFirst } from 'scule'
import { useRouter } from 'vue-router'
import { reactive, ref } from 'vue'
import { useColorMode } from '@vueuse/core'

const appConfig = useAppConfig()
const mode = useColorMode()

appConfig.toaster = reactive({
  position: 'bottom-right' as const,
  expand: true,
  duration: 5000
})

const router = useRouter()

const components = [
  'accordion',
  'alert',
  'avatar',
  'badge',
  'breadcrumb',
  'button-group',
  'button',
  'calendar',
  'card',
  'carousel',
  'checkbox-group',
  'checkbox',
  'chip',
  'collapsible',
  'color-picker',
  'command-palette',
  'context-menu',
  'drawer',
  'dropdown-menu',
  'file-upload',
  'form',
  'form-field',
  'form',
  'input-menu',
  'input-number',
  'input-tags',
  'input',
  'kbd',
  'link',
  'modal',
  'navigation-menu',
  'pagination',
  'pin-input',
  'popover',
  'progress',
  'radio-group',
  'select-menu',
  'select',
  'separator',
  'shortcuts',
  'skeleton',
  'slideover',
  'slider',
  'stepper',
  'switch',
  'table',
  'tabs',
  'textarea',
  'timeline',
  'toast',
  'tooltip',
  'tree'
]

const proComponents = [
  'auth-form',
  'banner',
  'blog-post',
  'blog-posts',
  'changelog-version',
  'changelog-versions',
  'chat-message',
  'chat-messages',
  'chat-palette',
  'chat-prompt-submit',
  'chat-prompt',
  'dashboard',
  'error',
  'footer-columns',
  'footer',
  'header',
  'main',
  'page-accordion',
  'page-anchors',
  'page-aside',
  'page-body',
  'page-card',
  'page-columns',
  'page-cta',
  'page-feature',
  'page-grid',
  'page-header',
  'page-hero',
  'page-links',
  'page-list',
  'page-logos',
  'page-marquee',
  'page-section',
  'page',
  'pricing-plan',
  'pricing-plans',
  'pricing-table',
  'user'
]

const items = [...components, ...proComponents].sort().map(component => ({
  label: upperName(component),
  to: `/components/${component}`,
  pro: proComponents.includes(component)
}))

function upperName(name: string) {
  return splitByCase(name)
    .map(p => upperFirst(p))
    .join('')
}

const isCommandPaletteOpen = ref(false)

function onSelect(item: any) {
  router.push(item.to)
}

defineShortcuts({
  meta_k: () => (isCommandPaletteOpen.value = true)
})
</script>

<template>
  <UApp :toaster="appConfig.toaster as any">
    <div class="h-screen w-screen overflow-hidden flex min-h-0 bg-default" data-vaul-drawer-wrapper>
      <!-- Vertical Navigation Menu -->
      <UNavigationMenu
        :items="items"
        orientation="vertical"
        class="hidden lg:flex border-e border-default overflow-y-auto w-fit p-4"
      >
        <template #item="{ item }">
          <div class="flex items-center gap-2">
            <span>{{ item.label }}</span>
            <sup v-if="item.pro" class="text-success">Pro</sup>
          </div>
        </template>
      </UNavigationMenu>

      <!-- Horizontal Navigation Menu -->
      <UNavigationMenu
        :items="items"
        orientation="horizontal"
        class="lg:hidden border-b border-default [&>div]:min-w-min overflow-x-auto"
      >
        <template #item="{ item }">
          <div class="flex items-center gap-2">
            <span>{{ item.label }}</span>
            <sup v-if="item.pro" class="text-success">Pro</sup>
          </div>
        </template>
      </UNavigationMenu>

      <div class="fixed top-15 lg:top-3 end-4 flex items-center gap-2">
        <UButton
          :icon="mode === 'dark' ? 'i-lucide-moon' : 'i-lucide-sun'"
          color="neutral"
          variant="ghost"
          :aria-label="`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`"
          @click="mode = mode === 'dark' ? 'light' : 'dark'"
        />
      </div>

      <div class="flex-1 flex flex-col items-center justify-around overflow-y-auto w-full py-14 px-4">
        <Suspense>
          <RouterView />
        </Suspense>
      </div>
    </div>

    <UModal v-model:open="isCommandPaletteOpen" class="sm:h-96">
      <template #content>
        <UCommandPalette
          placeholder="Search a component..."
          :groups="[{ id: 'items', items }]"
          :fuse="{ resultLimit: 100 }"
          @update:model-value="onSelect"
          @update:open="(value) => (isCommandPaletteOpen = value)"
        />
      </template>
    </UModal>
  </UApp>
</template>
