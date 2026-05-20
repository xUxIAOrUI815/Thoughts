// Vercel Serverless Function — GitHub API proxy for data persistence
// Uses standard Node.js types, no external dependencies required

interface VercelRequest {
  method?: string
  body?: any
  query: Record<string, string>
}

interface VercelResponse {
  status(code: number): VercelResponse
  json(data: any): void
}

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

function ghHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${TOKEN}`,
    Accept: 'application/vnd.github.v3+json',
  }
}

async function loadFile(key: string): Promise<{ data: any; sha: string } | null> {
  const path = `${DATA_PREFIX}/${key}.json`
  const res = await fetch(`${API_BASE}/${path}?ref=${BRANCH}`, { headers: ghHeaders() })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`GitHub API ${res.status}`)
  const json = (await res.json()) as { content: string; sha: string }
  return {
    data: JSON.parse(Buffer.from(json.content, 'base64').toString('utf-8')),
    sha: json.sha,
  }
}

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
    headers: { ...ghHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`GitHub API ${res.status}`)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!OWNER || !REPO || !TOKEN) {
    return res.status(500).json({ error: 'Missing GITHUB_OWNER, GITHUB_REPO, or GITHUB_TOKEN env vars' })
  }

  if (req.method === 'GET') {
    const result: Record<string, any> = {}
    for (const key of DATA_KEYS) {
      try {
        const file = await loadFile(key)
        result[key] = file?.data ?? null
      } catch {
        result[key] = null
      }
    }
    return res.status(200).json(result)
  }

  if (req.method === 'POST') {
    const { key, data } = req.body || {}
    if (!key || data === undefined) {
      return res.status(400).json({ error: 'Missing key or data in body' })
    }
    if (!DATA_KEYS.includes(key)) {
      return res.status(400).json({ error: `Unknown key: ${key}` })
    }

    let sha: string | null = null
    try {
      const existing = await loadFile(key)
      sha = existing?.sha ?? null
    } catch { /* file may not exist */ }

    try {
      await saveFile(key, data, sha)
      return res.status(200).json({ ok: true, key })
    } catch (e: any) {
      return res.status(500).json({ error: e.message })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
