<script lang="ts">
import theme from '#build/ui/page-accordion'
import type { AppConfig } from '@nuxt/schema'
import type { AccordionProps, AccordionSlots, AccordionItem, ComponentConfig } from '../types'

type PageAccordion = ComponentConfig<typeof theme, AppConfig, 'pageAccordion'>

export interface PageAccordionProps<T extends AccordionItem = AccordionItem> extends /** @vue-ignore */ Omit<AccordionProps<T>, 'type'> {
  type?: AccordionProps<T>['type']
  class?: any
  ui?: PageAccordion['slots'] & AccordionProps['ui']
}
export type PageAccordionSlots<T extends AccordionItem = AccordionItem> = AccordionSlots<T & {
  slot?: string
}>
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { omit, transformUI } from '../utils'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'

const props = withDefaults(defineProps<PageAccordionProps>(), {
  type: 'multiple'
})
const slots = defineSlots<PageAccordionSlots>()
const appConfig = useAppConfig() as PageAccordion['AppConfig']
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.pageAccordion || {} })())
</script>

<template>
  <UAccordion :type="type" :unmount-on-hide="false" :class="ui.base({ class: [props.ui?.base, props.class] })" :ui="transformUI(omit(ui, ['base']), props.ui)">
    <template v-for="(_, name) in slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>
  </UAccordion>
</template>
