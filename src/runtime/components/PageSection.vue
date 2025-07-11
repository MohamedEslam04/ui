<script lang="ts">
import theme from '#build/ui/page-section'
import type { AppConfig } from '@nuxt/schema'
import type { ButtonProps, ComponentConfig, PageFeatureProps } from '../types'

type PageSection = ComponentConfig<typeof theme, AppConfig, 'pageSection'>

export interface PageSectionProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'section'
   */
  as?: any
  /**
   * The headline displayed above the title.
   */
  headline?: string
  /**
   * The icon displayed above the title.
   * @IconifyIcon
   */
  icon?: string
  title?: string
  description?: string
  /**
   * Display a list of Button under the description.
   * `{ size: 'lg' }`{lang="ts-type"}
   */
  links?: ButtonProps[]
  /**
   * Display a list of PageFeature under the description.
   */
  features?: PageFeatureProps[]
  /**
   * The orientation of the section.
   * @defaultValue 'vertical'
   */
  orientation?: PageSection['variants']['orientation']
  /**
   * Reverse the order of the default slot.
   * @defaultValue false
   */
  reverse?: boolean
  class?: any
  ui?: PageSection['slots']
}
export interface PageSectionSlots {
  default(props?: {}): any
  top(props?: {}): any
  bottom(props?: {}): any
  headline(props?: {}): any
  leading(props?: {}): any
  title(props?: {}): any
  description(props?: {}): any
  links(props?: {}): any
  features(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'

const props = defineProps({
  as: { type: null, required: false, default: 'section' },
  headline: { type: String, required: false },
  icon: { type: String, required: false },
  title: { type: String, required: false },
  description: { type: String, required: false },
  links: { type: Array, required: false },
  features: { type: Array, required: false },
  orientation: { type: null, required: false, default: 'vertical' },
  reverse: { type: Boolean, required: false },
  class: { type: null, required: false },
  ui: { type: null, required: false }
})
const slots = defineSlots()
const appConfig = useAppConfig()
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.uiPro?.pageSection || {} })({
  orientation: props.orientation,
  reverse: props.reverse,
  title: !!props.title || !!slots.title,
  description: !!props.description || !!slots.description,
  features: !!props.features?.length || !!slots.features
}))
</script>

<template>
  <Primitive :as="as" :data-orientation="orientation" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <slot name="top" />

    <UContainer :class="ui.container({ class: props.ui?.container })">
      <div v-if="icon || !!slots.leading || (headline || !!slots.headline) || (title || !!slots.title) || (description || !!slots.description) || (features?.length || !!slots.features) || (links?.length || !!slots.links)" :class="ui.wrapper({ class: props.ui?.wrapper })">
        <div v-if="icon || !!slots.leading" :class="ui.leading({ class: props.ui?.leading })">
          <slot name="leading">
            <UIcon v-if="icon" :name="icon" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
          </slot>
        </div>

        <div v-if="headline || !!slots.headline" :class="ui.headline({ class: props.ui?.headline, headline: !slots.headline })">
          <slot name="headline">
            {{ headline }}
          </slot>
        </div>

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

        <ul v-if="features?.length || !!slots.features" :class="ui.features({ class: props.ui?.features })">
          <slot name="features">
            <UPageFeature
              v-for="(feature, index) in features"
              :key="index"
              as="li"
              v-bind="feature"
            />
          </slot>
        </ul>

        <div v-if="links?.length || !!slots.links" :class="ui.links({ class: props.ui?.links })">
          <slot name="links">
            <UButton v-for="(link, index) in links" :key="index" size="lg" v-bind="link" />
          </slot>
        </div>
      </div>

      <slot v-if="!!slots.default" />
      <div v-else-if="orientation === 'horizontal'" class="hidden lg:block" />
    </UContainer>

    <slot name="bottom" />
  </Primitive>
</template>
