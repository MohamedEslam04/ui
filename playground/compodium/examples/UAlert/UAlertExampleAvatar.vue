<script setup lang="ts">
extendCompodiumMeta({
  combo: ['variant'],
  defaultProps: {
    avatar: { src: 'https://github.com/benjamincanac.png' },
    title: 'Heads up!',
    description: 'You can change the primary color in your app config.'
  }
})
</script>

<template>
  <UAlert />
</template>
