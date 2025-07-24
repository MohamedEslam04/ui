<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../types/utils'
import theme from '#build/ui/scroll-to-section'

type ScrollToSection = ComponentConfig<typeof theme, AppConfig, 'scrollToSection'>

export interface UScrollToSectionProps {
  as?: any
  class?: any
  offset?: number
  autoScroll?: boolean
  clearQuery?: boolean
  param?: string
}

export interface UScrollToSectionSlots {
  default(props?: {}): any
  link(props: { to: string, replace: boolean, param: string }): any
}
</script>

<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { computed, onMounted, watch } from 'vue'
import { useAppConfig, useRoute, useRouter } from '#imports'
import { tv } from '../utils/tv'

const props = withDefaults(defineProps<UScrollToSectionProps>(), {
  as: 'div',
  offset: 0,
  autoScroll: true,
  clearQuery: false,
  param: 'section'
})

const route = useRoute()
const router = useRouter()
const appConfig = useAppConfig() as ScrollToSection['AppConfig']
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.scrollToSection || {}) }))

const scrollToSection = (id: string) => {
  const el = document.getElementById(id)
  if (!el) return

  const top = el.getBoundingClientRect().top + window.scrollY - props.offset
  window.scrollTo({ top, behavior: 'smooth' })
}

const maybeScroll = () => {
  const sectionId = route.query[props.param] as string | undefined
  if (!sectionId) return

  scrollToSection(sectionId)

  if (props.clearQuery) {
    const { [props.param]: _, ...rest } = route.query
    router.replace({ query: rest })
  }
}

onMounted(() => {
  if (props.autoScroll) maybeScroll()
})

watch(() => route.query[props.param], () => {
  if (props.autoScroll) maybeScroll()
})

const scrollToQuery = (id: string, replace = true) => {
  router[replace ? 'replace' : 'push']({
    query: {
      ...route.query,
      [props.param]: id
    }
  })
}
</script>

<template>
  <Primitive :as="as" :class="ui({ class: props.class })">
    <slot />

    <!-- Named slot for internal scroll links -->
    <slot name="link" :scroll-to-query="scrollToQuery" :param="props.param">
      <!-- Default behavior: render nothing unless used -->
    </slot>
  </Primitive>
</template>
