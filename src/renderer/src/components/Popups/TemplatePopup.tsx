import { Modal } from 'antd'
import { useState } from 'react'

import { Box } from '../Layout'
import { TopView } from '../TopView'

interface ShowParams {
  title: string
}

interface Props extends ShowParams {
  resolve: (data: any) => void
}

const PopupContainer: React.FC<Props> = ({ title, resolve }) => {
  const [open, setOpen] = useState(true)

  const onOk = () => {
    setOpen(false)
  }

  const onCancel = () => {
    setOpen(false)
  }

  const onClose = () => {
    resolve({})
  }

  TemplatePopup.hide = onCancel

  return (
    <Modal
      title={title}
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      afterClose={onClose}
      transitionName="ant-move-down"
      centered>
      <Box mb={8}>Name</Box>
    </Modal>
  )
}

const TopViewKey = 'TemplatePopup'

export default class TemplatePopup {
  static topviewId = 0
  static hide() {
    TopView.hide(TopViewKey)
  }
  static show(props: ShowParams) {
    return new Promise<any>((resolve) => {
      TopView.show(
        <PopupContainer
          {...props}
          resolve={(v) => {
            resolve(v)
            TopView.hide(TopViewKey)
          }}
        />,
        TopViewKey
      )
    })
  }
}
