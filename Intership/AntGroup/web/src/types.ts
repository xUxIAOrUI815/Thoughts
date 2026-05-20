// ── Pre-internship: flexible workspace ──

export interface TodoItem {
  id: string
  text: string
  category: string
  done: boolean
  createdAt: string
}

export interface Note {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface Skill {
  id: string
  name: string
  category: string
  currentLevel: number // 1-5
  targetLevel: number
  resources: string[]
  notes: string
  status: 'planned' | 'learning' | 'done'
}

export interface ResearchSection {
  heading: string
  content: string
}

export interface ResearchTopic {
  id: string
  title: string
  goal: string
  category: string
  sections: ResearchSection[]
  status: 'planned' | 'in-progress' | 'done'
  createdAt: string
}

// ── During-internship: daily logs, weekly reviews, projects ──

export interface DailyLog {
  id: string
  date: string
  weekday: string
  tasks: { planned: string; status: 'done' | 'progress' | 'todo'; note: string }[]
  summary: string
  learned: string[]
  problems: string
  questions: string[]
  tomorrow: string[]
}

export interface WeeklyReview {
  id: string
  weekNumber: number
  dateRange: string
  achievements: string[]
  techLearnings: { area: string; detail: string; level: number }[]
  businessInsight: string
  challenges: string
  good: string[]
  bad: string[]
  nextWeek: string[]
  selfRatings: { dimension: string; score: number; note: string }[]
}

export interface ProjectDoc {
  id: string
  name: string
  timeRange: string
  role: string
  collaborators: string
  background: string
  myWork: string[]
  decisions: { point: string; optionA: string; optionB: string; choice: string; reason: string }[]
  results: string
  pitfalls: string[]
  lessons: string[]
}

// ── Post-internship: templates, not pre-filled content ──

export interface STAREntry {
  id: string
  title: string
  situation: string
  task: string
  action: string
  result: string
}

export interface SkillGrowth {
  id: string
  dimension: string
  before: string
  after: string
}

export interface ProjectSummary {
  id: string
  name: string
  time: string
  role: string
  output: string
}

export interface PostData {
  timeRange: string
  mentor: string
  projects: ProjectSummary[]
  skillGrowths: SkillGrowth[]
  techTakeaways: string[]
  businessTakeaways: string
  starEntries: STAREntry[]
  reusableOutputs: string[]
  // reflection
  understandingBefore: string
  understandingAfter: string
  agentDirection: string
  strengths: string[]
  improvements: string[]
  surprises: string[]
  careerAdjustments: { dimension: string; before: string; after: string }[]
  relationships: { name: string; role: string; learned: string }[]
  advice: string[]
}
