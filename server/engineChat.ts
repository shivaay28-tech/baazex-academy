import { proxyEngineChat } from './engineChatCore.ts'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin } from 'vite'

function readBody(req: IncomingMessage) {
  return new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

async function adapt(req: IncomingMessage, res: ServerResponse) {
  const raw = await readBody(req)
  const abort = new AbortController()
  req.on('aborted', () => abort.abort())
  const request = new Request('http://local/api/engine/chat', {
    method: req.method ?? 'POST',
    headers: { 'content-type': req.headers['content-type'] ?? 'application/json' },
    body: req.method === 'GET' || req.method === 'HEAD' ? undefined : raw || undefined,
    signal: abort.signal,
  })
  const response = await proxyEngineChat(request)
  res.statusCode = response.status
  response.headers.forEach((value, key) => {
    res.setHeader(key, value)
  })
  if (!response.body) {
    res.end()
    return
  }
  const reader = response.body.getReader()
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    res.write(value)
  }
  res.end()
}

export function engineChatPlugin(): Plugin {
  return {
    name: 'baazex-engine-chat',
    configureServer(server) {
      server.middlewares.use('/api/engine/chat', (req, res) => {
        void adapt(req, res)
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/engine/chat', (req, res) => {
        void adapt(req, res)
      })
    },
  }
}
