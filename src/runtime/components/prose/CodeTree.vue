<script lang="ts">
import theme from '#build/ui/prose/code-tree'
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types'

type ProseCodeTree = ComponentConfig<typeof theme, AppConfig, 'codeTree', 'ui.prose'>

export interface ProseCodeTreeProps {
  /**
   * The default path to select.
   * @example 'package.json'
   */
  defaultValue?: string
  /**
   * Expand all directories by default.
   * @defaultValue false
   */
  expandAll?: boolean
  class?: any
  ui?: ProseCodeTree['slots']
}

export interface ProseCodeTreeSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed, ref, watch, onBeforeUpdate } from 'vue'
import { TreeRoot, TreeItem } from 'reka-ui'
import { createReusableTemplate } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { tv } from '../../utils/tv'
import CodeIcon from './CodeIcon.vue'

interface FlatItem {
  label: string
  icon?: string
  component: any
}

interface TreeNode {
  label: string
  path: string
  icon?: string
  component?: any
  children?: TreeNode[]
}

const props = withDefaults(defineProps<ProseCodeTreeProps>(), {
  expandAll: false
})
const slots = defineSlots<ProseCodeTreeSlots>()

const appConfig = useAppConfig() as ProseCodeTree['AppConfig']

const [DefineTreeTemplate, ReuseTreeTemplate] = createReusableTemplate()

const ui = computed(() => tv({
  extend: tv(theme),
  ...appConfig.ui?.prose?.codeTree || {}
})())

const model = ref<{ path: string } | undefined>(props.defaultValue ? { path: props.defaultValue } : undefined)
const lastSelectedItem = ref<FlatItem | undefined>()
const rerenderCount = ref(1)

const flatItems = computed<FlatItem[]>(() => {
  const _ = rerenderCount.value
  return slots.default?.()?.flatMap(transformSlot).filter(Boolean) as FlatItem[] || []
})

const treeItems = computed<TreeNode[]>(() => buildTree(flatItems.value))

function transformSlot(slot: any, index: number): FlatItem | undefined {
  if (typeof slot?.type === 'symbol') {
    return slot.children?.flatMap((child: any, i: number) => transformSlot(child, i))
  }

  return {
    label: slot.props?.filename || slot.props?.label || `${index}`,
    icon: slot.props?.icon,
    component: slot
  }
}

function buildTree(items: FlatItem[]): TreeNode[] {
  const map = new Map<string, TreeNode>()
  const root: TreeNode[] = []

  items.forEach((item) => {
    const parts = item.label.split('/')
    let path = ''

    parts.forEach((part: string, i: number) => {
      path = path ? `${path}/${part}` : part

      if (!map.has(path)) {
        const node: TreeNode = {
          label: part,
          path,
          ...(i < parts.length - 1
            ? { children: [] }
            : { component: item.component, icon: item.icon })
        }

        map.set(path, node)

        if (i === 0) {
          root.push(node)
        } else {
          map.get(parts.slice(0, i).join('/'))?.children?.push(node)
        }
      }
    })
  })

  const sort = (nodes: TreeNode[]): TreeNode[] =>
    nodes.sort((a, b) =>
      !!a.children === !!b.children
        ? a.label.localeCompare(b.label)
        : b.children ? 1 : -1
    ).map(n => ({
      ...n,
      children: n.children && sort(n.children)
    }))

  return sort(root)
}

const expanded = computed<string[]>(() => {
  if (props.expandAll) {
    const allPaths: Set<string> = new Set()

    flatItems.value.forEach((item) => {
      const parts = item.label.split('/')
      for (let i = 1; i < parts.length; i++) {
        allPaths.add(parts.slice(0, i).join('/'))
      }
    })

    return Array.from(allPaths)
  }

  const path = model.value?.path
  if (!path) return []

  return path.split('/').map((_, i) => path.split('/').slice(0, i + 1).join('/'))
})

watch(model, (value) => {
  const item = flatItems.value.find(i => i.label === value?.path)
  if (item?.component) {
    lastSelectedItem.value = item
  }
}, { immediate: true })

onBeforeUpdate(() => rerenderCount.value++)
</script>

<template>
  <DefineTreeTemplate v-slot="{ items: children, level }">
    <li
      v-for="(item, index) in children"
      :key="`${level}-${index}`"
      :class="level > 0 ? ui.itemWithChildren({ class: props.ui?.itemWithChildren }) : ui.item({ class: props.ui?.item })"
    >
      <TreeItem
        v-slot="{ isExpanded, isSelected }"
        as-child
        :level="level"
        :value="item"
      >
        <button :class="ui.link({ class: props.ui?.link, active: isSelected })">
          <UIcon
            v-if="item.children?.length"
            :name="isExpanded ? appConfig.ui.icons.folderOpen : appConfig.ui.icons.folder"
            :class="ui.linkLeadingIcon({ class: props.ui?.linkLeadingIcon })"
          />
          <CodeIcon
            v-else
            :filename="item.label"
            :class="ui.linkLeadingIcon({ class: props.ui?.linkLeadingIcon })"
          />
          <span :class="ui.linkLabel({ class: props.ui?.linkLabel })">
            {{ item.label }}
          </span>
          <span
            v-if="item.children?.length"
            :class="ui.linkTrailing({ class: props.ui?.linkTrailing })"
          >
            <UIcon
              :name="appConfig.ui.icons.chevronDown"
              :class="ui.linkTrailingIcon({ class: props.ui?.linkTrailingIcon })"
            />
          </span>
        </button>
        <ul
          v-if="item.children?.length && isExpanded"
          :class="ui.listWithChildren({ class: props.ui?.listWithChildren })"
        >
          <ReuseTreeTemplate :items="item.children" :level="level + 1" />
        </ul>
      </TreeItem>
    </li>
  </DefineTreeTemplate>

  <div :class="ui.root({ class: [props.ui?.root, props.class] })">
    <TreeRoot
      v-model="model"
      :items="treeItems"
      :get-key="(item) => item.path"
      :default-expanded="expanded"
      :class="ui.list({ class: props.ui?.list })"
    >
      <ReuseTreeTemplate :items="treeItems" :level="0" />
    </TreeRoot>

    <div :class="ui.content({ class: props.ui?.content })">
      <component :is="lastSelectedItem?.component" />
    </div>
  </div>
</template>
