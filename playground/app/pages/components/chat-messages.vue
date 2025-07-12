<script setup lang="ts">
import type { ChatMessageProps } from '#ui/types'
import type { Message } from '@ai-sdk/vue'
import { useClipboard } from '@vueuse/core'

const messages: ChatMessageProps[] = [
  {
    id: '1',
    content: 'Hello! This is the first message.',
    variant: 'outline',
    role: 'user',
    side: 'right',
    // class: '',
    // avatar: { name: 'User', icon: 'lucide-user' },
    createdAt: new Date()
  },
  {
    id: '2',
    content: 'Hi! This is a response from the assistant.',
    role: 'assistant',
    // avatar: { name: 'Assistant', src: 'https://i.pravatar.cc/40?img=2' },
    side: 'left',
    createdAt: new Date()
  }
]
const clipboard = useClipboard()
const copied = ref(false)

function copy(e: MouseEvent, message: Message) {
  clipboard.copy(message.content)

  copied.value = true

  setTimeout(() => {
    copied.value = false
  }, 2000)
}
const input = ref('')
const loading = ref(false)

// const { model } = useLLM()

async function createChat(prompt: string) {
  input.value = prompt
  loading.value = true
  const chat = await $fetch('/api/chats', {
    method: 'POST',
    body: { input: prompt }
  })

  refreshNuxtData('chats')
  navigateTo(`/chat/${chat.id}`)
}

function onSubmit() {
  createChat(input.value)
}
</script>

<template>
  <UContainer class="flex-1 flex flex-col gap-4 sm:gap-6">
    <UChatMessages
      :messages="messages"
      :status="status"
      :assistant="{ actions: [{ label: 'Copy', icon: copied ? 'i-lucide-copy-check' : 'i-lucide-copy', onClick: copy }] }"
      class="lg:pt-(--ui-header-height) pb-4 sm:pb-6"
      :spacing-offset="160"
    >
      <!-- <template #content="{ message }">
        <MDCCached
          :value="message.content"
          :cache-key="message.id"
          unwrap="p"
          :components="components"
          :parser-options="{ highlight: false }"
        />
      </template> -->
    </UChatMessages>

    <UChatPrompt
      v-model="input"
      :status="loading ? 'streaming' : 'ready'"
      class="[view-transition-name:chat-prompt]"
      variant="subtle"
      @submit="onSubmit"
    >
      <UChatPromptSubmit color="neutral" />

      <template #footer>
        <ModelSelect v-model="model" />
      </template>
    </UChatPrompt>
  </UContainer>
</template>
