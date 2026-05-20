import { useState } from 'react'
import { Plus, Calendar, ChevronRight, ChevronDown, Star, Trash2, Edit3, Save, X, BookOpen, AlertCircle } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { DailyLog, WeeklyReview, ProjectDoc } from '../types'

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

function emptyLog(): DailyLog {
  const d = new Date()
  return {
    id: crypto.randomUUID(),
    date: todayStr(),
    weekday: weekdays[d.getDay()],
    tasks: [{ planned: '', status: 'todo', note: '' }],
    summary: '',
    learned: [''],
    problems: '',
    questions: [''],
    tomorrow: [''],
  }
}

function emptyReview(): WeeklyReview {
  return {
    id: crypto.randomUUID(),
    weekNumber: 1,
    dateRange: '',
    achievements: [''],
    techLearnings: [{ area: '', detail: '', level: 3 }],
    businessInsight: '',
    challenges: '',
    good: [''],
    bad: [''],
    nextWeek: [''],
    selfRatings: [
      { dimension: '技术成长', score: 3, note: '' },
      { dimension: '业务理解', score: 3, note: '' },
      { dimension: '沟通协作', score: 3, note: '' },
      { dimension: '主动性', score: 3, note: '' },
    ],
  }
}

function emptyProject(): ProjectDoc {
  return {
    id: crypto.randomUUID(),
    name: '',
    timeRange: '',
    role: '',
    collaborators: '',
    background: '',
    myWork: [''],
    decisions: [],
    results: '',
    pitfalls: [''],
    lessons: [''],
  }
}

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} onClick={() => onChange(n)} className="transition-colors">
          <Star
            size={16}
            className={n <= value ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
          />
        </button>
      ))}
    </div>
  )
}

function stringListEditor(items: string[], onChange: (v: string[]) => void, placeholder: string) {
  return (
    <div className="space-y-1.5">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={item}
            onChange={(e) => {
              const next = [...items]
              next[i] = e.target.value
              onChange(next)
            }}
            placeholder={placeholder}
            className="flex-1 px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100"
          />
          <button
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="text-slate-300 hover:text-red-400 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ))}
      <button
        onClick={() => onChange([...items, ''])}
        className="text-xs text-indigo-500 hover:text-indigo-600 font-medium"
      >
        + 添加
      </button>
    </div>
  )
}

