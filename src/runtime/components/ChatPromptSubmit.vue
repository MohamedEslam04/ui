<script lang="ts" setup>
import theme from '#build/ui/chat-prompt-submit'
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { useLocalePro } from '../composables/useLocalePro'
import { transformUI } from '../utils'
import { tv } from '../utils/tv'
import type { AppConfig } from '@nuxt/schema'
import type { ButtonProps, ComponentConfig } from '@nuxt/ui'
import type { UseChatHelpers } from '@ai-sdk/vue'

type ChatPromptSubmit = ComponentConfig<typeof theme, AppConfig, 'chatPromptSubmit'>

export interface ChatPromptSubmitProps extends /** @vue-ignore */ Pick<ButtonProps, 'size' | 'label'> {
  status?: UseChatHelpers['status']['value']
  /**
   * The icon displayed in the button when the status is `ready`.
   * @defaultValue appConfig.ui.icons.arrowUp
   * @IconifyIcon
   */
  icon?: string
  /**
   * The color of the button when the status is `ready`.
   * @defaultValue 'primary'
   */
  color?: ButtonProps['color']
  /**
   * The variant of the button when the status is `ready`.
   * @defaultValue 'solid'
   */
  variant?: ButtonProps['variant']
  /**
   * The icon displayed in the button when the status is `streaming`.
   * @defaultValue appConfig.ui.icons.stop
   * @IconifyIcon
   */
  streamingIcon?: string
  /**
   * The color of the button when the status is `streaming`.
   * @defaultValue 'neutral'
   */
  streamingColor?: ButtonProps['color']
  /**
   * The variant of the button when the status is `streaming`.
   * @defaultValue 'subtle'
   */
  streamingVariant?: ButtonProps['variant']
  /**
   * The icon displayed in the button when the status is `submitted`.
   * @defaultValue appConfig.ui.icons.stop
   * @IconifyIcon
   */
  submittedIcon?: string
  /**
   * The color of the button when the status is `submitted`.
   * @defaultValue 'neutral'
   */
  submittedColor?: ButtonProps['color']
  /**
   * The variant of the button when the status is `submitted`.
   * @defaultValue 'subtle'
   */
  submittedVariant?: ButtonProps['variant']
  /**
   * The icon displayed in the button when the status is `error`.
   * @defaultValue appConfig.ui.icons.reload
   * @IconifyIcon
   */
  errorIcon?: string
  /**
   * The color of the button when the status is `error`.
   * @defaultValue 'error'
   */
  errorColor?: ButtonProps['color']
  /**
   * The variant of the button when the status is `error`.
   * @defaultValue 'soft'
   */
  errorVariant?: ButtonProps['variant']
  ui?: ChatPromptSubmit['slots'] & ButtonProps['ui']
  class?: any
}

export interface ChatPromptSubmitEmits {
  (e: 'stop'): void
  (e: 'reload'): void
}

const props = withDefaults(defineProps<ChatPromptSubmitProps>(), {
  status: 'ready',
  streamingColor: 'neutral',
  streamingVariant: 'subtle',
  submittedColor: 'neutral',
  submittedVariant: 'subtle',
  errorColor: 'error',
  errorVariant: 'soft'
})

const emit = defineEmits<ChatPromptSubmitEmits>()
const slots = defineSlots()
const { t } = useLocalePro()
const appConfig = useAppConfig()

const buttonProps = computed(() => {
  return {
    ready: {
      icon: props.icon || appConfig.ui.icons.arrowUp,
      color: props.color ?? 'primary',
      variant: props.variant ?? 'solid',
      type: 'submit'
    },
    submitted: {
      icon: props.submittedIcon || appConfig.ui.icons.stop,
      color: props.submittedColor,
      variant: props.submittedVariant,
      onClick: () => emit('stop')
    },
    streaming: {
      icon: props.streamingIcon || appConfig.ui.icons.stop,
      color: props.streamingColor,
      variant: props.streamingVariant,
      onClick: () => emit('stop')
    },
    error: {
      icon: props.errorIcon || appConfig.ui.icons.reload,
      color: props.errorColor,
      variant: props.errorVariant,
      onClick: () => emit('reload')
    }
  }[props.status || 'ready']
})

const ui = computed(() =>
  tv({ extend: tv(theme), ...appConfig.ui?.chatPromptSubmit || {} })()
)
</script>

<template>
  <UButton
    :aria-label="t('chatPromptSubmit.label')"
    v-bind="buttonProps"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    :ui="transformUI(ui, props.ui)"
  >
    <template v-for="(_, name) in slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>
  </UButton>
</template>
