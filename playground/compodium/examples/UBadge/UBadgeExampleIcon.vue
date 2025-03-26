<script setup lang="ts">
extendCompodiumMeta({
  combo: ['size', 'variant'],
  defaultProps: {
    label: 'Badge',
    icon: 'i-lucide-rocket'
  }
})
</script>

<template>
  <UBadge />
</template>
