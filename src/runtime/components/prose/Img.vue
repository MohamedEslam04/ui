<script lang="ts">
import theme from '#build/ui/prose/img'
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types'

type ProseImg = ComponentConfig<typeof theme, AppConfig, 'img', 'ui.prose'>
export interface ProseImgProps {
  src: string
  alt: string
  width?: string | number
  height?: string | number
  class?: any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { withTrailingSlash, withLeadingSlash, joinURL } from 'ufo'
import { useRuntimeConfig, useAppConfig } from '#imports'
import ImageComponent from '#build/ui-image-component'
import { tv } from '../../utils/tv'

const props = defineProps<ProseImgProps>()
const appConfig = useAppConfig() as ProseImg['AppConfig']
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.img || {} }))
const refinedSrc = computed(() => {
  if (props.src?.startsWith('/') && !props.src.startsWith('//')) {
    const _base = withLeadingSlash(withTrailingSlash(useRuntimeConfig().app.baseURL))
    if (_base !== '/' && !props.src.startsWith(_base)) {
      return joinURL(_base, props.src)
    }
  }
  return props.src
})
</script>

<template>
  <component
    :is="ImageComponent"
    :src="refinedSrc"
    :alt="alt"
    :width="width"
    :height="height"
    :class="ui({ class: props.class })"
  />
</template>
