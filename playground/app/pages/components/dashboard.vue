<script setup lang="ts">
// const loading = ref(false)
const input = ref('')
const model = ref({ label: 'Nuxt UI Pro', value: 'nuxt-ui-pro' })
// function onSubmit() {
//   console.log('hi')
// }

const models = [
  { label: 'Nuxt UI Pro', value: 'nuxt-ui-pro' },
  { label: 'VueUse', value: 'vueuse' },
  { label: 'UnJS', value: 'unjs' },
  { label: 'Tailwind CSS', value: 'tailwindcss' }
]

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
  <UDashboardGroup class="mt-16 w-4/5 self-center ms-auto me-10">
    <UDashboardSidebar
      id="default"
      :min-size="12"
      collapsible
      resizable
      class="bg-elevated/50"
    >
      <template #header="{ collapsed }">
        <NuxtLink to="/" class="flex items-end gap-0.5">
          <Logo class="h-8 w-auto shrink-0" />
          <span v-if="!collapsed" class="text-xl font-bold text-highlighted">Chat</span>
        </NuxtLink>

        <div v-if="!collapsed" class="flex items-center gap-1.5 ms-auto">
          <UDashboardSearchButton collapsed />
          <UDashboardSidebarCollapse />
        </div>
      </template>

      <template #default="{ collapsed }">
        <div class="flex flex-col gap-1.5">
          <UButton
            v-bind="collapsed ? { icon: 'i-lucide-plus' } : { label: 'New chat' }"
            variant="soft"
            block
            to="/"
          />

          <template v-if="collapsed">
            <UDashboardSearchButton collapsed />
            <UDashboardSidebarCollapse />
          </template>
        </div>
      </template>

      <template #footer="{ collapsed }">
        <UButton
          :label="collapsed ? '' : 'Login with GitHub'"
          icon="i-simple-icons-github"
          color="neutral"
          variant="ghost"
          class="w-full"
        />
      </template>
    </UDashboardSidebar>

    <UDashboardPanel id="home" :ui="{ body: 'p-0 sm:p-0' }">
      <template #header>
        <UDashboardNavbar
          class="sticky lg:absolute top-0 inset-x-0 border-b-0 z-10 bg-default/75 backdrop-blur lg:bg-transparent lg:backdrop-blur-none pointer-events-none"
          :ui="{ left: 'pointer-events-auto', right: 'pointer-events-auto' }"
        >
          <template #right>
            <UColorModeButton />

            <UButton
              color="neutral"
              variant="ghost"
              icon="i-lucide-plus"
              to="/"
              class="lg:hidden"
            />
          </template>
        </UDashboardNavbar>
      </template>

      <template #body>
        <UContainer class="flex-1 flex flex-col justify-center gap-4 sm:gap-6 py-8">
          <h1 class="text-3xl sm:text-4xl text-highlighted font-bold">
            How can I help you today?
          </h1>

          <UChatPrompt
            v-model="input"
            class="[view-transition-name:chat-prompt]"
            variant="subtle"
          >
            <UChatPromptSubmit color="neutral" />

            <template #footer>
              <USelectMenu
                v-model="model"
                :items="models"
                variant="ghost"
                class="hover:bg-default focus:bg-default data-[state=open]:bg-default"
                :ui="{
                  trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
                }"
              />
              {{ model.value }}
            </template>
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
  </UDashboardGroup>
</template>
