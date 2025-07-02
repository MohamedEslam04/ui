<script lang="ts">
import type { SwitchProps } from '../../../types'

export interface ColorModeSwitchProps extends /** @vue-ignore */ Pick<SwitchProps, 'as' | 'color' | 'size' | 'disabled' | 'ui'> {
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig, useColorMode } from '#imports'
import { useLocalePro } from '../../../composables/useLocalePro'

defineOptions({ inheritAttrs: false })
defineProps({})
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
  <USwitch
    v-model="isDark"
    :checked-icon="appConfig.ui.icons.dark"
    :unchecked-icon="appConfig.ui.icons.light"
    :aria-label="isDark ? t('colorMode.switchToLight') : t('colorMode.switchToDark')"
    v-bind="$attrs"
  />
</template>
