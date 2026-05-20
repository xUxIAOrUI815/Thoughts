export interface ChecklistItemData {
  id: string;
  text: string;
  done: boolean;
}

export interface ChecklistGroup {
  id: string;
  title: string;
  icon: string;
  items: ChecklistItemData[];
}

export interface TableData {
  headers: string[];
  rows: string[][];
}

export interface TopicSection {
  heading: string;
  type: 'paragraphs' | 'table' | 'list' | 'checklist';
  content: string[] | TableData;
}

export interface ResearchTopic {
  id: string;
  title: string;
  goal: string;
  icon: string;
  sections: TopicSection[];
}

export interface DailyLog {
  id: string;
  date: string;
  weekday: string;
  tasks: { planned: string; status: 'done' | 'progress' | 'todo'; note: string }[];
  summary: string;
  learned: string[];
  problems: string;
  questions: string[];
  tomorrow: string[];
}

export interface WeeklyReview {
  id: string;
  weekNumber: number;
  dateRange: string;
  achievements: string[];
  techLearnings: { area: string; detail: string; level: number }[];
  businessInsight: string;
  challenges: string;
  good: string[];
  bad: string[];
  nextWeek: string[];
  selfRatings: { dimension: string; score: number; note: string }[];
}

export interface ProjectDoc {
  id: string;
  name: string;
  timeRange: string;
  role: string;
  collaborators: string;
  background: string;
  myWork: string[];
  decisions: { point: string; optionA: string; optionB: string; choice: string; reason: string }[];
  results: string;
  pitfalls: string[];
  lessons: string[];
}

export interface StarExperience {
  situation: string;
  task: string;
  action: string;
  result: string;
}

export interface PostSummary {
  timeRange: string;
  mentor: string;
  projects: { name: string; time: string; role: string; output: string }[];
  techGrowth: { dimension: string; before: string; after: string }[];
  techTakeaways: string[];
  businessTakeaways: string;
  starExperiences: StarExperience[];
  reusableOutputs: string[];
}

export interface PostReflection {
  understandingBefore: string;
  understandingAfter: string;
  agentDirection: string;
  strengths: string[];
  improvements: string[];
  surprises: string[];
  careerAdjustments: { dimension: string; before: string; after: string }[];
  relationships: { name: string; role: string; learned: string; keepInTouch: boolean }[];
  advice: string[];
}
