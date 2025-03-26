<script setup lang="ts">
extendCompodiumMeta({
  combo: ['size', 'variant'],
  defaultProps: {
    label: 'Click me!',
    loading: true
  }
})
</script>

<template>
  <UButton />
</template>
