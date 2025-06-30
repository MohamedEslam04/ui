<template>
  <div class="flex flex-col gap-5">
    <UChatPrompt>
      <UChatPromptSubmit />
    </UChatPrompt>

    <UChatPromptSubmit color="primary" variant="solid" icon="i-lucide-arrow-up" />
    <UChatPromptSubmit
      submitted-color="neutral"
      submitted-variant="subtle"
      submitted-icon="i-lucide-square"
      status="submitted"
    />
    <UChatPromptSubmit
      error-color="error"
      error-variant="soft"
      error-icon="i-lucide-rotate-ccw"
      status="error"
    />
  </div>
</template>

<script lang="ts" setup>

</script>

<style></style>
