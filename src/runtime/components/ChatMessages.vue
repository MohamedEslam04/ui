<script lang="ts">
import type { ChatMessageProps } from './ChatMessage.vue'

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
}

export interface ChatMessagesSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import UChatMessage from './ChatMessage.vue'

const props = withDefaults(defineProps<ChatMessagesProps>(), {
  as: 'div',
  compact: false
})

const rootClasses = computed(() => [
  'flex flex-col',
  props.compact ? 'gap-2' : 'gap-4',
  props.class
])
</script>

<template>
  <Primitive :as="as" :class="rootClasses">
    <slot>
      <UChatMessage
        v-for="message in messages"
        :key="message.id || message.content"
        v-bind="message"
        :compact="compact"
      />
    </slot>
  </Primitive>
</template>
