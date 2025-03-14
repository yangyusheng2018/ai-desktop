import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { isLocalAi } from '@renderer/config/env'
import { SYSTEM_MODELS } from '@renderer/config/models'
import { Model, Provider } from '@renderer/types'
import { uniqBy } from 'lodash'

type LlmSettings = {
  ollama: {
    keepAliveTime: number
  }
  lmstudio: {
    keepAliveTime: number
  }
}

export interface LlmState {
  providers: Provider[]
  defaultModel: Model
  topicNamingModel: Model
  translateModel: Model
  settings: LlmSettings
}

const initialState: LlmState = {
  defaultModel: SYSTEM_MODELS.silicon[1],
  topicNamingModel: SYSTEM_MODELS.silicon[2],
  translateModel: SYSTEM_MODELS.silicon[3],
  providers: [
    {
      id: 'silicon',
      name: 'Silicon',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://api.siliconflow.cn',
      models: SYSTEM_MODELS.silicon,
      isSystem: true,
      enabled: true
    },
    {
      id: 'o3',
      name: 'O3',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://api.o3.fan',
      models: SYSTEM_MODELS.o3,
      isSystem: true,
      enabled: false
    },
    {
      id: 'aihubmix',
      name: 'AiHubMix',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://aihubmix.com',
      models: SYSTEM_MODELS.aihubmix,
      isSystem: true,
      enabled: false
    },
    {
      id: 'deepseek',
      name: 'deepseek',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://api.deepseek.com',
      models: SYSTEM_MODELS.deepseek,
      isSystem: true,
      enabled: false
    },
    {
      id: 'ocoolai',
      name: 'ocoolAI',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://api.ocoolai.com',
      models: SYSTEM_MODELS.ocoolai,
      isSystem: true,
      enabled: false
    },
    {
      id: 'baidu-cloud',
      name: 'Baidu Cloud',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://qianfan.baidubce.com/v2/',
      models: SYSTEM_MODELS['baidu-cloud'],
      isSystem: true,
      enabled: false
    },
    {
      id: 'ollama',
      name: 'Ollama',
      type: 'openai',
      apiKey: '',
      apiHost: 'http://localhost:11434',
      models: SYSTEM_MODELS.ollama,
      isSystem: true,
      enabled: false
    },
    {
      id: 'lmstudio',
      name: 'LM Studio',
      type: 'openai',
      apiKey: '',
      apiHost: 'http://localhost:1234',
      models: SYSTEM_MODELS.lmstudio,
      isSystem: true,
      enabled: false
    },
    {
      id: 'anthropic',
      name: 'Anthropic',
      type: 'anthropic',
      apiKey: '',
      apiHost: 'https://api.anthropic.com/',
      models: SYSTEM_MODELS.anthropic,
      isSystem: true,
      enabled: false
    },
    {
      id: 'openai',
      name: 'OpenAI',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://api.openai.com',
      models: SYSTEM_MODELS.openai,
      isSystem: true,
      enabled: false
    },
    {
      id: 'azure-openai',
      name: 'Azure OpenAI',
      type: 'openai',
      apiKey: '',
      apiHost: '',
      apiVersion: '',
      models: SYSTEM_MODELS['azure-openai'],
      isSystem: true,
      enabled: false
    },
    {
      id: 'gemini',
      name: 'Gemini',
      type: 'gemini',
      apiKey: '',
      apiHost: 'https://generativelanguage.googleapis.com',
      models: SYSTEM_MODELS.gemini,
      isSystem: true,
      enabled: false
    },
    {
      id: 'github',
      name: 'Github Models',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://models.inference.ai.azure.com/',
      models: SYSTEM_MODELS.github,
      isSystem: true,
      enabled: false
    },
    {
      id: 'dmxapi',
      name: 'DMXAPI',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://www.dmxapi.cn',
      models: SYSTEM_MODELS.dmxapi,
      isSystem: true,
      enabled: false
    },
    {
      id: 'yi',
      name: 'Yi',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://api.lingyiwanwu.com',
      models: SYSTEM_MODELS.yi,
      isSystem: true,
      enabled: false
    },
    {
      id: 'zhipu',
      name: 'ZhiPu',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://open.bigmodel.cn/api/paas/v4/',
      models: SYSTEM_MODELS.zhipu,
      isSystem: true,
      enabled: false
    },
    {
      id: 'moonshot',
      name: 'Moonshot AI',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://api.moonshot.cn',
      models: SYSTEM_MODELS.moonshot,
      isSystem: true,
      enabled: false
    },
    {
      id: 'baichuan',
      name: 'BAICHUAN AI',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://api.baichuan-ai.com',
      models: SYSTEM_MODELS.baichuan,
      isSystem: true,
      enabled: false
    },
    {
      id: 'dashscope',
      name: 'Bailian',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://dashscope.aliyuncs.com/compatible-mode/v1/',
      models: SYSTEM_MODELS.bailian,
      isSystem: true,
      enabled: false
    },
    {
      id: 'stepfun',
      name: 'StepFun',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://api.stepfun.com',
      models: SYSTEM_MODELS.stepfun,
      isSystem: true,
      enabled: false
    },
    {
      id: 'doubao',
      name: 'doubao',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://ark.cn-beijing.volces.com/api/v3/',
      models: SYSTEM_MODELS.doubao,
      isSystem: true,
      enabled: false
    },
    {
      id: 'minimax',
      name: 'MiniMax',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://api.minimax.chat/v1/',
      models: SYSTEM_MODELS.minimax,
      isSystem: true,
      enabled: false
    },
    {
      id: 'openrouter',
      name: 'OpenRouter',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://openrouter.ai/api/v1/',
      models: SYSTEM_MODELS.openrouter,
      isSystem: true,
      enabled: false
    },
    {
      id: 'groq',
      name: 'Groq',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://api.groq.com/openai',
      models: SYSTEM_MODELS.groq,
      isSystem: true,
      enabled: false
    },
    {
      id: 'together',
      name: 'Together',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://api.together.xyz',
      models: SYSTEM_MODELS.together,
      isSystem: true,
      enabled: false
    },
    {
      id: 'fireworks',
      name: 'Fireworks',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://api.fireworks.ai/inference',
      models: SYSTEM_MODELS.fireworks,
      isSystem: true,
      enabled: false
    },
    {
      id: 'zhinao',
      name: 'zhinao',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://api.360.cn',
      models: SYSTEM_MODELS.zhinao,
      isSystem: true,
      enabled: false
    },
    {
      id: 'hunyuan',
      name: 'hunyuan',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://api.hunyuan.cloud.tencent.com',
      models: SYSTEM_MODELS.hunyuan,
      isSystem: true,
      enabled: false
    },
    {
      id: 'nvidia',
      name: 'nvidia',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://integrate.api.nvidia.com',
      models: SYSTEM_MODELS.nvidia,
      isSystem: true,
      enabled: false
    },
    {
      id: 'grok',
      name: 'Grok',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://api.x.ai',
      models: SYSTEM_MODELS.grok,
      isSystem: true,
      enabled: false
    },
    {
      id: 'hyperbolic',
      name: 'Hyperbolic',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://api.hyperbolic.xyz',
      models: SYSTEM_MODELS.hyperbolic,
      isSystem: true,
      enabled: false
    },
    {
      id: 'mistral',
      name: 'Mistral',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://api.mistral.ai',
      models: SYSTEM_MODELS.mistral,
      isSystem: true,
      enabled: false
    },
    {
      id: 'jina',
      name: 'Jina',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://api.jina.ai',
      models: SYSTEM_MODELS.jina,
      isSystem: true,
      enabled: false
    },
    {
      id: 'gitee-ai',
      name: 'gitee ai',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://ai.gitee.com',
      models: SYSTEM_MODELS['gitee-ai'],
      isSystem: true,
      enabled: false
    },
    {
      id: 'ppio',
      name: 'PPIO',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://api.ppinfra.com/v3/openai',
      models: SYSTEM_MODELS.ppio,
      isSystem: true,
      enabled: false
    },
    {
      id: 'perplexity',
      name: 'Perplexity',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://api.perplexity.ai/',
      models: SYSTEM_MODELS.perplexity,
      isSystem: true,
      enabled: false
    },
    {
      id: 'infini',
      name: 'Infini',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://cloud.infini-ai.com/maas',
      models: SYSTEM_MODELS.infini,
      isSystem: true,
      enabled: false
    },
    {
      id: 'modelscope',
      name: 'ModelScope',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://api-inference.modelscope.cn/v1/',
      models: SYSTEM_MODELS.modelscope,
      isSystem: true,
      enabled: false
    },
    {
      id: 'xirang',
      name: 'Xirang',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://wishub-x1.ctyun.cn',
      models: SYSTEM_MODELS.xirang,
      isSystem: true,
      enabled: false
    },
    {
      id: 'tencent-cloud-ti',
      name: 'Tencent Cloud TI',
      type: 'openai',
      apiKey: '',
      apiHost: 'https://api.lkeap.cloud.tencent.com',
      models: SYSTEM_MODELS['tencent-cloud-ti'],
      isSystem: true,
      enabled: false
    }
  ],
  settings: {
    ollama: {
      keepAliveTime: 0
    },
    lmstudio: {
      keepAliveTime: 0
    }
  }
}

