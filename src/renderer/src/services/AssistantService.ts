import { DEFAULT_CONTEXTCOUNT, DEFAULT_MAX_TOKENS, DEFAULT_TEMPERATURE } from '@renderer/config/constant'
import db from '@renderer/databases'
import i18n from '@renderer/i18n'
import store from '@renderer/store'
import { addAssistant } from '@renderer/store/assistants'
import { Agent, Assistant, AssistantSettings, Message, Model, Provider, Topic } from '@renderer/types'
import { uuid } from '@renderer/utils'

import { estimateMessageUsage } from './TokenService'

export function getDefaultAssistant(): Assistant {
  return {
    id: 'default',
    name: i18n.t('chat.default.name'),
    emoji: '⭐️',
    prompt: '',
    topics: [getDefaultTopic('default')],
    messages: [],
    type: 'assistant'
    // defaultModel: {
    //   id: 'Qwen2.5-Coder-32B-Instruct-GPTQ-Int4:32k',
    //   name: 'Qwen2.5-Coder-32B-Instruct-GPTQ-Int4:32k',
    //   provider: 'lmstudio',
    //   group: 'deepseek-ai'
    // }
  }
}
export function getManyDefaultAssistant(): Assistant[] {
  return [
    {
      id: 'default',
      name: i18n.t('chat.default.name'),
      emoji: '⭐️',
      prompt: '',
      topics: [getDefaultTopic('default')],
      messages: [],
      type: 'assistant'
      // defaultModel: {
      //   id: 'Qwen2.5-Coder-32B-Instruct-GPTQ-Int4:32k',
      //   name: 'Qwen2.5-Coder-32B-Instruct-GPTQ-Int4:32k',
      //   provider: 'lmstudio',
      //   group: 'deepseek-ai'
      // }
    },
    {
      id: '2aa5e997-6bf3-4bff-bbe5-e3f9d3994b18',
      name: '商家运营 - Merchant Operations',
      emoji: '🛍️',
      prompt:
        '你现在是一名经验丰富的商家运营专家，你擅长管理商家关系，优化商家业务流程，提高商家满意度。你对电商行业有深入的了解，并有优秀的商业洞察力。请在这个角色下为我解答以下问题。',
      description:
        '在商家运营专家的角色下，提供管理商家关系和提升满意度的实用建议。\r\nProvides practical advice on managing merchant relationships and enhancing satisfaction as a merchant operations specialist.\r\n',
      topics: [getDefaultTopicByName('default')],
      messages: [],
      type: 'assistant'
    },
    {
      id: '59a09c4b-eb95-4132-a2ac-bd5b8db2465e',
      name: '社群运营 - Community Operations',
      emoji: '👥',
      prompt:
        '你现在是一名社群运营专家，你擅长激发社群活力，增强用户的参与度和忠诚度。你了解如何管理和引导社群文化，以及如何解决社群内的问题和冲突。请在这个角色下为我解答以下问题。',
      description:
        '在社群运营专家的角色下，提供提高社群活跃度和用户忠诚度的建议。\r\nProvides guidance to enhance community engagement and user loyalty in a community operations specialist role.\r\n',
      topics: [getDefaultTopicByName('default')],
      messages: [],
      type: 'assistant'
    },
    {
      id: '2bd3cc97-1aa2-4a05-ac6d-6712fda99ff0',
      name: '产品运营 - Product Operations',
      emoji: '🚀',
      prompt:
        '你现在是一名经验丰富的产品运营专家，你擅长分析市场和用户需求，并对产品生命周期各阶段的运营策略有深刻的理解。你有出色的团队协作能力和沟通技巧，能在不同部门间进行有效的协调。请在这个角色下为我解答以下问题。\n',
      description:
        '在产品运营专家的角色下，提供基于市场需求和生命周期的运营策略建议。\r\nOffers product operation strategies based on market demand and lifecycle phases as a product operations specialist.\r\n',
      topics: [getDefaultTopicByName('default')],
      messages: [],
      type: 'assistant'
    },
    {
      id: 'a48638ac-2b9c-4002-9af7-0ec4094ee52c',
      name: '用户运营 - User Operations',
      emoji: '👨‍💻',
      prompt:
        '你现在是一名用户运营专家，你了解用户行为和需求，能够制定并执行针对性的用户运营策略。你有出色的用户服务能力，能有效处理用户反馈和投诉。请在这个角色下为我解答以下问题。\n',
      description:
        '在用户运营专家的角色下，提供提升用户活跃度和满意度的实用建议。\r\nProvides actionable insights to boost user engagement and satisfaction in a user operations specialist role.\r\n',
      topics: [getDefaultTopicByName('default')],
      messages: [],
      type: 'assistant'
    },
    {
      id: '5813c0bb-a140-4d6d-8418-20008a7349f8',
      name: '商业数据分析 - Business Data Analysis',
      emoji: '📈',
      prompt:
        '你现在是一名商业数据分析师，你精通数据分析方法和工具，能够从大量数据中提取出有价值的商业洞察。你对业务运营有深入的理解，并能提供数据驱动的优化建议。请在这个角色下为我解答以下问题。',
      description:
        '在商业数据分析师的角色下，提供基于数据的业务优化建议和洞察。\r\nProvides data-driven business insights and optimization advice as a business data analyst.\r\n',
      topics: [getDefaultTopicByName('default')],
      messages: [],
      type: 'assistant'
    },
    {
      id: 'd238636c-ac27-45fe-abbb-6647be00902a',
      name: '策略产品经理 - Strategy Product Manager',
      emoji: '🎯 ',
      prompt:
        '你现在是一名策略产品经理，你擅长进行市场研究和竞品分析，以制定产品策略。你能把握行业趋势，了解用户需求，并在此基础上优化产品功能和用户体验。请在这个角色下为我解答以下问题。',
      description:
        '在策略产品经理的角色下，提供基于市场和用户需求的深度解答。\r\nOffers in-depth answers based on market insights in a strategic product manager role.\r\n',
      topics: [getDefaultTopicByName('default')],
      messages: [],
      type: 'assistant'
    }
  ]
}

