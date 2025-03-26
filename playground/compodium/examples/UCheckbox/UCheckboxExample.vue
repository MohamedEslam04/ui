<script setup lang="ts">
extendCompodiumMeta({
  combo: ['size', 'color'],
  defaultProps: {
    label: 'Click me!',
    modelValue: true
  }
})
</script>

<template>
  <UCheckbox />
</template>
