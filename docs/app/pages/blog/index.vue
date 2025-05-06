<script setup lang="ts">
// @ts-expect-error yaml is not typed
import page from '.blog.yml'

const { data: posts } = await useAsyncData('blogs', () =>
  queryCollection('blog').order('date', 'DESC').all()
)

const title = page.seo?.title || page.title
const description = page.seo?.description || page.description

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description
})

/* defineOgImageComponent('Docs', {
  headline: 'Blog',
  title: page.title,
  description: page.description
}) */
</script>

<template>
  <div v-if="page" class="relative">
    <UPageHero :links="page.links" :ui="{ container: 'relative' }">
      <LazyStarsBg />

      <div aria-hidden="true" class="absolute z-[-1] border-x border-default inset-0 mx-4 sm:mx-6 lg:mx-8" />

      <template #title>
        <MDC :value="page.title" unwrap="p" cache-key="pro-templates-hero-title" />
      </template>

      <template #description>
        <MDC :value="page.description" unwrap="p" cache-key="pro-templates-hero-description" />
      </template>
    </UPageHero>

    <UPageBody class="!my-0 !py-0 border-y border-default">
      <UContainer>
        <UBlogPosts orientation="vertical" class="border-x border-default !gap-0">
          <Motion
            v-for="(post, index) in posts"
            :key="index"
            :initial="{ opacity: 0, transform: 'translateY(10px)' }"
            :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
            :transition="{ delay: 0.2 * index }"
            :in-view-options="{ once: true }"
            class="group"
          >
            <UBlogPost
              variant="naked"
              orientation="horizontal"
              :to="post.path"
              v-bind="post"
              :ui="{
                root: 'md:grid md:grid-cols-2 group overflow-visible transition-all duration-300',
                image: 'rounded-lg group-hover/blog-post:scale-none shadow-lg border-4 border-muted ring-2 ring-default',
                header: 'scale-90 md:scale-85 lg:scale-80 overflow-visible'
              }"
            />
            <div class="group-last:hidden border-b border-default" />
          </Motion>
        </UBlogPosts>
      </UContainer>
    </UPageBody>
    <UContainer class="relative h-24">
      <div aria-hidden="true" class="absolute z-[-1] border-x border-default inset-0 mx-4 sm:mx-6 lg:mx-8" />
    </UContainer>
  </div>
</template>
