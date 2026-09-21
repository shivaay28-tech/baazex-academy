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

function env(name: string) {
  const runtime = globalThis as unknown as { process?: { env?: Record<string, string | undefined> } }
  return runtime.process?.env?.[name]
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
    env('AI_API_KEY') ||
    env('OPENAI_API_KEY') ||
    env('GROQ_API_KEY') ||
    env('OPENROUTER_API_KEY') ||
    env('POLLINATIONS_KEY') ||
    env('VITE_AI_API_KEY')
  const envBase = env('AI_BASE_URL') || env('VITE_AI_BASE_URL')
  const envModel = env('AI_MODEL') || env('VITE_AI_MODEL')
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

export async function proxyEngineChat(request: Request): Promise<Response> {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204 })
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 })

  try {
    const body = (await request.json().catch(() => ({}))) as ChatBody
    const messages = body.messages?.length ? body.messages : [{ role: 'system', content: SYSTEM_FALLBACK }]
    const target = await resolveTarget(body)
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (target.key && target.key !== 'anonymous') headers.Authorization = `Bearer ${target.key}`

    const upstream = await fetch(target.url, {
      method: 'POST',
      headers,
      signal: request.signal,
      body: JSON.stringify({
        model: target.model,
        temperature: body.temperature ?? 0.6,
        stream: true,
        messages,
      }),
    })

    if (!upstream.ok || !upstream.body) {
      const detail = await upstream.text().catch(() => '')
      return Response.json(
        { error: detail.slice(0, 400) || 'The live model could not reply.' },
        { status: upstream.status || 502 },
      )
    }

    return new Response(upstream.body, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'X-Accel-Buffering': 'no',
        'X-Engine-Model': target.model,
      },
    })
  } catch (error) {
    if (request.signal.aborted) return new Response(null, { status: 499 })
    return Response.json(
      { error: error instanceof Error ? error.message : 'Engine proxy failed.' },
      { status: 502 },
    )
  }
}
