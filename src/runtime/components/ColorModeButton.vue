<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig, useColorMode } from '#imports'
import type { ButtonProps } from './Button.vue'
import type { AppConfig } from '@nuxt/schema'

const props = withDefaults(defineProps<ButtonProps>(), {
  color: 'neutral',
  variant: 'ghost'
})

const appConfig = useAppConfig() as AppConfig & { ui: { icons: { light: string, dark: string } } }
const colorMode = useColorMode()

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set(value) {
    colorMode.preference = value ? 'dark' : 'light'
  }
})

const lightIcon = computed(() => appConfig.ui.icons?.light || 'i-heroicons-sun-20-solid')
const darkIcon = computed(() => appConfig.ui.icons?.dark || 'i-heroicons-moon-20-solid')

const buttonIcon = computed(() => isDark.value ? lightIcon.value : darkIcon.value)
</script>

<template>
  <ClientOnly>
    <UButton
      v-bind="props"
      :icon="buttonIcon"
      :aria-label="`Switch to ${isDark ? 'light' : 'dark'} mode`"
      @click="isDark = !isDark"
    />
    <template #fallback>
      <slot name="fallback">
        <UButton
          v-bind="props"
          loading
        />
      </slot>
    </template>
  </ClientOnly>
</template>
