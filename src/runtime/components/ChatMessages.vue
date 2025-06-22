<script lang="ts">
import type { ChatMessageProps, ComponentConfig } from '../types'
import theme from '#build/ui/chat-messages'
import type { AppConfig } from '@nuxt/schema'

export type ChatMessages = ComponentConfig<typeof theme, AppConfig, 'chat-messages'>
export interface ChatMessagesProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * Array of messages to display.
   */
  messages?: ChatMessageProps[]
  /**
   * Render messages in a compact style.
   * @defaultValue false
   */
  compact?: boolean
  class?: any
  ui?: ChatMessages['slots']
}

export interface ChatMessagesSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'
import UChatMessage from './ChatMessage.vue'

const props = withDefaults(defineProps<ChatMessagesProps>(), {
  as: 'section',
  compact: false
})

const appConfig = useAppConfig() as ChatMessages['AppConfig']

const ui = computed(() =>
  tv({ extend: tv(theme), ...(appConfig.ui?.['chat-messages'] || {}) })({
    compact: props.compact
  })
)
</script>

<template>
  <Primitive :as="as" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <slot>
      <UChatMessage
        v-for="message in messages"
        :key="message.id"
        v-bind="message"
        :compact="compact"
      >
        <template #content="slotProps">
          <slot name="content" v-bind="{ ...slotProps, message }">
            {{ message.content }}
          </slot>
        </template>
      </UChatMessage>
    </slot>
  </Primitive>
</template>
