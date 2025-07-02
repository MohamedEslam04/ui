<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type {
  ButtonProps,
  InputProps,
  CommandPaletteProps,
  CommandPaletteSlots,
  CommandPaletteGroup,
  CommandPaletteItem,
  ComponentConfig
} from '../types'
import type { UseFuseOptions } from '@vueuse/integrations/useFuse'
import theme from '#build/ui/dashboard-search'

export type DashboardSearch<_T extends CommandPaletteItem = CommandPaletteItem>
  = ComponentConfig<typeof theme, AppConfig, 'dashboardSearch'>

export interface DashboardSearchProps<T extends CommandPaletteItem = CommandPaletteItem> {
  icon?: string
  placeholder?: InputProps['placeholder']
  autofocus?: boolean
  loading?: boolean
  loadingIcon?: string
  close?: boolean | Partial<ButtonProps>
  closeIcon?: string
  shortcut?: string
  groups?: CommandPaletteGroup<T>[]
  fuse?: UseFuseOptions<T>
  colorMode?: boolean
  class?: any
  ui?: DashboardSearch<T>['slots'] & CommandPaletteProps<CommandPaletteGroup<T>, T>['ui']
}

export type DashboardSearchSlots<T extends CommandPaletteItem = CommandPaletteItem>
  = CommandPaletteSlots<CommandPaletteGroup<T>, T> & { content(props?: {}): any }
</script>

<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { useForwardProps } from 'reka-ui'
import { defu } from 'defu'
import { reactivePick } from '@vueuse/core'
import { useAppConfig, useColorMode, defineShortcuts, useRuntimeHook } from '#imports'
import { useLocalePro } from '../composables/useLocalePro'
import { transformUI, omit } from '../utils'
import { tv } from '../utils/tv'

const props = withDefaults(defineProps<DashboardSearchProps>(), {
  close: true,
  shortcut: 'meta_k',
  colorMode: true
})

const slots = defineSlots<DashboardSearchSlots>()
const open = defineModel('open', { type: Boolean, default: false })
const searchTerm = defineModel('searchTerm', { type: String, default: '' })

useRuntimeHook('dashboard:search:toggle', () => {
  open.value = !open.value
})

const { t } = useLocalePro()
const colorModeComposable = useColorMode()
const appConfig = useAppConfig() as DashboardSearch['AppConfig']

const commandPaletteProps = useForwardProps(
  reactivePick(props, 'icon', 'placeholder', 'autofocus', 'loading', 'loadingIcon', 'close', 'closeIcon')
)

const proxySlots = omit(slots, ['content'])

const fuse = computed(() =>
  defu({}, props.fuse, {
    fuseOptions: {}
  })
)

const ui = computed(() => tv({
  extend: tv(theme),
  ...appConfig.ui?.dashboardSearch
})())

const groups = computed(() => {
  const arr = [...(props.groups || [])]
  if (props.colorMode && !colorModeComposable?.forced) {
    arr.push({
      id: 'theme',
      label: t('dashboardSearch.theme'),
      items: [
        {
          label: t('colorMode.system'),
          icon: appConfig.ui.icons.system,
          active: colorModeComposable.preference === 'system',
          onSelect: () => { colorModeComposable.preference = 'system' }
        },
        {
          label: t('colorMode.light'),
          icon: appConfig.ui.icons.light,
          active: colorModeComposable.preference === 'light',
          onSelect: () => { colorModeComposable.preference = 'light' }
        },
        {
          label: t('colorMode.dark'),
          icon: appConfig.ui.icons.dark,
          active: colorModeComposable.preference === 'dark',
          onSelect: () => { colorModeComposable.preference = 'dark' }
        }
      ]
    })
  }
  return arr
})

function onSelect(item: any) {
  if (item.disabled) return
  open.value = false
  searchTerm.value = ''
}

defineShortcuts({
  [props.shortcut]: {
    usingInput: true,
    handler: () => (open.value = !open.value)
  }
})

const commandPaletteRef = useTemplateRef('commandPaletteRef')
defineExpose({ commandPaletteRef })
</script>

<template>
  <UModal v-model:open="open" :class="ui.modal({ class: props.class })">
    <template #content>
      <slot name="content">
        <UCommandPalette
          ref="commandPaletteRef"
          v-model:search-term="searchTerm"
          v-bind="commandPaletteProps"
          :groups="groups"
          :fuse="fuse"
          :ui="transformUI(ui, props.ui)"
          @update:model-value="onSelect"
          @update:open="open = $event"
        >
          <template v-for="(_, name) in proxySlots" :key="name" #[name]="slotProps">
            <slot :name="name" v-bind="slotProps" />
          </template>
        </UCommandPalette>
      </slot>
    </template>
  </UModal>
</template>
