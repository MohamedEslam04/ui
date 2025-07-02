<script lang="ts">
import theme from '#build/ui/prose/icon'

export interface ProseIconProps {
  name: string
  class?: any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { tv } from '../../utils/tv'

const props = defineProps({
  name: { type: String, required: true },
  class: { type: null, required: false }
})
const appConfig = useAppConfig()
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.icon || {} }))
</script>

<template>
  <UIcon :name="name" :class="ui({ class: props.class })" />
</template>
