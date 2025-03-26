<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <UButtonGroup v-bind="$attrs">
      <UButton>Button</UButton>
    </UButtonGroup>

    <UButtonGroup v-bind="$attrs">
      <UInput placeholder="Search..." />
    </UButtonGroup>

    <UButtonGroup v-bind="$attrs">
      <UButton color="neutral" variant="outline">
        Button
      </UButton>
      <UButton color="neutral" variant="subtle">
        Button
      </UButton>
      <UButton color="neutral" variant="outline">
        Button
      </UButton>
    </UButtonGroup>

    <UButtonGroup v-bind="$attrs" orientation="vertical">
      <UButton color="neutral" variant="outline">
        Button
      </UButton>
      <UInput placeholder="Search..." />
    </UButtonGroup>

    <UButtonGroup v-bind="$attrs">
      <UButton color="neutral" variant="outline">
        Button
      </UButton>
      <UInput placeholder="Search..." />
    </UButtonGroup>

    <UButtonGroup v-bind="$attrs">
      <UInput placeholder="Search..." />
      <UButton color="neutral" variant="outline">
        Button
      </UButton>
    </UButtonGroup>

    <UButtonGroup v-bind="$attrs">
      <UBadge color="neutral" variant="outline" size="lg" label="https://" />
      <UInput color="neutral" variant="outline" placeholder="www.example.com" />
    </UButtonGroup>
  </div>
</template>
