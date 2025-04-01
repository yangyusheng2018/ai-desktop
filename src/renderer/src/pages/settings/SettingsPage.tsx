import {
  CloudOutlined,
  GlobalOutlined,
  LayoutOutlined,
  MacCommandOutlined,
  RocketOutlined,
  SaveOutlined,
  SettingOutlined
} from '@ant-design/icons'
import { Navbar, NavbarCenter } from '@renderer/components/app/Navbar'
import { isLocalAi } from '@renderer/config/env'
import ModelSettings from '@renderer/pages/settings/ModelSettings/ModelSettings'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import styled from 'styled-components'

import AboutSettings from './AboutSettings'
import DataSettings from './DataSettings/DataSettings'
import DisplaySettings from './DisplaySettings/DisplaySettings'
import GeneralSettings from './GeneralSettings'
import ProvidersList from './ProviderSettings'
import QuickAssistantSettings from './QuickAssistantSettings'
import ShortcutSettings from './ShortcutSettings'
import WebSearchSettings from './WebSearchSettings'

const SettingsPage: FC = () => {
  const { pathname } = useLocation()
  const { t } = useTranslation()

  const isRoute = (path: string): string => (pathname.startsWith(path) ? 'active' : '')

  return (
    <Container>
      <Navbar>
        <NavbarCenter style={{ borderRight: 'none' }}>{t('settings.title')}</NavbarCenter>
      </Navbar>
      <ContentContainer id="content-container">
        <SettingMenus>
          {!isLocalAi && (
            <>
              <MenuItemLink to="/settings/provider">
                <MenuItem className={isRoute('/settings/provider')}>
                  <CloudOutlined />
                  {t('settings.provider.title')}
                </MenuItem>
              </MenuItemLink>
              <MenuItemLink to="/settings/model">
                <MenuItem className={isRoute('/settings/model')}>
                  <i className="iconfont icon-ai-model" />
                  {t('settings.model')}
                </MenuItem>
              </MenuItemLink>
            </>
          )}
          <MenuItemLink to="/settings/web-search">
            <MenuItem className={isRoute('/settings/web-search')}>
              <GlobalOutlined />
              {t('settings.websearch.title')}
            </MenuItem>
          </MenuItemLink>
          <MenuItemLink to="/settings/general">
            <MenuItem className={isRoute('/settings/general')}>
              <SettingOutlined />
              {t('settings.general')}
            </MenuItem>
          </MenuItemLink>
          <MenuItemLink to="/settings/display">
            <MenuItem className={isRoute('/settings/display')}>
              <LayoutOutlined />
              {t('settings.display.title')}
            </MenuItem>
          </MenuItemLink>
          <MenuItemLink to="/settings/shortcut">
            <MenuItem className={isRoute('/settings/shortcut')}>
              <MacCommandOutlined />
              {t('settings.shortcuts.title')}
            </MenuItem>
          </MenuItemLink>
          <MenuItemLink to="/settings/quickAssistant">
            <MenuItem className={isRoute('/settings/quickAssistant')}>
              <RocketOutlined />
              {t('settings.quickAssistant.title')}
            </MenuItem>
          </MenuItemLink>
          <MenuItemLink to="/settings/data">
            <MenuItem className={isRoute('/settings/data')}>
              <SaveOutlined />
              {t('settings.data.title')}
            </MenuItem>
          </MenuItemLink>
          {/* <MenuItemLink to="/settings/about">
            <MenuItem className={isRoute('/settings/about')}>
              <InfoCircleOutlined />
              {t('settings.about')}
            </MenuItem>
          </MenuItemLink> */}
        </SettingMenus>
        <SettingContent>
          <Routes>
            <Route path="provider" element={<ProvidersList />} />
            <Route path="model" element={<ModelSettings />} />
            <Route path="web-search" element={<WebSearchSettings />} />
            <Route path="general/*" element={<GeneralSettings />} />
            <Route path="display" element={<DisplaySettings />} />
            <Route path="data/*" element={<DataSettings />} />
            <Route path="quickAssistant" element={<QuickAssistantSettings />} />
            <Route path="shortcut" element={<ShortcutSettings />} />
            <Route path="about" element={<AboutSettings />} />
          </Routes>
        </SettingContent>
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

const SettingMenus = styled.ul`
  display: flex;
  flex-direction: column;
  min-width: var(--settings-width);
  border-right: 0.5px solid var(--color-border);
  padding: 10px;
  user-select: none;
`

const MenuItemLink = styled(Link)`
  text-decoration: none;
  color: var(--color-text-1);
  margin-bottom: 5px;
`

const MenuItem = styled.li`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  width: 100%;
  cursor: pointer;
  border-radius: var(--list-item-border-radius);
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  border: 0.5px solid transparent;
  .anticon {
    font-size: 16px;
    opacity: 0.8;
  }
  .iconfont {
    font-size: 18px;
    line-height: 18px;
    opacity: 0.7;
    margin-left: -1px;
  }
  &:hover {
    background: var(--color-background-soft);
  }
  &.active {
    background: var(--color-background-soft);
    border: 0.5px solid var(--color-border);
  }
`

const SettingContent = styled.div`
  display: flex;
  height: 100%;
  flex: 1;
  border-right: 0.5px solid var(--color-border);
`

export default SettingsPage
