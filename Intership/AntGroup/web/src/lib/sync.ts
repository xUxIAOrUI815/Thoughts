// Frontend sync client — talks to /api/data Vercel Function

const DATA_KEYS = [
  'todos', 'notes', 'skills', 'research',
  'daily-logs', 'weekly-reviews', 'projects', 'post-data',
] as const

type DataKey = (typeof DATA_KEYS)[number]

export type SyncStore = Record<DataKey, any>

// Load all data from GitHub (via Vercel Function)
export async function loadFromGitHub(): Promise<SyncStore> {
  const res = await fetch('/api/data', { method: 'GET' })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || `HTTP ${res.status}`)
  }
  return res.json()
}

// Save one key to GitHub (via Vercel Function)
export async function saveToGitHub(key: DataKey, data: any): Promise<void> {
  const res = await fetch('/api/data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, data }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || `HTTP ${res.status}`)
  }
}

// Save all localStorage data to GitHub
export async function saveAllToGitHub(): Promise<{ ok: number; fail: number }> {
  let ok = 0
  let fail = 0
  for (const key of DATA_KEYS) {
    try {
      const raw = localStorage.getItem(`ant-${key}`)
      const data = raw ? JSON.parse(raw) : key === 'post-data' ? null : []
      // Convert 'ant-xxx' key to 'xxx' for GitHub storage
      await saveToGitHub(key, data)
      ok++
    } catch {
      fail++
    }
  }
  return { ok, fail }
}

// Load all data from GitHub and write to localStorage
export async function loadAllFromGitHub(): Promise<{ ok: number; fail: number }> {
  const store = await loadFromGitHub()
  let ok = 0
  let fail = 0
  for (const key of DATA_KEYS) {
    try {
      if (store[key] !== null && store[key] !== undefined) {
        localStorage.setItem(`ant-${key}`, JSON.stringify(store[key]))
        ok++
      }
    } catch {
      fail++
    }
  }
  // Notify all useLocalStorage hooks to re-read from localStorage
  window.dispatchEvent(new CustomEvent('ant-sync-loaded', { detail: {} }))
  return { ok, fail }
}
