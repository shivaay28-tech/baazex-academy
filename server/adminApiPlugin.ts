import { handleAdminUsers } from './adminUsers.js'
import { handleDeposits } from './deposits.js'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin } from 'vite'
import { loadEnv } from 'vite'

function readBody(req: IncomingMessage) {
  return new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

async function adapt(
  req: IncomingMessage,
  res: ServerResponse,
  handle: (request: Request) => Promise<Response>,
  path: string,
) {
  const raw = await readBody(req)
  const request = new Request(`http://local${path}`, {
    method: req.method ?? 'POST',
    headers: {
      'content-type': req.headers['content-type'] ?? 'application/json',
      authorization: typeof req.headers.authorization === 'string' ? req.headers.authorization : '',
    },
    body: req.method === 'GET' || req.method === 'HEAD' ? undefined : raw || undefined,
  })
  const response = await handle(request)
  res.statusCode = response.status
  response.headers.forEach((value, key) => {
    res.setHeader(key, value)
  })
  const text = await response.text()
  res.end(text)
}

function applyEnv(root: string, mode: string) {
  const loaded = loadEnv(mode, root, '')
  for (const [key, value] of Object.entries(loaded)) {
    if (!process.env[key]) process.env[key] = value
  }
}

export function adminApiPlugin(): Plugin {
  return {
    name: 'academy-admin-api',
    configureServer(server) {
      applyEnv(server.config.root, server.config.mode)
      server.middlewares.use('/api/admin/users', (req, res) => {
        void adapt(req, res, handleAdminUsers, '/api/admin/users')
      })
      server.middlewares.use('/api/admin/deposits', (req, res) => {
        void adapt(req, res, handleDeposits, '/api/admin/deposits')
      })
    },
    configurePreviewServer(server) {
      applyEnv(server.config.root, server.config.mode)
      server.middlewares.use('/api/admin/users', (req, res) => {
        void adapt(req, res, handleAdminUsers, '/api/admin/users')
      })
      server.middlewares.use('/api/admin/deposits', (req, res) => {
        void adapt(req, res, handleDeposits, '/api/admin/deposits')
      })
    },
  }
}
