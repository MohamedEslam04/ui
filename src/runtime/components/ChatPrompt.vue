<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { Primitive, useForwardProps } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import { omit } from '@nuxt/ui/utils'
import { useAppConfig } from '#imports'
import { useLocalePro } from '../composables/useLocalePro'
import { transformUI } from '../utils'
import { tv } from '../utils/tv'
import theme from '#build/ui/chat-prompt'

import type { AppConfig } from '@nuxt/schema'
import type { TextareaProps, TextareaSlots, ComponentConfig } from '@nuxt/ui'

type ChatPrompt = ComponentConfig<typeof theme, AppConfig, 'chatPrompt'>

export interface ChatPromptProps extends Pick<TextareaProps, 'autofocusDelay' | 'autoresizeDelay' | 'maxrows' | 'icon' | 'avatar' | 'loading' | 'loadingIcon'> {
  as?: any // Consider specifying a more precise type (e.g., string | Component)
  placeholder?: string
  autofocus?: TextareaProps['autofocus']
  autoresize?: TextareaProps['autoresize']
  rows?: TextareaProps['rows']
  variant?: ChatPrompt['variants']['variant']
  error?: Error
  class?: any // Consider using `string | string[] | Record<string, boolean>`
  ui?: Partial<ChatPrompt['slots']> & Partial<TextareaProps['ui']>
}

export interface ChatPromptEmits {
  (e: 'close', event: Event): void
  (e: 'submit', event: Event): void
  (e: 'update:modelValue', value: string): void
}

export interface ChatPromptSlots extends TextareaSlots {
  header?: (props?: Record<string, never>) => any
  footer?: (props?: Record<string, never>) => any
}

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<ChatPromptProps>(), {})

const emits = defineEmits<{
  'submit': [event: Event]
  'close': [event: Event]
  'update:modelValue': [value: string]
}>()

const slots = defineSlots<ChatPromptSlots>()
const model = defineModel<string>({ default: '' })
const { t } = useLocalePro()
const appConfig = useAppConfig()

const textareaProps = useForwardProps(reactivePick(props, 'autofocus', 'autoresize', 'rows'))
const proxySlots = omit(slots, ['header', 'footer'])
const ui = computed(() =>
  tv({ extend: tv(theme), ...appConfig.ui?.chatPrompt || {} })({ variant: props.variant })
)

const textarea = useTemplateRef('textarea')

const submit = (e: Event) => {
  if (!model.value?.trim()) return
  emits('submit', e)
}

const blur = (e: Event) => {
  textarea.value?.textareaRef?.blur()
  emits('close', e)
}

defineExpose({ textareaRef: textarea.value?.textareaRef })
</script>

<template>
  <Primitive
    :as="as"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    @submit.prevent="submit"
  >
    <div v-if="slots.header" :class="ui.header({ class: props.ui?.header })">
      <slot name="header" />
    </div>

    <UTextarea
      ref="textarea"
      v-model="model"
      :placeholder="placeholder || t('chatPrompt.placeholder')"
      :disabled="!!error"
      variant="none"
      v-bind="{ ...textareaProps, ...$attrs }"
      :ui="transformUI(omit(ui, ['root', 'body', 'header', 'footer']), props.ui)"
      :class="ui.body({ class: props.ui?.body })"
      @keydown.enter.exact.prevent="submit"
      @keydown.esc="blur"
    >
      <template v-for="(_, name) in proxySlots" #[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>
    </UTextarea>

    <div v-if="slots.footer" :class="ui.footer({ class: props.ui?.footer })">
      <slot name="footer" />
    </div>
  </Primitive>
</template>
