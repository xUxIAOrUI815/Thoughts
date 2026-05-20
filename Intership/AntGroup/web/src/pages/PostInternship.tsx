import { useState } from 'react'
import { Save, Edit3, Plus, X, Star, Target, Briefcase, Lightbulb, Users, BookOpen } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { PostSummary, PostReflection, StarExperience } from '../types'

const defaultSummary: PostSummary = {
  timeRange: '',
  mentor: '',
  projects: [],
  techGrowth: [
    { dimension: 'Agent 架构理解', before: '', after: '' },
    { dimension: 'LLM 工程化能力', before: '', after: '' },
    { dimension: '保险业务理解', before: '', after: '' },
    { dimension: '工程协作能力', before: '', after: '' },
  ],
  techTakeaways: ['', '', ''],
  businessTakeaways: '',
  starExperiences: [],
  reusableOutputs: [''],
}

const defaultReflection: PostReflection = {
  understandingBefore: '',
  understandingAfter: '',
  agentDirection: '',
  strengths: ['', '', ''],
  improvements: ['', '', ''],
  surprises: [''],
  careerAdjustments: [
    { dimension: '想做的方向', before: '', after: '' },
    { dimension: '想加入的团队类型', before: '', after: '' },
    { dimension: '长期目标', before: '', after: '' },
  ],
  relationships: [],
  advice: ['', '', ''],
}

function StarExpEditor({
  exp,
  onChange,
  onDelete,
}: {
  exp: StarExperience
  onChange: (e: StarExperience) => void
  onDelete: () => void
}) {
  return (
    <div className="card p-5 border-amber-200 bg-amber-50/30">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-amber-700 flex items-center gap-1.5">
          <Star size={14} /> STAR 经历
        </h4>
        <button onClick={onDelete} className="text-slate-300 hover:text-red-400"><X size={14} /></button>
      </div>
      {(['situation', 'task', 'action', 'result'] as const).map((field) => (
        <div key={field} className="mb-2">
          <label className="text-xs font-medium text-slate-500 uppercase mb-1 block">
            {field === 'situation' ? 'Situation 背景' :
             field === 'task' ? 'Task 任务' :
             field === 'action' ? 'Action 行动' : 'Result 结果'}
          </label>
          <textarea
            value={exp[field]}
            onChange={(e) => onChange({ ...exp, [field]: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg resize-none focus:outline-none focus:border-amber-400"
            placeholder={
              field === 'situation' ? '当时是什么情况？' :
              field === 'task' ? '我的任务是什么？' :
              field === 'action' ? '我做了什么？' : '结果如何？（包含量化数据）'
            }
          />
        </div>
      ))}
    </div>
  )
}

function ListInput({ items, onChange, placeholder }: { items: string[]; onChange: (v: string[]) => void; placeholder: string }) {
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
          <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-slate-300 hover:text-red-400">
            <X size={16} />
          </button>
        </div>
      ))}
      <button onClick={() => onChange([...items, ''])} className="text-xs text-indigo-500 font-medium">+ 添加</button>
    </div>
  )
}

