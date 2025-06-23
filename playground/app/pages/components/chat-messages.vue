<script setup lang="ts">
import type { ChatMessageProps } from '#ui/types'

const messages: ChatMessageProps[] = [
  {
    id: '1',
    content: 'Hello! This is the first message.',
    variant: 'outline',
    role: 'user',
    avatar: { name: 'User', icon: 'lucide-user' },
    createdAt: new Date()
  },
  {
    id: '2',
    content: 'Hi! This is a response from the assistant.',
    role: 'assistant',
    // avatar: { name: 'Assistant', src: 'https://i.pravatar.cc/40?img=2' },
    side: 'right',
    createdAt: new Date()
  }
]
</script>

<template>
  <!-- <div> -->
  <UChatMessages :messages="messages" />
  <!-- </div> -->
</template>
