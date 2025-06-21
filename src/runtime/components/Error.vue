<script setup lang="ts">
import { computed } from 'vue'
import type { NuxtError } from '#app'
import { useAppConfig } from '#imports'
import { clearError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const appConfig = useAppConfig()

const ui = computed(() => appConfig.ui.error)

const defaultError = {
  statusCode: 404,
  statusMessage: 'Page not found'
}

const statusCode = computed(() => props.error?.statusCode || defaultError.statusCode)
const title = computed(() => props.error?.statusMessage || defaultError.statusMessage)

const button = computed(() => ({
  label: 'Go back home',
  to: '/',
  size: 'lg',
  color: 'primary',
  ...((appConfig.ui.error as any)?.button || {})
}))

async function onClearError() {
  await clearError({ redirect: button.value.to })
}
</script>

<template>
  <div :class="ui.wrapper">
    <div :class="ui.container">
      <div :class="ui.header">
        <p :class="ui.statusCode">
          {{ statusCode }}
        </p>
      </div>
      <div :class="ui.body">
        <p :class="ui.title">
          {{ title }}
        </p>
        <div :class="ui.separator" />
        <div :class="ui.button">
          <UButton
            v-bind="button"
            @click="onClearError"
          />
        </div>
      </div>
    </div>
  </div>
</template>
