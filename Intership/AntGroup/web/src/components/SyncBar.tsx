import { useState, useCallback, useEffect } from 'react'
import { Cloud, CloudOff, Download, Upload, RefreshCw, Check, AlertCircle } from 'lucide-react'
import { saveAllToGitHub, loadAllFromGitHub } from '../lib/sync'

type Status = 'idle' | 'syncing' | 'success' | 'error'

export default function SyncBar() {
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')
  const [hasToken, setHasToken] = useState(false)

  // Check if sync is configured (we do this by trying a lightweight check)
  useEffect(() => {
    // Check if GitHub token is configured by looking for a stored flag
    const configured = localStorage.getItem('ant-sync-configured') === 'true'
    setHasToken(configured)
    if (!configured) {
      setMessage('未配置同步：缺少 GitHub Token')
    }
  }, [])

  const handleSave = useCallback(async () => {
    setStatus('syncing')
    setMessage('正在保存到 GitHub...')
    try {
      const { ok, fail } = await saveAllToGitHub()
      if (fail === 0) {
        setStatus('success')
        setMessage(`已保存 ${ok} 项数据到 GitHub`)
        setHasToken(true)
        localStorage.setItem('ant-sync-configured', 'true')
      } else {
        setStatus('error')
        setMessage(`部分失败：${ok} 成功，${fail} 失败`)
      }
    } catch (e: any) {
      setStatus('error')
      setMessage(e.message || '保存失败')
      if (e.message?.includes('Missing GITHUB')) {
        setHasToken(false)
      }
    }
    setTimeout(() => { if (status === 'success') setStatus('idle') }, 3000)
  }, [])

  const handleLoad = useCallback(async () => {
    setStatus('syncing')
    setMessage('正在从 GitHub 加载...')
    try {
      const { ok, fail } = await loadAllFromGitHub()
      if (fail === 0) {
        setStatus('success')
        setMessage(`已加载 ${ok} 项数据，刷新页面后生效`)
        setHasToken(true)
        localStorage.setItem('ant-sync-configured', 'true')
      } else {
        setStatus('error')
        setMessage(`部分失败：${ok} 成功，${fail} 失败`)
      }
    } catch (e: any) {
      setStatus('error')
      setMessage(e.message || '加载失败')
    }
    setTimeout(() => { if (status === 'success') setStatus('idle') }, 3000)
  }, [])

  const statusIcon = {
    idle: hasToken ? <Cloud size={14} className="text-slate-400" /> : <CloudOff size={14} className="text-slate-400" />,
    syncing: <RefreshCw size={14} className="text-indigo-500 animate-spin" />,
    success: <Check size={14} className="text-emerald-500" />,
    error: <AlertCircle size={14} className="text-red-400" />,
  }[status]

  return (
    <div className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200 px-6 py-1.5 flex items-center justify-between">
      <div className="flex items-center gap-2 text-xs">
        {statusIcon}
        <span className={`text-xs ${status === 'error' ? 'text-red-500' : status === 'success' ? 'text-emerald-600' : 'text-slate-400'}`}>
          {message || (hasToken ? '数据存储在本地浏览器' : '未配置 Token')}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleLoad}
          disabled={status === 'syncing'}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-50"
          title="从 GitHub 加载数据到浏览器"
        >
          <Download size={12} />
          加载
        </button>
        <button
          onClick={handleSave}
          disabled={status === 'syncing'}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors disabled:opacity-50 font-medium"
          title="保存浏览器数据到 GitHub"
        >
          <Upload size={12} />
          保存到 GitHub
        </button>
      </div>
    </div>
  )
}