export default function DuringInternship() {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'projects'>('daily')
  const [dailyLogs, setDailyLogs] = useLocalStorage<DailyLog[]>('ant-daily-logs', [])
  const [weeklyReviews, setWeeklyReviews] = useLocalStorage<WeeklyReview[]>('ant-weekly-reviews', [])
  const [projects, setProjects] = useLocalStorage<ProjectDoc[]>('ant-projects', [])
  const [editingLog, setEditingLog] = useState<DailyLog | null>(null)
  const [editingReview, setEditingReview] = useState<WeeklyReview | null>(null)
  const [editingProject, setEditingProject] = useState<ProjectDoc | null>(null)

  const saveLog = () => {
    if (!editingLog) return
    const exists = dailyLogs.findIndex((l) => l.id === editingLog.id)
    if (exists >= 0) {
      setDailyLogs(dailyLogs.map((l) => (l.id === editingLog.id ? editingLog : l)))
    } else {
      setDailyLogs([editingLog, ...dailyLogs])
    }
    setEditingLog(null)
  }

  const deleteLog = (id: string) => {
    setDailyLogs(dailyLogs.filter((l) => l.id !== id))
  }

  const tabs = [
    { key: 'daily' as const, label: '📝 日报', count: dailyLogs.length },
    { key: 'weekly' as const, label: '📊 周报', count: weeklyReviews.length },
    { key: 'projects' as const, label: '🚀 项目', count: projects.length },
  ]

  return (
    <div className="max-w-5xl mx-auto px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">实习中记录</h1>
        <p className="text-slate-500">记录每天的工作内容和收获，是后期总结和复盘的基础素材。</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
          {tabs.map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === key
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {label}
              {count > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-xs bg-slate-200 text-slate-600">
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            if (activeTab === 'daily') setEditingLog(emptyLog())
            else if (activeTab === 'weekly') setEditingReview(emptyReview())
            else setEditingProject(emptyProject())
          }}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus size={16} />
          新建
        </button>
      </div>

      {/* Daily Logs */}
      {activeTab === 'daily' && (
        <div className="space-y-4">
          {/* Editor */}
          {editingLog && (
            <div className="card p-6 border-indigo-200 ring-1 ring-indigo-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">
                  {dailyLogs.find((l) => l.id === editingLog.id) ? '编辑日报' : '新建日报'}
                </h3>
                <div className="flex gap-2">
                  <button onClick={saveLog} className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">
                    <Save size={14} /> 保存
                  </button>
                  <button onClick={() => setEditingLog(null)} className="p-1.5 text-slate-400 hover:text-slate-600">
                    <X size={18} />
                  </button>
                </div>
              </div>
              <div className="flex gap-4 mb-4">
                <input
                  type="date"
                  value={editingLog.date}
                  onChange={(e) => setEditingLog({ ...editingLog, date: e.target.value })}
                  className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg"
                />
              </div>
              {/* Tasks */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">今日任务</h4>
                {editingLog.tasks.map((task, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <select
                      value={task.status}
                      onChange={(e) => {
                        const next = [...editingLog.tasks]
                        next[i] = { ...task, status: e.target.value as DailyLog['tasks'][0]['status'] }
                        setEditingLog({ ...editingLog, tasks: next })
                      }}
                      className="px-2 py-1.5 text-sm border border-slate-200 rounded-lg w-24"
                    >
                      <option value="todo">待做</option>
                      <option value="progress">进行中</option>
                      <option value="done">已完成</option>
                    </select>
                    <input
                      value={task.planned}
                      onChange={(e) => {
                        const next = [...editingLog.tasks]
                        next[i] = { ...task, planned: e.target.value }
                        setEditingLog({ ...editingLog, tasks: next })
                      }}
                      placeholder="任务描述..."
                      className="flex-1 px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-400"
                    />
                    <button
                      onClick={() => setEditingLog({ ...editingLog, tasks: editingLog.tasks.filter((_, j) => j !== i) })}
                      className="text-slate-300 hover:text-red-400"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setEditingLog({ ...editingLog, tasks: [...editingLog.tasks, { planned: '', status: 'todo', note: '' }] })}
                  className="text-xs text-indigo-500 font-medium"
                >
                  + 添加任务
                </button>
              </div>
              {/* Summary */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">工作内容总结</h4>
                <textarea
                  value={editingLog.summary}
                  onChange={(e) => setEditingLog({ ...editingLog, summary: e.target.value })}
                  placeholder="用几句话描述今天实际做了什么..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-400 resize-none"
                />
              </div>
              {/* Learned */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">学到的</h4>
                {stringListEditor(editingLog.learned, (v) => setEditingLog({ ...editingLog, learned: v }), '新技术/新概念/新方法...')}
              </div>
              {/* Problems */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">遇到的问题 & 解决</h4>
                <textarea
                  value={editingLog.problems}
                  onChange={(e) => setEditingLog({ ...editingLog, problems: e.target.value })}
                  placeholder="描述问题 + 如何解决 + 启发..."
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-400 resize-none"
                />
              </div>
              {/* Tomorrow */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">明日计划</h4>
                {stringListEditor(editingLog.tomorrow, (v) => setEditingLog({ ...editingLog, tomorrow: v }), '计划事项...')}
              </div>
            </div>
          )}

          {/* Log list */}
          {dailyLogs.length === 0 && !editingLog && (
            <div className="card p-12 text-center">
              <Calendar size={40} className="mx-auto text-slate-300 mb-3" />
              <h3 className="text-slate-600 font-medium mb-1">还没有日报</h3>
              <p className="text-sm text-slate-400 mb-4">点击"新建"开始记录你的第一份日报</p>
              <button
                onClick={() => setEditingLog(emptyLog())}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
              >
                开始记录
              </button>
            </div>
          )}
          {dailyLogs.map((log) => (
            <div key={log.id} className="card p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-sm font-semibold text-slate-900">{log.date}</span>
                  <span className="text-sm text-slate-400 ml-2">{log.weekday}</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setEditingLog(log)} className="p-1 text-slate-300 hover:text-indigo-500">
                    <Edit3 size={14} />
                  </button>
                  <button onClick={() => deleteLog(log.id)} className="p-1 text-slate-300 hover:text-red-400">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              {/* Task summary */}
              <div className="flex gap-1.5 mb-2">
                {log.tasks.map((t, i) => (
                  <span
                    key={i}
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      t.status === 'done' ? 'bg-emerald-50 text-emerald-600' :
                      t.status === 'progress' ? 'bg-amber-50 text-amber-600' :
                      'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {t.planned || '未命名任务'}
                  </span>
                ))}
              </div>
              {log.summary && <p className="text-sm text-slate-600 line-clamp-2">{log.summary}</p>}
              {log.learned.some((l) => l.trim()) && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {log.learned.filter(Boolean).map((l, i) => (
                    <span key={i} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-xs">{l}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Weekly Reviews */}
      {activeTab === 'weekly' && (
        <div className="space-y-4">
          {editingReview && (
            <div className="card p-6 border-indigo-200 ring-1 ring-indigo-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">周报</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const exists = weeklyReviews.findIndex((r) => r.id === editingReview.id)
                      if (exists >= 0) {
                        setWeeklyReviews(weeklyReviews.map((r) => (r.id === editingReview.id ? editingReview : r)))
                      } else {
                        setWeeklyReviews([editingReview, ...weeklyReviews])
                      }
                      setEditingReview(null)
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
                  >
                    <Save size={14} /> 保存
                  </button>
                  <button onClick={() => setEditingReview(null)} className="p-1.5 text-slate-400 hover:text-slate-600">
                    <X size={18} />
                  </button>
                </div>
              </div>
              <div className="flex gap-4 mb-4">
                <div>
                  <label className="text-xs text-slate-500 block mb-1">周数</label>
                  <input type="number" value={editingReview.weekNumber} onChange={(e) => setEditingReview({ ...editingReview, weekNumber: +e.target.value })} className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg w-20" />
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">日期范围</label>
                  <input value={editingReview.dateRange} onChange={(e) => setEditingReview({ ...editingReview, dateRange: e.target.value })} placeholder="MM/DD — MM/DD" className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg w-40" />
                </div>
              </div>
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">关键成果</h4>
                {stringListEditor(editingReview.achievements, (v) => setEditingReview({ ...editingReview, achievements: v }), '完成的功能/文档/问题...')}
              </div>
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">技术收获</h4>
                {editingReview.techLearnings.map((tl, i) => (
                  <div key={i} className="flex gap-2 mb-2 items-center">
                    <input value={tl.area} onChange={(e) => { const n = [...editingReview.techLearnings]; n[i] = { ...tl, area: e.target.value }; setEditingReview({ ...editingReview, techLearnings: n }) }} placeholder="领域" className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg w-28" />
                    <input value={tl.detail} onChange={(e) => { const n = [...editingReview.techLearnings]; n[i] = { ...tl, detail: e.target.value }; setEditingReview({ ...editingReview, techLearnings: n }) }} placeholder="学到了什么" className="flex-1 px-3 py-1.5 text-sm border border-slate-200 rounded-lg" />
                    <StarRating value={tl.level} onChange={(v) => { const n = [...editingReview.techLearnings]; n[i] = { ...tl, level: v }; setEditingReview({ ...editingReview, techLearnings: n }) }} />
                    <button onClick={() => setEditingReview({ ...editingReview, techLearnings: editingReview.techLearnings.filter((_, j) => j !== i) })} className="text-slate-300 hover:text-red-400"><X size={16} /></button>
                  </div>
                ))}
                <button onClick={() => setEditingReview({ ...editingReview, techLearnings: [...editingReview.techLearnings, { area: '', detail: '', level: 3 }] })} className="text-xs text-indigo-500 font-medium">+ 添加</button>
              </div>
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">自评</h4>
                <div className="grid grid-cols-2 gap-3">
                  {editingReview.selfRatings.map((sr, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-sm text-slate-600 w-16">{sr.dimension}</span>
                      <StarRating value={sr.score} onChange={(v) => { const n = [...editingReview.selfRatings]; n[i] = { ...sr, score: v }; setEditingReview({ ...editingReview, selfRatings: n }) }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {weeklyReviews.length === 0 && !editingReview && (
            <div className="card p-12 text-center">
              <BookOpen size={40} className="mx-auto text-slate-300 mb-3" />
              <h3 className="text-slate-600 font-medium mb-1">还没有周报</h3>
              <p className="text-sm text-slate-400">每周花 20 分钟深度复盘</p>
            </div>
          )}
          {weeklyReviews.map((review) => (
            <div key={review.id} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-slate-900">Week {review.weekNumber} · {review.dateRange}</span>
                <div className="flex gap-1">
                  <button onClick={() => setEditingReview(review)} className="p-1 text-slate-300 hover:text-indigo-500"><Edit3 size={14} /></button>
                  <button onClick={() => setWeeklyReviews(weeklyReviews.filter((r) => r.id !== review.id))} className="p-1 text-slate-300 hover:text-red-400"><Trash2 size={14} /></button>
                </div>
              </div>
              {review.achievements.some(Boolean) && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {review.achievements.filter(Boolean).map((a, i) => (
                    <span key={i} className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-xs">{a}</span>
                  ))}
                </div>
              )}
              <div className="flex gap-4 text-xs text-slate-400">
                {review.techLearnings.some(t => t.area) && <span>技术收获 {review.techLearnings.filter(t => t.area).length} 项</span>}
                {review.selfRatings.length > 0 && (
                  <span>均分 {Math.round(review.selfRatings.reduce((s, r) => s + r.score, 0) / review.selfRatings.length * 10) / 10}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          {editingProject && (
            <div className="card p-6 border-indigo-200 ring-1 ring-indigo-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">{editingProject.name || '新建项目'}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (editingProject.name) {
                        const exists = projects.findIndex((p) => p.id === editingProject.id)
                        if (exists >= 0) setProjects(projects.map((p) => (p.id === editingProject.id ? editingProject : p)))
                        else setProjects([editingProject, ...projects])
                        setEditingProject(null)
                      }
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
                  >
                    <Save size={14} /> 保存
                  </button>
                  <button onClick={() => setEditingProject(null)} className="p-1.5 text-slate-400 hover:text-slate-600">
                    <X size={18} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3 mb-4">
                <input value={editingProject.name} onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })} placeholder="项目名称" className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg" />
                <input value={editingProject.timeRange} onChange={(e) => setEditingProject({ ...editingProject, timeRange: e.target.value })} placeholder="时间范围" className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg" />
                <input value={editingProject.role} onChange={(e) => setEditingProject({ ...editingProject, role: e.target.value })} placeholder="我的角色" className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg" />
                <input value={editingProject.collaborators} onChange={(e) => setEditingProject({ ...editingProject, collaborators: e.target.value })} placeholder="协作方" className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg" />
              </div>
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">背景 & 目标</h4>
                <textarea value={editingProject.background} onChange={(e) => setEditingProject({ ...editingProject, background: e.target.value })} rows={2} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg resize-none" />
              </div>
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">我的工作</h4>
                {stringListEditor(editingProject.myWork, (v) => setEditingProject({ ...editingProject, myWork: v }), '负责的模块/功能...')}
              </div>
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">踩过的坑</h4>
                {stringListEditor(editingProject.pitfalls, (v) => setEditingProject({ ...editingProject, pitfalls: v }), '踩坑经验...')}
              </div>
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">学到的</h4>
                {stringListEditor(editingProject.lessons, (v) => setEditingProject({ ...editingProject, lessons: v }), '收获...')}
              </div>
            </div>
          )}
          {projects.length === 0 && !editingProject && (
            <div className="card p-12 text-center">
              <Star size={40} className="mx-auto text-slate-300 mb-3" />
              <h3 className="text-slate-600 font-medium mb-1">还没有项目文档</h3>
              <p className="text-sm text-slate-400">记录参与的项目，方便后期总结</p>
            </div>
          )}
          {projects.map((proj) => (
            <div key={proj.id} className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-slate-900">{proj.name}</h3>
                <div className="flex gap-1">
                  <button onClick={() => setEditingProject(proj)} className="p-1 text-slate-300 hover:text-indigo-500"><Edit3 size={14} /></button>
                  <button onClick={() => setProjects(projects.filter((p) => p.id !== proj.id))} className="p-1 text-slate-300 hover:text-red-400"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="flex gap-3 text-xs text-slate-400 mb-2">
                {proj.timeRange && <span>{proj.timeRange}</span>}
                {proj.role && <span>角色：{proj.role}</span>}
              </div>
              {proj.background && <p className="text-sm text-slate-600 line-clamp-2">{proj.background}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
