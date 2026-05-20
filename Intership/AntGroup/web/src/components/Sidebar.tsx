import { NavLink } from 'react-router-dom'
import { LayoutDashboard, BookOpen, Play, Flag, ChevronRight } from 'lucide-react'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: '总览' },
  { to: '/pre', icon: BookOpen, label: '实习前准备' },
  { to: '/during', icon: Play, label: '实习中记录' },
  { to: '/post', icon: Flag, label: '实习后总结' },
]

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-white border-r border-slate-200 flex flex-col z-30">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-slate-100">
        <span className="text-2xl mr-3">🐜</span>
        <div>
          <div className="text-sm font-semibold text-slate-900 leading-tight">蚂蚁保实习</div>
          <div className="text-xs text-slate-400">复盘归档系统</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <Icon size={18} />
            {label}
            <ChevronRight size={14} className="ml-auto opacity-40" />
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-slate-100">
        <div className="text-xs text-slate-400">
          蚂蚁集团 · 财保技术部
        </div>
        <div className="text-xs text-slate-400 mt-0.5">
          Agent 研发 · 实习开发工程师
        </div>
      </div>
    </aside>
  )
}
