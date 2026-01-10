<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/marquee'
import type { ComponentConfig } from '../types/tv'

type Marquee = ComponentConfig<typeof theme, AppConfig, 'marquee'>

export interface MarqueeProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * Pause the marquee on hover.
   * @defaultValue false
   */
  pauseOnHover?: boolean
  /**
   * Pause the marquee on touch.
   * @defaultValue false
   */
  pauseOnTouch?: boolean
  /**
   * Reverse the direction of the marquee.
   * @defaultValue false
   */
  reverse?: boolean
  /**
   * The orientation of the marquee.
   * @defaultValue 'horizontal'
   */
  orientation?: Marquee['variants']['orientation']
  /**
   * The number of times the marquee should repeat.
   * @defaultValue 4
   */
  repeat?: number
  /**
   * Display an overlay on the marquee.
   * @defaultValue true
   */
  overlay?: boolean
  /**
   * The duration of the marquee animation in seconds.
   * @defaultValue 20
   */
  /**
   * The duration of the marquee animation in seconds.
   * @defaultValue 20
   */
  duration?: number
  /**
   * Pause the marquee when clicking on it.
   * @defaultValue false
   */
  pauseOnClick?: boolean
  class?: any
  ui?: Marquee['slots']
}

export interface MarqueeSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Primitive } from 'reka-ui'
import { onClickOutside } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'

const props = withDefaults(defineProps<MarqueeProps>(), {
  orientation: 'horizontal',
  repeat: 4,
  overlay: true,
  duration: 20,
  pauseOnClick: false
})
defineSlots<MarqueeSlots>()

const appConfig = useAppConfig() as Marquee['AppConfig']

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.marquee || {}) })({
  pauseOnHover: props.pauseOnHover,
  pauseOnTouch: props.pauseOnTouch,
  orientation: props.orientation,
  reverse: props.reverse,
  overlay: props.overlay
}))

const container = ref<HTMLElement | null>(null)
const paused = ref(false)

onClickOutside(container, () => {
  if (props.pauseOnClick) {
    paused.value = false
  }
})

function togglePause(e: MouseEvent) {
  if (!props.pauseOnClick) {
    return
  }

  const target = e.target as HTMLElement
  if (target.closest('button, a, input, textarea, select')) {
    return
  }

  paused.value = !paused.value
}
</script>

<template>
  <Primitive
    ref="container"
    :as="as"
    :data-orientation="orientation"
    data-slot="root"
    :class="ui.root({ class: [props.ui?.root, props.class, pauseOnClick && !paused && 'cursor-pointer'] })"
    :style="{ '--duration': `${props.duration}s` }"
    @click="togglePause"
  >
    <div
      v-for="i in repeat"
      :key="i"
      :aria-hidden="i > 1 ? 'true' : undefined"
      data-slot="content"
      :class="ui.content({ class: [props.ui?.content] })"
      :style="paused ? { animationPlayState: 'paused' } : undefined"
    >
      <slot />
    </div>
    <div
      v-if="pauseOnClick && !paused"
      :class="ui.overlay({ class: [props.ui?.overlay] })"
    />
  </Primitive>
</template>
