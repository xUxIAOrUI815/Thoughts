import { useNavigate } from 'react-router-dom'
import { BookOpen, Play, Flag, ArrowRight, Target, CheckCircle2, CalendarDays } from 'lucide-react'
import { checklistGroups } from '../data/content'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { DailyLog, WeeklyReview } from '../types'

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
    <div
      onClick={() => navigate(to)}
      className="card-hover p-6 cursor-pointer group"
    >
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
      {/* Progress bar */}
      <div className="w-full h-1.5 bg-slate-100 rounded-full mb-4">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      {/* Stats */}
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
  const [checklist] = useLocalStorage('ant-pre-checklist', checklistGroups)
  const [dailyLogs] = useLocalStorage<DailyLog[]>('ant-daily-logs', [])
  const [weeklyReviews] = useLocalStorage<WeeklyReview[]>('ant-weekly-reviews', [])

  const allItems = checklist.flatMap((g) => g.items)
  const doneItems = allItems.filter((i) => i.done).length
  const preProgress = progressPercent(doneItems, allItems.length)

  const duringProgress = progressPercent(
    (dailyLogs.length > 0 ? 1 : 0) + (weeklyReviews.length > 0 ? 1 : 0),
    2
  )

  const postProgress = 0

  const totalProgress = progressPercent(
    (preProgress > 0 ? 1 : 0) + (duringProgress > 0 ? 1 : 0) + (postProgress > 0 ? 1 : 0),
    3
  )

  return (
    <div className="max-w-5xl mx-auto px-8 py-10">
      {/* Hero */}
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

      {/* Overall progress */}
      <div className="card p-6 mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-100">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-indigo-600 font-medium mb-1">整体进度</div>
            <div className="text-3xl font-bold text-slate-900">{totalProgress}%</div>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-indigo-100 flex items-center justify-center bg-white">
            <span className="text-lg font-bold text-indigo-600">{totalProgress}%</span>
          </div>
        </div>
      </div>

      {/* Phase cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <PhaseCard
          icon={BookOpen}
          title="实习前准备"
          subtitle="产品调研 · 业务知识 · 技术储备"
          progress={preProgress}
          stats={[
            { label: '已完成', value: doneItems },
            { label: '总计', value: allItems.length },
          ]}
          color="bg-blue-500"
          to="/pre"
        />
        <PhaseCard
          icon={Play}
          title="实习中记录"
          subtitle="日报 · 周报 · 项目文档"
          progress={duringProgress}
          stats={[
            { label: '日报', value: dailyLogs.length },
            { label: '周报', value: weeklyReviews.length },
          ]}
          color="bg-emerald-500"
          to="/during"
        />
        <PhaseCard
          icon={Flag}
          title="实习后总结"
          subtitle="整体复盘 · 职业校准 · 产出归档"
          progress={postProgress}
          stats={[
            { label: '状态', value: '待开始' },
            { label: '产出', value: 0 },
          ]}
          color="bg-amber-500"
          to="/post"
        />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Target size={18} className="text-indigo-500" />
            当前建议
          </h3>
          <ul className="space-y-2 text-sm text-slate-600">
            {preProgress < 100 && (
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-slate-300 mt-0.5 shrink-0" />
                完成实习前准备清单，建立业务和技术基础认知
              </li>
            )}
            {dailyLogs.length === 0 && (
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-slate-300 mt-0.5 shrink-0" />
                开始记录第一份日报，养成每日复盘习惯
              </li>
            )}
            {postProgress === 0 && preProgress === 100 && (
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-slate-300 mt-0.5 shrink-0" />
                实习结束后完成总结与反思
              </li>
            )}
          </ul>
        </div>
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <CalendarDays size={18} className="text-indigo-500" />
            快捷操作
          </h3>
          <div className="space-y-2">
            {[
              { label: '添加日报', href: '/#/during' },
              { label: '写周报', href: '/#/during' },
              { label: '查看调研笔记', href: '/#/pre' },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
              >
                {action.label}
                <ArrowRight size={14} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
