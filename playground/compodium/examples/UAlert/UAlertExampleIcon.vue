<script setup lang="ts">
extendCompodiumMeta({
  combo: ['variant'],
  defaultProps: {
    icon: 'i-lucide-terminal',
    title: 'Heads up!',
    description: 'You can change the primary color in your app config.'
  }
})
</script>

<template>
  <UAlert />
</template>
