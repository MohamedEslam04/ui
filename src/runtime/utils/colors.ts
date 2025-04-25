import colors from 'tailwindcss/colors'

export const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

export function getColor(color: keyof typeof colors, shade: typeof shades[number]): string {
  if (color in colors && typeof colors[color] === 'object' && shade in colors[color]) {
    return colors[color][shade] as string
  }
  return ''
}

export function generateShades(key: string, value: string) {
  return `${shades.map(shade => `--ui-color-${key}-${shade}: var(--color-${value === 'neutral' ? 'old-neutral' : value}-${shade}, ${getColor(value as keyof typeof colors, shade)});`).join('\n  ')}`
}

export function generateColor(key: string, shade: number) {
  return `--ui-${key}: var(--ui-color-${key}-${shade});`
}

export function generateColorStyles(colors: Record<string, string>) {
  const { neutral, ...rest } = colors

  return `@layer base {
  :root {
  ${Object.entries(colors).map(([key, value]: [string, string]) => generateShades(key, value)).join('\n  ')}
  }
  :root, .light {
  ${Object.keys(rest).map(key => generateColor(key, 500)).join('\n  ')}
  }
  .dark {
  ${Object.keys(rest).map(key => generateColor(key, 400)).join('\n  ')}
  }
}`
}
