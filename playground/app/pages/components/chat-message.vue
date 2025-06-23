<script setup lang="ts">
import type { ChatMessageProps } from '#ui/types'

type ChatRole = 'user' | 'assistant' | 'data' | 'system'

const message: ChatMessageProps = {
  id: '1',
  variant: 'naked',
  content: 'Hello! This is a chat message.',
  role: 'user' as ChatRole,
  avatar: { name: 'User', src: 'https://i.pravatar.cc/40?img=1' },
  side: 'right' as const, // Explicitly type as 'left'
  createdAt: new Date()
}
</script>

<template>
  <UChatMessage v-bind="message" variant="outline" />
</template>
