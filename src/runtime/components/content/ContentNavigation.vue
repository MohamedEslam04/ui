<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { AccordionRootProps, AccordionRootEmits } from 'reka-ui'
import type { BadgeProps, LinkProps, ComponentConfig } from '../../types'
import type { ContentNavigationItem } from '@nuxt/content'
import theme from '#build/ui/content-navigation'

export type ContentNavigation = ComponentConfig<typeof theme, AppConfig, 'contentNavigation'>

export interface ContentNavigationLink extends ContentNavigationItem {
  icon?: string
  badge?: string | number | BadgeProps
  target?: LinkProps['target']
  trailingIcon?: string
  disabled?: boolean
  children?: ContentNavigationLink[]
  defaultOpen?: boolean
  active?: boolean
  class?: any
  ui?: Partial<ContentNavigation['slots']>
}

export interface ContentNavigationProps<T extends ContentNavigationLink = ContentNavigationLink> extends Pick<AccordionRootProps, 'disabled' | 'type' | 'unmountOnHide'> {
  as?: any
  defaultOpen?: boolean
  trailingIcon?: string
  color?: ContentNavigation['variants']['color']
  variant?: ContentNavigation['variants']['variant']
  highlight?: boolean
  highlightColor?: ContentNavigation['variants']['highlightColor']
  collapsible?: boolean
  level?: number
  navigation?: T[]
  class?: any
  ui?: Partial<ContentNavigation['slots']>
}

export interface ContentNavigationEmits extends AccordionRootEmits {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useAppConfig } from '#imports'
import { Primitive, AccordionRoot, AccordionItem, AccordionTrigger, AccordionContent, useForwardPropsEmits } from 'reka-ui'
import { reactivePick, createReusableTemplate } from '@vueuse/core'
import { pickLinkProps } from '../../utils/link'
import { tv } from '../../utils/tv'
import { mapContentNavigationItem } from '../../utils/content'
import UBadge from '../Badge.vue'
import UIcon from '../Icon.vue'
import ULink from '../Link.vue'
import ULinkBase from '../LinkBase.vue'

const props = withDefaults(defineProps<ContentNavigationProps>(), {
  as: 'nav',
  defaultOpen: undefined,
  highlight: false,
  collapsible: true,
  level: 0,
  type: 'multiple',
  unmountOnHide: true
})

const emits = defineEmits<ContentNavigationEmits>()
const slots = defineSlots()
const rootProps = useForwardPropsEmits(reactivePick(props, 'collapsible', 'disabled', 'type', 'unmountOnHide'), emits)
const route = useRoute()
const appConfig = useAppConfig() as ContentNavigation['AppConfig']
const [DefineLinkTemplate, ReuseLinkTemplate] = createReusableTemplate()

const ui = computed(() =>
  tv({ extend: tv(theme), ...appConfig.ui?.contentNavigation || {} })({
    color: props.color,
    variant: props.variant,
    highlight: props.highlight,
    highlightColor: props.highlightColor || props.color
  })
)

const defaultValue = computed(() => {
  if (props.defaultOpen === false) return undefined
  if (props.defaultOpen === undefined) {
    if (props.type === 'single') {
      return '0'
    } else {
      // Only include string values, filter out any false
      return props.navigation
        ?.map((link, idx) => link.defaultOpen !== false ? String(idx) : undefined)
        .filter((v): v is string => typeof v === 'string')
    }
  }
  const index = props.navigation?.findIndex(link => route.path.startsWith(link.path || ''))
  return props.type === 'multiple' ? [String(index === -1 ? 0 : index)] : String(index === -1 ? 0 : index)
})
</script>

