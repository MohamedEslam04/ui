<script setup lang="ts">
import type { ChatMessageProps } from '#ui/types'

const messages: ChatMessageProps[] = [
  {
    id: '1',
    content: 'Hello! This is the first message.',
    role: 'user',
    avatar: { name: 'User', src: 'https://i.pravatar.cc/40?img=1' },
    side: 'left',
    createdAt: new Date()
  },
  {
    id: '2',
    content: 'Hi! This is a response from the assistant.',
    role: 'assistant',
    avatar: { name: 'Assistant', src: 'https://i.pravatar.cc/40?img=2' },
    side: 'right',
    createdAt: new Date()
  }
]
</script>

<template>
  <UChatMessages :messages="messages" />
</template>
