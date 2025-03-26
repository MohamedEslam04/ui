<script setup lang="ts">
extendCompodiumMeta({
  defaultProps: {
    items: [{
      label: 'Home',
      to: '/'
    }, {
      slot: 'dropdown' as const,
      icon: 'i-lucide-ellipsis',
      children: [{
        label: 'Documentation'
      }, {
        label: 'Themes'
      }, {
        label: 'GitHub'
      }]
    }, {
      label: 'Components',
      disabled: true
    }, {
      label: 'Breadcrumb',
      to: '/components/breadcrumb'
    }]
  }
})
</script>

<template>
  <UBreadcrumb />
</template>
