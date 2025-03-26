<script setup lang="ts">
extendCompodiumMeta({
  combo: ['size', 'orientation']
})
</script>

<template>
  <UButtonGroup v-bind="$attrs">
    <UButton color="neutral" variant="outline">
      Button
    </UButton>
    <UInput placeholder="Search..." />
  </UButtonGroup>
</template>
