<script lang="ts">
import theme from '#build/ui/prose/thead'

export interface ProseTheadProps {
  class?: any
}
export interface ProseTheadSlots {
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
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.thead || {} }))
</script>

<template>
  <thead :class="ui({ class: props.class })">
    <slot />
  </thead>
</template>
