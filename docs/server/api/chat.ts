import { streamText, tool } from 'ai'
import { createWorkersAI } from 'workers-ai-provider'
import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const { messages } = await readBody(event)

  // Enable AI Gateway if defined in environment variables
  const gateway = process.env.CLOUDFLARE_AI_GATEWAY_ID
    ? {
        id: process.env.CLOUDFLARE_AI_GATEWAY_ID,
        cacheTtl: 60 * 60 * 24 // 24 hours
      }
    : undefined
  const workersAI = createWorkersAI({ binding: hubAI(), gateway })
  const autorag = hubAutoRAG('ui3')

  return streamText({
    model: workersAI('@cf/meta/llama-3.3-70b-instruct-fp8-fast'),
    maxTokens: 10000,
    messages,
    system: `You are a helpful assistant for Nuxt UI. Check your knowledge base before answering any questions.
    Only respond to questions using information from tool calls.
    if no relevant information is found in the tool calls, respond, "Sorry, I don't know."
    Format your markdown response using the following rules:
    - Use the vue lang for code blocks syntax highlighting.
    - Don't use markdown headings.
    `,
    tools: {
      searchDocumentation: tool({
        description: `search the documentation for information to answer questions.`,
        parameters: z.object({
          question: z.string().describe('the users question')
        }),
        execute: async ({ question }) => {
          return (await autorag.aiSearch({ query: question })).response
        }
      })
    }
  }).toDataStreamResponse()
})
