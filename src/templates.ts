import { fileURLToPath } from 'node:url'
import { kebabCase } from 'scule'
import { addTemplate, addTypeTemplate } from '@nuxt/kit'
import type { Nuxt, NuxtTemplate, NuxtTypeTemplate } from '@nuxt/schema'
import type { Resolver } from '@nuxt/kit'
import type { ModuleOptions } from './module'
import * as theme from './theme'
import * as contentTheme from './theme/content'
import * as proseTheme from './theme/prose'
import colors from 'tailwindcss/colors'
import { genExport } from 'knitwork'

// Define theme collections with their respective folder paths
const themeCollections = {
  '': theme, // Root theme files
  'content': contentTheme,
  'prose': proseTheme
} as const

export function buildTemplates(options: ModuleOptions) {
  const templates: Record<string, any> = {}

  // Process each theme collection
  for (const [folder, themeCollection] of Object.entries(themeCollections)) {
    const folderKey = folder || 'root'
    templates[folderKey] = {}

    for (const [key, component] of Object.entries(themeCollection)) {
      // const fullKey = folder ? `${folder}/${key}` : key
      templates[folderKey][key] = typeof component === 'function'
        ? component(options as Required<ModuleOptions>)
        : component
    }
  }

  return templates
}

function generateVariantDeclarations(variants: string[], result: any) {
  return variants
    .filter(variant => result.variants?.[variant])
    .map((variant) => {
      const keys = Object.keys(result.variants[variant])
      return `const ${variant} = ${JSON.stringify(keys, null, 2)} as const`
    })
}

