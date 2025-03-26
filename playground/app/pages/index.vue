<script setup lang="ts">

</script>

<template>
  <div class="w-screen h-screen flex flex-col justify-center items-center gap-2">
    <h1 class="text-3xl font-bold mb-1">
      Nuxt UI Playground
    </h1>

    <div class="flex items-center justify-center gap-1">
      <UButton size="lg" to="/__compodium__/devtools" external>
        Browse components
      </UButton>
      <UButton variant="outline" color="neutral" size="lg">
        Documentation
      </UButton>
    </div>
  </div>
</template>
