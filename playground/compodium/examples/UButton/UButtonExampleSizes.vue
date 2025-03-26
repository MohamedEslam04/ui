<script setup lang="ts">
extendCompodiumMeta({
  combo: ['size', 'variant'],
  defaultProps: {
    label: 'Click me!'
  }
})
</script>

<template>
  <UButton />
</template>
