<script lang="ts">
import theme from '#build/ui/prose/code-group'
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types'

type ProseCodeGroup = ComponentConfig<typeof theme, AppConfig, 'codeGroup', 'ui.prose'>
export interface ProseCodeGroupProps {
  /**
   * The default tab to select.
   * @example '1'
   */
  defaultValue?: string
  /**
   * Sync the selected tab with a local storage key.
   */
  sync?: string
  class?: any
  ui?: ProseCodeGroup['slots']
}
export interface ProseCodeGroupSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed, watch, onMounted, ref, onBeforeUpdate } from 'vue'
import { TabsRoot, TabsList, TabsIndicator, TabsTrigger, TabsContent } from 'reka-ui'
import { useState, useAppConfig } from '#imports'
import { tv } from '../../utils/tv'
import CodeIcon from './CodeIcon.vue'

const props = withDefaults(defineProps<ProseCodeGroupProps>(), { defaultValue: '0' })
const slots = defineSlots<ProseCodeGroupSlots>()
const model = defineModel({ type: String })
const appConfig = useAppConfig() as ProseCodeGroup['AppConfig']
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.codeGroup || {} })())
const rerenderCount = ref(1)
const items = computed(() => {
  const _ = rerenderCount.value
  return slots.default?.()?.flatMap(transformSlot).filter(Boolean) || []
})
function transformSlot(slot: any, index: number) {
  if (typeof slot.type === 'symbol') {
    return slot.children?.map(transformSlot)
  }
  return {
    label: slot.props?.filename || slot.props?.label || `${index}`,
    icon: slot.props?.icon,
    component: slot
  }
}
onMounted(() => {
  if (props.sync) {
    const syncKey = `code-group-${props.sync}`
    const syncValue = useState(syncKey, () => localStorage.getItem(syncKey))
    watch(syncValue, () => {
      if (!syncValue.value) return
      model.value = syncValue.value
    }, { immediate: true })
    watch(model, () => {
      if (!model.value) return
      syncValue.value = model.value
      localStorage.setItem(syncKey, model.value)
    })
  }
})
onBeforeUpdate(() => rerenderCount.value++)
</script>

<template>
  <TabsRoot v-model="model" :default-value="defaultValue" :unmount-on-hide="false" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <TabsList :class="ui.list({ class: props.ui?.list })">
      <TabsIndicator :class="ui.indicator({ class: props.ui?.indicator })" />

      <TabsTrigger v-for="(item, index) of items" :key="index" :value="String(index)" :class="ui.trigger({ class: props.ui?.trigger })">
        <CodeIcon :icon="item.icon" :filename="item.label" :class="ui.triggerIcon({ class: props.ui?.triggerIcon })" />

        <span :class="ui.triggerLabel({ class: props.ui?.triggerLabel })">{{ item.label }}</span>
      </TabsTrigger>
    </TabsList>

    <TabsContent v-for="(item, index) of items" :key="index" :value="String(index)" as-child>
      <component :is="item.component" hide-header tabindex="-1" />
    </TabsContent>
  </TabsRoot>
</template>
