<script lang="ts">
import type { AvatarProps, ButtonProps } from '../types'

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

const handleActionClick = (e: MouseEvent, action: any) => {
  if (action.onClick) {
    action.onClick(e, props)
  }
}

// Simple class computation
const rootClasses = computed(() => [
  'group/message relative w-full',
  props.compact ? 'scroll-mt-3' : 'scroll-mt-4 sm:scroll-mt-6',
  props.class
])

const containerClasses = computed(() => [
  'relative flex items-start group-data-[role=user]/message:max-w-[75%]',
  props.side === 'right' ? 'ltr:justify-end ms-auto' : 'rtl:justify-end',
  props.compact ? 'gap-1.5 pb-3' : 'gap-3 pb-8',
  hasActions.value && props.compact ? 'pb-8' : ''
])

const contentClasses = computed(() => [
  'relative text-pretty min-w-0',
  props.variant === 'solid' ? 'bg-inverted text-inverted' : '',
  props.variant === 'outline' ? 'bg-default ring ring-default' : '',
  props.variant === 'soft' ? 'bg-elevated/50' : '',
  props.variant === 'subtle' ? 'bg-elevated/50 ring ring-default' : '',
  props.variant !== 'naked' && !props.compact ? 'px-4 py-3 rounded-lg min-h-12' : '',
  props.variant !== 'naked' && props.compact ? 'px-2 py-1 rounded-lg min-h-8' : ''
])

const leadingClasses = computed(() => [
  'inline-flex items-center justify-center min-h-6',
  props.variant !== 'naked' && !props.compact ? 'mt-2' : '',
  props.variant !== 'naked' && props.compact ? 'mt-1' : ''
])

const actionsClasses = computed(() => [
  'opacity-0 group-hover/message:opacity-100 absolute bottom-0 flex items-center transition-opacity',
  props.side === 'left' && hasLeading.value && !props.compact ? 'left-11' : '',
  props.side === 'left' && hasLeading.value && props.compact ? 'left-6.5' : ''
])
</script>

<template>
  <Primitive :id="id" :as="as" :data-role="role" :class="rootClasses">
    <div :class="containerClasses">
      <slot name="leading" :avatar="avatar">
        <div v-if="hasLeading" :class="leadingClasses">
          <UIcon v-if="icon" :name="icon" :class="props.compact ? 'size-5' : 'size-8'" />
          <UAvatar v-else-if="avatar" :size="props.compact ? '2xs' : 'md'" v-bind="avatar" class="shrink-0" />
        </div>
      </slot>

      <slot name="content" :content="content">
        <div :class="contentClasses">
          {{ content }}
        </div>
      </slot>

      <slot name="actions" :actions="actions">
        <div v-if="hasActions" :class="actionsClasses">
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
