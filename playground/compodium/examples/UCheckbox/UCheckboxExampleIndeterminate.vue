<script setup lang="ts">
extendCompodiumMeta({
  combo: ['size', 'color'],
  defaultProps: {
    label: 'Click me!',
    modelValue: 'indeterminate',
    indeterminate: true
  }
})
</script>

<template>
  <UCheckbox />
</template>
