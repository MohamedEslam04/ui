<script lang="ts">
import theme from '#build/ui/prose/em'

export interface ProseEmProps {
  class?: string
}
export interface ProseEmSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { tv } from '../../utils/tv'

const props = defineProps({
  class: { type: String, required: false }
})
defineSlots()
const appConfig = useAppConfig()
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.em || {} }))
</script>

<template>
  <em :class="ui({ class: props.class })"><slot /></em>
</template>
