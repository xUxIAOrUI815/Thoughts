import type { ChecklistGroup, ResearchTopic } from '../types'

export const checklistGroups: ChecklistGroup[] = [
  {
    id: 'product-research',
    title: '产品调研',
    icon: 'Search',
    items: [
      { id: 'pr-1', text: '蚂蚁保核心产品线梳理（车险、健康险、寿险、宠物险等）', done: false },
      { id: 'pr-2', text: '竞品分析：微保、水滴保、众安保险', done: false },
      { id: 'pr-3', text: '保险代理 vs 保险经纪 vs 直销模式理解', done: false },
      { id: 'pr-4', text: '蚂蚁保在蚂蚁集团生态中的定位', done: false },
    ],
  },
  {
    id: 'business-knowledge',
    title: '业务知识',
    icon: 'BookOpen',
    items: [
      { id: 'bk-1', text: '保险基础概念（保费、核保、理赔、精算、再保险）', done: false },
      { id: 'bk-2', text: '中国保险监管体系（国家金融监督管理总局）', done: false },
      { id: 'bk-3', text: '互联网保险业务监管办法', done: false },
      { id: 'bk-4', text: 'InsurTech 行业趋势与 AI 落地场景', done: false },
    ],
  },
  {
    id: 'tech-stack',
    title: '技术栈储备',
    icon: 'Code2',
    items: [
      { id: 'ts-1', text: 'LLM 基础（Transformer、Prompt Engineering、Fine-tuning）', done: false },
      { id: 'ts-2', text: 'Agent 框架（LangChain/LangGraph、AutoGen 等）', done: false },
      { id: 'ts-3', text: 'RAG 检索增强生成', done: false },
      { id: 'ts-4', text: 'Function Calling / Tool Use 机制', done: false },
      { id: 'ts-5', text: '多 Agent 协作与编排', done: false },
      { id: 'ts-6', text: 'Agent 评测与可观测性', done: false },
      { id: 'ts-7', text: '蚂蚁集团技术生态（SOFAStack、OceanBase、Ant Design 等）', done: false },
    ],
  },
  {
    id: 'tools-env',
    title: '工具 & 环境',
    icon: 'Wrench',
    items: [
      { id: 'te-1', text: '开发环境搭建确认', done: false },
      { id: 'te-2', text: '内部代码仓库、文档平台权限确认', done: false },
      { id: 'te-3', text: '内部 IM、日历、邮件配置', done: false },
    ],
  },
]

export const agentLearningWeeks = [
  {
    week: '第 1 周：快速上手',
    items: [
      '用 LangChain/LangGraph 搭建一个简单的 Agent Demo（搜索 + 回答）',
      '阅读 OpenAI Function Calling 文档，理解工具调用的完整链路',
      '体验 3-5 个 Agent 产品（ChatGPT Plugins、扣子、Dify 等）',
    ],
  },
  {
    week: '第 2 周：深入核心',
    items: [
      '深入理解 ReAct / Plan-and-Execute 两种 Agent 模式',
      '搭建一个带记忆的多轮对话 Agent',
      '学习 RAG 的基础实现（Embedding + 向量检索 + LLM 生成）',
    ],
  },
  {
    week: '第 3 周：工程与评测',
    items: [
      '了解 Agent 评测的主流方法',
      '了解 Prompt 管理和版本控制',
      '阅读一篇 Agent 相关的论文（推荐：ReAct、AutoGPT、MetaGPT 中选一篇）',
    ],
  },
]

