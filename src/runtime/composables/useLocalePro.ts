import type { Ref } from 'vue'
import { computed, inject, toRef } from 'vue'
import { createSharedComposable } from '@vueuse/core'
import { buildLocaleContext } from '../utils/locale'
import type { Messages, Locale } from '../types/locale'
import en from '../locale/en'
import { localeContextInjectionKey } from './useLocale'

const _useLocalePro = (
  localeOverrides?: Ref<Locale<Messages> | undefined>
) => {
  const injectedLocale = inject(localeContextInjectionKey) as Ref<Locale<Messages> | undefined> | undefined
  const locale = localeOverrides || toRef(injectedLocale)
  return buildLocaleContext<Messages>(computed(() => locale.value || en))
}

export const useLocalePro = /* @__PURE__ */ createSharedComposable(_useLocalePro)
