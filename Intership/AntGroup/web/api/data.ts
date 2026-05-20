// Vercel Serverless Function — GitHub API proxy for data persistence

const OWNER = process.env.GITHUB_OWNER || ''
const REPO = process.env.GITHUB_REPO || ''
const TOKEN = process.env.GITHUB_TOKEN || ''
const BRANCH = process.env.GITHUB_BRANCH || 'main'
const DATA_PREFIX = 'Intership/AntGroup/data'

const API_BASE = `https://api.github.com/repos/${OWNER}/${REPO}/contents`

const DATA_KEYS = [
  'todos', 'notes', 'skills', 'research',
  'daily-logs', 'weekly-reviews', 'projects', 'post-data',
]

function checkConfig() {
  if (!OWNER || !REPO || !TOKEN) {
    return { ok: false, error: 'Missing GITHUB_OWNER, GITHUB_REPO, or GITHUB_TOKEN env vars' }
  }
  return { ok: true as const, error: null }
}

function ghHeaders() {
  return {
    Authorization: `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
    Accept: 'application/vnd.github.v3+json',
  }
}

// Load a single file from the repo
async function loadFile(key: string): Promise<{ data: any; sha: string } | null> {
  const path = `${DATA_PREFIX}/${key}.json`
  const res = await fetch(`${API_BASE}/${path}?ref=${BRANCH}`, { headers: ghHeaders() })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`GitHub API error ${res.status}: ${await res.text()}`)
  const json = await res.json() as { content: string; sha: string }
  return { data: JSON.parse(Buffer.from(json.content, 'base64').toString('utf-8')), sha: json.sha }
}

// Save a single file to the repo
async function saveFile(key: string, content: any, sha: string | null): Promise<void> {
  const path = `${DATA_PREFIX}/${key}.json`
  const body = {
    message: `sync: update ${key}.json`,
    content: Buffer.from(JSON.stringify(content, null, 2), 'utf-8').toString('base64'),
    branch: BRANCH,
    ...(sha ? { sha } : {}),
  }
  const res = await fetch(`${API_BASE}/${path}`, {
    method: 'PUT',
    headers: ghHeaders(),
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`GitHub API error ${res.status}: ${await res.text()}`)
}

// GET /api/data — load everything
async function handleGET(): Promise<Response> {
  const result: Record<string, any> = {}
  for (const key of DATA_KEYS) {
    try {
      const file = await loadFile(key)
      result[key] = file?.data ?? null
    } catch {
      result[key] = null
    }
  }
  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

// POST /api/data — save one key
// Body: { key: string, data: any }
async function handlePOST(req: Request): Promise<Response> {
  let body: { key: string; data: any }
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 })
  }

  if (!body.key || body.data === undefined) {
    return new Response(JSON.stringify({ error: 'Missing key or data' }), { status: 400 })
  }

  if (!DATA_KEYS.includes(body.key)) {
    return new Response(JSON.stringify({ error: `Unknown key: ${body.key}. Allowed: ${DATA_KEYS.join(', ')}` }), { status: 400 })
  }

  // Get current sha
  let sha: string | null = null
  try {
    const existing = await loadFile(body.key)
    sha = existing?.sha ?? null
  } catch { /* file doesn't exist, will create */ }

  try {
    await saveFile(body.key, body.data, sha)
    return new Response(JSON.stringify({ ok: true, key: body.key }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 })
  }
}

// Vercel function handler
export default async function handler(req: Request): Promise<Response> {
  const config = checkConfig()
  if (!config.ok) {
    return new Response(JSON.stringify({ error: config.error }), { status: 500 })
  }

  if (req.method === 'GET') return handleGET()
  if (req.method === 'POST') return handlePOST(req)

  return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
}

// Configure runtime
export const config = { runtime: 'nodejs20' }
