---
title: CodeGroup
description: 'Group multiple code examples in tabbed interfaces for easy comparison.'
framework: nuxt
category: components
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/prose/CodeGroup.vue
---

## Usage

Wrap your code blocks around a `code-group` component to group them together in tabs.

::code-preview{class="[&>div]:*:my-0 [&>div]:*:w-full"}

:::code-group

```bash [pnpm]
pnpm add @eslamdevui/ui
```

```bash [yarn]
yarn add @eslamdevui/ui
```

```bash [npm]
npm install @eslamdevui/ui
```

```bash [bun]
bun add @eslamdevui/ui
```

:::

#code

````mdc
::code-group

```bash [pnpm]
pnpm add @eslamdevui/ui
```

```bash [yarn]
yarn add @eslamdevui/ui
```

```bash [npm]
npm install @eslamdevui/ui
```

```bash [bun]
bun add @eslamdevui/ui
```

::
````

::

::note{to="/docs/typography/code#code-blocks"}
Like the `ProsePre` component, the `CodeGroup` handles filenames, icons and copy button.
::

## API

### Props

:component-props{prose}

### Slots

:component-slots{prose}

## Theme

:component-theme{prose}

## Changelog

:component-changelog{prefix="prose"}
