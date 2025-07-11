<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { ButtonProps, ComponentConfig } from '../types'
import type { NuxtError } from '#app'
import theme from '#build/ui/error'

type Error = ComponentConfig<typeof theme, AppConfig, 'error'>
export interface ErrorProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'main'
   */
  as?: any
  error?: Partial<NuxtError & {
    message: string
  }>
  /**
   * The URL to redirect to when the error is cleared.
   * @defaultValue '/'
   */
  redirect?: string
  /**
   * Display a button to clear the error in the links slot.
   * `{ size: 'lg', color: 'primary', variant: 'solid', label: 'Back to home' }`{lang="ts-type"}
   * @defaultValue true
   */
  clear?: boolean | Partial<ButtonProps>
  class?: any
  ui?: Error['slots']
}
export interface ErrorSlots {
  default(props?: {}): any
  statusCode(props?: {}): any
  statusMessage(props?: {}): any
  links(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig, useRouter } from '#imports'
import { useLocalePro } from '../composables/useLocalePro'
import { tv } from '../utils/tv'
import UButton from './Button.vue'

const props = withDefaults(defineProps<ErrorProps>(), {
  as: 'main',
  redirect: '/',
  clear: true,
  error: () => ({} as any)
})
const emit = defineEmits<{
  (e: 'clear'): void
}>()
defineSlots<ErrorSlots>()

const { t } = useLocalePro()
const appConfig = useAppConfig() as Error['AppConfig']
const router = useRouter()

const uiPro = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.error || {} })())

const handleError = () => {
  if (props.error) {
    emit('clear')
  }
  router.push(props.redirect)
}
</script>

<template>
  <Primitive :as="as" :class="uiPro.root({ class: [props.ui?.root, props.class] })">
    <p :class="uiPro.statusCode({ class: props.ui?.statusCode })">
      {{ props.error?.statusCode }}
    </p>
    <h1 v-if="props.error?.statusMessage" :class="uiPro.statusMessage({ class: props.ui?.statusMessage })">
      {{ props.error.statusMessage }}
    </h1>
    <p v-if="props.error?.message && props.error.message !== props.error.statusMessage" :class="uiPro.message({ class: props.ui?.message })">
      {{ props.error?.message }}
    </p>
    <div :class="uiPro.links({ class: props.ui?.links })">
      <UButton
        v-if="clear"
        size="lg"
        color="primary"
        variant="solid"
        :label="t('error.clear')"
        v-bind="typeof clear === 'object' ? clear : {}"
        @click="handleError"
      />
    </div>
  </Primitive>
</template>
