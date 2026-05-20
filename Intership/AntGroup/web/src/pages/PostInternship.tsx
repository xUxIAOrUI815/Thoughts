import { useState } from 'react'
import { Save, Edit3, Plus, X, Star, Target, Briefcase, Lightbulb, Users, BookOpen, ChevronRight, Trash2 } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { defaultPostData } from '../data/content'
import type { PostData, STAREntry, SkillGrowth, ProjectSummary } from '../types'

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} onClick={() => onChange(n)}>
          <Star size={14} className={n <= value ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} />
        </button>
      ))}
    </div>
  )
}

function ListEditor({ items, onChange, placeholder }: { items: string[]; onChange: (v: string[]) => void; placeholder: string }) {
  return (
    <div className="space-y-1.5">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={item}
            onChange={(e) => { const n = [...items]; n[i] = e.target.value; onChange(n) }}
            placeholder={placeholder}
            className="flex-1 px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-400"
          />
          <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-slate-300 hover:text-red-400"><X size={16} /></button>
        </div>
      ))}
      <button onClick={() => onChange([...items, ''])} className="text-xs text-indigo-500 font-medium">+ 添加</button>
    </div>
  )
}

/* ──────────────────────────────────────────────
   STAR Entry Editor
   ────────────────────────────────────────────── */

