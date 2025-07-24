<script setup lang="ts">
import { Slot } from 'reka-ui'
</script>

<template>
  <Slot class="ui-only">
    <slot name="ui" />
  </Slot>
  <Slot class="ui-only">
    <slot name="ui" />
  </Slot>
</template>
