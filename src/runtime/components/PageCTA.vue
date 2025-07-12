<script lang="ts">
import theme from '#build/ui/page-cta'
import type { AppConfig } from '@nuxt/schema'
import type { ButtonProps, ComponentConfig } from '../types'

type PageCTA = ComponentConfig<typeof theme, AppConfig, 'pageCTA'>

export interface PageCTAProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  class?: any
  title?: string
  description?: string
  /**
   * The orientation of the page cta.
   * @defaultValue 'vertical'
   */
  orientation?: PageCTA['variants']['orientation']
  /**
   * Reverse the order of the default slot.
   * @defaultValue false
   */
  reverse?: boolean
  /**
   * @defaultValue 'outline'
   */
  variant?: PageCTA['variants']['variant']
  /**
   * Display a list of Button under the description.
   * `{ size: 'lg' }`{lang="ts-type"}
   */
  links?: ButtonProps[]
  ui?: PageCTA['slots']
}
export interface PageCTASlots {
  default(props?: {}): any
  title(props?: {}): any
  description(props?: {}): any
  links(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'

const props = withDefaults(defineProps<PageCTAProps>(), {
  orientation: 'vertical'
})
const slots = defineSlots<PageCTASlots>()
const appConfig = useAppConfig() as PageCTA['AppConfig']
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.pageCTA || {} })({
  variant: props.variant,
  orientation: props.orientation,
  reverse: props.reverse,
  title: !!props.title || !!slots.title
}))
</script>

<template>
  <Primitive :as="as" :data-orientation="orientation" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <UContainer :class="ui.container({ class: props.ui?.container })">
      <div :class="ui.wrapper({ class: props.ui?.wrapper })">
        <h2 v-if="title || !!slots.title" :class="ui.title({ class: props.ui?.title })">
          <slot name="title">
            {{ title }}
          </slot>
        </h2>

        <div v-if="description || !!slots.description" :class="ui.description({ class: props.ui?.description })">
          <slot name="description">
            {{ description }}
          </slot>
        </div>

        <div v-if="links?.length || !!slots.links" :class="ui.links({ class: props.ui?.links })">
          <slot name="links">
            <UButton v-for="(link, index) in links" :key="index" size="lg" v-bind="link" />
          </slot>
        </div>
      </div>

      <slot v-if="!!slots.default" />
      <div v-else-if="orientation === 'horizontal'" class="hidden lg:block" />
    </UContainer>
  </Primitive>
</template>
