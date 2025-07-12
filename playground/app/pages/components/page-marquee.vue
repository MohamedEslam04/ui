<template>
  <UPageMarquee reverse orientation="vertical" :overlay="false" :ui="{ root: '[--duration:40s] absolute w-[460px] -left-[100px] -top-[300px] h-[940px] transform-3d rotate-x-55 rotate-y-0 rotate-z-30' }">
    <img
      v-for="i in 4"
      :key="i"
      :src="`/pro/blocks/image${i}.png`"
      width="460"
      height="258"
      :alt="`Nuxt UI Pro Screenshot ${i}`"
      class="aspect-video border border-default rounded-lg bg-white"
    >
  </UPageMarquee>
</template>
