import { addComponentsDir, addImportsDir, addPlugin, addVitePlugin, createResolver, defineNuxtModule, hasNuxtModule, installModule } from '@nuxt/kit'
import type { HookResult } from '@nuxt/schema'
import * as _nuxt_schema from '@nuxt/schema'
import { defu } from 'defu'
import { name, version } from '../package.json'
import { defaultOptions, getDefaultUiConfig, resolveColors } from './defaults'
import { addTemplates } from './templates'

export type * from './runtime/types'

type Color = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | (string & {})
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | (string & {})

export interface ModuleOptions {
  /**
   * Prefix for components
   * @defaultValue `U`
   * @link https://ui.nuxt.com/getting-started/installation/nuxt#prefix
   */
  prefix?: string

  /**
   * Enable or disable `@nuxt/fonts` module
   * @defaultValue `true`
   * @link https://ui.nuxt.com/getting-started/installation/nuxt#fonts
   */
  fonts?: boolean

  /**
   * Enable or disable `@nuxtjs/color-mode` module
   * @defaultValue `true`
   * @link https://ui.nuxt.com/getting-started/installation/nuxt#colormode
   */
  colorMode?: boolean

  /**
   * Customize how the theme is generated
   * @link https://ui.nuxt.com/getting-started/theme
   */
  theme?: {
    /**
     * Define the color aliases available for components
     * @defaultValue `['primary', 'secondary', 'success', 'info', 'warning', 'error']`
     * @link https://ui.nuxt.com/getting-started/installation/nuxt#themecolors
     */
    colors?: Color[]

    /**
     * Enable or disable transitions on components
     * @defaultValue `true`
     * @link https://ui.nuxt.com/getting-started/installation/nuxt#themetransitions
     */
    transitions?: boolean

    defaultVariants?: {
      /**
       * The default color variant to use for components
       * @defaultValue `'primary'`
       */
      color?: Color

      /**
       * The default size variant to use for components
       * @defaultValue `'md'`
       */
      size?: Size
    }
  }

  /**
   * Force the import of prose components even if @nuxtjs/mdc or @nuxt/content is not installed
   * @defaultValue false
   */
  mdc?: boolean
  /**
   * Force the import of content & prose components even if @nuxt/content is not installed
   * @defaultValue false
   */
  content?: boolean
}

declare module '#app' {
  interface RuntimeNuxtHooks {
    'dashboard:search:toggle': () => HookResult
    'dashboard:sidebar:toggle': () => HookResult
    'dashboard:sidebar:collapse': (value: boolean) => HookResult
  }
}

// Create a helper function to generate component mappings
function generateProseComponentMap(components: string[]): Record<string, string> {
  return components.reduce((map, component) => {
    // Convert kebab-case to PascalCase
    const pascalCase = component
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')

    map[component] = `Prose${pascalCase}`
    return map
  }, {} as Record<string, string>)
}

// Define the prose components
const proseComponents = [
  'accordion',
  'accordion-item',
  'badge',
  'callout',
  'card',
  'card-group',
  'caution',
  'code-collapse',
  'code-group',
  'code-icon',
  'code-preview',
  'code-tree',
  'collapsible',
  'field',
  'field-group',
  'icon',
  'kbd',
  'note',
  'steps',
  'tabs',
  'tabs-item',
  'tip',
  'warning'
]

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    docs: 'https://ui.nuxt.com/getting-started/installation/nuxt',
    configKey: 'ui',
    compatibility: {
      nuxt: '>=3.16.0'
    }
  },
  defaults: defaultOptions,
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    options.theme = options.theme || {}
    options.theme.colors = resolveColors(options.theme.colors)

    nuxt.options.ui = options

    nuxt.options.alias['#ui'] = resolve('./runtime')

    nuxt.options.appConfig.ui = defu(
      nuxt.options.appConfig.ui || {},
      getDefaultUiConfig(options.theme.colors)
    )

    // Isolate root node from portaled components
    nuxt.options.app.rootAttrs = nuxt.options.app.rootAttrs || {}
    nuxt.options.app.rootAttrs.class = [
      nuxt.options.app.rootAttrs.class,
      'isolate'
    ]
      .filter(Boolean)
      .join(' ')

    if (nuxt.options.builder === '@nuxt/vite-builder') {
      const plugin = await import('@tailwindcss/vite').then(r => r.default)
      addVitePlugin(plugin())
    } else {
      nuxt.options.postcss.plugins['@tailwindcss/postcss'] = {}
    }

    async function registerModule(
      name: string,
      key: string,
      options: Record<string, any>
    ) {
      if (!hasNuxtModule(name)) {
        await installModule(name, defu((nuxt.options as any)[key], options))
      } else {
        (nuxt.options as any)[key] = defu((nuxt.options as any)[key], options)
      }
    }

    await registerModule('@nuxt/icon', 'icon', {
      cssLayer: 'components'
    })
    if (options.fonts) {
      await registerModule('@nuxt/fonts', 'fonts', {
        defaults: {
          weights: [400, 500, 600, 700]
        }
      })
    }
    if (options.colorMode) {
      await registerModule('@nuxtjs/color-mode', 'colorMode', {
        classSuffix: '',
        disableTransition: true
      })
    }

    addPlugin({ src: resolve('./runtime/plugins/colors') })

    if (
      hasNuxtModule('@nuxtjs/mdc')
      || options.mdc
      || hasNuxtModule('@nuxt/content')
      || options.content
    ) {
      (nuxt.options as any).mdc = defu((nuxt.options as any).mdc, {
        highlight: {
          theme: {
            light: 'material-theme-lighter',
            default: 'material-theme',
            dark: 'material-theme-palenight'
          }
        },
        components: {
          map: generateProseComponentMap(proseComponents)
        }
      })
    }

    addComponentsDir({
      path: resolve('./runtime/components/prose'),
      prefix: 'Prose',
      pathPrefix: false,
      global: true
    })

    if (hasNuxtModule('@nuxt/content') || options.content) {
      addComponentsDir({
        path: resolve('./runtime/components/content'),
        pathPrefix: false,
        prefix: nuxt.options.ui?.prefix || 'U'
      })
    }
    if (hasNuxtModule('@nuxtjs/color-mode')) {
      addComponentsDir({
        path: resolve('./runtime/components/color-mode'),
        pathPrefix: false,
        prefix: nuxt.options.ui?.prefix || 'U'
      })
    } else {
      addImportsDir(resolve('./runtime/composables/color-mode'))
    }

    addComponentsDir({
      path: resolve('./runtime/components'),
      prefix: nuxt.options.ui?.prefix || 'U',
      pathPrefix: false,
      ignore: ['color-mode/**', 'content/**', 'prose/**']
    })

    addImportsDir(resolve('./runtime/composables'))

    addTemplates(options, nuxt, resolve)
  }
})
