<script setup lang="ts">
const route = useRoute()
const copyStatus = ref<'idle' | 'copying' | 'copied'>('idle')

const items = [
  {
    label: 'Copy Markdown link',
    icon: 'i-lucide-link',
    onSelect() {
      navigator.clipboard.writeText(`${window.location.origin}/raw${route.path}.md`)
    }
  },
  {
    label: 'View as Markdown',
    icon: 'i-simple-icons:markdown',
    target: '_blank',
    onSelect() {
      window.open(`${window.location.origin}/raw${route.path}.md`, '_blank')
    }
  },
  {
    label: 'Open in ChatGPT',
    icon: 'i-simple-icons:openai',
    target: '_blank',
    onSelect() {
      window.open(`https://chatgpt.com/?hints=search&q=${encodeURIComponent(`Read ${window.location.origin}/raw${route.path}.md so I can ask questions about it.`)}`, '_blank')
    }
  },
  {
    label: 'Open in Claude',
    icon: 'i-simple-icons:anthropic',
    target: '_blank',
    onSelect() {
      window.open(`https://claude.ai/new?q=${encodeURIComponent(`Read ${window.location.origin}/raw${route.path}.md so I can ask questions about it.`)}`, '_blank')
    }
  }
]

async function copyPage() {
  copyStatus.value = 'copying'
  const markdown = await $fetch<string>(`${window.location.origin}/raw${route.path}.md`)
  copyToClipboard(markdown)
  copyStatus.value = 'copied'
  setTimeout(() => {
    copyStatus.value = 'idle'
  }, 2000)
}

function copyToClipboard(text: string) {
  // Fix for iOS Safari: https://stackoverflow.com/questions/62327358/javascript-clipboard-api-safari-ios-notallowederror-message
  setTimeout(async () => {
    await navigator.clipboard.writeText(text)
  }, 0)
}
</script>

<template>
  <UButtonGroup>
    <UButton
      label="Copy page"
      :icon="copyStatus === 'copied' ? 'i-lucide-copy-check' : 'i-lucide-copy'"
      color="neutral"
      variant="outline"
      :loading="copyStatus === 'copying'"
      :ui="{
        leadingIcon: [copyStatus === 'copied' ? 'text-primary' : 'text-neutral', 'size-3.5']
      }"
      @click="copyPage"
    />
    <UDropdownMenu
      size="sm"
      :items="items"
      :content="{
        align: 'end',
        side: 'bottom',
        sideOffset: 8
      }"
      :ui="{
        content: 'w-48'
      }"
    >
      <UButton
        icon="i-lucide-chevron-down"
        size="sm"
        color="neutral"
        variant="outline"
      />
    </UDropdownMenu>
  </UButtonGroup>
</template>
