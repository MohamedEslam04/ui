<script setup lang="ts">
extendCompodiumMeta({
  combo: ['variant'],
  defaultProps: {
    icon: 'i-lucide-terminal',
    title: 'Heads up!',
    description: 'You can change the primary color in your app config.',
    close: true,
    actions: [

      {
        label: 'Action',
        onClick() {
          console.log('Action clicked')
        }
      },
      {
        label: 'Another action',
        color: 'warning',
        onClick() {
          console.log('Another action clicked')
        }
      },
      {
        label: 'One more action',
        color: 'error',
        onClick() {
          console.log('One more action clicked')
        }
      },
      {
        label: 'And one more',
        color: 'info',
        icon: 'i-lucide-info',
        onClick() {
          console.log('And one more clicked')
        }
      },
      {
        label: 'Last one',
        color: 'neutral',
        icon: 'i-lucide-info',
        onClick() {
          console.log('Last one clicked')
        }
      }
    ]
  }
})

const multipleActions = (color: string) => [
]
</script>

<template>
  <UAlert />
</template>
