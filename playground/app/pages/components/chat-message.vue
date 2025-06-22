<script setup lang="ts">
type ChatRole = 'user' | 'assistant' | 'data' | 'system'

const message = {
  id: '1',
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
