<template>
  <UContainer class="flex flex-col gap-8">
    <UBlogPost title="Introducing Nuxt Icon v1" />
    <UBlogPost
      title="Introducing Nuxt Icon v1"
      description="Discover Nuxt Icon v1 - a modern, versatile, and customizable icon solution for your Nuxt projects."
    />
    <UBlogPost
      title="Introducing Nuxt Icon v1"
      description="Discover Nuxt Icon v1 - a modern, versatile, and customizable icon solution for your Nuxt projects."
      date="2024-11-25"
    />
    <UBlogPost
      title="Introducing Nuxt Icon v1"
      description="Discover Nuxt Icon v1 - a modern, versatile, and customizable icon solution for your Nuxt projects."
      badge="Release"
    />
    <UBlogPost
      title="Introducing Nuxt Icon v1"
      description="Discover Nuxt Icon v1 - a modern, versatile, and customizable icon solution for your Nuxt projects."
      :badge="{
        label: 'Release',
        color: 'primary',
        variant: 'solid'
      }"
    />
    <UBlogPost
      title="Introducing Nuxt Icon v1"
      description="Discover Nuxt Icon v1 - a modern, versatile, and customizable icon solution for your Nuxt projects."
      image="https://nuxt.com/assets/blog/nuxt-icon/cover.png"
      date="2024-11-25"
    />
    <UBlogPost
      title="Introducing Nuxt Icon v1"
      description="Discover Nuxt Icon v1 - a modern, versatile, and customizable icon solution for your Nuxt projects."
      image="https://nuxt.com/assets/blog/nuxt-icon/cover.png"
      date="2024-11-25"
      :authors="authors"
    />
  </UContainer>
</template>

<script setup lang="ts">
const authors = ref([
  {
    name: 'Anthony Fu',
    description: 'antfu7',
    avatar: {
      src: 'https://github.com/antfu.png'
    },
    to: 'https://github.com/antfu',
    target: '_blank'
  }
])
</script>
