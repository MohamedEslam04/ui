<script setup lang="ts">
import { useAppConfig } from '#imports'
import Callout from '../Callout.vue'

const appConfig = useAppConfig() as any
</script>

<template>
  <Callout color="warning" :icon="appConfig.ui.icons.warning">
    <slot mdc-unwrap="p" />
  </Callout>
</template>
