<script lang="ts">
import theme from '#build/ui/prose/card-group'

export interface ProseCardGroupProps {
  class?: any
}
export interface ProseCardGroupSlots {
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
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.cardGroup || {} }))
</script>

<template>
  <div :class="ui({ class: props.class })">
    <slot />
  </div>
</template>
