<script lang="ts">
import theme from '#build/ui/prose/th'

export interface ProseThProps {
  class?: any
}
export interface ProseThSlots {
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
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.th || {} }))
</script>

<template>
  <th :class="ui({ class: props.class })">
    <slot />
  </th>
</template>
