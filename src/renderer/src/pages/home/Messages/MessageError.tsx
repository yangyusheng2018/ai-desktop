import { Message } from '@renderer/types'
import { formatErrorMessage } from '@renderer/utils/error'
import { Alert as AntdAlert } from 'antd'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import Markdown from '../Markdown/Markdown'
const MessageError: FC<{ message: Message }> = ({ message }) => {
  return (
    <>
      <Markdown message={message} />
      {message.error && (
        <Markdown
          message={{
            ...message,
            content: formatErrorMessage(message.error)
          }}
        />
      )}
      <MessageErrorInfo message={message} />
    </>
  )
}

const MessageErrorInfo: FC<{ message: Message }> = ({ message }) => {
  const { t } = useTranslation()

  const HTTP_ERROR_CODES = [400, 401, 403, 404, 429, 500, 502, 503, 504]

  if (message.error && HTTP_ERROR_CODES.includes(message.error?.status)) {
    return <Alert description={t(`error.http.${message.error.status}`)} type="error" />
  }

  return <Alert description={t('error.chat.response')} type="error" />
}

const Alert = styled(AntdAlert)`
  margin: 15px 0 8px;
  padding: 10px;
  font-size: 12px;
`

export default MessageError
