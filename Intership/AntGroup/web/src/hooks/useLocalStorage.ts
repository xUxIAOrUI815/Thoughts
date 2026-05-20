import { useState, useEffect, useCallback } from 'react'

export function useLocalStorage<T>(key: string, initial: T): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initial
    } catch {
      return initial
    }
  })

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  // Listen for external changes (GitHub sync, other tabs)
  useEffect(() => {
    const handler = () => {
      try {
        const stored = localStorage.getItem(key)
        if (stored) setValue(JSON.parse(stored))
      } catch { /* ignore parse errors */ }
    }
    // Standard storage event (other tabs)
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) handler()
    }
    // Custom event (same tab, fired by sync.ts after GitHub load)
    const onSync = (e: Event) => {
      if ((e as CustomEvent).detail?.key === key || !(e as CustomEvent).detail?.key) {
        handler()
      }
    }
    window.addEventListener('storage', onStorage)
    window.addEventListener('ant-sync-loaded', onSync)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('ant-sync-loaded', onSync)
    }
  }, [key])

  return [value, setValue]
}
