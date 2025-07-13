<script setup lang="ts">
const links = ref([
  {
    label: 'GitHub',
    icon: 'i-simple-icons-github',
    to: 'https://github.com/nuxt/ui-pro/tree/v3/src/runtime/components/PageHeader.vue',
    target: '_blank'
  }
])
</script>

<template>
  <UPageHeader
    title="PageHeader"
    description="A responsive page header with title, description and actions."
    headline="Components"
    :links="links"
  />
</template>
