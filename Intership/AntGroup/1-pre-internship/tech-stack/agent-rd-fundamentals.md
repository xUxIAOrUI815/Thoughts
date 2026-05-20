# Agent 研发技术栈储备

## 学习目标

建立 Agent 研发的系统性知识框架，入职后能快速理解和参与团队的 Agent 项目。

## 知识地图

### 第一层：LLM 基础

| 主题 | 核心内容 | 掌握程度 |
|------|---------|---------|
| Transformer 架构 | Self-Attention、Multi-Head Attention、位置编码 | 理解原理即可 |
| Prompt Engineering | Few-shot、Chain-of-Thought、ReAct、结构化 Prompt | 需要熟练 |
| Tokenization | BPE、SentencePiece、Token 计数 | 了解 |
| 模型选型 | GPT、Claude、文心、通义、DeepSeek 等差异 | 了解各模型特点 |

### 第二层：Agent 核心机制

| 主题 | 核心内容 | 重要性 |
|------|---------|--------|
| Tool Use / Function Calling | 工具定义、调用链路、错误处理 | ⭐⭐⭐⭐⭐ |
| Planning | 任务分解（Plan-and-Execute）、ReAct 循环 | ⭐⭐⭐⭐⭐ |
| Memory | 短期记忆（上下文窗口）、长期记忆（向量存储） | ⭐⭐⭐⭐ |
| RAG | 检索增强生成：Embedding、向量检索、重排序 | ⭐⭐⭐⭐ |
| Multi-Agent | Agent 间通信、任务分配、结果聚合 | ⭐⭐⭐ |

### 第三层：工程化

| 主题 | 核心内容 | 重要性 |
|------|---------|--------|
| 框架 | LangChain、LangGraph、AutoGen、CrewAI | ⭐⭐⭐⭐ |
| 可观测性 | LangSmith、LangFuse、Prompt 版本管理 | ⭐⭐⭐⭐ |
| 评测 | 端到端评测、组件评测、人工评测体系 | ⭐⭐⭐⭐⭐ |
| 安全 | Prompt Injection 防护、内容安全、权限控制 | ⭐⭐⭐ |
| 性能 | 延迟优化、缓存策略、流式输出 | ⭐⭐⭐ |

## 推荐学习路径

### 第 1 周：快速上手
- [ ] 用 LangChain/LangGraph 搭建一个简单的 Agent Demo（搜索 + 回答）
- [ ] 阅读 OpenAI Function Calling 文档，理解工具调用的完整链路
- [ ] 体验 3-5 个 Agent 产品（ChatGPT Plugins、扣子、Dify 等）

### 第 2 周：深入核心
- [ ] 深入理解 ReAct / Plan-and-Execute 两种 Agent 模式
- [ ] 搭建一个带记忆的多轮对话 Agent
- [ ] 学习 RAG 的基础实现（Embedding + 向量检索 + LLM 生成）

### 第 3 周：工程与评测
- [ ] 了解 Agent 评测的主流方法
- [ ] 了解 Prompt 管理和版本控制
- [ ] 阅读一篇 Agent 相关的论文（推荐：ReAct、AutoGPT、MetaGPT 中选一篇）

## 关键论文

| 论文 | 核心贡献 | 优先级 |
|------|---------|--------|
| ReAct: Synergizing Reasoning and Acting in Language Models | Reasoning + Action 交替模式 | ⭐⭐⭐⭐⭐ |
| Toolformer: Language Models Can Teach Themselves to Use Tools | LLM 自主学会使用工具 | ⭐⭐⭐ |
| AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation | 多 Agent 对话框架 | ⭐⭐⭐⭐ |
| DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines | 声明式 Prompt 编程 | ⭐⭐⭐ |

## 动手项目

> 入职前至少完成一个，把代码放到 `../assets/` 或独立 repo

- [ ] **保险问答 Agent**：用 RAG 搭建一个保险知识问答系统，能回答"重疾险和医疗险有什么区别"这类问题
- [ ] **多 Agent 协作 Demo**：一个 Agent 负责理解用户需求，另一个 Agent 负责查询保险产品库，协作完成产品推荐