export function getDefaultTranslateAssistant(targetLanguage: string, text: string): Assistant {
  const translateModel = getTranslateModel()
  const assistant: Assistant = getDefaultAssistant()
  assistant.model = translateModel

  assistant.settings = {
    temperature: 0.7
  }

  assistant.prompt = store
    .getState()
    .settings.translateModelPrompt.replaceAll('{{target_language}}', targetLanguage)
    .replaceAll('{{text}}', text)
  return assistant
}

export function getDefaultAssistantSettings() {
  return store.getState().assistants.defaultAssistant.settings
}

export function getDefaultTopic(assistantId: string): Topic {
  return {
    id: uuid(),
    assistantId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    name: i18n.t('chat.default.topic.name'),
    messages: []
  }
}
export function getDefaultTopicByName(assistantId: string, i18nName: string = 'chat.default.topic.name'): Topic {
  return {
    id: uuid(),
    assistantId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    // name: i18n.t(i18nName),
    name: i18nName,
    messages: []
  }
}

export function getDefaultProvider() {
  return getProviderByModel(getDefaultModel())
}

export function getDefaultModel() {
  return store.getState().llm.defaultModel
}

export function getTopNamingModel() {
  return store.getState().llm.topicNamingModel
}

export function getTranslateModel() {
  return store.getState().llm.translateModel
}

export function getAssistantProvider(assistant: Assistant): Provider {
  const providers = store.getState().llm.providers
  const provider = providers.find((p) => p.id === assistant.model?.provider)
  return provider || getDefaultProvider()
}

export function getProviderByModel(model?: Model): Provider {
  const providers = store.getState().llm.providers
  const providerId = model ? model.provider : getDefaultProvider().id
  return providers.find((p) => p.id === providerId) as Provider
}

export function getProviderByModelId(modelId?: string) {
  const providers = store.getState().llm.providers
  const _modelId = modelId || getDefaultModel().id
  return providers.find((p) => p.models.find((m) => m.id === _modelId)) as Provider
}

export const getAssistantSettings = (assistant: Assistant): AssistantSettings => {
  const contextCount = assistant?.settings?.contextCount ?? DEFAULT_CONTEXTCOUNT
  const getAssistantMaxTokens = () => {
    if (assistant.settings?.enableMaxTokens) {
      const maxTokens = assistant.settings.maxTokens
      if (typeof maxTokens === 'number') {
        return maxTokens > 0 ? maxTokens : DEFAULT_MAX_TOKENS
      }
      return DEFAULT_MAX_TOKENS
    }
    return undefined
  }

  return {
    contextCount: contextCount === 20 ? 100000 : contextCount,
    temperature: assistant?.settings?.temperature ?? DEFAULT_TEMPERATURE,
    topP: assistant?.settings?.topP ?? 1,
    enableMaxTokens: assistant?.settings?.enableMaxTokens ?? false,
    maxTokens: getAssistantMaxTokens(),
    streamOutput: assistant?.settings?.streamOutput ?? true,
    hideMessages: assistant?.settings?.hideMessages ?? false,
    defaultModel: assistant?.defaultModel ?? undefined,
    customParameters: assistant?.settings?.customParameters ?? []
  }
}

export function getAssistantById(id: string) {
  const assistants = store.getState().assistants.assistants
  return assistants.find((a) => a.id === id)
}

export async function addAssistantMessagesToTopic({ assistant, topic }: { assistant: Assistant; topic: Topic }) {
  const messages: Message[] = []
  const defaultModel = getDefaultModel()

  for (const msg of assistant?.messages || []) {
    const message: Message = {
      id: uuid(),
      assistantId: assistant.id,
      role: msg.role,
      content: msg.content,
      topicId: topic.id,
      createdAt: new Date().toISOString(),
      status: 'success',
      model: assistant.defaultModel || defaultModel,
      type: 'text',
      isPreset: true
    }
    message.usage = await estimateMessageUsage(message)
    messages.push(message)
  }

  db.topics.put({ id: topic.id, messages }, topic.id)

  return messages
}

export async function createAssistantFromAgent(agent: Agent) {
  const assistantId = uuid()
  const topic = getDefaultTopic(assistantId)

  const assistant: Assistant = {
    ...agent,
    id: assistantId,
    name: agent.name,
    emoji: agent.emoji,
    topics: [topic],
    model: agent.defaultModel,
    type: 'assistant'
  }

  store.dispatch(addAssistant(assistant))

  await addAssistantMessagesToTopic({ assistant, topic })

  window.message.success({
    content: i18n.t('message.assistant.added.content'),
    key: 'assistant-added'
  })

  return assistant
}