<template>
  <DefineLinkTemplate v-slot="{ link, active }">
    <slot name="link" :link="link" :active="active">
      <slot name="link-leading" :link="link" :active="active">
        <UIcon
          v-if="link.icon"
          :name="link.icon"
          :class="ui.linkLeadingIcon({ class: [props.ui?.linkLeadingIcon, link.ui?.linkLeadingIcon], active })"
        />
      </slot>

      <span
        v-if="link.title || !!slots['link-title']"
        :class="ui.linkTitle({ class: [props.ui?.linkTitle, link.ui?.linkTitle], active })"
      >
        <slot name="link-title" :link="link" :active="active">
          {{ link.title }}
        </slot>

        <UIcon
          v-if="link.target === '_blank'"
          :name="appConfig.ui.icons.external"
          :class="ui.linkTitleExternalIcon({ class: [props.ui?.linkTitleExternalIcon, link.ui?.linkTitleExternalIcon], active })"
        />
      </span>

      <span
        v-if="link.badge || (link.children?.length && !props.disabled) || link.trailingIcon || !!slots['link-trailing']"
        :class="ui.linkTrailing({ class: [props.ui?.linkTrailing, link.ui?.linkTrailing] })"
      >
        <slot name="link-trailing" :link="link" :active="active">
          <UBadge
            v-if="link.badge"
            color="neutral"
            variant="outline"
            :size="props.ui?.linkTrailingBadgeSize || ui.linkTrailingBadgeSize()"
            v-bind="typeof link.badge === 'string' || typeof link.badge === 'number' ? { label: link.badge } : link.badge"
            :class="ui.linkTrailingBadge({ class: props.ui?.linkTrailingBadge })"
          />

          <UIcon
            v-if="link.children?.length && !props.disabled"
            :name="link.trailingIcon || props.trailingIcon || appConfig.ui.icons.chevronDown"
            :class="ui.linkTrailingIcon({ class: [props.ui?.linkTrailingIcon, link.ui?.linkTrailingIcon] })"
          />

          <UIcon
            v-else-if="link.trailingIcon"
            :name="link.trailingIcon"
            :class="ui.linkTrailingIcon({ class: [props.ui?.linkTrailingIcon, link.ui?.linkTrailingIcon] })"
          />
        </slot>
      </span>
    </slot>
  </DefineLinkTemplate>

  <Primitive :as="props.as" :as-child="props.level > 0" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <AccordionRoot
      as="ul"
      v-bind="rootProps"
      :default-value="defaultValue"
      :class="props.level > 0 ? ui.listWithChildren({ class: props.ui?.listWithChildren }) : ui.list({ class: props.ui?.list })"
    >
      <template v-for="(link, index) in props.navigation" :key="index">
        <AccordionItem
          v-if="link.children?.length"
          as="li"
          :value="String(index)"
          :class="ui.itemWithChildren({ class: [props.ui?.itemWithChildren, link.ui?.itemWithChildren], level: props.level > 0 })"
        >
          <AccordionTrigger
            as="button"
            :class="[
              ui.link({ class: [props.ui?.link, link.ui?.link, link.class], active: link.active, disabled: !!link.disabled }),
              ui.trigger({ class: [props.ui?.trigger, link.ui?.trigger] })
            ]"
          >
            <ReuseLinkTemplate :link="link" :active="link.active" />
          </AccordionTrigger>

          <AccordionContent :class="ui.content({ class: [props.ui?.content, link.ui?.content] })">
            <UContentNavigation
              v-bind="rootProps"
              :navigation="link.children"
              :default-open="props.defaultOpen"
              :level="props.level + 1"
              :trailing-icon="props.trailingIcon"
              :color="props.color"
              :variant="props.variant"
              :highlight="props.highlight"
              :highlight-color="props.highlightColor"
              :ui="props.ui"
            >
              <template v-for="(_, name) in slots" #[name]="slotData">
                <slot :name="name" :link="slotData.link" :active="slotData.active" />
              </template>
            </UContentNavigation>
          </AccordionContent>
        </AccordionItem>

        <li v-else :class="ui.item({ class: [props.ui?.item, link.ui?.item], level: props.level > 0 })">
          <ULink v-slot="{ active, ...slotProps }" v-bind="pickLinkProps(mapContentNavigationItem(link))" custom>
            <ULinkBase
              v-bind="slotProps"
              :class="ui.link({ class: [props.ui?.link, link.ui?.link, link.class], active, disabled: !!link.disabled, level: props.level > 0 })"
            >
              <ReuseLinkTemplate :link="link" :active="active" />
            </ULinkBase>
          </ULink>
        </li>
      </template>
    </AccordionRoot>
  </Primitive>
</template>
