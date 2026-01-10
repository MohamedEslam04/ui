<script lang="ts">
import type { PopoverRootProps, PopoverRootEmits, PopoverContentProps, PopoverContentEmits, PopoverArrowProps, ReferenceElement } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/tour'
import type { ButtonProps } from '../types'
import type { EmitsToProps } from '../types/utils'
import type { ComponentConfig } from '../types/tv'

type Tour = ComponentConfig<typeof theme, AppConfig, 'tour'>

export type TourTarget = ReferenceElement | string | null | undefined | (() => ReferenceElement | null | undefined)

export interface TourStep {
  target: TourTarget
  title?: string
  description?: string
  body?: string
  /**
   * Customize the popover content props for this step.
   */
  content?: Omit<PopoverContentProps, 'as' | 'asChild' | 'forceMount'> & Partial<EmitsToProps<PopoverContentEmits>>
  /**
   * Display an arrow alongside the tour content.
   * @defaultValue true
   */
  arrow?: boolean | Omit<PopoverArrowProps, 'as' | 'asChild'>
  /**
   * When `false`, the tour step will not close when clicking outside or pressing escape.
   * @defaultValue inherit from Tour props
   */
  dismissible?: boolean
  /**
   * Labels for the navigation buttons.
   */
  nextLabel?: string
  prevLabel?: string
  finishLabel?: string
  class?: any
  ui?: Partial<Tour['slots']>
}

export interface TourProps extends Pick<PopoverRootProps, 'open' | 'defaultOpen' | 'modal'> {
  steps: TourStep[]
  /**
   * The initial step index when the tour opens.
   * @defaultValue 0
   */
  initialStep?: number
  /**
   * The controlled step index.
   */
  step?: number
  /**
   * Loop back to the first step when reaching the end.
   * @defaultValue false
   */
  loop?: boolean
  /**
   * Render the tour in a portal.
   * @defaultValue true
   */
  portal?: boolean | string | HTMLElement
  /**
   * When `false`, the tour will not close when clicking outside or pressing escape.
   * @defaultValue true
   */
  dismissible?: boolean
  /**
   * Display an arrow alongside the tour content.
   * @defaultValue true
   */
  arrow?: boolean | Omit<PopoverArrowProps, 'as' | 'asChild'>
  /**
   * Customize the popover content props shared across steps.
   */
  content?: Omit<PopoverContentProps, 'as' | 'asChild' | 'forceMount'> & Partial<EmitsToProps<PopoverContentEmits>>
  /**
   * Show a close action in the footer.
   * @defaultValue true
   */
  close?: boolean | ButtonProps
  class?: any
  ui?: Tour['slots']
}

export interface TourEmits extends PopoverRootEmits {
  'update:step': [number]
  'next': [number]
  'prev': [number]
  'finish': []
}

export interface TourSlots {
  default(props: TourSlotProps): any
  title(props: TourSlotProps): any
  description(props: TourSlotProps): any
  body(props: TourSlotProps): any
  footer(props: TourSlotProps): any
  actions(props: TourSlotProps): any
}

export interface TourSlotProps {
  index: number
  step: TourStep | undefined
  hasNext: boolean
  hasPrev: boolean
  next: () => void
  prev: () => void
  finish: () => void
  goTo: (index: number) => void
}
</script>

<script setup lang="ts">
import { computed, ref, watchEffect, toValue, toRef } from 'vue'
import { defu } from 'defu'
import { useVModel } from '@vueuse/core'
import { Popover } from 'reka-ui/namespaced'
import { useAppConfig } from '#imports'
import { usePortal } from '../composables/usePortal'
import { tv } from '../utils/tv'
import UTourHighlight from './TourHighlight.vue'
import UTourStep from './TourStep.vue'

const props = withDefaults(defineProps<TourProps>(), {
  initialStep: 0,
  loop: false,
  portal: true,
  dismissible: true,
  arrow: true,
  close: true,
  modal: true
})
const emits = defineEmits<TourEmits>()
const slots = defineSlots<TourSlots>()

const appConfig = useAppConfig() as Tour['AppConfig']

const open = useVModel<TourProps, 'open', 'update:open'>(props, 'open', emits, { defaultValue: props.defaultOpen })
const step = useVModel<TourProps, 'step', 'update:step'>(props, 'step', emits, { defaultValue: props.initialStep })

const portalProps = usePortal(toRef(() => props.portal))

const totalSteps = computed(() => props.steps?.length || 0)
const currentIndex = computed({
  get() {
    const index = step.value ?? 0

    return Math.min(Math.max(index, 0), Math.max(totalSteps.value - 1, 0))
  },
  set(value: number) {
    step.value = Math.min(Math.max(value, 0), Math.max(totalSteps.value - 1, 0))
  }
})

