<script lang="ts">
import type { AvatarProps, ButtonProps, ComponentConfig } from '../types'
import theme from '#build/ui/chat-message'
import type { AppConfig } from '@nuxt/schema'

export type ChatMessage = ComponentConfig<typeof theme, AppConfig, 'chat-message'>
export interface ChatMessageProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'article'
   */
  as?: any
  /**
   * A unique identifier for the message.
   */
  id?: string
  /**
   * Text content of the message. Use parts when possible.
   */
  content?: string
  /**
   * The 'data' role is deprecated.
   */
  role?: 'data' | 'user' | 'system' | 'assistant'
  /**
   * Icon to display next to the message.
   */
  icon?: string
  /**
   * Avatar to display next to the message.
   */
  avatar?: AvatarProps & { [key: string]: any }
  /**
   * @defaultValue 'naked'
   */
  variant?: 'solid' | 'outline' | 'soft' | 'subtle' | 'naked'
  /**
   * @defaultValue 'left'
   */
  side?: 'right' | 'left'
  /**
   * Display a list of actions under the message. The label will be used in a tooltip. { size: 'xs', color: 'neutral', variant: 'ghost' }
   */
  actions?: (Omit<ButtonProps, 'onClick'> & { onClick?: ((e: MouseEvent, message: any) => void) | undefined })[]
  /**
   * Render the message in a compact style. This is done automatically when used inside a UChatPalette.
   * @defaultValue false
   */
  compact?: boolean
  /**
   * The timestamp of the message.
   */
  createdAt?: Date
  /**
   * Reasoning for the message.
   */
  reasoning?: string
  /**
   * Additional attachments to be sent along with the message.
   */
  experimentalAttachments?: any[]
  /**
   * For data messages.
   */
  data?: null | string | number | false | true | { [value: string]: any } | any[]
  /**
   * Additional message-specific information added on the server via StreamData
   */
  annotations?: any[]
  /**
   * Tool invocations (that can be tool calls or tool results, depending on whether or not the invocation has finished) that the assistant made as part of this message.
   */
  toolInvocations?: any[]
  /**
   * The parts of the message. Use this for rendering the message in the UI.
   */
  parts?: any[]
  class?: any
  ui?: ChatMessage['slots']
}

export interface ChatMessageSlots {
  leading(props?: { avatar: (AvatarProps & { [key: string]: any }) | undefined }): any
  content(props?: { content: string }): any
  actions(props?: { actions: (Omit<ButtonProps, 'onClick'> & { onClick?: ((e: MouseEvent, message: any) => void) | undefined })[] | undefined }): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'
import UButton from './Button.vue'
import UIcon from './Icon.vue'
import UAvatar from './Avatar.vue'

const props = withDefaults(defineProps<ChatMessageProps>(), {
  as: 'article',
  variant: 'naked',
  side: 'left',
  compact: false
})

const hasLeading = computed(() => Boolean(props.icon || props.avatar))
const hasActions = computed(() => Boolean(props.actions && props.actions.length > 0))

const appConfig = useAppConfig() as ChatMessage['AppConfig']

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.chatMessage || {}) })({
  variant: props.variant,
  side: props.side,
  compact: props.compact,
  leading: hasLeading.value,
  actions: hasActions.value
}))

const handleActionClick = (e: MouseEvent, action: any) => {
  if (action.onClick) {
    action.onClick(e, props)
  }
}
</script>

<template>
  <Primitive :id="id" :as="as" :data-role="role" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div :class="ui.container({ class: props.ui?.container })">
      <slot name="leading" :avatar="avatar">
        <div v-if="hasLeading" :class="ui.leading({ class: props.ui?.leading })">
          <UIcon v-if="icon" :name="icon" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
          <UAvatar v-else-if="avatar" :size="ui.leadingAvatarSize()" v-bind="avatar" :class="ui.leadingAvatar({ class: props.ui?.leadingAvatar })" />
        </div>
      </slot>

      <slot name="content" :content="content">
        <div :class="ui.content({ class: props.ui?.content })">
          <slot name="default">
            {{ content }}
          </slot>
        </div>
      </slot>

      <slot name="actions" :actions="actions">
        <div v-if="hasActions" :class="ui.actions({ class: props.ui?.actions })">
          <UButton
            v-for="action in actions"
            :key="action.label"
            v-bind="action"
            :size="action.size || 'xs'"
            :color="action.color || 'neutral'"
            :variant="action.variant || 'ghost'"
            @click="(e) => handleActionClick(e, action)"
          />
        </div>
      </slot>
    </div>
  </Primitive>
</template>
