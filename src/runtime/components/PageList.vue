<script lang="ts">
import theme from '#build/ui/page-list'

export interface PageListProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  divide?: boolean
  class?: any
}
export interface PageListSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'

const props = defineProps({
  as: { type: null, required: false },
  divide: { type: Boolean, required: false, default: false },
  class: { type: null, required: false }
})
defineSlots()
const appConfig = useAppConfig()
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.uiPro?.pageList || {} }))
</script>

<template>
  <Primitive :as="as" role="list" :class="ui({ class: props.class, divide: props.divide })">
    <slot />
  </Primitive>
</template>
