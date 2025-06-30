<script setup lang="ts">
const loading = ref(false)

function onSubmit() {
  console.log('hi')
}

const quickChats = [
  {
    label: 'Why use Nuxt UI Pro?',
    icon: 'i-logos-nuxt-icon'
  },
  {
    label: 'Help me create a Vue composable',
    icon: 'i-logos-vue'
  },
  {
    label: 'Tell me more about UnJS',
    icon: 'i-logos-unjs'
  },
  {
    label: 'Why should I consider VueUse?',
    icon: 'i-logos-vueuse'
  },
  {
    label: 'Tailwind CSS best practices',
    icon: 'i-logos-tailwindcss-icon'
  }
]
</script>

<template>
  <UDashboardPanel id="home" :ui="{ body: 'p-0 sm:p-0' }">
    <template #header>
      <DashboardNavbar />
    </template>

    <template #body>
      <UContainer class="flex-1 flex flex-col justify-center gap-4 sm:gap-6 py-8">
        <h1 class="text-3xl sm:text-4xl text-highlighted font-bold">
          How can I help you today?
        </h1>

        <UChatPrompt
          :status="loading ? 'streaming' : 'ready'"
          class="[view-transition-name:chat-prompt]"
          variant="subtle"
          @submit="onSubmit"
        >
          <UChatPromptSubmit color="neutral" />
        </UChatPrompt>

        <div class="flex flex-wrap gap-2">
          <UButton
            v-for="quickChat in quickChats"
            :key="quickChat.label"
            :icon="quickChat.icon"
            :label="quickChat.label"
            size="sm"
            color="neutral"
            variant="outline"
            class="rounded-full"
          />
        </div>
      </UContainer>
    </template>
  </UDashboardPanel>
</template>
