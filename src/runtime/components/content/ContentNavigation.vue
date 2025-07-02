<script lang="ts">
import type { AccordionRootProps, AccordionRootEmits } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import type { BadgeProps, LinkProps, ComponentConfig } from '../../types'
import type { ContentNavigationItem } from '@nuxt/content'
import theme from '#build/ui/content/content-navigation'

export type ContentNavigation<T>
  = ComponentConfig<typeof theme, AppConfig, 'contentNavigation'>

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
  ui?: Partial<ContentNavigation<T>['slots']>
}

export interface ContentNavigationProps<T extends ContentNavigationLink = ContentNavigationLink>
  extends Pick<AccordionRootProps, 'disabled' | 'type' | 'unmountOnHide'> {
  as?: any
  defaultOpen?: boolean
  trailingIcon?: string
  color?: ContentNavigation<T>['variants']['color']
  variant?: ContentNavigation<T>['variants']['variant']
  highlight?: boolean
  highlightColor?: ContentNavigation<T>['variants']['highlightColor']
  collapsible?: boolean
  level?: number
  navigation?: T[]
  class?: any
  ui?: ContentNavigation<T>['slots']
}

export interface ContentNavigationEmits extends AccordionRootEmits {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import {
  Primitive,
  AccordionRoot,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  useForwardPropsEmits
} from 'reka-ui'
import { pickLinkProps } from '../../utils/link'
import { reactivePick, createReusableTemplate } from '@vueuse/core'
import { useRoute, useAppConfig } from '#imports'
import { tv } from '../../utils/tv'
import { mapContentNavigationItem } from '../../utils/content'

const props = withDefaults(defineProps<ContentNavigationProps>(), {
  as: 'nav',
  defaultOpen: undefined,
  highlight: false,
  collapsible: true,
  level: 0,
  type: 'multiple',
  unmountOnHide: true
})

const emit = defineEmits<ContentNavigationEmits>()
const slots = defineSlots<ContentNavigationEmits>()
const rootProps = useForwardPropsEmits(
  reactivePick(props, 'disabled', 'type', 'unmountOnHide'),
  emit
)

const route = useRoute()
const appConfig = useAppConfig()

const [DefineLink, ReuseLink] = createReusableTemplate()

const uiPro = computed(() =>
  tv({ extend: tv(theme), ...appConfig.uiPro?.contentNavigation })(
    {
      color: props.color,
      variant: props.variant,
      highlight: props.highlight,
      highlightColor: props.highlightColor || props.color
    }
  )
)

const defaultValue = computed(() => {
  if (props.defaultOpen === false) return undefined
  if (props.defaultOpen === undefined) {
    if (props.type === 'single') return '0'
    return props.navigation
      ?.map((link, i) => link.defaultOpen !== false && String(i))
      .filter(Boolean)
  }
  const idx = props.navigation?.findIndex(l => route.path.startsWith(l.path)) ?? 0
  return props.type === 'multiple' ? [String(idx)] : String(idx)
})
</script>

<template>
  <DefineLink v-slot="{ link, active }">
    <slot name="link" :link="link" :active="active">
      <slot name="link-leading" :link="link" :active="active">
        <UIcon
          v-if="link.icon"
          :name="link.icon"
          :class="uiPro.linkLeadingIcon({ class: [props.ui?.linkLeadingIcon, link.ui?.linkLeadingIcon], active })"
        />
      </slot>
      <span
        v-if="link.title || $slots['link-title']"
        :class="uiPro.linkTitle({ class: [props.ui?.linkTitle, link.ui?.linkTitle], active })"
      >
        <slot name="link-title" :link="link" :active="active">{{ link.title }}</slot>
        <UIcon
          v-if="link.target === '_blank'"
          :name="appConfig.ui.icons.external"
          :class="uiPro.linkTitleExternalIcon({ class: [props.ui?.linkTitleExternalIcon, link.ui?.linkTitleExternalIcon], active })"
        />
      </span>
      <span
        v-if="link.badge || (link.children?.length && !props.disabled) || link.trailingIcon || $slots['link-trailing']"
        :class="uiPro.linkTrailing({ class: [props.ui?.linkTrailing, link.ui?.linkTrailing] })"
      >
        <slot name="link-trailing" :link="link" :active="active">
          <UBadge
            v-if="link.badge"
            color="neutral"
            variant="outline"
            :size="props.ui?.linkTrailingBadgeSize || uiPro.linkTrailingBadgeSize()"
            v-bind="typeof link.badge === 'string' || typeof link.badge === 'number' ? { label: link.badge } : link.badge"
            :class="uiPro.linkTrailingBadge({ class: props.ui?.linkTrailingBadge })"
          />
          <UIcon
            v-if="link.children?.length && !props.disabled"
            :name="link.trailingIcon || props.trailingIcon || appConfig.ui.icons.chevronDown"
            :class="uiPro.linkTrailingIcon({ class: [props.ui?.linkTrailingIcon, link.ui?.linkTrailingIcon] })"
          />
          <UIcon
            v-else-if="link.trailingIcon"
            :name="link.trailingIcon"
            :class="uiPro.linkTrailingIcon({ class: [props.ui?.linkTrailingIcon, link.ui?.linkTrailingIcon] })"
          />
        </slot>
      </span>
    </slot>
  </DefineLink>

  <Primitive
    :as="props.as"
    :as-child="props.level > 0"
    :class="uiPro.root({ class: [props.ui?.root, props.class] })"
  >
    <AccordionRoot
      as="ul"
      v-bind="rootProps"
      :default-value="defaultValue"
      :class="props.level > 0
        ? uiPro.listWithChildren({ class: props.ui?.listWithChildren })
        : uiPro.list({ class: props.ui?.list })"
    >
      <template v-for="(link, idx) in props.navigation" :key="idx">
        <AccordionItem
          v-if="link.children?.length"
          as="li"
          :class="uiPro.itemWithChildren({ class: [props.ui?.itemWithChildren, link.ui?.itemWithChildren], level: props.level > 0 })"
          :value="String(idx)"
        >
          <AccordionTrigger
            as="button"
            :class="[
              uiPro.link({ class: [props.ui?.link, link.ui?.link, link.class], active: link.active, disabled: !!link.disabled }),
              uiPro.trigger({ class: [props.ui?.trigger, link.ui?.trigger] })
            ]"
          >
            <ReuseLink :link="link" :active="link.active" />
          </AccordionTrigger>
          <AccordionContent :class="uiPro.content({ class: [props.ui?.content, link.ui?.content] })">
            <ContentNavigation
              v-bind="props"
              :navigation="link.children"
              :default-open="props.defaultOpen"
              :level="props.level + 1"
            >
              <template v-for="(_, name) in slots" #[name]="slotData">
                <slot :name="name" v-bind="slotData" />
              </template>
            </ContentNavigation>
          </AccordionContent>
        </AccordionItem>
        <li v-else :class="uiPro.item({ class: [props.ui?.item, link.ui?.item], level: props.level > 0 })">
          <ULink
            v-slot="{ active, ...slotProps }"
            v-bind="pickLinkProps(mapContentNavigationItem(link))"
            custom
          >
            <ULinkBase
              v-bind="slotProps"
              :class="uiPro.link({ class: [props.ui?.link, link.ui?.link, link.class], active, disabled: !!link.disabled, level: props.level > 0 })"
            >
              <ReuseLink :link="link" :active="active" />
            </ULinkBase>
          </ULink>
        </li>
      </template>
    </AccordionRoot>
  </Primitive>
</template>