watchEffect(() => {
  if (!totalSteps.value && open.value) {
    open.value = false
  }
})

const currentStep = computed(() => props.steps?.[currentIndex.value])
const hasNext = computed(() => currentIndex.value < totalSteps.value - 1)
const hasPrev = computed(() => currentIndex.value > 0)

const fallbackRef = ref<HTMLElement>()
const reference = computed<ReferenceElement | undefined>(() => {
  if (!open.value) {
    return undefined
  }

  const target = currentStep.value?.target
  const resolved = resolveTarget(target)

  return resolved ?? fallbackRef.value ?? undefined
})

const contentProps = computed(() => defu(
  currentStep.value?.content,
  props.content,
  { side: 'bottom', sideOffset: 12, collisionPadding: 12 }
) as PopoverContentProps)

const arrowProps = computed(() => (currentStep.value?.arrow ?? props.arrow) as PopoverArrowProps | boolean)
const dismissible = computed(() => currentStep.value?.dismissible ?? props.dismissible)
// When modal is true, we should also prevent dismissal to ensure proper behavior
const shouldPreventDismissal = computed(() => !dismissible.value || props.modal)
const contentEvents = computed(() => {
  if (shouldPreventDismissal.value) {
    const events = ['pointerDownOutside', 'interactOutside', 'escapeKeyDown']

    return events.reduce((acc, curr) => {
      acc[curr] = (e: Event) => {
        e.preventDefault()
      }
      return acc
    }, {} as Record<typeof events[number], (e: Event) => void>)
  }

  return {}
})

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.tour || {}) })({}))

const slotProps = computed<TourSlotProps>(() => ({
  index: currentIndex.value,
  step: currentStep.value,
  hasNext: hasNext.value,
  hasPrev: hasPrev.value,
  next,
  prev,
  finish,
  goTo
}))

function resolveTarget(target?: TourTarget) {
  const value = toValue(target) as TourTarget

  if (!value || typeof window === 'undefined') {
    return undefined
  }

  if (typeof value === 'string') {
    const direct = document.querySelector(value) as ReferenceElement | null

    if (direct) {
      return direct
    }

    const selector = value.startsWith('#') || value.startsWith('.') ? value : `#${value}`

    return document.querySelector(selector) as ReferenceElement | null
  }

  if (typeof value === 'function') {
    return value() ?? undefined
  }

  return value ?? undefined
}

function goTo(index: number) {
  currentIndex.value = index
  open.value = true
}

function next() {
  if (hasNext.value) {
    currentIndex.value += 1
    emits('next', currentIndex.value)
    return
  }

  // If loop is enabled OR if there's a custom nextLabel on the last step, restart the tour
  if (props.loop || currentStep.value?.nextLabel) {
    currentIndex.value = 0
    emits('next', currentIndex.value)
    return
  }

  finish()
}

function prev() {
  if (hasPrev.value) {
    currentIndex.value -= 1
    emits('prev', currentIndex.value)
  }
}

function finish() {
  open.value = false
  emits('finish')
}

defineExpose({
  next,
  prev,
  finish,
  goTo
})
</script>

<template>
  <Popover.Root v-if="totalSteps > 0" v-model:open="open" :modal="props.modal">
    <Popover.Trigger as-child :reference="reference">
      <span ref="fallbackRef" aria-hidden="true" />
    </Popover.Trigger>

    <Teleport :to="portalProps.to || 'body'" :disabled="portalProps.disabled">
      <UTourHighlight
        v-if="open"
        :reference="reference"
        :class="ui.highlight({ class: (currentStep?.ui)?.highlight })"
      />
    </Teleport>

    <Popover.Portal v-bind="portalProps">
      <Popover.Content
        data-slot="content"
        v-bind="contentProps"
        :class="ui.content({ class: [props.class, currentStep?.class, currentStep?.ui?.content] })"
        v-on="contentEvents"
      >
        <UTourStep
          :step="currentStep"
          :slot-props="slotProps"
          :total-steps="totalSteps"
          :ui="ui"
          :close="props.close"
          :loop="props.loop"
          @finish="finish"
          @next="next"
          @prev="prev"
        >
          <template v-for="slotName in (Object.keys(slots) as Array<keyof TourSlots>)" :key="slotName" #[slotName]="scope">
            <slot :name="slotName" v-bind="scope" />
          </template>
        </UTourStep>

        <Popover.Arrow v-if="arrowProps" v-bind="arrowProps === true ? {} : arrowProps" data-slot="arrow" :class="ui.arrow({ class: currentStep?.ui?.arrow })" />
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>
</template>
