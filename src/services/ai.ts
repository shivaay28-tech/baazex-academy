import {
  CFD_NOTE,
  FUNDAMENTALS_NOTE,
  INSTRUMENT_STUDY,
  MT5_NOTE,
  ORDER_NOTE,
  PAIRS_NOTE,
  PSYCH_NOTE,
  RISK_NOTE,
  SESSION_NOTE,
  TA_NOTE,
  TOPIC_COURSES,
  instrumentName,
  instrumentSession,
  sessionClock,
  weekdayLabel,
} from '@/data/engineKnowledge'
import type { AiAnswerLength, AiAttachment } from '@/types'
import { DISCLAIMER } from '@/utils/constants'
import { inspectAttachments, type ChartRead } from '@/utils/chartRead'

const SYSTEM_RULES = `You are Baazex Engine, a live ChatGPT-style educational tutor for forex, CFDs, MetaTrader 5, market structure, sessions, risk, and trading psychology.

Behave like a dynamic assistant, not a template:
- Answer the user's actual question in the first sentences.
- Use the full conversation history. Follow-ups refer to what was just discussed.
- Be specific, natural, and structured. Use short headings and bullets when they help.
- If a chart or screenshot is attached, comment on what is visible as a study worksheet, then teach how to read it. Do not invent candle-by-candle prices you cannot see.
- Never give buy or sell calls, entries, take-profit, or stop-loss levels. If asked to trade, refuse the call and still teach the idea behind the question.
- Do not invent live quotes. If you lack a price, say so and keep teaching.
- You may discuss related topics (calendar, platform how-to, order types, psychology) whenever they help.
- Close with one short risk reminder, not a repeated wall of legal text.`

export type EngineTopic =
  | 'brief'
  | 'chart'
  | 'instrument'
  | 'mt5'
  | 'risk'
  | 'orders'
  | 'sessions'
  | 'pairs'
  | 'psychology'
  | 'fundamentals'
  | 'ta'
  | 'signals'
  | 'cfd'
  | 'ib'

interface AskInput {
  prompt: string
  instrument?: string
  attachments: AiAttachment[]
  answerLength: AiAnswerLength
  history: Array<{ role: 'user' | 'assistant'; content: string }>
  apiKey?: string
  baseUrl?: string
  model?: string
}

const SYMBOL_ALIASES: Array<{ symbol: string; keys: string[] }> = [
  { symbol: 'EURUSD', keys: ['eurusd', 'eur/usd', 'eur usd', 'euro dollar'] },
  { symbol: 'XAUUSD', keys: ['xauusd', 'xau', 'gold'] },
  { symbol: 'GBPUSD', keys: ['gbpusd', 'gbp/usd', 'gbp usd', 'cable', 'pound'] },
  { symbol: 'US30', keys: ['us30', 'dow', 'djia', 'wall street'] },
  { symbol: 'NAS100', keys: ['nas100', 'nasdaq', 'us100', 'ustec'] },
  { symbol: 'USOIL', keys: ['usoil', 'wti', 'crude', 'brent', 'oil'] },
]

const TOPIC_KEYS: Array<{ topic: EngineTopic; keys: string[] }> = [
  { topic: 'brief', keys: ['brief', 'watchlist', 'daily study', "today's educational", "today's market", 'today briefing'] },
  { topic: 'chart', keys: ['chart', 'screenshot', 'candle', 'candlestick', 'structure', 'support', 'resistance', 'trend', 'breakout'] },
  { topic: 'mt5', keys: ['mt5', 'metatrader', 'market watch', 'ticket', 'journal', 'toolbox'] },
  { topic: 'risk', keys: ['leverage', 'margin', 'lot', 'lots', 'pip', 'pips', 'position size', 'stop out', 'risk'] },
  { topic: 'orders', keys: ['order', 'limit', 'pending', 'market order', 'buy stop', 'sell stop'] },
  { topic: 'sessions', keys: ['session', 'london', 'new york', 'tokyo', 'overlap', 'liquidity'] },
  { topic: 'pairs', keys: ['pair', 'quote', 'base currency', 'spread', 'bid', 'ask', 'major', 'cross'] },
  { topic: 'psychology', keys: ['psychology', 'emotion', 'discipline', 'fomo', 'revenge'] },
  { topic: 'fundamentals', keys: ['nfp', 'cpi', 'fed', 'ecb', 'boe', 'fomc', 'news', 'fundamental', 'interest rate'] },
  { topic: 'ta', keys: ['rsi', 'macd', 'ema', 'sma', 'moving average', 'fibonacci', 'indicator', 'price action'] },
  { topic: 'signals', keys: ['buy', 'sell', 'entry', 'take profit', 'take-profit', 'stop loss', 'stop-loss', 'tp', 'sl', 'signal', 'call', 'trade', 'trading', 'should i'] },
  { topic: 'cfd', keys: ['cfd', 'contract for difference', 'overnight', 'swap'] },
  { topic: 'ib', keys: ['ib', 'introducing broker', 'partner'] },
]

