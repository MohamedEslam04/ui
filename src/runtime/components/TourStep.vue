<script setup lang="ts">
import type { TourStep, TourSlotProps } from './Tour.vue'
import UButton from './Button.vue'
import { useLocale } from '../composables/useLocale'

const props = defineProps<{
  step?: TourStep
  slotProps: TourSlotProps
  totalSteps: number
  ui: any
  close?: boolean | any
  loop?: boolean
}>()

const emits = defineEmits<{
  finish: []
  prev: []
  next: []
}>()

const { t } = useLocale()
</script>

<template>
  <slot name="default" v-bind="slotProps">
    <header :class="ui.header({ class: step?.ui?.header })">
      <div :class="ui.indicator({ class: step?.ui?.indicator })">
        {{ slotProps.index + 1 }} / {{ totalSteps }}
      </div>
      <div class="flex-1 space-y-1">
        <div v-if="step?.title || $slots.title" :class="ui.title({ class: step?.ui?.title })">
          <slot name="title" v-bind="slotProps">
            {{ step?.title }}
          </slot>
        </div>
        <p v-if="step?.description || $slots.description" :class="ui.description({ class: step?.ui?.description })">
          <slot name="description" v-bind="slotProps">
            {{ step?.description }}
          </slot>
        </p>
      </div>
      <UButton
        v-if="close"
        size="xs"
        color="neutral"
        variant="link"
        :class="ui.close({ class: step?.ui?.close })"
        v-bind="(typeof close === 'object' ? close : {})"
        icon="i-lucide-x"
        :aria-label="t('tour.close')"
        @click="emits('finish')"
      />
    </header>

    <div v-if="step?.body || $slots.body" :class="ui.body({ class: step?.ui?.body })">
      <slot name="body" v-bind="slotProps">
        {{ step?.body }}
      </slot>
    </div>

    <footer :class="ui.footer({ class: step?.ui?.footer })">
      <slot name="actions" v-bind="slotProps">
        <div :class="ui.controls({ class: step?.ui?.controls })">
          <UButton
            v-if="slotProps.hasPrev"
            size="xs"
            color="neutral"
            variant="ghost"
            :disabled="!slotProps.hasPrev"
            :class="ui.prev({ class: step?.ui?.prev })"
            @click="emits('prev')"
          >
            {{ step?.prevLabel || t('tour.previous') }}
          </UButton>
          <UButton
            size="xs"
            color="primary"
            :class="ui.next({ class: step?.ui?.next })"
            @click="emits('next')"
          >
            {{ slotProps.hasNext || props.loop || slotProps.step?.nextLabel
              ? (step?.nextLabel || t('tour.next'))
              : (step?.finishLabel || t('tour.finish')) }}
          </UButton>
        </div>
      </slot>
    </footer>
  </slot>
</template>
