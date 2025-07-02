<script lang="ts">
import theme from '#build/ui/prose/badge'

export interface ProseBadgeProps {
  class?: any
}
export interface ProseBadgeSlots {
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
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.badge || {} }))
</script>

<template>
  <UBadge color="primary" variant="subtle" :class="ui({ class: props.class })">
    <slot mdc-unwrap="p" />
  </UBadge>
</template>
