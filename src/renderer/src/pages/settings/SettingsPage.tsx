import { Navbar, NavbarCenter } from '@renderer/components/app/Navbar'
import { ProviderType } from '@renderer/types'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import ProviderSetting from './ProviderSettings/ProviderSetting'
const SettingsPage: FC = () => {
  const { t } = useTranslation()

  const provider = {
    id: 'lmstudio',
    name: 'LM Studio',
    type: 'openai' as ProviderType,
    apiKey: '',
    apiHost: 'http://xa1.puhuacloud.com:23311/app-api/ai',
    models: [
      {
        id: 'deepseek-ai/DeepSeek-R1',
        name: 'deepseek-ai/DeepSeek-R1',
        provider: 'lmstudio',
        group: 'deepseek-ai'
      },
      {
        id: 'deepseek-ai/DeepSeek-V3',
        name: 'deepseek-ai/DeepSeek-V3',
        provider: 'lmstudio',
        group: 'deepseek-ai'
      },
      {
        id: 'Qwen/Qwen2.5-7B-Instruct',
        provider: 'lmstudio',
        name: 'Qwen2.5-7B-Instruct',
        group: 'Qwen'
      },
      {
        id: 'meta-llama/Llama-3.3-70B-Instruct',
        name: 'meta-llama/Llama-3.3-70B-Instruct',
        provider: 'lmstudio',
        group: 'meta-llama'
      },
      {
        id: 'BAAI/bge-m3',
        name: 'BAAI/bge-m3',
        provider: 'lmstudio',
        group: 'BAAI'
      }
    ],
    isSystem: true,
    enabled: false
  }
  return (
    <Container>
      <Navbar>
        <NavbarCenter style={{ borderRight: 'none' }}>{t('settings.title')}</NavbarCenter>
      </Navbar>
      <ContentContainer id="content-container">
        <ProviderSetting provider={provider}></ProviderSetting>
      </ContentContainer>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`

const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
`
export default SettingsPage
