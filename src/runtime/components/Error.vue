<script lang="ts">
import type { NuxtError } from '#app'
import type { ClassValue } from 'tailwind-variants'
import type { ButtonProps } from './Button.vue'

export interface ErrorProps {
  as?: any
  error?: Partial<NuxtError<unknown> & { message?: string }>
  redirect?: string
  clear?: boolean | Partial<ButtonProps>
  ui?: {
    root?: ClassValue
    statusCode?: ClassValue
    statusMessage?: ClassValue
    message?: ClassValue
    links?: ClassValue
  }
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { defu } from 'defu'
import { useAppConfig, clearError } from '#imports'

const props = withDefaults(defineProps<ErrorProps>(), {
  as: 'main',
  redirect: '/',
  clear: true
})

const appConfig = useAppConfig()

const ui = computed(() => defu({}, props.ui, (appConfig.ui as any).error.slots))

const button = computed<ButtonProps | undefined>(() => {
  if (!props.clear) {
    return undefined
  }
  const defaults: Partial<ButtonProps> = { size: 'lg', color: 'primary', variant: 'solid', label: 'Back to home' }
  if (typeof props.clear === 'boolean') {
    return defaults as ButtonProps
  }
  return defu(props.clear, defaults) as ButtonProps
})

function onClearError() {
  clearError({ redirect: props.redirect })
}
</script>

<template>
  <component :is="as" v-if="error" :class="ui.root">
    <div class="flex flex-col">
      <slot name="statusCode">
        <p v-if="error.statusCode" :class="ui.statusCode">
          {{ error.statusCode }}
        </p>
      </slot>
      <slot name="statusMessage">
        <p v-if="error.statusMessage" :class="ui.statusMessage">
          {{ error.statusMessage }}
        </p>
      </slot>
      <slot>
        <p v-if="error.message" :class="ui.message">
          {{ error.message }}
        </p>
      </slot>
      <slot name="links">
        <div v-if="clear" :class="ui.links">
          <UButton v-bind="button" @click="onClearError" />
        </div>
      </slot>
    </div>
  </component>
</template>
