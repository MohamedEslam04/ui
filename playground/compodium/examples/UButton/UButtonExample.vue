<script setup lang="ts">
extendCompodiumMeta({
  combo: ['variant', 'color'],
  defaultProps: {
    label: 'Click me!'
  }
})
</script>

<template>
  <UButton />
</template>
