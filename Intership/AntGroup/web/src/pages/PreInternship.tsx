import { useState } from 'react'
import { Search, BookOpen, Code2, Target, ChevronDown, ChevronRight, ExternalLink, CheckSquare, Square } from 'lucide-react'
import { checklistGroups, researchTopics, agentLearningWeeks } from '../data/content'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { ChecklistGroup, TableData } from '../types'

function TableView({ data }: { data: TableData }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50">
            {data.headers.map((h) => (
              <th key={h} className="text-left px-4 py-2.5 font-medium text-slate-600 text-xs uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, i) => (
            <tr key={i} className="border-t border-slate-100 hover:bg-slate-50/50">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2.5 text-slate-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function TopicCard({
  topic,
  defaultOpen,
}: {
  topic: (typeof researchTopics)[0]
  defaultOpen: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="card mb-4 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-4 flex items-center gap-3 text-left hover:bg-slate-50 transition-colors"
      >
        <span className="text-xl">{topic.icon === 'Target' ? '🎯' : topic.icon === 'Shield' ? '🛡️' : topic.icon === 'Cpu' ? '🧠' : '🔗'}</span>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900">{topic.title}</h3>
          <p className="text-sm text-slate-500 mt-0.5">{topic.goal}</p>
        </div>
        {open ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
      </button>
      {open && (
        <div className="px-6 pb-6 space-y-5 border-t border-slate-100 pt-5">
          {topic.sections.map((section, i) => (
            <div key={i}>
              <h4 className="text-sm font-semibold text-indigo-600 mb-2.5 uppercase tracking-wider">
                {section.heading}
              </h4>
              {section.type === 'table' && <TableView data={section.content as TableData} />}
              {section.type === 'list' && (
                <ul className="space-y-1.5">
                  {(section.content as string[]).map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className="text-indigo-400 mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function PreInternship() {
  const [checklist, setChecklist] = useLocalStorage('ant-pre-checklist', checklistGroups)
  const [activeTab, setActiveTab] = useState<'checklist' | 'research' | 'learning'>('checklist')

  const toggleItem = (groupId: string, itemId: string) => {
    setChecklist(
      checklist.map((g) =>
        g.id === groupId
          ? { ...g, items: g.items.map((i) => (i.id === itemId ? { ...i, done: !i.done } : i)) }
          : g
      )
    )
  }

  const allItems = checklist.flatMap((g) => g.items)
  const doneCount = allItems.filter((i) => i.done).length
  const totalCount = allItems.length
  const progressPct = totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100)

  const iconMap: Record<string, React.ElementType> = {
    Search, BookOpen, Code2, Wrench: Search,
  }

  return (
    <div className="max-w-5xl mx-auto px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">实习前准备</h1>
        <p className="text-slate-500">
          在正式入职前建立对保险业务、Agent 技术栈、蚂蚁生态的基本认知，减少冷启动时间。
        </p>
      </div>

      {/* Progress bar */}
      <div className="card p-5 mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-slate-600">准备进度</span>
          <span className="text-sm font-semibold text-indigo-600">{doneCount}/{totalCount} 项完成</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-slate-100 rounded-lg p-1 w-fit">
        {[
          { key: 'checklist', label: '📋 准备清单' },
          { key: 'research', label: '📖 调研笔记' },
          { key: 'learning', label: '🗓️ 学习路径' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as typeof activeTab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === key
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'checklist' && (
        <div className="space-y-4">
          {checklist.map((group) => {
            const groupDone = group.items.filter((i) => i.done).length
            return (
              <div key={group.id} className="card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900">{group.title}</h3>
                  <span className="text-xs text-slate-400">
                    {groupDone}/{group.items.length}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {group.items.map((item) => (
                    <label
                      key={item.id}
                      className="flex items-start gap-3 py-2 px-3 -mx-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <button
                        onClick={() => toggleItem(group.id, item.id)}
                        className="mt-0.5 shrink-0 text-slate-300 hover:text-indigo-500 transition-colors"
                      >
                        {item.done ? (
                          <CheckSquare size={18} className="text-emerald-500" />
                        ) : (
                          <Square size={18} />
                        )}
                      </button>
                      <span
                        className={`text-sm ${
                          item.done ? 'text-slate-400 line-through' : 'text-slate-700'
                        }`}
                      >
                        {item.text}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {activeTab === 'research' && (
        <div>
          {researchTopics.map((topic, i) => (
            <TopicCard key={topic.id} topic={topic} defaultOpen={i === 0} />
          ))}
        </div>
      )}

      {activeTab === 'learning' && (
        <div className="space-y-4">
          {agentLearningWeeks.map((week, i) => (
            <div key={i} className="card p-5">
              <h3 className="font-semibold text-slate-900 mb-3">{week.week}</h3>
              <ul className="space-y-2">
                {week.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="text-indigo-400 mt-0.5">▸</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="card p-5 border-indigo-200 bg-indigo-50/50">
            <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <Target size={18} className="text-indigo-500" />
              动手项目（入职前至少完成一个）
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-slate-700">
                <span className="text-indigo-400 mt-0.5">▸</span>
                <span>
                  <strong>保险问答 Agent</strong>：用 RAG 搭建保险知识问答系统，能回答"重疾险和医疗险有什么区别"这类问题
                </span>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-700">
                <span className="text-indigo-400 mt-0.5">▸</span>
                <span>
                  <strong>多 Agent 协作 Demo</strong>：一个 Agent 负责理解用户需求，另一个 Agent 负责查询保险产品库，协作完成产品推荐
                </span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
