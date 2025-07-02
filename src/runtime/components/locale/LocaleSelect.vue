<script lang="ts">
import type { SelectMenuProps, Locale } from '../../types'

export interface LocaleSelectProps extends
  /** @vue-ignore */
  Pick<
    SelectMenuProps<any>,
    'color' | 'variant' | 'size' | 'trailingIcon' | 'selectedIcon' | 'content' | 'arrow' | 'portal' | 'disabled' | 'ui'
  > {
  locales?: Locale<any>[]
}
</script>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const props = defineProps<LocaleSelectProps>()
const modelValue = defineModel<string | undefined>()

function getEmojiFlag(locale: string): string {
  const languageToCountry: Record<string, string> = {
    ar: 'sa',
    bn: 'bd',
    ca: 'es',
    ckb: 'iq',
    cs: 'cz',
    da: 'dk',
    el: 'gr',
    en: 'gb',
    et: 'ee',
    he: 'il',
    hi: 'in',
    hy: 'am',
    ja: 'jp',
    km: 'kh',
    ko: 'kr',
    nb: 'no',
    sv: 'se',
    uk: 'ua',
    ur: 'pk',
    vi: 'vn'
  }

  const baseLanguage = locale.split('-')[0]?.toLowerCase() || locale
  const countryCode = languageToCountry[baseLanguage] || locale.replace(/^.*-/, '').slice(0, 2)

  return countryCode
    .toUpperCase()
    .split('')
    .map(char => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join('')
}
</script>

<template>
  <USelectMenu
    v-model="modelValue"
    :search-input="false"
    value-key="code"
    label-key="name"
    :items="props.locales"
    v-bind="$attrs"
  >
    <template #leading>
      <span v-if="modelValue" class="size-5 text-center">
        {{ getEmojiFlag(modelValue) }}
      </span>
    </template>

    <template #item-leading="{ item }">
      <span class="size-5 text-center">
        {{ getEmojiFlag(item.code) }}
      </span>
    </template>
  </USelectMenu>
</template>
