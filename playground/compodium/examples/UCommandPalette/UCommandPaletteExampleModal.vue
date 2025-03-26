<script setup lang="ts">
import type { User } from '~/types'
import { ref, computed, useFetch, useToast } from '#imports'

const toast = useToast()

const open = ref(false)
const searchTerm = ref('')
const selected = ref([])

const { data: users, status } = await useFetch('https://jsonplaceholder.typicode.com/users', {
  // params: { q: searchTermDebounced },
  transform: (data: User[]) => {
    return data?.map(user => ({ id: user.id, label: user.name, suffix: user.email, avatar: { src: `https://i.pravatar.cc/120?img=${user.id}` } })) || []
  },
  lazy: true
})

const loading = ref(false)

const groups = computed(() => [{
  id: 'users',
  label: searchTerm.value ? `Users matching “${searchTerm.value}”...` : 'Users',
  items: users.value || []
}, {
  id: 'actions',
  items: [{
    label: 'Add new file',
    suffix: 'Create a new file in the current directory or workspace.',
    icon: 'i-lucide-file-plus',
    loading: loading.value,
    onSelect(e: Event) {
      e.preventDefault()

      toast.add({ title: 'New file added!' })

      loading.value = true

      setTimeout(() => {
        loading.value = false
      }, 2000)
    },
    kbds: ['meta', 'N']
  }, {
    label: 'Add new folder',
    suffix: 'Create a new folder in the current directory or workspace.',
    icon: 'i-lucide-folder-plus',
    onSelect(e: Event) {
      e.preventDefault()

      toast.add({ title: 'New folder added!' })
    },
    kbds: ['meta', 'F']
  }, {
    label: 'Add hashtag',
    suffix: 'Add a hashtag to the current item.',
    icon: 'i-lucide-hash',
    onSelect(e: Event) {
      e.preventDefault()

      toast.add({ title: 'Hashtag added!' })
    },
    kbds: ['meta', 'H']
  }, {
    label: 'Add label',
    suffix: 'Add a label to the current item.',
    icon: 'i-lucide-tag',
    onSelect(e: Event) {
      e.preventDefault()

      toast.add({ title: 'Label added!' })
    },
    kbds: ['meta', 'L']
  }]
}])

// function onSelect(item: typeof groups.value[number]['items'][number]) {
function onSelect(item: any) {
  console.log('Selected', item)
}
</script>

<template>
  <UModal v-model:open="open">
    <UButton label="Open in modal" color="neutral" variant="outline" />

    <template #content>
      <UCommandPalette
        v-bind="$attrs"
        v-model="selected"
        v-model:search-term="searchTerm"
        :loading="status === 'pending'"
        :groups="groups"
        :fuse="{
          fuseOptions: {
            includeMatches: true
          }
        }"
        multiple
        close
        class="sm:max-h-80"
        @update:open="open = $event"
        @update:model-value="onSelect"
      />
    </template>
  </UModal>
</template>
