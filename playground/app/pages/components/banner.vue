<template>
  <UContainer class="flex flex-col gap-8">
    <UBanner color="primary" title="This is a banner with an important message." />
    <UBanner color="primary" icon="i-lucide-info" title="This is a banner with an icon." />
    <UBanner color="neutral" icon="i-lucide-info" title="This is a banner with an icon." />
    <UBanner id="example" color="primary" title="This is a closable banner." close />
    <UBanner
      color="primary"
      title="This is a closable banner with a custom close icon."
      close
      close-icon="i-lucide-x-circle"
    />
    <UBanner color="primary" title="This is a banner with actions." :actions="actions" />
    <UBanner
      to="https://github.com/nuxt/ui-pro"
      target="_blank"
      title="Purchase Nuxt UI Pro and get access to all components."
      color="primary"
    />
  </UContainer>
</template>

<script setup lang="ts">
const actions = ref([
  {
    label: 'Action 1',
    variant: 'outline'
  },
  {
    label: 'Action 2',
    trailingIcon: 'i-lucide-arrow-right'
  }
])
</script>
