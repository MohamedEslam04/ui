<script lang="ts">
import theme from '#build/ui/page-aside'
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../types'

type PageAside = ComponentConfig<typeof theme, AppConfig, 'pageAside'>

export interface PageAsideProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'aside'
   */
  as?: any
  class?: any
  ui?: PageAside['slots']
}
export interface PageAsideSlots {
  top(props?: {}): any
  default(props?: {}): any
  bottom(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'

const props = defineProps({
  as: { type: null, required: false, default: 'aside' },
  class: { type: null, required: false },
  ui: { type: null, required: false }
})
const slots = defineSlots()
const appConfig = useAppConfig()
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.uiPro?.pageAside || {} })())
</script>

<template>
  <Primitive :as="as" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div :class="ui.container({ class: props.ui?.container })">
      <div v-if="!!slots.top" :class="ui.top({ class: props.ui?.top })">
        <div :class="ui.topHeader({ class: props.ui?.topHeader })" />
        <div :class="ui.topBody({ class: props.ui?.topBody })">
          <slot name="top" />
        </div>
        <div :class="ui.topFooter({ class: props.ui?.topFooter })" />
      </div>

      <slot />

      <slot name="bottom" />
    </div>
  </Primitive>
</template>
