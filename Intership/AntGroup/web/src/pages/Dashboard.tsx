import { useNavigate } from 'react-router-dom'
import { BookOpen, Play, Flag, ArrowRight, CheckCircle2, FileText, Star } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { TodoItem, Note, Skill, ResearchTopic, DailyLog, WeeklyReview, ProjectDoc, PostData } from '../types'

function progressPercent(done: number, total: number) {
  return total === 0 ? 0 : Math.round((done / total) * 100)
}

function PhaseCard({
  icon: Icon,
  title,
  subtitle,
  progress,
  stats,
  color,
  to,
}: {
  icon: React.ElementType
  title: string
  subtitle: string
  progress: number
  stats: { label: string; value: string | number }[]
  color: string
  to: string
}) {
  const navigate = useNavigate()
  return (
    <div onClick={() => navigate(to)} className="card-hover p-6 cursor-pointer group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-slate-800">{progress}%</span>
        </div>
      </div>
      <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 mb-4">{subtitle}</p>
      <div className="w-full h-1.5 bg-slate-100 rounded-full mb-4">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${progress}%` }} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {stats.map((s) => (
          <div key={s.label} className="text-center py-2 bg-slate-50 rounded-lg">
            <div className="text-lg font-semibold text-slate-800">{s.value}</div>
            <div className="text-xs text-slate-400">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1 mt-4 text-sm text-indigo-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
        进入 <ArrowRight size={14} />
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [todos] = useLocalStorage<TodoItem[]>('ant-todos', [])
  const [notes] = useLocalStorage<Note[]>('ant-notes', [])
  const [skills] = useLocalStorage<Skill[]>('ant-skills', [])
  const [research] = useLocalStorage<ResearchTopic[]>('ant-research', [])
  const [dailyLogs] = useLocalStorage<DailyLog[]>('ant-daily-logs', [])
  const [weeklyReviews] = useLocalStorage<WeeklyReview[]>('ant-weekly-reviews', [])
  const [projects] = useLocalStorage<ProjectDoc[]>('ant-projects', [])
  const [postData] = useLocalStorage<PostData>('ant-post-data', { timeRange: '', mentor: '', projects: [], skillGrowths: [], techTakeaways: [], businessTakeaways: '', starEntries: [], reusableOutputs: [], understandingBefore: '', understandingAfter: '', agentDirection: '', strengths: [], improvements: [], surprises: [], careerAdjustments: [], relationships: [], advice: [] })

  const todoDone = todos.filter((t) => t.done).length
  const preTotal = todos.length + notes.length + skills.length + research.length
  const preDone = todoDone + (notes.length > 0 ? 1 : 0) + (skills.length > 0 ? 1 : 0) + (research.length > 0 ? 1 : 0)
  const preProgress = progressPercent(preDone, Math.max(preTotal, 4))

  const duringProgress = progressPercent(
    (dailyLogs.length > 0 ? 1 : 0) + (weeklyReviews.length > 0 ? 1 : 0) + (projects.length > 0 ? 1 : 0),
    3
  )

  const postFilled = [
    postData.timeRange,
    postData.projects.length > 0,
    postData.starEntries.length > 0,
    postData.understandingBefore,
    postData.understandingAfter,
  ].filter(Boolean).length
  const postProgress = progressPercent(postFilled, 5)

  return (
    <div className="max-w-5xl mx-auto px-8 py-10">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">🐜</span>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">蚂蚁保实习复盘</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              蚂蚁集团 · 财保技术部 · 保险技术部 — Agent 研发工程师（实习）
            </p>
          </div>
        </div>
      </div>

      {/* Phase cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <PhaseCard
          icon={BookOpen}
          title="实习前准备"
          subtitle="待办 · 笔记 · 技能 · 调研"
          progress={preProgress}
          stats={[
            { label: '待办完成', value: `${todoDone}/${todos.length}` },
            { label: '内容项', value: notes.length + skills.length + research.length },
          ]}
          color="bg-blue-500"
          to="/pre"
        />
        <PhaseCard
          icon={Play}
          title="实习中记录"
          subtitle="日报 · 周报 · 项目"
          progress={duringProgress}
          stats={[
            { label: '日报', value: dailyLogs.length },
            { label: '项目', value: projects.length },
          ]}
          color="bg-emerald-500"
          to="/during"
        />
        <PhaseCard
          icon={Flag}
          title="实习后总结"
          subtitle="复盘 · 成长 · 规划"
          progress={postProgress}
          stats={[
            { label: 'STAR经历', value: postData.starEntries.length },
            { label: '填写项', value: postFilled },
          ]}
          color="bg-amber-500"
          to="/post"
        />
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: CheckCircle2, label: '添加待办', to: '/#/pre', color: 'text-blue-500' },
          { icon: FileText, label: '记录日报', to: '/#/during', color: 'text-emerald-500' },
          { icon: Star, label: '总结复盘', to: '/#/post', color: 'text-amber-500' },
        ].map(({ icon: Icon, label, to, color }) => (
          <a
            key={label}
            href={to}
            className="card p-4 flex items-center gap-3 hover:shadow-md transition-all group"
          >
            <Icon size={18} className={color} />
            <span className="text-sm font-medium text-slate-700">{label}</span>
            <ArrowRight size={14} className="ml-auto text-slate-300 group-hover:text-indigo-500 transition-colors" />
          </a>
        ))}
      </div>
    </div>
  )
}
