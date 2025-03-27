import { useTheme } from '@renderer/context/ThemeProvider'
import AssistantSettingsPopup from '@renderer/pages/settings/AssistantSettings'
import { Assistant, Topic } from '@renderer/types'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

interface Props {
  assistant: Assistant
  topic?: Topic
}

const Prompt: FC<Props> = ({ assistant, topic }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  const prompt = assistant.prompt || t('chat.default.description')
  const topicPrompt = topic?.prompt || ''
  const isDark = theme === 'dark'

  if (!prompt && !topicPrompt) {
    return null
  }

  return (
    <Container className="system-prompt" onClick={() => AssistantSettingsPopup.show({ assistant })} $isDark={isDark}>
      <Text>{prompt}</Text>
    </Container>
  )
}

const Container = styled.div<{ $isDark: boolean }>`
  padding: 10px 20px;
  margin: 5px 20px 0 20px;
  border-radius: 6px;
  cursor: pointer;
  border: 0.5px solid var(--color-border);
  background-color: ${({ $isDark }) => ($isDark ? 'var(--color-background-opacity)' : 'transparent')};
`

const Text = styled.div`
  color: var(--color-text-2);
  font-size: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

export default Prompt
