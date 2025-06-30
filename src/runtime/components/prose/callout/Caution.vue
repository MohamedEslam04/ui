<script setup lang="ts">
import { useAppConfig } from '#imports'
import Callout from '../Callout.vue'

// Type as any to avoid TS errors if icons.caution does not exist
const appConfig = useAppConfig() as any
</script>

<template>
  <Callout color="error" :icon="appConfig.ui.icons.caution">
    <slot mdc-unwrap="p" />
  </Callout>
</template>