const getIntegratedInitialState = () => {
  const model = JSON.parse(import.meta.env.VITE_RENDERER_INTEGRATED_MODEL)

  return {
    defaultModel: model,
    topicNamingModel: model,
    translateModel: model,
    providers: [
      {
        id: 'ollama',
        name: 'Ollama',
        apiKey: 'ollama',
        apiHost: 'http://localhost:15537/v1/',
        models: [model],
        isSystem: true,
        enabled: true
      }
    ],
    settings: {
      ollama: {
        keepAliveTime: 3600
      },
      lmstudio: {
        keepAliveTime: 3600
      }
    }
  } as LlmState
}

const settingsSlice = createSlice({
  name: 'llm',
  initialState: isLocalAi ? getIntegratedInitialState() : initialState,
  reducers: {
    updateProvider: (state, action: PayloadAction<Provider>) => {
      state.providers = state.providers.map((p) => (p.id === action.payload.id ? { ...p, ...action.payload } : p))
    },
    updateProviders: (state, action: PayloadAction<Provider[]>) => {
      state.providers = action.payload
    },
    addProvider: (state, action: PayloadAction<Provider>) => {
      state.providers.unshift(action.payload)
    },
    removeProvider: (state, action: PayloadAction<Provider>) => {
      const providerIndex = state.providers.findIndex((p) => p.id === action.payload.id)
      if (providerIndex !== -1) {
        state.providers.splice(providerIndex, 1)
      }
    },
    addModel: (state, action: PayloadAction<{ providerId: string; model: Model }>) => {
      state.providers = state.providers.map((p) =>
        p.id === action.payload.providerId
          ? {
              ...p,
              models: uniqBy(p.models.concat(action.payload.model), 'id'),
              enabled: true
            }
          : p
      )
    },
    removeModel: (state, action: PayloadAction<{ providerId: string; model: Model }>) => {
      state.providers = state.providers.map((p) =>
        p.id === action.payload.providerId
          ? {
              ...p,
              models: p.models.filter((m) => m.id !== action.payload.model.id)
            }
          : p
      )
    },
    setDefaultModel: (state, action: PayloadAction<{ model: Model }>) => {
      state.defaultModel = action.payload.model
      window.electron.ipcRenderer.send('miniwindow-reload')
    },
    setTopicNamingModel: (state, action: PayloadAction<{ model: Model }>) => {
      state.topicNamingModel = action.payload.model
    },
    setTranslateModel: (state, action: PayloadAction<{ model: Model }>) => {
      state.translateModel = action.payload.model
    },
    setOllamaKeepAliveTime: (state, action: PayloadAction<number>) => {
      state.settings.ollama.keepAliveTime = action.payload
    },
    setLMStudioKeepAliveTime: (state, action: PayloadAction<number>) => {
      state.settings.lmstudio.keepAliveTime = action.payload
    },
    updateModel: (
      state,
      action: PayloadAction<{
        providerId: string
        model: Model
      }>
    ) => {
      const provider = state.providers.find((p) => p.id === action.payload.providerId)
      if (provider) {
        const modelIndex = provider.models.findIndex((m) => m.id === action.payload.model.id)
        if (modelIndex !== -1) {
          provider.models[modelIndex] = action.payload.model
        }
      }
    }
  }
})

export const {
  updateProvider,
  updateProviders,
  addProvider,
  removeProvider,
  addModel,
  removeModel,
  setDefaultModel,
  setTopicNamingModel,
  setTranslateModel,
  setOllamaKeepAliveTime,
  setLMStudioKeepAliveTime,
  updateModel
} = settingsSlice.actions

export default settingsSlice.reducer
