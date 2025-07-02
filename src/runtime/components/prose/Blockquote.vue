<script lang="ts">
import theme from '#build/ui/prose/blockquote'

export interface ProseBlockquoteProps {
  class?: any
}
export interface ProseBlockquoteSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { tv } from '../../utils/tv'

const props = defineProps({
  class: { type: null, required: false }
})
defineSlots()
const appConfig = useAppConfig()
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.blockquote || {} }))
</script>

<template>
  <blockquote :class="ui({ class: props.class })">
    <slot />
  </blockquote>
</template>
