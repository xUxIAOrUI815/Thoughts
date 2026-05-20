import { useState, useMemo } from 'react'
import {
  Plus, X, CheckSquare, Square, Edit3, Trash2, Save, Search,
  BookOpen, Target, Cpu, ChevronRight, Star
} from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { newTodo, newNote, newSkill, newResearchTopic } from '../data/content'
import type { TodoItem, Note, Skill, ResearchTopic } from '../types'

/* ──────────────────────────────────────────────
   Shared helpers
   ────────────────────────────────────────────── */

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

function CategoryInput({ value, onChange, existing }: { value: string; onChange: (v: string) => void; existing: string[] }) {
  return (
    <div className="relative">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="分类（可选）"
        list="categories"
        className="w-28 px-2 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-400"
      />
      <datalist id="categories">
        {existing.filter(Boolean).map((c) => <option key={c} value={c} />)}
      </datalist>
    </div>
  )
}

function EmptyState({ icon: Icon, title, desc, onAdd }: { icon: React.ElementType; title: string; desc: string; onAdd: () => void }) {
  return (
    <div className="py-16 text-center">
      <Icon size={40} className="mx-auto text-slate-300 mb-3" />
      <h3 className="text-slate-600 font-medium mb-1">{title}</h3>
      <p className="text-sm text-slate-400 mb-4">{desc}</p>
      <button onClick={onAdd} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
        开始添加
      </button>
    </div>
  )
}

/* ──────────────────────────────────────────────
   Tab: Todos
   ────────────────────────────────────────────── */

