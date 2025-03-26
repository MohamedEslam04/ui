<script setup lang="ts">
extendCompodiumMeta({
  combo: ['size', 'variant'],
  defaultProps: {
    label: 'Click me!',
    icon: 'i-lucide-rocket'
  }
})
</script>

<template>
  <UButton />
</template>
