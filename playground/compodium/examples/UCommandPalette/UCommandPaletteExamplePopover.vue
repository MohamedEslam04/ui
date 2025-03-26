<script setup lang="ts">
import { ref } from '#imports'

const labels = [{
  label: 'bug',
  chip: {
    color: 'error' as const
  }
}, {
  label: 'feature',
  chip: {
    color: 'success' as const
  }
}, {
  label: 'enhancement',
  chip: {
    color: 'info' as const
  }
}]

const label = ref()
</script>

<template>
  <UPopover :content="{ side: 'right', align: 'start' }">
    <UButton label="Select label (popover)" color="neutral" variant="outline" />

    <template #content>
      <UCommandPalette v-model="label" placeholder="Search labels..." :groups="[{ id: 'labels', items: labels }]" :ui="{ input: '[&>input]:h-9' }" />
    </template>
  </UPopover>
</template>