export const researchTopics: ResearchTopic[] = [
  {
    id: 'ant-insurance-landscape',
    title: '蚂蚁保产品体系调研',
    goal: '理解蚂蚁保的产品矩阵、商业模式、以及 Agent/AI 可能落地的场景。',
    icon: 'Target',
    sections: [
      {
        heading: '蚂蚁保核心产品线',
        type: 'table',
        content: {
          headers: ['产品线', '代表产品', '定位', 'AI 潜在应用'],
          rows: [
            ['车险', '—', '标准化产品', '智能报价、理赔定损'],
            ['健康险', '好医保系列', '流量入口', '核保辅助、理赔审核'],
            ['寿险', '—', '长期保障', '需求分析、智能推荐'],
            ['宠物险', '—', '新兴赛道', '理赔自动化'],
            ['意外险', '—', '高频低额', '极速理赔'],
          ],
        },
      },
      {
        heading: '竞争格局',
        type: 'table',
        content: {
          headers: ['平台', '模式', '优势', '差异化'],
          rows: [
            ['蚂蚁保', '保险代理', '支付宝流量 + 信用体系', '—'],
            ['微保（腾讯）', '保险代理', '微信生态 + 社交裂变', '场景化销售'],
            ['水滴保', '保险经纪', '众筹场景 + 下沉市场', '场景教育'],
            ['众安保险', '直销 + 技术输出', '持牌保险公司', '技术能力强'],
          ],
        },
      },
      {
        heading: 'Agent 落地场景猜想',
        type: 'list',
        content: [
          '智能投保顾问 — 多轮对话理解用户需求，推荐合适产品',
          '理赔 Agent — 自动审核理赔材料、识别欺诈风险',
          '客服 Agent — 7×24 保险咨询、保单查询、退保处理',
          '运营 Agent — 用户触达策略生成、文案自动生成',
          '风控 Agent — 实时风险评估、异常行为检测',
        ],
      },
      {
        heading: '关键待调研问题',
        type: 'list',
        content: [
          '蚂蚁保的保险代理牌照和蚂蚁集团其他金融牌照如何协同？',
          '支付宝流量如何转化为保险用户？转化漏斗如何？',
          '蚂蚁保的技术团队如何分工？Agent 团队在组织架构中的位置？',
          '现有产品中哪些环节已经有 AI 介入？效果如何？',
        ],
      },
    ],
  },
  {
    id: 'insurance-fundamentals',
    title: '保险业务基础知识',
    goal: '建立保险业务的基本知识框架，能听懂业务方在说什么，能理解产品需求背后的业务逻辑。',
    icon: 'Shield',
    sections: [
      {
        heading: '保险基础概念',
        type: 'table',
        content: {
          headers: ['概念', '定义', '对技术的影响'],
          rows: [
            ['保费 Premium', '投保人支付的费用', '定价模型、费率计算'],
            ['核保 Underwriting', '评估风险、决定是否承保', '规则引擎、AI 辅助核保'],
            ['理赔 Claims', '出险后申请赔付', '流程自动化、反欺诈'],
            ['精算 Actuarial', '数学/统计方法评估风险', '数据建模'],
            ['再保险 Reinsurance', '保险公司间转移风险', '数据上报、合规'],
            ['等待期', '投保后到保障生效的间隔', '状态机设计'],
            ['免赔额 Deductible', '理赔时自行承担的部分', '赔付计算逻辑'],
            ['现金价值 Cash Value', '长期保险储蓄/投资部分价值', '退保计算'],
          ],
        },
      },
      {
        heading: '保险产品类型',
        type: 'table',
        content: {
          headers: ['类型', '特点', '典型场景'],
          rows: [
            ['医疗险', '报销型，实报实销', '住院、门诊'],
            ['重疾险', '给付型，确诊即赔', '癌症、心脑血管'],
            ['意外险', '保费低、杠杆高', '意外身故/伤残/医疗'],
            ['寿险', '以死亡/生存为给付条件', '家庭支柱保障'],
            ['年金险', '按期领取', '养老规划、教育储蓄'],
            ['车险', '强制+商业', '交强险、三者险'],
          ],
        },
      },
      {
        heading: '互联网保险特有概念',
        type: 'list',
        content: [
          '保险代理 vs 保险经纪 vs 保险公司直销 — 蚂蚁保是代理平台，不承担承保风险',
          '互联网保险新规（2021）— 对线上销售的限制和要求',
          '首月 0 元争议 — 互联网保险营销的监管红线',
          '可回溯管理 — 销售过程记录，技术实现涉及前端录屏/埋点',
        ],
      },
    ],
  },
  {
    id: 'agent-rd-fundamentals',
    title: 'Agent 研发技术栈储备',
    goal: '建立 Agent 研发的系统性知识框架，入职后能快速理解和参与团队的 Agent 项目。',
    icon: 'Cpu',
    sections: [
      {
        heading: '第一层：LLM 基础',
        type: 'table',
        content: {
          headers: ['主题', '核心内容', '掌握程度'],
          rows: [
            ['Transformer 架构', 'Self-Attention、Multi-Head Attention、位置编码', '理解原理即可'],
            ['Prompt Engineering', 'Few-shot、CoT、ReAct、结构化 Prompt', '需要熟练'],
            ['Tokenization', 'BPE、SentencePiece、Token 计数', '了解'],
            ['模型选型', 'GPT、Claude、文心、通义、DeepSeek 等差异', '了解各模型特点'],
          ],
        },
      },
      {
        heading: '第二层：Agent 核心机制',
        type: 'table',
        content: {
          headers: ['主题', '核心内容', '重要性'],
          rows: [
            ['Tool Use / Function Calling', '工具定义、调用链路、错误处理', '⭐⭐⭐⭐⭐'],
            ['Planning', '任务分解（Plan-and-Execute）、ReAct 循环', '⭐⭐⭐⭐⭐'],
            ['Memory', '短期记忆（上下文窗口）、长期记忆（向量存储）', '⭐⭐⭐⭐'],
            ['RAG', 'Embedding、向量检索、重排序', '⭐⭐⭐⭐'],
            ['Multi-Agent', 'Agent 间通信、任务分配、结果聚合', '⭐⭐⭐'],
          ],
        },
      },
      {
        heading: '第三层：工程化',
        type: 'table',
        content: {
          headers: ['主题', '核心内容', '重要性'],
          rows: [
            ['框架', 'LangChain、LangGraph、AutoGen、CrewAI', '⭐⭐⭐⭐'],
            ['可观测性', 'LangSmith、LangFuse、Prompt 版本管理', '⭐⭐⭐⭐'],
            ['评测', '端到端评测、组件评测、人工评测体系', '⭐⭐⭐⭐⭐'],
            ['安全', 'Prompt Injection 防护、内容安全、权限控制', '⭐⭐⭐'],
            ['性能', '延迟优化、缓存策略、流式输出', '⭐⭐⭐'],
          ],
        },
      },
      {
        heading: '关键论文',
        type: 'table',
        content: {
          headers: ['论文', '核心贡献', '优先级'],
          rows: [
            ['ReAct', 'Reasoning + Action 交替模式', '⭐⭐⭐⭐⭐'],
            ['Toolformer', 'LLM 自主学会使用工具', '⭐⭐⭐'],
            ['AutoGen', '多 Agent 对话框架', '⭐⭐⭐⭐'],
            ['DSPy', '声明式 Prompt 编程', '⭐⭐⭐'],
          ],
        },
      },
      {
        heading: '动手项目（入职前至少完成一个）',
        type: 'list',
        content: [
          '保险问答 Agent：用 RAG 搭建保险知识问答系统，能回答"重疾险和医疗险有什么区别"',
          '多 Agent 协作 Demo：一个 Agent 负责理解用户需求，另一个查询产品库，协作完成推荐',
        ],
      },
    ],
  },
  {
    id: 'ant-tech-ecosystem',
    title: '蚂蚁集团技术生态调研',
    goal: '了解蚂蚁集团的技术基础设施，入职后能更快融入团队的技术体系。',
    icon: 'Network',
    sections: [
      {
        heading: '公开技术栈',
        type: 'table',
        content: {
          headers: ['项目', '用途', '状态'],
          rows: [
            ['SOFAStack', '金融级分布式中间件', '开源'],
            ['OceanBase', '分布式关系数据库', '开源'],
            ['Ant Design', '企业级 UI 设计语言和组件库', '开源'],
            ['AntV', '数据可视化引擎', '开源'],
            ['Egg.js', 'Node.js 企业级框架', '开源'],
          ],
        },
      },
      {
        heading: '入职后待探索的内部平台',
        type: 'table',
        content: {
          headers: ['平台/系统', '可能用途', '优先级'],
          rows: [
            ['内部 LLM 平台', '模型调用、Prompt 管理、评测', '⭐⭐⭐⭐⭐'],
            ['代码仓库 & CI/CD', '日常开发流程', '⭐⭐⭐⭐⭐'],
            ['数据平台', '训练数据、评测数据、业务分析', '⭐⭐⭐⭐'],
            ['向量数据库服务', 'RAG 系统的检索后端', '⭐⭐⭐⭐'],
            ['监控 & 告警', 'Agent 服务的可观测性', '⭐⭐⭐'],
            ['配置中心 / 服务注册', '微服务基础设施', '⭐⭐⭐'],
          ],
        },
      },
      {
        heading: '入职后需搞清楚的问题',
        type: 'list',
        content: [
          '团队的 Agent 框架是自研还是基于开源框架？技术选型的背景是什么？',
          '保险业务的 Agent 场景有哪些已经上线？有哪些在规划中？',
          '团队的工程化程度如何？评测体系、Prompt 管理、可观测性是否完善？',
          'Agent 研发和业务开发的协作模式是怎样的？',
        ],
      },
    ],
  },
]
