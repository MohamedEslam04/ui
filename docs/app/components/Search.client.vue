<script setup lang="ts">
import type { DefineComponent } from 'vue'
import type { ContentNavigationItem } from '@nuxt/content'
import { useChat } from '@ai-sdk/vue'
import ProseStreamPre from './prose/PreStream.vue'

const components = {
  pre: ProseStreamPre as unknown as DefineComponent
}

interface ContentSearchFile {
  id: string
  title: string
  titles: string[]
  level: number
  content: string
}

defineProps<{
  files?: ContentSearchFile[]
  navigation?: ContentNavigationItem[]
}>()

const { frameworks, modules } = useSharedData()
const { messages, input, handleSubmit, status, error, reload, setMessages } = useChat({
  maxSteps: 2
})

const ai = ref(false)
const searchTerm = ref('')

const links = computed(() => [{
  label: 'Ask AI',
  icon: 'i-lucide-bot',
  onSelect: (e: any) => {
    e.preventDefault()

    ai.value = true
  }
}, {
  label: 'Docs',
  icon: 'i-lucide-square-play',
  to: '/getting-started'
}, {
  label: 'Components',
  icon: 'i-lucide-square-code',
  to: '/components'
}, {
  icon: 'i-lucide-sparkles',
  label: 'Pro > Features',
  description: 'A collection of premium Vue components.',
  to: '/pro'
}, {
  icon: 'i-lucide-credit-card',
  label: 'Pro > Pricing',
  description: 'Free in development, buy when ready to launch.',
  to: '/pro/pricing'
}, {
  icon: 'i-lucide-panels-top-left',
  label: 'Pro > Templates',
  description: 'Official templates made with Nuxt UI Pro.',
  to: '/pro/templates'
}, {
  icon: 'i-lucide-circle-check',
  label: 'Pro > Activate',
  description: 'Enable Nuxt UI Pro in your production projects.',
  to: '/pro/activate'
}, {
  label: 'Figma',
  icon: 'i-simple-icons-figma',
  to: '/figma'
}, {
  icon: 'i-lucide-presentation',
  label: 'Community > Showcase',
  description: 'Check out some of the amazing projects built with Nuxt UI.',
  to: '/showcase'
}, {
  label: 'Community > Contribution',
  description: 'A comprehensive guide on contributing to Nuxt UI, including project structure, development workflow, and best practices.',
  icon: 'i-lucide-git-pull-request-arrow',
  to: '/getting-started/contribution'
}, {
  label: 'Community > Roadmap',
  description: 'Track our development progress in real-time.',
  icon: 'i-lucide-map',
  to: '/roadmap'
}, {
  label: 'Community > Devtools',
  description: 'Integrate Nuxt UI with Nuxt Devtools with Compodium.',
  icon: 'i-lucide-code',
  to: 'https://github.com/romhml/compodium',
  target: '_blank'
}, {
  label: 'Community > Team',
  description: 'Meet the team behind Nuxt UI.',
  icon: 'i-lucide-users',
  to: '/team'
}, {
  label: 'Releases',
  icon: 'i-lucide-rocket',
  to: 'https://github.com/nuxt/ui/releases',
  target: '_blank'
}])

const groups = computed(() => [{
  id: 'ai',
  label: 'AI',
  ignoreFilter: true,
  items: [{
    label: searchTerm.value ? `Ask Nuxt AI for “${searchTerm.value}”` : 'Ask Nuxt AI',
    icon: 'i-lucide-bot',
    onSelect: (e: any) => {
      e.preventDefault()

      ai.value = true

      if (searchTerm.value) {
        setMessages([{
          id: '1',
          role: 'user',
          content: searchTerm.value
        }])

        reload()
      }
    }
  }]
}, {
  id: 'framework',
  label: 'Framework',
  items: frameworks.value
}, {
  id: 'module',
  label: 'Module',
  items: modules.value
}])

function onClose(e: Event) {
  console.log('onClose')
  e.preventDefault()

  ai.value = false
}
</script>

<template>
  <LazyUContentSearch
    v-model:search-term="searchTerm"
    :links="links"
    :files="files"
    :groups="groups"
    :navigation="navigation"
    :fuse="{ resultLimit: 100 }"
  >
    <template v-if="ai" #content>
      <UChatPalette>
        <UChatMessages
          :messages="messages"
          :status="status"
          :user="{ side: 'left', variant: 'naked', avatar: { src: 'https://github.com/benjamincanac.png' } }"
          :assistant="{ icon: 'i-lucide-bot' }"
        >
          <template #content="{ message }">
            <MDCCached
              v-if="message.toolInvocations?.[0]?.state === 'result'"
              :value="message.toolInvocations?.[0]?.result"
              :cache-key="message.id"
              unwrap="p"
              :components="components"
              :parser-options="{ highlight: false }"
            />
            <MDCCached
              v-else-if="message.content.length > 0"
              :value="message.content"
              :cache-key="message.id"
              unwrap="p"
              :components="components"
              :parser-options="{ highlight: false }"
            />
            <span v-else class="italic font-light">
              Searching documentation...
            </span>
          </template>
        </UChatMessages>

        <template #prompt>
          <UChatPrompt
            v-model="input"
            icon="i-lucide-search"
            variant="naked"
            :error="error"
            @submit="handleSubmit"
            @close="onClose"
          />
        </template>
      </UChatPalette>
    </template>
  </LazyUContentSearch>
</template>