function processJsonWithVariants(json: string, variants: string[]) {
  let processedJson = json

  for (const variant of variants) {
    processedJson = processedJson.replace(
      new RegExp(`("${variant}": "[^"]+")`, 'g'),
      `$1 as typeof ${variant}[number]`
    )
    processedJson = processedJson.replace(
      new RegExp(`("${variant}": \\[\\s*)((?:"[^"]+",?\\s*)+)(\\])`, 'g'),
      (_, before, match, after) => {
        const replaced = match.replace(/("[^"]+")/g, `$1 as typeof ${variant}[number]`)
        return `${before}${replaced}${after}`
      }
    )
  }

  return processedJson
}

export function getTemplates(options: ModuleOptions, uiConfig: Record<string, any>) {
  const templates: NuxtTemplate[] = []

  // Process each theme collection
  for (const [folder, themeCollection] of Object.entries(themeCollections)) {
    for (const [component, template] of Object.entries(themeCollection)) {
      const folderPath = folder ? `${folder}/` : ''
      const filename = `ui/${folderPath}${kebabCase(component)}.ts`

      templates.push({
        filename,
        write: true,
        getContents: async () => {
          const result = typeof template === 'function' ? template(options) : template

        // Override default variants from nuxt.config.ts
        if (result?.defaultVariants?.color && options.theme?.defaultVariants?.color) {
          result.defaultVariants.color = options.theme.defaultVariants.color
        }
        if (result?.defaultVariants?.size && options.theme?.defaultVariants?.size) {
          result.defaultVariants.size = options.theme.defaultVariants.size
        }

          const variants = Object.entries(result.variants || {})
            .filter(([_, values]) => {
              const keys = Object.keys(values as Record<string, unknown>)
              return keys.some(key => key !== 'true' && key !== 'false')
            })
            .map(([key]) => key)

          let json = JSON.stringify(result, null, 2)
          json = processJsonWithVariants(json, variants)

          // For local development, import directly from theme
          if (process.argv.includes('--uiDev')) {
            const themePath = folder ? `./theme/${folder}/${kebabCase(component)}` : `./theme/${kebabCase(component)}`
            const templatePath = fileURLToPath(new URL(themePath, import.meta.url))

            return [
              `import template from ${JSON.stringify(templatePath)}`,
              ...generateVariantDeclarations(variants, result),
              `const options = ${JSON.stringify(options, null, 2)}`,
            `const result = typeof template === 'function' ? (template as Function)(options) : template`,
            `if (result?.defaultVariants?.color && options.theme?.defaultVariants?.color) result.defaultVariants.color = options.theme.defaultVariants.color`,
            `if (result?.defaultVariants?.size && options.theme?.defaultVariants?.size) result.defaultVariants.size = options.theme.defaultVariants.size`,
              `const theme = ${json}`,
              `export default result as typeof theme`
            ].join('\n\n')
          }

          // For production build
          return [
            ...generateVariantDeclarations(variants, result),
            `export default ${json}`
          ].join('\n\n')
        }
      })
    }
  }

  // Generate CSS template
  templates.push({
    filename: 'ui.css',
    write: true,
    getContents: () => `@source "./ui";

@theme static {
  --color-old-neutral-50: ${colors.neutral[50]};
  --color-old-neutral-100: ${colors.neutral[100]};
  --color-old-neutral-200: ${colors.neutral[200]};
  --color-old-neutral-300: ${colors.neutral[300]};
  --color-old-neutral-400: ${colors.neutral[400]};
  --color-old-neutral-500: ${colors.neutral[500]};
  --color-old-neutral-600: ${colors.neutral[600]};
  --color-old-neutral-700: ${colors.neutral[700]};
  --color-old-neutral-800: ${colors.neutral[800]};
  --color-old-neutral-900: ${colors.neutral[900]};
  --color-old-neutral-950: ${colors.neutral[950]};
}

@theme default inline {
  ${[...(options.theme?.colors || []).filter(color => !colors[color as keyof typeof colors]), 'neutral'].map(color => [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map(shade => `--color-${color}-${shade}: var(--ui-color-${color}-${shade});`).join('\n\t')).join('\n\t')}
  ${options.theme?.colors?.map(color => `--color-${color}: var(--ui-${color});`).join('\n\t')}
  --radius-xs: calc(var(--ui-radius) * 0.5);
  --radius-sm: var(--ui-radius);
  --radius-md: calc(var(--ui-radius) * 1.5);
  --radius-lg: calc(var(--ui-radius) * 2);
  --radius-xl: calc(var(--ui-radius) * 3);
  --radius-2xl: calc(var(--ui-radius) * 4);
  --radius-3xl: calc(var(--ui-radius) * 6);
  --text-color-dimmed: var(--ui-text-dimmed);
  --text-color-muted: var(--ui-text-muted);
  --text-color-toned: var(--ui-text-toned);
  --text-color-default: var(--ui-text);
  --text-color-highlighted: var(--ui-text-highlighted);
  --text-color-inverted: var(--ui-text-inverted);
  --background-color-default: var(--ui-bg);
  --background-color-muted: var(--ui-bg-muted);
  --background-color-elevated: var(--ui-bg-elevated);
  --background-color-accented: var(--ui-bg-accented);
  --background-color-inverted: var(--ui-bg-inverted);
  --background-color-border: var(--ui-border);
  --border-color-default: var(--ui-border);
  --border-color-muted: var(--ui-border-muted);
  --border-color-accented: var(--ui-border-accented);
  --border-color-inverted: var(--ui-border-inverted);
  --border-color-bg: var(--ui-bg);
  --ring-color-default: var(--ui-border);
  --ring-color-muted: var(--ui-border-muted);
  --ring-color-accented: var(--ui-border-accented);
  --ring-color-inverted: var(--ui-border-inverted);
  --ring-color-bg: var(--ui-bg);
  --ring-offset-color-default: var(--ui-border);
  --ring-offset-color-muted: var(--ui-border-muted);
  --ring-offset-color-accented: var(--ui-border-accented);
  --ring-offset-color-inverted: var(--ui-border-inverted);
  --ring-offset-color-bg: var(--ui-bg);
  --divide-color-default: var(--ui-border);
  --divide-color-muted: var(--ui-border-muted);
  --divide-color-accented: var(--ui-border-accented);
  --divide-color-inverted: var(--ui-border-inverted);
  --divide-color-bg: var(--ui-bg);
  --outline-color-default: var(--ui-border);
  --outline-color-inverted: var(--ui-border-inverted);
  --stroke-default: var(--ui-border);
  --stroke-inverted: var(--ui-border-inverted);
  --fill-default: var(--ui-border);
  --fill-inverted: var(--ui-border-inverted);
}
`
  })

  // Generate main index file with all exports
  templates.push({
    filename: 'ui/index.ts',
    write: true,
    getContents: () => {
      const exports: string[] = []

      // Export root theme components
      for (const component of Object.keys(theme)) {
        exports.push(`export { default as ${component} } from './${kebabCase(component)}'`)
      }

      // // Export content theme components
      // for (const component of Object.keys(contentTheme)) {
      //   exports.push(`export { default as ${component} } from './content/${kebabCase(component)}'`)
      // }

      // // Export prose theme components
      // for (const component of Object.keys(proseTheme)) {
      //   exports.push(`export { default as ${component} } from './prose/${kebabCase(component)}'`)
      // }

      return exports.join('\n')
    }
  })

  // Generate subfolder index files
  templates.push({
    filename: 'ui/content/index.ts',
    write: true,
    getContents: () => Object.keys(contentTheme)
      .map(component => `export { default as ${component} } from './${kebabCase(component)}'`)
      .join('\n')
  })

  templates.push({
    filename: 'ui/prose/index.ts',
    write: true,
    getContents: () => Object.keys(proseTheme)
      .map(component => `export { default as ${component} } from './${kebabCase(component)}'`)
      .join('\n')
  })

  // Generate TypeScript definitions
  templates.push({
    filename: 'types/ui.d.ts',
    getContents: () => `import * as ui from '#build/ui'
import type { TVConfig } from '@eslamdevui/ui'
import type { defaultConfig } from 'tailwind-variants'
import colors from 'tailwindcss/colors'

const icons = ${JSON.stringify(uiConfig.icons)};

type NeutralColor = 'slate' | 'gray' | 'zinc' | 'neutral' | 'stone'
type Color = Exclude<keyof typeof colors, 'inherit' | 'current' | 'transparent' | 'black' | 'white' | NeutralColor> | (string & {})

type AppConfigUI = {
  colors?: {
    ${options.theme?.colors?.map(color => `'${color}'?: Color`).join('\n\t\t')}
    neutral?: NeutralColor | (string & {})
  }
  icons?: Partial<typeof icons>
  tv?: typeof defaultConfig
} & TVConfig<typeof ui>

declare module '@nuxt/schema' {
  interface AppConfigInput {
    /**
     * Nuxt UI theme configuration
     * @see https://ui.nuxt.com/getting-started/theme#customize-theme
     */
    ui?: AppConfigUI
  }
}

export {}
`
  })

  // Generate image component template
  templates.push({
    filename: 'ui-image-component.ts',
    write: true,
    getContents: ({ app }) => {
      const image = app?.components?.find(c => c.pascalName === 'NuxtImg' && !/nuxt(?:-nightly)?\/dist\/app/.test(c.filePath))
      return image ? genExport(image.filePath, [{ name: image.export, as: 'default' }]) : 'export default "img"'
    }
  })

  return templates
}

export function addTemplates(options: ModuleOptions, nuxt: Nuxt, resolve: Resolver['resolve']) {
  const templates = getTemplates(options, nuxt.options.appConfig.ui)
  for (const template of templates) {
    if (template.filename!.endsWith('.d.ts')) {
      addTypeTemplate(template as NuxtTypeTemplate)
    } else {
      addTemplate(template)
    }
  }

  nuxt.hook('prepare:types', ({ references }) => {
    references.push({ path: resolve('./runtime/types/app.config.d.ts') })
  })
}
