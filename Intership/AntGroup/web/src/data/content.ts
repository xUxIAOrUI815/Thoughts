// All initial states are empty. Users create their own content.
// This file provides only the default factory functions for new items.

import type { TodoItem, Note, Skill, ResearchTopic, DailyLog, WeeklyReview, ProjectDoc, PostData } from '../types'

export function newTodo(category = ''): TodoItem {
  return {
    id: crypto.randomUUID(),
    text: '',
    category,
    done: false,
    createdAt: new Date().toISOString(),
  }
}

export function newNote(): Note {
  const now = new Date().toISOString()
  return { id: crypto.randomUUID(), title: '', content: '', category: '', tags: [], createdAt: now, updatedAt: now }
}

export function newSkill(): Skill {
  return {
    id: crypto.randomUUID(),
    name: '',
    category: '',
    currentLevel: 1,
    targetLevel: 3,
    resources: [],
    notes: '',
    status: 'planned',
  }
}

export function newResearchTopic(): ResearchTopic {
  return {
    id: crypto.randomUUID(),
    title: '',
    goal: '',
    category: '',
    sections: [{ heading: '', content: '' }],
    status: 'planned',
    createdAt: new Date().toISOString(),
  }
}

export function newDailyLog(): DailyLog {
  const d = new Date()
  return {
    id: crypto.randomUUID(),
    date: d.toISOString().slice(0, 10),
    weekday: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][d.getDay()],
    tasks: [{ planned: '', status: 'todo', note: '' }],
    summary: '',
    learned: [''],
    problems: '',
    questions: [''],
    tomorrow: [''],
  }
}

export function newWeeklyReview(n: number): WeeklyReview {
  return {
    id: crypto.randomUUID(),
    weekNumber: n,
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

export function newProjectDoc(): ProjectDoc {
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

export function defaultPostData(): PostData {
  return {
    timeRange: '',
    mentor: '',
    projects: [],
    skillGrowths: [
      { id: crypto.randomUUID(), dimension: 'Agent 架构理解', before: '', after: '' },
      { id: crypto.randomUUID(), dimension: 'LLM 工程化能力', before: '', after: '' },
      { id: crypto.randomUUID(), dimension: '保险业务理解', before: '', after: '' },
      { id: crypto.randomUUID(), dimension: '工程协作能力', before: '', after: '' },
    ],
    techTakeaways: ['', '', ''],
    businessTakeaways: '',
    starEntries: [],
    reusableOutputs: [''],
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
}
