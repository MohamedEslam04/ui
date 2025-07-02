<script lang="ts">
import theme from '#build/ui/prose/tabs'

export interface ProseTabsProps {
  /**
   * The default tab to select.
   * @example '1'
   */
  defaultValue?: string
  /**
   * Sync the selected tab with a local storage key.
   */
  sync?: string
  /**
   * The hash to scroll to when the tab is selected.
   */
  hash?: string
  class?: any
}
export interface ProseTabsSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed, watch, onMounted, ref, onBeforeUpdate } from 'vue'
import { useState, useAppConfig } from '#imports'
import { transformUI } from '../../utils'
import { tv } from '../../utils/tv'

const props = defineProps({
  defaultValue: { type: String, required: false, default: '0' },
  sync: { type: String, required: false },
  hash: { type: String, required: false },
  class: { type: null, required: false }
})
const slots = defineSlots()
const model = defineModel({ type: String })
const appConfig = useAppConfig()
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.tabs || {} }))
const rerenderCount = ref(1)
const items = computed(() => {
  rerenderCount.value
  return slots.default?.()?.flatMap(transformSlot).filter(Boolean) || []
})
function transformSlot(slot, index) {
  if (typeof slot.type === 'symbol') {
    return slot.children?.map(transformSlot)
  }
  return {
    index,
    label: slot.props?.label || `${index}`,
    description: slot.props?.description,
    icon: slot.props?.icon,
    component: slot
  }
}
onMounted(() => {
  if (props.sync) {
    const syncKey = `tabs-${props.sync}`
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
async function onUpdateModelValue() {
  if (props.hash) {
    const hash = props.hash.startsWith('#') ? props.hash : `#${props.hash}`
    setTimeout(() => {
      document.querySelector(hash)?.scrollIntoView()
    }, 200)
  }
}
onBeforeUpdate(() => rerenderCount.value++)
</script>

<template>
  <UTabs
    v-model="model"
    color="primary"
    variant="link"
    :items="items"
    :class="props.class"
    :unmount-on-hide="false"
    :ui="transformUI(ui())"
    @update:model-value="onUpdateModelValue"
  >
    <template #content="{ item }">
      <component :is="item.component" />
    </template>
  </UTabs>
</template>
