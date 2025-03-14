import Scrollbar from '@renderer/components/Scrollbar'
import { useDefaultAssistant } from '@renderer/hooks/useAssistant'
import { getDefaultModel } from '@renderer/services/AssistantService'
import { FC } from 'react'
import styled from 'styled-components'

import Messages from './components/Messages'

interface Props {
  route: string
}

const ChatWindow: FC<Props> = ({ route }) => {
  const { defaultAssistant } = useDefaultAssistant()

  return (
    <Main className="bubble">
      <Messages assistant={{ ...defaultAssistant, model: getDefaultModel() }} route={route} />
    </Main>
  )
}

const Main = styled(Scrollbar)`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin-bottom: auto;
  -webkit-app-region: none;
  background-color: transparent !important;
  max-height: 100%;
`

export default ChatWindow