function normalize(text: string) {
  return text.toLowerCase().replace(/[’']/g, "'")
}

function detectSymbols(text: string, selected?: string) {
  const found = new Set<string>()
  if (selected) found.add(selected)
  const haystack = normalize(text)
  for (const item of SYMBOL_ALIASES) {
    if (item.keys.some((key) => haystack.includes(key))) found.add(item.symbol)
  }
  return [...found]
}

function detectTopics(text: string, hasMedia: boolean): EngineTopic[] {
  const haystack = normalize(text)
  const hits = new Set<EngineTopic>()
  if (hasMedia) hits.add('chart')
  for (const item of TOPIC_KEYS) {
    if (item.keys.some((key) => haystack.includes(key))) hits.add(item.topic)
  }
  return [...hits]
}

function previousUserText(history: AskInput['history'], prompt: string) {
  const users = history.filter((item) => item.role === 'user').map((item) => item.content)
  const last = users[users.length - 1]
  if (last === prompt) return users[users.length - 2] ?? ''
  return last ?? ''
}

function parseQuestion(input: AskInput) {
  const prior = previousUserText(input.history, input.prompt)
  const symbols = detectSymbols(`${input.prompt} ${input.instrument ?? ''} ${prior}`, input.instrument)
  let topics = detectTopics(input.prompt, input.attachments.length > 0)
  const shortFollowUp = input.prompt.trim().length < 48 && input.history.some((item) => item.role === 'assistant')
  if (topics.length === 0 || shortFollowUp) {
    const previous = detectTopics(prior, false)
    for (const topic of previous) topics.push(topic)
    const previousSymbols = detectSymbols(prior)
    for (const symbol of previousSymbols) if (!symbols.includes(symbol)) symbols.push(symbol)
  }
  topics = [...new Set(topics)]
  if (topics.length === 0 && symbols.length) topics.push('instrument')
  if (topics.length === 0) topics.push('brief')
  return { symbols, topics, followUp: shortFollowUp }
}

function heading(title: string) {
  return `**${title}**`
}

function bullets(items: string[]) {
  return items.map((item) => `- ${item}`).join('\n')
}

function courseLine(topics: EngineTopic[]) {
  const picked = topics
    .map((topic) => TOPIC_COURSES[topic])
    .filter((item): item is { title: string; slug: string } => Boolean(item))
  const unique = picked.filter((item, index) => picked.findIndex((row) => row?.slug === item?.slug) === index)
  const first = unique[0]
  const second = unique[1]
  if (!first) return 'Suggested next lesson: Introduction to Forex Trading.'
  if (second) return `Suggested next lessons: ${first.title}, then ${second.title}.`
  return `Suggested next lesson: ${first.title}.`
}

function instrumentSection(symbol: string, brief: boolean) {
  const study = INSTRUMENT_STUDY[symbol]
  const name = instrumentName(symbol)
  const session = instrumentSession(symbol)
  if (!study) return `${heading(`${symbol} study note`)}\nThis is an educational note on ${name}, not a call.`
  const parts = [
    heading(`${symbol} — ${name}`),
    study.product,
    brief ? null : study.howQuoted,
    study.whatMovesIt,
    session,
    study.studyFocus,
  ].filter(Boolean)
  return parts.join('\n\n')
}

function chartSection(reads: ChartRead[], symbols: string[]) {
  if (!reads.length) return ''
  const symbolText = symbols.length ? ` on ${symbols.join(', ')}` : ''
  const lines = reads.map((read, index) => {
    const label = reads.length > 1 ? `Attachment ${index + 1} (${read.source})` : `Attached ${read.source}`
    return `${label}: ${read.note}`
  })
  return [
    heading(`What the ${reads[0]?.source === 'video' ? 'clip' : 'chart'} shows`),
    ...lines,
    heading('How to read it as a worksheet'),
    bullets([
      `Name the timeframe before anything else. A 5-minute swing is not an H4 story${symbolText}.`,
      'Mark the most recent swing high and swing low that are obvious on the picture. Those are labels of the past.',
      'Say whether the series is overlapping (a range) or making a directional run of swings. Do not add “therefore buy/sell”.',
      'Measure the height of that range in pips, points, or dollars, then ask what that distance costs at a tiny size.',
    ]),
  ].join('\n\n')
}

function topicSection(topic: EngineTopic, brief: boolean) {
  if (topic === 'signals') {
    return [
      heading('No trade call'),
      'I will not tell you to buy or sell, and I will not give an entry, take-profit, or stop-loss level. Those would be personalised recommendations.',
      'You can still study the idea behind the question: how a stop is meant to cap a loss if price reaches a level you chose, how a limit waits, and how size decides whether that distance is survivable.',
    ].join('\n\n')
  }
  const body: Partial<Record<EngineTopic, string>> = {
    orders: `${heading('Order types')}\n${ORDER_NOTE}`,
    risk: `${heading('Risk, size and leverage')}\n${RISK_NOTE}`,
    mt5: `${heading('MetaTrader 5')}\n${MT5_NOTE}`,
    pairs: `${heading('Quotes and pairs')}\n${PAIRS_NOTE}`,
    sessions: `${heading('Sessions and liquidity')}\n${SESSION_NOTE}`,
    ta: `${heading('Chart language')}\n${TA_NOTE}`,
    fundamentals: `${heading('Calendar literacy')}\n${FUNDAMENTALS_NOTE}`,
    psychology: `${heading('Process over impulse')}\n${PSYCH_NOTE}`,
    cfd: `${heading('What a CFD is')}\n${CFD_NOTE}`,
    ib: `${heading('IB education')}\nIntroducing-broker work is about explaining products, risk, and account opening clearly. It is not about promising results or circulating signals. If you support clients, send them to structured lessons rather than a screenshot with arrows.`,
  }
  const text = body[topic]
  if (!text) return ''
  if (brief) return text.split('\n\n')[0] ?? text
  return text
}

function briefSection(symbols: string[]) {
  const now = new Date()
  const clock = sessionClock(now)
  const watch = symbols.length ? symbols : ['EURUSD', 'XAUUSD', 'US30']
  return [
    heading(`Today's study brief — ${weekdayLabel(now)}`),
    `UTC teaching clock: ${clock.summary}`,
    heading('A practical study loop (no orders required)'),
    bullets([
      `Write three names on a pad: ${watch.join(', ')}. For each, note the product type (spot FX vs CFD) and the next high-impact print that can affect it.`,
      'Open one timeframe only (H1 or H4 is enough for a daily worksheet). Label last obvious swing high and low.',
      'Check whether you are on a demo or live account. If you are studying, demo is the right classroom.',
      'Decide in writing whether today is a study day. Sitting out is a complete outcome.',
    ]),
    heading('Session reminder'),
    SESSION_NOTE,
  ].join('\n\n')
}

function answerLead(prompt: string, symbols: string[], topics: EngineTopic[], followUp: boolean) {
  const asked = prompt.replace(/\s+/g, ' ').trim()
  const about = symbols.length ? ` — focusing on ${symbols.join(', ')}` : ''
  if (topics.includes('signals')) {
    return `You asked: “${asked}”${about}. I can teach the concepts in that question. I cannot give a trade.`
  }
  if (followUp) return `Follow-up received${about}. I will stay on the same study thread and go one layer deeper.`
  return `You asked: “${asked}”${about}. Here is an educational answer, not a recommendation.`
}

async function composeReply(input: AskInput) {
  const parsed = parseQuestion(input)
  const brief = input.answerLength === 'brief'
  const reads = await inspectAttachments(input.attachments)
  const sections: string[] = [answerLead(input.prompt, parsed.symbols, parsed.topics, parsed.followUp)]

  if (parsed.topics.includes('brief') && !reads.length) {
    sections.push(briefSection(parsed.symbols))
  }

  if (reads.length) sections.push(chartSection(reads, parsed.symbols))

  const uniqueSymbols = parsed.symbols.slice(0, brief ? 1 : 3)
  for (const symbol of uniqueSymbols) {
    sections.push(instrumentSection(symbol, brief))
  }

  const topicOrder: EngineTopic[] = ['signals', 'orders', 'risk', 'mt5', 'pairs', 'sessions', 'ta', 'fundamentals', 'psychology', 'cfd', 'ib']
  const used = new Set<EngineTopic>()
  for (const topic of topicOrder) {
    if (!parsed.topics.includes(topic)) continue
    if (topic === 'brief' || topic === 'chart' || topic === 'instrument') continue
    const block = topicSection(topic, brief)
    if (block) {
      sections.push(block)
      used.add(topic)
    }
    if (brief && used.size >= 1) break
    if (!brief && used.size >= 3) break
  }

  if (!reads.length && uniqueSymbols.length === 0 && used.size === 0 && !parsed.topics.includes('brief')) {
    sections.push(
      `${heading('How to study a market question')}\nStart with the product (pair or CFD), the timeframe, and the risk unit (pip, point, or dollar). Then ask what would invalidate the idea and what that distance costs at a small size. That sequence keeps you in education rather than prediction.`,
    )
  }

  if (!brief) sections.push(courseLine(parsed.topics))
  sections.push(DISCLAIMER)
  return sections.filter(Boolean).join('\n\n')
}

function historyWithoutDuplicate(input: AskInput) {
  const history = input.history.slice(-18)
  const last = history[history.length - 1]
  if (last?.role === 'user' && last.content === input.prompt) return history.slice(0, -1)
  return history
}

function userContent(input: AskInput, chartNote: string) {
  const images = input.attachments.filter((item) => item.kind === 'image' && item.dataUrl.length < 420_000).slice(0, 2)
  const text = [
    input.instrument ? `Instrument in focus: ${input.instrument}.` : '',
    chartNote,
    input.attachments.some((item) => item.kind === 'video') ? 'A video clip was attached; treat sampled frames as a structure worksheet.' : '',
    `Answer length: ${input.answerLength === 'brief' ? 'concise' : 'thorough but readable'}.`,
    input.prompt,
  ]
    .filter(Boolean)
    .join('\n')

  if (!images.length) return text
  return [
    { type: 'text', text },
    ...images.map((image) => ({ type: 'image_url' as const, image_url: { url: image.dataUrl } })),
  ]
}

async function readSseStream(
  response: Response,
  onToken: (token: string) => void,
  signal?: AbortSignal,
  onThinking?: (token: string) => void,
) {
  if (!response.body) throw new Error('The live model returned an empty stream.')
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let output = ''
  let sawContent = false

  while (true) {
    if (signal?.aborted) break
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    for (const raw of lines) {
      const line = raw.trim()
      if (!line.startsWith('data:')) continue
      const data = line.slice(5).trim()
      if (!data || data === '[DONE]') continue
      try {
        const payload = JSON.parse(data) as {
          choices?: Array<{ delta?: { content?: string | null; reasoning?: string | null } }>
        }
        const delta = payload.choices?.[0]?.delta
        const token = delta?.content
        const thought = delta?.reasoning
        if (thought && !sawContent) onThinking?.(thought)
        if (token) {
          sawContent = true
          output += token
          onToken(token)
        }
      } catch {
        // ignore malformed keep-alive chunks
      }
    }
  }

  if (!sawContent && !output) throw new Error('The live model did not return any text.')
  return output
}

async function streamLocal(input: AskInput, onToken: (token: string) => void) {
  const text = await composeReply(input)
  const parts = text.split(/(\s+)/)
  let output = ''
  for (let index = 0; index < parts.length; index += 5) {
    const chunk = parts.slice(index, index + 5).join('')
    output += chunk
    onToken(chunk)
    await new Promise((resolve) => window.setTimeout(resolve, 6))
  }
  return output
}

export const aiService = {
  isLive() {
    return true
  },

  async ask(input: AskInput) {
    let output = ''
    await this.askStream(input, (token) => {
      output += token
    })
    return output
  },

  async askStream(
    input: AskInput,
    onToken: (token: string) => void,
    signal?: AbortSignal,
    onThinking?: (token: string) => void,
  ) {
    const reads = await inspectAttachments(input.attachments)
    const chartNote = reads.length ? reads.map((item) => item.note).join(' ') : ''
    const messages = [
      { role: 'system', content: SYSTEM_RULES },
      ...historyWithoutDuplicate(input).map((item) => ({ role: item.role, content: item.content })),
      { role: 'user', content: userContent(input, chartNote) },
    ]

    const attempts: Array<{ url: string; headers: Record<string, string>; body: unknown }> = [
      {
        url: `${import.meta.env.BASE_URL.replace(/\/$/, '')}/api/engine/chat`,
        headers: { 'Content-Type': 'application/json' },
        body: {
          messages,
          apiKey: input.apiKey,
          baseUrl: input.baseUrl,
          model: input.model,
          temperature: 0.55,
        },
      },
      {
        url: 'https://text.pollinations.ai/openai',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer anonymous' },
        body: {
          messages,
          model: input.model || 'openai',
          temperature: 0.55,
          stream: true,
        },
      },
    ]

    for (const attempt of attempts) {
      try {
        const response = await fetch(attempt.url, {
          method: 'POST',
          headers: attempt.headers,
          signal,
          body: JSON.stringify(attempt.body),
        })
        if (!response.ok) continue
        const type = response.headers.get('content-type') ?? ''
        if (type.includes('application/json') && !type.includes('event-stream')) continue
        return await readSseStream(response, onToken, signal, onThinking)
      } catch {
        if (signal?.aborted) return ''
      }
    }

    return streamLocal(input, onToken)
  },
}
