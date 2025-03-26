<script setup lang="ts">
extendCompodiumMeta({
  combo: ['size', 'color'],
  defaultProps: {
    label: 'Click me!',
    description: 'This is a description',
    modelValue: true
  }
})
</script>

<template>
  <UCheckbox />
</template>
