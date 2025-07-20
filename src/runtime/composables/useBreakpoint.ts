import { createSharedComposable, useMediaQuery } from '@vueuse/core'
import { computed } from 'vue'
import { useAppConfig } from '#imports'

// Define default breakpoints (Tailwind-inspired)
const defaultBreakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
}

type BreakpointKey = keyof typeof defaultBreakpoints

type BreakpointMap = Record<BreakpointKey, string>

export function useBreakpoint() {
    const config = useAppConfig() as { ui?: { breakpoints?: Record<string, string> } }
    const breakpoints: BreakpointMap = {
        ...defaultBreakpoints,
        ...(config.ui?.breakpoints || {})
    }

    // Create media queries for each breakpoint
    const queries = {
        sm: useMediaQuery(`(min-width: ${breakpoints.sm})`),
        md: useMediaQuery(`(min-width: ${breakpoints.md})`),
        lg: useMediaQuery(`(min-width: ${breakpoints.lg})`),
        xl: useMediaQuery(`(min-width: ${breakpoints.xl})`),
        '2xl': useMediaQuery(`(min-width: ${breakpoints['2xl']})`)
    }

    // Helper to return the current active size
    const current = computed<BreakpointKey>(() => {
        const order: BreakpointKey[] = ['2xl', 'xl', 'lg', 'md', 'sm']
        for (const key of order) {
            if (queries[key].value) return key
        }
        return 'sm'
    })

    // Boolean helpers
    const isSm = queries.sm
    const isMd = queries.md
    const isLg = queries.lg
    const isXl = queries.xl
    const is2xl = queries['2xl']

    const isMobile = computed(() => !isMd.value)
    const isTablet = computed(() => isMd.value && !isLg.value)
    const isDesktop = computed(() => isLg.value)

    return {
        // individual breakpoints
        isSm,
        isMd,
        isLg,
        isXl,
        is2xl,

        // helpers
        isMobile,
        isTablet,
        isDesktop,

        // current active key
        current
    }
}

// export const useBreakpoint = /* @__PURE__ */ createSharedComposable(_useBreakpoint)
