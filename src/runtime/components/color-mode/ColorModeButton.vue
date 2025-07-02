<script lang="ts">
import type { ButtonProps } from '../../types'

export interface ColorModeButtonProps extends /** @vue-ignore */ Pick<ButtonProps, 'as' | 'size' | 'disabled' | 'ui'> {
  /**
   * @defaultValue 'neutral'
   */
  color?: ButtonProps['color']

  /**
   * @defaultValue 'ghost'
   */
  variant?: ButtonProps['variant']
}

export interface ColorModeButtonSlots {
  fallback(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useColorMode, useAppConfig } from '#imports'
import { useLocalePro } from '../../composables/useLocalePro'

defineOptions({ inheritAttrs: false })

withDefaults(defineProps<ColorModeButtonProps>(), {
  color: 'neutral',
  variant: 'ghost'
})

defineSlots<ColorModeButtonSlots>()

const { t } = useLocalePro()
const colorMode = useColorMode()
const appConfig = useAppConfig()

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set(_isDark) {
    colorMode.preference = _isDark ? 'dark' : 'light'
  }
})
</script>

<template>
  <ClientOnly v-if="!colorMode?.forced">
    <UButton
      :icon="isDark ? appConfig.ui.icons.dark : appConfig.ui.icons.light"
      :color="color"
      :variant="variant"
      :aria-label="isDark ? t('colorMode.switchToLight') : t('colorMode.switchToDark')"
      v-bind="$attrs"
      @click="isDark = !isDark"
    />

    <template #fallback>
      <slot name="fallback">
        <div class="size-8" />
      </slot>
    </template>
  </ClientOnly>
</template>