function STAREditor({ entry, onChange, onDelete }: { entry: STAREntry; onChange: (e: STAREntry) => void; onDelete: () => void }) {
  const [expanded, setExpanded] = useState(true)
  return (
    <div className="card border-amber-200 bg-amber-50/30 overflow-hidden">
      <button onClick={() => setExpanded(!expanded)} className="w-full px-4 py-3 flex items-center gap-2 text-left hover:bg-amber-50/50">
        <Star size={14} className="text-amber-500 shrink-0" />
        <input
          value={entry.title}
          onChange={(e) => onChange({ ...entry, title: e.target.value })}
          placeholder="STAR 经历标题..."
          className="flex-1 text-sm font-medium bg-transparent border-none outline-none placeholder:text-slate-300"
          onClick={(e) => e.stopPropagation()}
        />
        <ChevronRight size={14} className={`text-slate-400 transition-transform ${expanded ? 'rotate-90' : ''}`} />
      </button>
      {expanded && (
        <div className="px-4 pb-4 space-y-2">
          {(['situation', 'task', 'action', 'result'] as const).map((field) => (
            <div key={field}>
              <label className="text-xs font-medium text-slate-500 uppercase mb-1 block">
                {field === 'situation' ? 'S · 背景' : field === 'task' ? 'T · 任务' : field === 'action' ? 'A · 行动' : 'R · 结果'}
              </label>
              <textarea
                value={entry[field]}
                onChange={(e) => onChange({ ...entry, [field]: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg resize-none focus:outline-none focus:border-amber-400"
                placeholder={
                  field === 'situation' ? '当时是什么情况？' :
                  field === 'task' ? '我的任务/目标是什么？' :
                  field === 'action' ? '我具体做了什么？' : '取得了什么结果？（量化数据）'
                }
              />
            </div>
          ))}
          <button onClick={onDelete} className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 mt-1">
            <Trash2 size={12} /> 删除此经历
          </button>
        </div>
      )}
    </div>
  )
}

/* ──────────────────────────────────────────────
   Section: 整体总结
   ────────────────────────────────────────────── */

function SummarySection({ data, setData, editing }: { data: PostData; setData: (d: PostData) => void; editing: boolean }) {
  const addProject = () => {
    setData({ ...data, projects: [...data.projects, { id: crypto.randomUUID(), name: '', time: '', role: '', output: '' }] })
  }

  const addSkillGrowth = () => {
    setData({ ...data, skillGrowths: [...data.skillGrowths, { id: crypto.randomUUID(), dimension: '', before: '', after: '' }] })
  }

  return (
    <div className="space-y-6">
      {/* Basic info */}
      <div className="card p-5">
        <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2"><Briefcase size={16} className="text-indigo-500" /> 基本信息</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-500 block mb-1">实习时间</label>
            {editing
              ? <input value={data.timeRange} onChange={(e) => setData({ ...data, timeRange: e.target.value })} placeholder="YYYY/MM/DD — YYYY/MM/DD" className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg" />
              : <p className="text-sm text-slate-700">{data.timeRange || '—'}</p>}
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">Mentor</label>
            {editing
              ? <input value={data.mentor} onChange={(e) => setData({ ...data, mentor: e.target.value })} placeholder="Mentor 姓名" className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg" />
              : <p className="text-sm text-slate-700">{data.mentor || '—'}</p>}
          </div>
        </div>
      </div>

      {/* Projects */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2"><Briefcase size={16} className="text-indigo-500" /> 参与项目</h3>
          {editing && <button onClick={addProject} className="text-xs text-indigo-500 font-medium flex items-center gap-1"><Plus size={12} /> 添加</button>}
        </div>
        {data.projects.length === 0 && !editing && <p className="text-sm text-slate-400">点击"编辑"添加参与的项目</p>}
        <div className="space-y-2">
          {data.projects.map((proj, i) => (
            <div key={proj.id} className="flex gap-2">
              {editing ? (
                <>
                  <input value={proj.name} onChange={(e) => { const n = [...data.projects]; n[i] = { ...proj, name: e.target.value }; setData({ ...data, projects: n }) }} placeholder="项目名" className="flex-1 px-2 py-1.5 text-sm border border-slate-200 rounded-lg" />
                  <input value={proj.time} onChange={(e) => { const n = [...data.projects]; n[i] = { ...proj, time: e.target.value }; setData({ ...data, projects: n }) }} placeholder="时间" className="w-28 px-2 py-1.5 text-sm border border-slate-200 rounded-lg" />
                  <input value={proj.role} onChange={(e) => { const n = [...data.projects]; n[i] = { ...proj, role: e.target.value }; setData({ ...data, projects: n }) }} placeholder="角色" className="w-24 px-2 py-1.5 text-sm border border-slate-200 rounded-lg" />
                  <input value={proj.output} onChange={(e) => { const n = [...data.projects]; n[i] = { ...proj, output: e.target.value }; setData({ ...data, projects: n }) }} placeholder="产出" className="flex-1 px-2 py-1.5 text-sm border border-slate-200 rounded-lg" />
                  <button onClick={() => setData({ ...data, projects: data.projects.filter((_, j) => j !== i) })} className="text-slate-300 hover:text-red-400"><X size={14} /></button>
                </>
              ) : (
                <div className="flex-1 py-2 px-3 bg-slate-50 rounded-lg text-sm flex items-center gap-3">
                  <span className="font-medium text-slate-800">{proj.name}</span>
                  <span className="text-slate-400">{proj.time}</span>
                  <span className="text-slate-400">|</span>
                  <span className="text-slate-600">{proj.role}</span>
                  <span className="text-slate-400">|</span>
                  <span className="text-slate-600">{proj.output}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Skill Growth */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2"><Target size={16} className="text-indigo-500" /> 技术成长（Before / After）</h3>
          {editing && <button onClick={addSkillGrowth} className="text-xs text-indigo-500 font-medium flex items-center gap-1"><Plus size={12} /> 添加维度</button>}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-2 font-medium text-slate-500 text-xs uppercase tracking-wider">维度</th>
                <th className="text-left py-2 font-medium text-slate-500 text-xs uppercase tracking-wider">实习前</th>
                <th className="text-left py-2 font-medium text-slate-500 text-xs uppercase tracking-wider">实习后</th>
              </tr>
            </thead>
            <tbody>
              {data.skillGrowths.map((row, i) => (
                <tr key={row.id} className="border-b border-slate-50">
                  {editing ? (
                    <>
                      <td className="py-2"><input value={row.dimension} onChange={(e) => { const n = [...data.skillGrowths]; n[i] = { ...row, dimension: e.target.value }; setData({ ...data, skillGrowths: n }) }} className="w-full px-2 py-1 text-sm border border-slate-200 rounded" /></td>
                      <td className="py-2"><input value={row.before} onChange={(e) => { const n = [...data.skillGrowths]; n[i] = { ...row, before: e.target.value }; setData({ ...data, skillGrowths: n }) }} className="w-full px-2 py-1 text-sm border border-slate-200 rounded" /></td>
                      <td className="py-2"><input value={row.after} onChange={(e) => { const n = [...data.skillGrowths]; n[i] = { ...row, after: e.target.value }; setData({ ...data, skillGrowths: n }) }} className="w-full px-2 py-1 text-sm border border-slate-200 rounded" /></td>
                    </>
                  ) : (
                    <>
                      <td className="py-2 font-medium text-slate-700">{row.dimension || '—'}</td>
                      <td className="py-2 text-slate-500">{row.before || '—'}</td>
                      <td className="py-2 text-slate-700">{row.after || '—'}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tech takeaways */}
      <div className="card p-5">
        <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2"><Lightbulb size={16} className="text-amber-500" /> 最有价值的技术收获</h3>
        {editing
          ? <ListEditor items={data.techTakeaways} onChange={(v) => setData({ ...data, techTakeaways: v })} placeholder="技术收获..." />
          : data.techTakeaways.filter(Boolean).length > 0
            ? <ul className="space-y-1">{data.techTakeaways.filter(Boolean).map((t, i) => <li key={i} className="text-sm text-slate-700">• {t}</li>)}</ul>
            : <p className="text-sm text-slate-400">点击"编辑"添加</p>}
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────
   Section: 个人反思
   ────────────────────────────────────────────── */

function ReflectionSection({ data, setData, editing }: { data: PostData; setData: (d: PostData) => void; editing: boolean }) {
  return (
    <div className="space-y-6">
      {/* Understanding change */}
      <div className="card p-5">
        <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2"><BookOpen size={16} className="text-indigo-500" /> 对 Agent 研发的理解变化</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">实习前的理解</h4>
            {editing
              ? <textarea value={data.understandingBefore} onChange={(e) => setData({ ...data, understandingBefore: e.target.value })} rows={4} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg resize-none" placeholder="实习前，我认为 Agent 研发是什么样的？" />
              : <p className="text-sm text-slate-600 whitespace-pre-wrap">{data.understandingBefore || '—'}</p>}
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">实习后的理解</h4>
            {editing
              ? <textarea value={data.understandingAfter} onChange={(e) => setData({ ...data, understandingAfter: e.target.value })} rows={4} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg resize-none" placeholder="实际做过之后，理解发生了哪些变化？" />
              : <p className="text-sm text-slate-600 whitespace-pre-wrap">{data.understandingAfter || '—'}</p>}
          </div>
        </div>
      </div>

      {/* Strengths & Improvements */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="font-semibold text-slate-900 mb-3 text-emerald-700">做得好的</h3>
          {editing
            ? <ListEditor items={data.strengths} onChange={(v) => setData({ ...data, strengths: v })} placeholder="优势..." />
            : data.strengths.filter(Boolean).length > 0
              ? <ul className="space-y-1">{data.strengths.filter(Boolean).map((s, i) => <li key={i} className="text-sm text-slate-700">✅ {s}</li>)}</ul>
              : <p className="text-sm text-slate-400">点击"编辑"添加</p>}
        </div>
        <div className="card p-5">
          <h3 className="font-semibold text-slate-900 mb-3 text-amber-700">需要提升的</h3>
          {editing
            ? <ListEditor items={data.improvements} onChange={(v) => setData({ ...data, improvements: v })} placeholder="待提升..." />
            : data.improvements.filter(Boolean).length > 0
              ? <ul className="space-y-1">{data.improvements.filter(Boolean).map((s, i) => <li key={i} className="text-sm text-slate-700">🔄 {s}</li>)}</ul>
              : <p className="text-sm text-slate-400">点击"编辑"添加</p>}
        </div>
      </div>

      {/* Career adjustments */}
      <div className="card p-5">
        <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2"><Target size={16} className="text-indigo-500" /> 职业规划校准</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-2 font-medium text-slate-500 text-xs uppercase tracking-wider">维度</th>
                <th className="text-left py-2 font-medium text-slate-500 text-xs uppercase tracking-wider">实习前设想</th>
                <th className="text-left py-2 font-medium text-slate-500 text-xs uppercase tracking-wider">实习后调整</th>
              </tr>
            </thead>
            <tbody>
              {data.careerAdjustments.map((row, i) => (
                <tr key={i} className="border-b border-slate-50">
                  {editing ? (
                    <>
                      <td className="py-2"><input value={row.dimension} onChange={(e) => { const n = [...data.careerAdjustments]; n[i] = { ...row, dimension: e.target.value }; setData({ ...data, careerAdjustments: n }) }} className="w-full px-2 py-1 text-sm border border-slate-200 rounded" /></td>
                      <td className="py-2"><input value={row.before} onChange={(e) => { const n = [...data.careerAdjustments]; n[i] = { ...row, before: e.target.value }; setData({ ...data, careerAdjustments: n }) }} className="w-full px-2 py-1 text-sm border border-slate-200 rounded" /></td>
                      <td className="py-2"><input value={row.after} onChange={(e) => { const n = [...data.careerAdjustments]; n[i] = { ...row, after: e.target.value }; setData({ ...data, careerAdjustments: n }) }} className="w-full px-2 py-1 text-sm border border-slate-200 rounded" /></td>
                    </>
                  ) : (
                    <>
                      <td className="py-2 font-medium text-slate-700">{row.dimension || '—'}</td>
                      <td className="py-2 text-slate-500">{row.before || '—'}</td>
                      <td className="py-2 text-slate-700">{row.after || '—'}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Advice */}
      <div className="card p-5">
        <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2"><Users size={16} className="text-indigo-500" /> 给下一届实习生的建议</h3>
        {editing
          ? <ListEditor items={data.advice} onChange={(v) => setData({ ...data, advice: v })} placeholder="建议..." />
          : data.advice.filter(Boolean).length > 0
            ? <ol className="space-y-1 list-decimal list-inside">{data.advice.filter(Boolean).map((a, i) => <li key={i} className="text-sm text-slate-700">{a}</li>)}</ol>
            : <p className="text-sm text-slate-400">点击"编辑"添加</p>}
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────
   Page: PostInternship
   ────────────────────────────────────────────── */

export default function PostInternship() {
  const [data, setData] = useLocalStorage<PostData>('ant-post-data', defaultPostData())
  const [editing, setEditing] = useState(false)
  const [tab, setTab] = useState<'summary' | 'reflection' | 'star'>('summary')

  const addSTAR = () => {
    setData({
      ...data,
      starEntries: [...data.starEntries, { id: crypto.randomUUID(), title: '', situation: '', task: '', action: '', result: '' }],
    })
  }

  const updateSTAR = (entry: STAREntry) => {
    setData({ ...data, starEntries: data.starEntries.map((e) => (e.id === entry.id ? entry : e)) })
  }

  const deleteSTAR = (id: string) => {
    setData({ ...data, starEntries: data.starEntries.filter((e) => e.id !== id) })
  }

  const hasContent = data.timeRange || data.projects.length > 0 || data.starEntries.length > 0 || data.understandingBefore || data.understandingAfter

  return (
    <div className="max-w-4xl mx-auto px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">实习后总结</h1>
        <p className="text-slate-500">实习结束后的系统性复盘。所有模板均为空，内容由你填写。</p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
          {[
            { key: 'summary' as const, label: '📄 整体总结' },
            { key: 'star' as const, label: '⭐ STAR 经历' },
            { key: 'reflection' as const, label: '💭 个人反思' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setEditing(!editing)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${editing ? 'bg-slate-100 text-slate-700' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
        >
          <Edit3 size={14} />
          {editing ? '完成编辑' : '编辑'}
        </button>
      </div>

      {tab === 'summary' && <SummarySection data={data} setData={setData} editing={editing} />}
      {tab === 'star' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">用 STAR 法则记录实习中的关键经历，每个经历都应该有量化的结果。</p>
            <button onClick={addSTAR} className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700">
              <Plus size={14} /> 添加经历
            </button>
          </div>
          {data.starEntries.length === 0 && (
            <div className="py-16 text-center">
              <Star size={40} className="mx-auto text-slate-300 mb-3" />
              <h3 className="text-slate-600 font-medium mb-1">还没有 STAR 经历</h3>
              <p className="text-sm text-slate-400">点击"添加经历"记录关键项目经历</p>
            </div>
          )}
          {data.starEntries.map((entry) => (
            <STAREditor
              key={entry.id}
              entry={entry}
              onChange={updateSTAR}
              onDelete={() => deleteSTAR(entry.id)}
            />
          ))}
        </div>
      )}
      {tab === 'reflection' && <ReflectionSection data={data} setData={setData} editing={editing} />}
    </div>
  )
}
