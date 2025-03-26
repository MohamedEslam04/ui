<script setup lang="ts">
extendCompodiumMeta({
  combo: ['size', 'variant'],
  defaultProps: {
    label: 'Badge',
    avatar: { src: 'https://github.com/benjamincanac.png' }
  }
})
</script>

<template>
  <UBadge />
</template>
