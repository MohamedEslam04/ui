<script setup lang="ts">
extendCompodiumMeta({
  combo: ['size', 'color'],
  defaultProps: {
    label: 'Click me!',
    icon: 'lucide:heart',
    modelValue: true
  }
})
</script>

<template>
  <UCheckbox />
</template>
