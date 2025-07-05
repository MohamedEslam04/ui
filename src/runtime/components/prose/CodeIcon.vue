<script lang="ts">
import theme from '#build/ui/prose/code-icon'
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types'

type ProseCodeIcon = ComponentConfig<typeof theme, AppConfig, 'codeIcon', 'ui.prose'>
export interface ProseCodeIconProps {
  icon?: string
  filename?: string
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { defu } from 'defu'
import { useAppConfig } from '#imports'

const props = defineProps({
  icon: { type: String, required: false },
  filename: { type: String, required: false }
})

const appConfig = useAppConfig() as ProseCodeIcon['AppConfig']

const icons = computed(() => defu(appConfig.ui?.prose?.codeIcon || {}, theme))

// 🛠 Fix TS7053
const iconMap = computed<Record<string, string>>(() => icons.value as Record<string, string>)

const icon = computed(() => {
  if (props.icon) return props.icon
  if (!props.filename) return

  const cleanFilename = props.filename.replace(/\s*\(.*\)\s*$/, '')
  const extension = cleanFilename.includes('.') ? cleanFilename.split('.').pop() : undefined
  const name = cleanFilename.split('/').pop()?.toLowerCase()

  return (name && iconMap.value[name])
    ?? (extension && (iconMap.value[extension] ?? `i-vscode-icons-file-type-${extension}`))
})
</script>

<template>
  <UIcon v-if="icon" :name="icon" />
</template>