export default function PostInternship() {
  const [activeTab, setActiveTab] = useState<'summary' | 'reflection'>('summary')
  const [summary, setSummary] = useLocalStorage<PostSummary>('ant-post-summary', defaultSummary)
  const [reflection, setReflection] = useLocalStorage<PostReflection>('ant-post-reflection', defaultReflection)
  const [editing, setEditing] = useState(false)

  const summaryFilled = summary.timeRange || summary.mentor || summary.projects.length > 0
  const reflectionFilled = reflection.understandingBefore || reflection.understandingAfter

  return (
    <div className="max-w-5xl mx-auto px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">实习后总结</h1>
        <p className="text-slate-500">实习结束后的系统性复盘，将碎片化的日常记录提炼为结构化的成长输出。</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
          {[
            { key: 'summary' as const, label: '📄 整体总结', filled: summaryFilled },
            { key: 'reflection' as const, label: '💭 个人反思', filled: reflectionFilled },
          ].map(({ key, label, filled }) => (
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
              {filled && <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />}
            </button>
          ))}
        </div>
        <button
          onClick={() => setEditing(!editing)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            editing ? 'bg-slate-100 text-slate-700' : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {editing ? '预览' : <><Edit3 size={14} /> 编辑</>}
        </button>
      </div>

      {/* Summary Tab */}
      {activeTab === 'summary' && (
        <div className="space-y-6">
          {/* Header info */}
          <div className="card p-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs text-slate-500 block mb-1">实习时间</label>
                {editing ? (
                  <input value={summary.timeRange} onChange={(e) => setSummary({ ...summary, timeRange: e.target.value })} placeholder="YY/MM/DD — YY/MM/DD（共 X 周）" className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg" />
                ) : (
                  <p className="text-sm text-slate-700">{summary.timeRange || '待填写'}</p>
                )}
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">Mentor</label>
                {editing ? (
                  <input value={summary.mentor} onChange={(e) => setSummary({ ...summary, mentor: e.target.value })} className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg" />
                ) : (
                  <p className="text-sm text-slate-700">{summary.mentor || '待填写'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Projects */}
          <div className="card p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Briefcase size={18} className="text-indigo-500" /> 参与项目
            </h3>
            {summary.projects.map((proj, i) => (
              <div key={i} className="flex gap-2 mb-2">
                {editing ? (
                  <>
                    <input value={proj.name} onChange={(e) => { const n = [...summary.projects]; n[i] = { ...proj, name: e.target.value }; setSummary({ ...summary, projects: n }) }} placeholder="项目名" className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg flex-1" />
                    <input value={proj.time} onChange={(e) => { const n = [...summary.projects]; n[i] = { ...proj, time: e.target.value }; setSummary({ ...summary, projects: n }) }} placeholder="时间" className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg w-32" />
                    <input value={proj.role} onChange={(e) => { const n = [...summary.projects]; n[i] = { ...proj, role: e.target.value }; setSummary({ ...summary, projects: n }) }} placeholder="角色" className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg w-28" />
                    <input value={proj.output} onChange={(e) => { const n = [...summary.projects]; n[i] = { ...proj, output: e.target.value }; setSummary({ ...summary, projects: n }) }} placeholder="产出" className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg flex-1" />
                    <button onClick={() => setSummary({ ...summary, projects: summary.projects.filter((_, j) => j !== i) })} className="text-slate-300 hover:text-red-400"><X size={16} /></button>
                  </>
                ) : (
                  <div className="flex-1 flex items-center gap-3 py-2 px-3 bg-slate-50 rounded-lg text-sm">
                    <span className="font-medium text-slate-800">{proj.name}</span>
                    <span className="text-slate-400">{proj.time}</span>
                    <span className="text-slate-400">· {proj.role}</span>
                    <span className="text-slate-400">· {proj.output}</span>
                  </div>
                )}
              </div>
            ))}
            {editing && (
              <button
                onClick={() => setSummary({ ...summary, projects: [...summary.projects, { name: '', time: '', role: '', output: '' }] })}
                className="text-xs text-indigo-500 font-medium mt-2"
              >
                + 添加项目
              </button>
            )}
            {summary.projects.length === 0 && !editing && (
              <p className="text-sm text-slate-400">点击"编辑"添加参与的项目</p>
            )}
          </div>

          {/* Tech Growth Before/After */}
          <div className="card p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Target size={18} className="text-indigo-500" /> 技术成长
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-2 font-medium text-slate-500">维度</th>
                    <th className="text-left py-2 font-medium text-slate-500">实习前</th>
                    <th className="text-left py-2 font-medium text-slate-500">实习后</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.techGrowth.map((row, i) => (
                    <tr key={i} className="border-b border-slate-50">
                      <td className="py-2 font-medium text-slate-700">{row.dimension}</td>
                      {editing ? (
                        <>
                          <td className="py-2"><input value={row.before} onChange={(e) => { const n = [...summary.techGrowth]; n[i] = { ...row, before: e.target.value }; setSummary({ ...summary, techGrowth: n }) }} className="w-full px-2 py-1 text-sm border border-slate-200 rounded" /></td>
                          <td className="py-2"><input value={row.after} onChange={(e) => { const n = [...summary.techGrowth]; n[i] = { ...row, after: e.target.value }; setSummary({ ...summary, techGrowth: n }) }} className="w-full px-2 py-1 text-sm border border-slate-200 rounded" /></td>
                        </>
                      ) : (
                        <>
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

          {/* STAR Experiences */}
          <div className="card p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Star size={18} className="text-amber-500" /> 关键经历（STAR 法则）
            </h3>
            {summary.starExperiences.map((exp, i) => (
              <div key={i} className="mb-4">
                {editing ? (
                  <StarExpEditor
                    exp={exp}
                    onChange={(e) => { const n = [...summary.starExperiences]; n[i] = e; setSummary({ ...summary, starExperiences: n }) }}
                    onDelete={() => setSummary({ ...summary, starExperiences: summary.starExperiences.filter((_, j) => j !== i) })}
                  />
                ) : (
                  <div className="card p-4 bg-slate-50">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="font-medium text-slate-700">S:</span> <span className="text-slate-500">{exp.situation}</span></div>
                      <div><span className="font-medium text-slate-700">T:</span> <span className="text-slate-500">{exp.task}</span></div>
                      <div><span className="font-medium text-slate-700">A:</span> <span className="text-slate-500">{exp.action}</span></div>
                      <div><span className="font-medium text-slate-700">R:</span> <span className="text-slate-500">{exp.result}</span></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {editing && (
              <button
                onClick={() => setSummary({ ...summary, starExperiences: [...summary.starExperiences, { situation: '', task: '', action: '', result: '' }] })}
                className="flex items-center gap-1 text-sm text-indigo-500 font-medium"
              >
                <Plus size={14} /> 添加 STAR 经历
              </button>
            )}
          </div>

          {/* Tech takeaways */}
          <div className="card p-6">
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Lightbulb size={18} className="text-amber-500" /> 最有价值的技术收获
            </h3>
            {editing ? (
              <ListInput items={summary.techTakeaways} onChange={(v) => setSummary({ ...summary, techTakeaways: v })} placeholder="技术收获..." />
            ) : (
              <ul className="space-y-1">
                {summary.techTakeaways.filter(Boolean).map((t, i) => (
                  <li key={i} className="text-sm text-slate-700 flex gap-2">• {t}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Reflection Tab */}
      {activeTab === 'reflection' && (
        <div className="space-y-6">
          {/* Understanding change */}
          <div className="card p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <BookOpen size={18} className="text-indigo-500" /> 对 Agent 研发的理解变化
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">实习前的理解</h4>
                {editing ? (
                  <textarea value={reflection.understandingBefore} onChange={(e) => setReflection({ ...reflection, understandingBefore: e.target.value })} rows={4} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg resize-none" placeholder="实习前，我认为 Agent 研发是什么样的工作？" />
                ) : (
                  <p className="text-sm text-slate-600">{reflection.understandingBefore || '待填写'}</p>
                )}
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">实习后的理解</h4>
                {editing ? (
                  <textarea value={reflection.understandingAfter} onChange={(e) => setReflection({ ...reflection, understandingAfter: e.target.value })} rows={4} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg resize-none" placeholder="实际做过之后，理解发生了哪些变化？" />
                ) : (
                  <p className="text-sm text-slate-600">{reflection.understandingAfter || '待填写'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="font-semibold text-slate-900 mb-3 text-emerald-700">做得好的</h3>
              {editing ? (
                <ListInput items={reflection.strengths} onChange={(v) => setReflection({ ...reflection, strengths: v })} placeholder="优势..." />
              ) : (
                <ul className="space-y-1">
                  {reflection.strengths.filter(Boolean).map((s, i) => (
                    <li key={i} className="text-sm text-slate-700 flex gap-2">✅ {s}</li>
                  ))}
                </ul>
              )}
            </div>
            <div className="card p-6">
              <h3 className="font-semibold text-slate-900 mb-3 text-amber-700">需要提升的</h3>
              {editing ? (
                <ListInput items={reflection.improvements} onChange={(v) => setReflection({ ...reflection, improvements: v })} placeholder="待提升..." />
              ) : (
                <ul className="space-y-1">
                  {reflection.improvements.filter(Boolean).map((s, i) => (
                    <li key={i} className="text-sm text-slate-700 flex gap-2">🔄 {s}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Career adjustments */}
          <div className="card p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Target size={18} className="text-indigo-500" /> 职业规划校准
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-2 font-medium text-slate-500">维度</th>
                    <th className="text-left py-2 font-medium text-slate-500">实习前设想</th>
                    <th className="text-left py-2 font-medium text-slate-500">实习后调整</th>
                  </tr>
                </thead>
                <tbody>
                  {reflection.careerAdjustments.map((row, i) => (
                    <tr key={i} className="border-b border-slate-50">
                      <td className="py-2 font-medium text-slate-700">{row.dimension}</td>
                      {editing ? (
                        <>
                          <td className="py-2"><input value={row.before} onChange={(e) => { const n = [...reflection.careerAdjustments]; n[i] = { ...row, before: e.target.value }; setReflection({ ...reflection, careerAdjustments: n }) }} className="w-full px-2 py-1 text-sm border border-slate-200 rounded" /></td>
                          <td className="py-2"><input value={row.after} onChange={(e) => { const n = [...reflection.careerAdjustments]; n[i] = { ...row, after: e.target.value }; setReflection({ ...reflection, careerAdjustments: n }) }} className="w-full px-2 py-1 text-sm border border-slate-200 rounded" /></td>
                        </>
                      ) : (
                        <>
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
          <div className="card p-6">
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Users size={18} className="text-indigo-500" /> 给下一届实习生的建议
            </h3>
            {editing ? (
              <ListInput items={reflection.advice} onChange={(v) => setReflection({ ...reflection, advice: v })} placeholder="建议..." />
            ) : (
              <ol className="space-y-1 list-decimal list-inside">
                {reflection.advice.filter(Boolean).map((a, i) => (
                  <li key={i} className="text-sm text-slate-700">{a}</li>
                ))}
              </ol>
            )}
            {!editing && reflection.advice.every(a => !a) && (
              <p className="text-sm text-slate-400">点击"编辑"添加建议</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
