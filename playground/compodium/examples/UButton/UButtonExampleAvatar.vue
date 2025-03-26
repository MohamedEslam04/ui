<script setup lang="ts">
extendCompodiumMeta({
  combo: ['size', 'variant'],
  defaultProps: {
    avatar: { src: 'https://github.com/benjamincanac.png' }
  }
})
</script>

<template>
  <UButton />
</template>
