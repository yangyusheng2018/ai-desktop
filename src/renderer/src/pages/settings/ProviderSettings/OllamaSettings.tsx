import { useOllamaSettings } from '@renderer/hooks/useOllama'
import { InputNumber } from 'antd'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { SettingHelpText, SettingHelpTextRow, SettingSubtitle } from '..'

const OllamSettings: FC = () => {
  const { keepAliveTime, setKeepAliveTime } = useOllamaSettings()
  const [keepAliveMinutes, setKeepAliveMinutes] = useState(keepAliveTime)
  const { t } = useTranslation()

  return (
    <Container>
      <SettingSubtitle style={{ marginBottom: 5 }}>{t('ollama.keep_alive_time.title')}</SettingSubtitle>
      <InputNumber
        style={{ width: '100%' }}
        value={keepAliveMinutes}
        onChange={(e) => setKeepAliveMinutes(Number(e))}
        onBlur={() => setKeepAliveTime(keepAliveMinutes)}
        suffix={t('ollama.keep_alive_time.placeholder')}
        step={5}
      />
      <SettingHelpTextRow>
        <SettingHelpText>{t('ollama.keep_alive_time.description')}</SettingHelpText>
      </SettingHelpTextRow>
    </Container>
  )
}

const Container = styled.div``

export default OllamSettings
