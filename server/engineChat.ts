import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin } from 'vite'

interface ChatBody {
  messages?: Array<{
    role: string
    content: string | Array<Record<string, unknown>>
  }>
  model?: string
  apiKey?: string
  baseUrl?: string
  temperature?: number
}

const SYSTEM_FALLBACK = `You are Baazex Engine, a live educational AI tutor for forex, CFDs, MetaTrader 5, market structure, and risk.
Answer like ChatGPT: directly, specifically, and in the context of the whole conversation.
Never give buy/sell calls, entries, take-profit or stop-loss prices. If asked, refuse the call and still teach the concept.
Do not invent live prices. Keep a professional tutor tone.`

function readBody(req: IncomingMessage) {
  return new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

async function ollamaReady() {
  try {
    const response = await fetch('http://127.0.0.1:11434/api/tags', { signal: AbortSignal.timeout(350) })
    if (!response.ok) return null
    const payload = (await response.json()) as { models?: Array<{ name?: string }> }
    return payload.models?.[0]?.name ?? 'llama3.2'
  } catch {
    return null
  }
}

async function resolveTarget(body: ChatBody) {
  const envKey =
    process.env.AI_API_KEY ||
    process.env.OPENAI_API_KEY ||
    process.env.GROQ_API_KEY ||
    process.env.OPENROUTER_API_KEY ||
    process.env.POLLINATIONS_KEY ||
    process.env.VITE_AI_API_KEY
  const envBase = process.env.AI_BASE_URL || process.env.VITE_AI_BASE_URL
  const envModel = process.env.AI_MODEL || process.env.VITE_AI_MODEL
  const key = body.apiKey?.trim() || envKey || ''
  const base = (body.baseUrl?.trim() || envBase || '').replace(/\/$/, '')
  const requested = body.model?.trim() || envModel

  if (base && (key || base.includes('11434') || base.includes('pollinations'))) {
    const path = base.endsWith('/v1') ? `${base}/chat/completions` : `${base}/v1/chat/completions`
    return { url: base.includes('/chat/completions') || base.includes('/openai') ? base : path, key, model: requested || 'gpt-4o-mini' }
  }
  if (key.startsWith('gsk_')) {
    return { url: 'https://api.groq.com/openai/v1/chat/completions', key, model: requested || 'llama-3.3-70b-versatile' }
  }
  if (key.startsWith('sk-or-')) {
    return { url: 'https://openrouter.ai/api/v1/chat/completions', key, model: requested || 'openai/gpt-4o-mini' }
  }
  if (key.startsWith('sk-')) {
    return { url: 'https://api.openai.com/v1/chat/completions', key, model: requested || 'gpt-4o-mini' }
  }

  const ollama = await ollamaReady()
  if (ollama) {
    return { url: 'http://127.0.0.1:11434/v1/chat/completions', key: 'ollama', model: requested || ollama }
  }

  return {
    url: 'https://text.pollinations.ai/openai',
    key: key || 'anonymous',
    model: requested || 'openai',
  }
}

async function handleChat(req: IncomingMessage, res: ServerResponse) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    res.end()
    return
  }
  if (req.method !== 'POST') {
    res.statusCode = 405
    res.end('Method not allowed')
    return
  }

  const abort = new AbortController()
  const cancel = () => abort.abort()
  req.on('aborted', cancel)
  res.on('close', () => {
    if (!res.writableEnded) cancel()
  })

  try {
    const raw = await readBody(req)
    const body = (raw ? JSON.parse(raw) : {}) as ChatBody
    const messages = body.messages?.length ? body.messages : [{ role: 'system', content: SYSTEM_FALLBACK }]
    const target = await resolveTarget(body)
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (target.key && target.key !== 'anonymous') headers.Authorization = `Bearer ${target.key}`

    const upstream = await fetch(target.url, {
      method: 'POST',
      headers,
      signal: abort.signal,
      body: JSON.stringify({
        model: target.model,
        temperature: body.temperature ?? 0.6,
        stream: true,
        messages,
      }),
    })

    if (!upstream.ok || !upstream.body) {
      const detail = await upstream.text().catch(() => '')
      res.statusCode = upstream.status || 502
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: detail.slice(0, 400) || 'The live model could not reply.' }))
      return
    }

    res.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
      'X-Engine-Model': target.model,
    })

    const reader = upstream.body.getReader()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      res.write(value)
    }
    res.end()
  } catch (error) {
    if (abort.signal.aborted) {
      res.end()
      return
    }
    if (!res.headersSent) {
      res.statusCode = 502
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Engine proxy failed.' }))
    } else {
      res.end()
    }
  }
}

export function engineChatPlugin(): Plugin {
  return {
    name: 'baazex-engine-chat',
    configureServer(server) {
      server.middlewares.use('/api/engine/chat', (req, res) => {
        void handleChat(req, res)
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/engine/chat', (req, res) => {
        void handleChat(req, res)
      })
    },
  }
}
