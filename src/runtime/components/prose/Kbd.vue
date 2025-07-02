<script lang="ts">
import theme from '#build/ui/prose/kbd'

export interface ProseKbdProps {
  value: string
  class?: any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { tv } from '../../utils/tv'

const props = defineProps({
  value: { type: String, required: true },
  class: { type: null, required: false }
})
const appConfig = useAppConfig()
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.kbd || {} }))
</script>

<template>
  <UKbd :value="value" :class="ui({ class: props.class })" />
</template>
