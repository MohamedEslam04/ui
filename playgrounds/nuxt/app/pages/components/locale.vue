<script setup lang="ts">
import * as locales from '@eslamdevui/ui/locale'

const locale = ref('en')
</script>

<template>
  <Navbar to="https://ui.nuxt.com/docs/getting-started/integrations/i18n" />

  <ULocaleSelect v-model="locale" :locales="Object.values(locales)" />
</template>
