<script setup lang="ts">
extendCompodiumMeta({
  combo: ['size', 'variant'],
  defaultProps: {
    label: 'Badge',
    disabled: true
  }
})
</script>

<template>
  <UBadge />
</template>