function TodoTab() {
  const [todos, setTodos] = useLocalStorage<TodoItem[]>('ant-todos', [])
  const [editing, setEditing] = useState<TodoItem | null>(null)
  const [filter, setFilter] = useState('all')

  const categories = useMemo(() => [...new Set(todos.map((t) => t.category).filter(Boolean))], [todos])
  const filtered = filter === 'all' ? todos : filter === 'done' ? todos.filter((t) => t.done) : todos.filter((t) => !t.done)

  const sorted = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const saveEdit = () => {
    if (!editing) return
    if (!editing.text.trim()) { setEditing(null); return }
    const idx = todos.findIndex((t) => t.id === editing.id)
    setTodos(idx >= 0 ? todos.map((t) => (t.id === editing.id ? editing : t)) : [editing, ...todos])
    setEditing(null)
  }

  const toggle = (id: string) => setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  const deleteItem = (id: string) => setTodos(todos.filter((t) => t.id !== id))

  const doneCount = todos.filter((t) => t.done).length

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1 bg-slate-100 rounded-lg p-0.5">
          {[{ k: 'all', l: '全部' }, { k: 'active', l: '进行中' }, { k: 'done', l: '已完成' }].map(({ k, l }) => (
            <button key={k} onClick={() => setFilter(k)} className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${filter === k ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              {l} {k === 'all' ? `(${todos.length})` : k === 'done' ? `(${doneCount})` : `(${todos.length - doneCount})`}
            </button>
          ))}
        </div>
        <button onClick={() => setEditing(newTodo())} className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700">
          <Plus size={14} /> 添加待办
        </button>
      </div>

      {/* Edit form */}
      {editing && (
        <div className="card p-4 mb-4 border-indigo-200 ring-1 ring-indigo-100">
          <div className="flex gap-2 mb-2">
            <input
              value={editing.text}
              onChange={(e) => setEditing({ ...editing, text: e.target.value })}
              placeholder="待办事项..."
              autoFocus
              className="flex-1 px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-400"
              onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
            />
            <CategoryInput value={editing.category} onChange={(v) => setEditing({ ...editing, category: v })} existing={categories} />
            <button onClick={saveEdit} className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs"><Save size={14} /></button>
            <button onClick={() => setEditing(null)} className="p-1.5 text-slate-400 hover:text-slate-600"><X size={16} /></button>
          </div>
        </div>
      )}

      {todos.length === 0 && !editing && <EmptyState icon={CheckSquare} title="还没有待办" desc="添加你的实习准备待办事项" onAdd={() => setEditing(newTodo())} />}

      <div className="space-y-1">
        {sorted.map((todo) => (
          <div key={todo.id} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg group transition-colors ${todo.done ? 'bg-slate-50' : 'hover:bg-slate-50'}`}>
            <button onClick={() => toggle(todo.id)} className="shrink-0 text-slate-300 hover:text-indigo-500 transition-colors">
              {todo.done ? <CheckSquare size={18} className="text-emerald-500" /> : <Square size={18} />}
            </button>
            <span className={`flex-1 text-sm ${todo.done ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
              {todo.text}
            </span>
            {todo.category && <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">{todo.category}</span>}
            <div className="opacity-0 group-hover:opacity-100 flex gap-0.5 transition-opacity">
              <button onClick={() => setEditing(todo)} className="p-1 text-slate-300 hover:text-indigo-500"><Edit3 size={13} /></button>
              <button onClick={() => deleteItem(todo.id)} className="p-1 text-slate-300 hover:text-red-400"><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────
   Tab: Notes
   ────────────────────────────────────────────── */

function NoteTab() {
  const [notes, setNotes] = useLocalStorage<Note[]>('ant-notes', [])
  const [editing, setEditing] = useState<Note | null>(null)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('')

  const categories = useMemo(() => [...new Set(notes.map((n) => n.category).filter(Boolean))], [notes])

  const filtered = notes.filter((n) => {
    if (search && !n.title.includes(search) && !n.content.includes(search)) return false
    if (catFilter && n.category !== catFilter) return false
    return true
  })

  const saveEdit = () => {
    if (!editing) return
    if (!editing.title.trim() && !editing.content.trim()) { setEditing(null); return }
    const now = new Date().toISOString()
    const item: Note = { ...editing, updatedAt: now }
    const idx = notes.findIndex((n) => n.id === item.id)
    setNotes(idx >= 0 ? notes.map((n) => (n.id === item.id ? item : n)) : [item, ...notes])
    setEditing(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索笔记..."
              className="w-full pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-400"
            />
          </div>
          {categories.length > 0 && (
            <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className="px-2 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-600">
              <option value="">全部分类</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          )}
        </div>
        <button onClick={() => setEditing(newNote())} className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 shrink-0">
          <Plus size={14} /> 新建笔记
        </button>
      </div>

      {editing && (
        <div className="card p-4 mb-4 border-indigo-200 ring-1 ring-indigo-100">
          <input
            value={editing.title}
            onChange={(e) => setEditing({ ...editing, title: e.target.value })}
            placeholder="笔记标题"
            autoFocus
            className="w-full px-3 py-2 text-sm font-medium border border-slate-200 rounded-lg mb-2 focus:outline-none focus:border-indigo-400"
          />
          <textarea
            value={editing.content}
            onChange={(e) => setEditing({ ...editing, content: e.target.value })}
            placeholder="笔记内容..."
            rows={5}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg mb-2 resize-none focus:outline-none focus:border-indigo-400"
          />
          <div className="flex items-center gap-2">
            <CategoryInput value={editing.category} onChange={(v) => setEditing({ ...editing, category: v })} existing={categories} />
            <input
              value={editing.tags.join(', ')}
              onChange={(e) => setEditing({ ...editing, tags: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
              placeholder="标签（逗号分隔）"
              className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-400"
            />
            <button onClick={saveEdit} className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs"><Save size={14} /> 保存</button>
            <button onClick={() => setEditing(null)} className="p-1.5 text-slate-400 hover:text-slate-600"><X size={16} /></button>
          </div>
        </div>
      )}

      {notes.length === 0 && !editing && <EmptyState icon={BookOpen} title="还没有笔记" desc="记录学习过程中的知识点和心得" onAdd={() => setEditing(newNote())} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((note) => (
          <div key={note.id} className="card p-4 hover:shadow-md transition-shadow group cursor-pointer" onClick={() => setEditing(note)}>
            <div className="flex items-start justify-between mb-1.5">
              <h3 className="font-medium text-sm text-slate-900 line-clamp-1">{note.title || '无标题'}</h3>
              <div className="opacity-0 group-hover:opacity-100 flex gap-0.5 transition-opacity shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => setEditing(note)} className="p-1 text-slate-300 hover:text-indigo-500"><Edit3 size={12} /></button>
                <button onClick={() => setNotes(notes.filter((n) => n.id !== note.id))} className="p-1 text-slate-300 hover:text-red-400"><Trash2 size={12} /></button>
              </div>
            </div>
            <p className="text-xs text-slate-500 line-clamp-3 mb-2">{note.content}</p>
            <div className="flex flex-wrap items-center gap-1">
              {note.category && <span className="text-xs px-1.5 py-0.5 bg-indigo-50 text-indigo-500 rounded">{note.category}</span>}
              {note.tags.filter(Boolean).map((t) => (
                <span key={t} className="text-xs px-1.5 py-0.5 bg-slate-100 text-slate-400 rounded">{t}</span>
              ))}
              <span className="text-xs text-slate-300 ml-auto">{new Date(note.updatedAt).toLocaleDateString('zh-CN')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────
   Tab: Skills
   ────────────────────────────────────────────── */

function SkillTab() {
  const [skills, setSkills] = useLocalStorage<Skill[]>('ant-skills', [])
  const [editing, setEditing] = useState<Skill | null>(null)
  const [filter, setFilter] = useState('')

  const categories = useMemo(() => [...new Set(skills.map((s) => s.category).filter(Boolean))], [skills])
  const filtered = filter ? skills.filter((s) => s.category === filter || s.status === filter) : skills

  const saveEdit = () => {
    if (!editing) return
    if (!editing.name.trim()) { setEditing(null); return }
    const idx = skills.findIndex((s) => s.id === editing.id)
    setSkills(idx >= 0 ? skills.map((s) => (s.id === editing.id ? editing : s)) : [editing, ...skills])
    setEditing(null)
  }

  const statusLabel = { planned: '待开始', learning: '学习中', done: '已掌握' }
  const statusColor = { planned: 'bg-slate-100 text-slate-500', learning: 'bg-amber-50 text-amber-600', done: 'bg-emerald-50 text-emerald-600' }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1">
          {['', 'planned', 'learning', 'done'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${filter === s ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {s === '' ? `全部 (${skills.length})` : statusLabel[s as keyof typeof statusLabel]}
            </button>
          ))}
        </div>
        <button onClick={() => setEditing(newSkill())} className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700">
          <Plus size={14} /> 添加技能
        </button>
      </div>

      {editing && (
        <div className="card p-4 mb-4 border-indigo-200 ring-1 ring-indigo-100">
          <div className="flex gap-2 mb-2">
            <input
              value={editing.name}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              placeholder="技能名称"
              autoFocus
              className="flex-1 px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-400"
            />
            <CategoryInput value={editing.category} onChange={(v) => setEditing({ ...editing, category: v })} existing={categories} />
            <select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as Skill['status'] })} className="px-2 py-1.5 text-xs border border-slate-200 rounded-lg">
              <option value="planned">待开始</option>
              <option value="learning">学习中</option>
              <option value="done">已掌握</option>
            </select>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs text-slate-500">当前水平</span>
            <StarRating value={editing.currentLevel} onChange={(v) => setEditing({ ...editing, currentLevel: v })} />
            <span className="text-xs text-slate-500 ml-2">目标水平</span>
            <StarRating value={editing.targetLevel} onChange={(v) => setEditing({ ...editing, targetLevel: v })} />
          </div>
          <textarea
            value={editing.notes}
            onChange={(e) => setEditing({ ...editing, notes: e.target.value })}
            placeholder="学习笔记..."
            rows={2}
            className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg mb-2 resize-none focus:outline-none focus:border-indigo-400"
          />
          <div className="flex gap-2">
            <button onClick={saveEdit} className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs"><Save size={14} /> 保存</button>
            <button onClick={() => setEditing(null)} className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs">取消</button>
          </div>
        </div>
      )}

      {skills.length === 0 && !editing && <EmptyState icon={Cpu} title="还没有技能" desc="追踪 Agent 研发相关的技能学习进度" onAdd={() => setEditing(newSkill())} />}

      <div className="space-y-2">
        {filtered.map((skill) => (
          <div key={skill.id} className="card p-4 hover:shadow-md transition-shadow group">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-slate-900">{skill.name}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${statusColor[skill.status]}`}>{statusLabel[skill.status]}</span>
                </div>
                {skill.category && <span className="text-xs text-slate-400">{skill.category}</span>}
              </div>
              <div className="opacity-0 group-hover:opacity-100 flex gap-0.5 transition-opacity">
                <button onClick={() => setEditing(skill)} className="p-1 text-slate-300 hover:text-indigo-500"><Edit3 size={13} /></button>
                <button onClick={() => setSkills(skills.filter((s) => s.id !== skill.id))} className="p-1 text-slate-300 hover:text-red-400"><Trash2 size={13} /></button>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-1 text-xs">
                <span className="text-slate-400">当前</span>
                <StarRating value={skill.currentLevel} onChange={() => {}} />
              </div>
              <ChevronRight size={12} className="text-slate-300" />
              <div className="flex items-center gap-1 text-xs">
                <span className="text-slate-400">目标</span>
                <StarRating value={skill.targetLevel} onChange={() => {}} />
              </div>
            </div>
            {/* Progress bar */}
            <div className="w-full h-1 bg-slate-100 rounded-full mb-2">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all"
                style={{ width: `${Math.round((skill.currentLevel / skill.targetLevel) * 100)}%` }}
              />
            </div>
            {skill.notes && <p className="text-xs text-slate-500 line-clamp-2">{skill.notes}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────
   Tab: Research
   ────────────────────────────────────────────── */

function ResearchTab() {
  const [topics, setTopics] = useLocalStorage<ResearchTopic[]>('ant-research', [])
  const [editing, setEditing] = useState<ResearchTopic | null>(null)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const categories = useMemo(() => [...new Set(topics.map((t) => t.category).filter(Boolean))], [topics])

  const toggleExpand = (id: string) => {
    const next = new Set(expanded)
    next.has(id) ? next.delete(id) : next.add(id)
    setExpanded(next)
  }

  const saveEdit = () => {
    if (!editing) return
    if (!editing.title.trim()) { setEditing(null); return }
    const idx = topics.findIndex((t) => t.id === editing.id)
    setTopics(idx >= 0 ? topics.map((t) => (t.id === editing.id ? editing : t)) : [editing, ...topics])
    setEditing(null)
  }

  const statusLabel: Record<string, string> = { 'planned': '待开始', 'in-progress': '进行中', 'done': '已完成' }
  const statusColor: Record<string, string> = { 'planned': 'bg-slate-100 text-slate-500', 'in-progress': 'bg-amber-50 text-amber-600', 'done': 'bg-emerald-50 text-emerald-600' }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-slate-500">{topics.length} 个调研主题</div>
        <button onClick={() => { const t = newResearchTopic(); setTopics([t, ...topics]); setEditing(t) }} className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700">
          <Plus size={14} /> 新建调研
        </button>
      </div>

      {editing && (
        <div className="card p-4 mb-4 border-indigo-200 ring-1 ring-indigo-100">
          <div className="flex gap-2 mb-2">
            <input
              value={editing.title}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              placeholder="调研主题"
              autoFocus
              className="flex-1 px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-400"
            />
            <CategoryInput value={editing.category} onChange={(v) => setEditing({ ...editing, category: v })} existing={categories} />
            <select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as ResearchTopic['status'] })} className="px-2 py-1.5 text-xs border border-slate-200 rounded-lg">
              <option value="planned">待开始</option>
              <option value="in-progress">进行中</option>
              <option value="done">已完成</option>
            </select>
          </div>
          <input
            value={editing.goal}
            onChange={(e) => setEditing({ ...editing, goal: e.target.value })}
            placeholder="调研目标（一句话描述）"
            className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg mb-2 focus:outline-none focus:border-indigo-400"
          />
          <div className="mb-2">
            <label className="text-xs text-slate-500 font-medium mb-1 block">调研章节</label>
            {editing.sections.map((sec, i) => (
              <div key={i} className="flex gap-2 mb-1.5">
                <input
                  value={sec.heading}
                  onChange={(e) => {
                    const next = [...editing.sections]
                    next[i] = { ...sec, heading: e.target.value }
                    setEditing({ ...editing, sections: next })
                  }}
                  placeholder="章节标题"
                  className="w-32 px-2 py-1 text-xs border border-slate-200 rounded-lg"
                />
                <input
                  value={sec.content}
                  onChange={(e) => {
                    const next = [...editing.sections]
                    next[i] = { ...sec, content: e.target.value }
                    setEditing({ ...editing, sections: next })
                  }}
                  placeholder="内容"
                  className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded-lg"
                />
                <button onClick={() => setEditing({ ...editing, sections: editing.sections.filter((_, j) => j !== i) })} className="text-slate-300 hover:text-red-400"><X size={14} /></button>
              </div>
            ))}
            <button onClick={() => setEditing({ ...editing, sections: [...editing.sections, { heading: '', content: '' }] })} className="text-xs text-indigo-500 font-medium">+ 添加章节</button>
          </div>
          <div className="flex gap-2">
            <button onClick={saveEdit} className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs"><Save size={14} /> 保存</button>
            <button onClick={() => setEditing(null)} className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs">取消</button>
          </div>
        </div>
      )}

      {topics.length === 0 && !editing && <EmptyState icon={Target} title="还没有调研主题" desc="创建你的产品调研、技术调研或竞品分析" onAdd={() => { const t = newResearchTopic(); setTopics([t]); setEditing(t) }} />}

      <div className="space-y-3">
        {topics.map((topic) => (
          <div key={topic.id} className="card overflow-hidden">
            <button onClick={() => toggleExpand(topic.id)} className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-slate-50 transition-colors">
              <span className="text-lg">🔍</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-slate-900 truncate">{topic.title || '未命名'}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full shrink-0 ${statusColor[topic.status]}`}>{statusLabel[topic.status]}</span>
                </div>
                <p className="text-xs text-slate-400 truncate">{topic.goal || '暂无描述'}</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                {topic.sections.length} 章节
                <ChevronRight size={14} className={`transition-transform ${expanded.has(topic.id) ? 'rotate-90' : ''}`} />
              </div>
            </button>
            {expanded.has(topic.id) && (
              <div className="px-4 pb-4 border-t border-slate-100 pt-3 space-y-3">
                {topic.sections.map((sec, i) => (
                  <div key={i}>
                    <h5 className="text-xs font-semibold text-indigo-600 mb-1">{sec.heading || `章节 ${i + 1}`}</h5>
                    <p className="text-sm text-slate-600">{sec.content || '暂无内容'}</p>
                  </div>
                ))}
                <div className="flex gap-2 pt-2 border-t border-slate-50">
                  <button onClick={() => setEditing(topic)} className="flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs hover:bg-slate-200"><Edit3 size={12} /> 编辑</button>
                  <button onClick={() => setTopics(topics.filter((t) => t.id !== topic.id))} className="flex items-center gap-1 px-3 py-1 bg-red-50 text-red-500 rounded-lg text-xs hover:bg-red-100"><Trash2 size={12} /> 删除</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────
   Page: PreInternship
   ────────────────────────────────────────────── */

export default function PreInternship() {
  const tabs = [
    { key: 'todo', label: '📋 待办清单', desc: '管理实习前的准备事项' },
    { key: 'notes', label: '📝 学习笔记', desc: '记录知识点和心得' },
    { key: 'skills', label: '📊 技能追踪', desc: '追踪技能学习进度' },
    { key: 'research', label: '🔍 调研管理', desc: '产品/技术/竞品调研' },
  ] as const
  const [tab, setTab] = useState<string>('todo')

  return (
    <div className="max-w-4xl mx-auto px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">实习前准备</h1>
        <p className="text-slate-500">灵活管理你的待办、笔记、技能学习和调研主题，内容完全由你定义。</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-slate-100 rounded-lg p-1 w-fit flex-wrap">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="card p-6">
        {tab === 'todo' && <TodoTab />}
        {tab === 'notes' && <NoteTab />}
        {tab === 'skills' && <SkillTab />}
        {tab === 'research' && <ResearchTab />}
      </div>
    </div>
  )
}
