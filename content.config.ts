import { defineCollection, z } from '@nuxt/content'

// content/config.ts
export default defineCollection({
  type: 'data',
  schema: z.object({
    // إعداداتك هنا, for example:
    title: z.string()
    // add more fields as n eeded
  })
})
