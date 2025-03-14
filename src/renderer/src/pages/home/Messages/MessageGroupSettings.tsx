import { SettingOutlined } from '@ant-design/icons'
import { useSettings } from '@renderer/hooks/useSettings'
import { SettingDivider } from '@renderer/pages/settings'
import { SettingRow } from '@renderer/pages/settings'
import { useAppDispatch } from '@renderer/store'
import { setGridColumns, setGridPopoverTrigger } from '@renderer/store/settings'
import { Col, Row, Select, Slider } from 'antd'
import { Popover } from 'antd'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'

const MessageGroupSettings: FC = () => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const { gridColumns, gridPopoverTrigger } = useSettings()
  const [gridColumnsValue, setGridColumnsValue] = useState(gridColumns)

  return (
    <Popover
      trigger={undefined}
      showArrow
      content={
        <div style={{ padding: 10 }}>
          <SettingRow>
            <div style={{ marginRight: 10 }}>{t('settings.messages.grid_popover_trigger')}</div>
            <Select
              value={gridPopoverTrigger || 'hover'}
              onChange={(value) => dispatch(setGridPopoverTrigger(value as 'hover' | 'click'))}
              size="small">
              <Select.Option value="hover">{t('settings.messages.grid_popover_trigger.hover')}</Select.Option>
              <Select.Option value="click">{t('settings.messages.grid_popover_trigger.click')}</Select.Option>
            </Select>
          </SettingRow>
          <SettingDivider />
          <SettingRow>
            <div>{t('settings.messages.grid_columns')}</div>
          </SettingRow>
          <Row align="middle" gutter={10}>
            <Col span={24}>
              <Slider
                value={gridColumnsValue}
                style={{ width: '100%' }}
                onChange={(value) => setGridColumnsValue(value)}
                onChangeComplete={(value) => dispatch(setGridColumns(value))}
                min={2}
                max={6}
                step={1}
              />
            </Col>
          </Row>
        </div>
      }>
      <SettingOutlined style={{ marginLeft: 15, cursor: 'pointer' }} />
    </Popover>
  )
}

export default MessageGroupSettings
