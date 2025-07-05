<script setup lang="ts">
import type { NuxtError } from '#app'
import { useSeoMeta, useHead } from '#imports'

defineProps<{
  error: NuxtError
}>()

useSeoMeta({
  title: 'Page not found',
  description: 'We are sorry but this page could not be found.'
})

useHead({
  htmlAttrs: {
    lang: 'en'
  }
})
</script>

<template>
  <UApp>
    <UError :error="error" />
  </UApp>
</template>
