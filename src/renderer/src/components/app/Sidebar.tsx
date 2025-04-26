import { FileSearchOutlined, FolderOutlined, PictureOutlined, TranslationOutlined } from '@ant-design/icons'
import { isMac } from '@renderer/config/constant'
import { isLocalAi, UserAvatar } from '@renderer/config/env'
// import { useTheme } from '@renderer/context/ThemeProvider'
import useAvatar from '@renderer/hooks/useAvatar'
import { useMinapps } from '@renderer/hooks/useMinapps'
import { modelGenerating, useRuntime } from '@renderer/hooks/useRuntime'
import { useSettings } from '@renderer/hooks/useSettings'
import { useShowAssistants } from '@renderer/hooks/useStore'
import type { MenuProps } from 'antd'
import { Tooltip } from 'antd'
import { Avatar } from 'antd'
import { Dropdown } from 'antd'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import DragableList from '../DragableList'
import MinAppIcon from '../Icons/MinAppIcon'
import MinApp from '../MinApp'
// import UserPopup from '../Popups/UserPopup'

const Sidebar: FC = () => {
  const { pathname } = useLocation()
  const avatar = useAvatar()
  const { minappShow } = useRuntime()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { windowStyle, sidebarIcons } = useSettings()
  // const { theme, toggleTheme } = useTheme()
  const { pinned } = useMinapps()
  const { showAssistants } = useShowAssistants()
  // className={showAssistants?:'expendside':''}
  // const onEditUser = () => UserPopup.show()

  const macTransparentWindow = isMac && windowStyle === 'transparent'
  const sidebarBgColor = macTransparentWindow ? 'transparent' : 'var(--navbar-background)'

  const showPinnedApps = pinned.length > 0 && sidebarIcons.visible.includes('minapp')

  const to = async (path: string) => {
    await modelGenerating()
    navigate(path)
  }

  // const onOpenDocs = () => {
  //   MinApp.start({
  //     id: 'docs',
  //     name: t('docs.title'),
  //     url: 'https://docs.cherry-ai.com/',
  //     logo: AppLogo
  //   })
  // }

  return (
    <Container
      id="app-sidebar"
      className={!showAssistants ? 'expendside' : ''}
      style={{
        backgroundColor: sidebarBgColor,
        zIndex: minappShow ? 10000 : 'initial'
      }}>
      {/* {isEmoji(avatar) ? (
        <EmojiAvatar onClick={onEditUser}>{avatar}</EmojiAvatar>
      ) : ( */}
      <AvatarSpan className={!showAssistants ? 'exp' : ''}>
        <AvatarImg src={avatar || UserAvatar} draggable={false} className="nodrag" />
        <span>{!showAssistants ? 'Work Studio' : ''}</span>
      </AvatarSpan>

      {/* )} */}
      <MainMenusContainer>
        <Menus className={!showAssistants ? 'expend' : ''} onClick={MinApp.onClose}>
          <MainMenus />
        </Menus>
        {showPinnedApps && (
          <AppsContainer>
            <Divider />
            <Menus className={!showAssistants ? 'expend' : ''}>
              <PinnedApps />
            </Menus>
          </AppsContainer>
        )}
      </MainMenusContainer>
      <Menus className={!showAssistants ? 'expend' : ''}>
        {/* <Tooltip title={t('docs.title')} mouseEnterDelay={0.8} placement="right">
          <Icon
            onClick={onOpenDocs}
            className={minappShow && MinApp.app?.url === 'https://docs.cherry-ai.com/' ? 'active' : ''}>
            <QuestionCircleOutlined />
          </Icon>
        </Tooltip>
        <Tooltip title={t('settings.theme.title')} mouseEnterDelay={0.8} placement="right">
          <Icon onClick={() => toggleTheme()}>
            {theme === 'dark' ? (
              <i className="iconfont icon-theme icon-dark1" />
            ) : (
              <i className="iconfont icon-theme icon-theme-light" />
            )}
          </Icon>
        </Tooltip> */}
        <Tooltip title={t('settings.title')} mouseEnterDelay={0.8} placement="right">
          <StyledLink
            className="set"
            onClick={async () => {
              if (minappShow) {
                await MinApp.close()
              }
              await to(isLocalAi ? '/settings/assistant' : '/settings/provider')
            }}>
            <Icon className={pathname.startsWith('/settings') && !minappShow ? 'active' : ''}>
              <i className="iconfont icon-setting" />
            </Icon>
            {!showAssistants ? t('settings.title') : ''}
          </StyledLink>
        </Tooltip>
      </Menus>
    </Container>
  )
}

const MainMenus: FC = () => {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const { sidebarIcons } = useSettings()
  const { minappShow } = useRuntime()
  const navigate = useNavigate()
  const { showAssistants } = useShowAssistants()
  const isRoute = (path: string): string => (pathname === path && !minappShow ? 'active' : '')
  const isRoutes = (path: string): string => (pathname.startsWith(path) && !minappShow ? 'active' : '')

  const iconMap = {
    assistants: <i className="iconfont icon-chat" />,
    agents: <i className="iconfont icon-business-smart-assistant" />,
    paintings: <PictureOutlined style={{ fontSize: 16 }} />,
    translate: <TranslationOutlined />,
    minapp: <i className="iconfont icon-appstore" />,
    knowledge: <FileSearchOutlined />,
    files: <FolderOutlined />
  }

  const pathMap = {
    assistants: '/',
    agents: '/agents',
    paintings: '/paintings',
    translate: '/translate',
    minapp: '/apps',
    knowledge: '/knowledge',
    files: '/files'
  }
  return sidebarIcons.visible
    .filter((v) => v !== 'minapp' && v !== 'agents')
    .map((icon) => {
      const path = pathMap[icon]
      const isActive = path === '/' ? isRoute(path) : isRoutes(path)
      return (
        <Tooltip key={icon} title={t(`${icon}.title`)} mouseEnterDelay={0.8} placement="right">
          <StyledLink
            className={isActive}
            onClick={async () => {
              if (minappShow) {
                await MinApp.close()
              }
              navigate(path)
            }}>
            <Icon>{iconMap[icon]}</Icon>
            {!showAssistants ? t(`${icon}.title`) : ''}
          </StyledLink>
        </Tooltip>
      )
    })
}

const PinnedApps: FC = () => {
  const { pinned, updatePinnedMinapps } = useMinapps()
  const { t } = useTranslation()
  const { minappShow } = useRuntime()
  const { showAssistants } = useShowAssistants()
  return (
    <DragableList list={pinned} onUpdate={updatePinnedMinapps} listStyle={{ marginBottom: 5 }}>
      {(app) => {
        const menuItems: MenuProps['items'] = [
          {
            key: 'togglePin',
            label: t('minapp.sidebar.remove.title'),
            onClick: () => {
              const newPinned = pinned.filter((item) => item.id !== app.id)
              updatePinnedMinapps(newPinned)
            }
          }
        ]
        const isActive = minappShow && MinApp.app?.id === app.id
        return (
          <Tooltip key={app.id} title={app.name} mouseEnterDelay={0.8} placement="right">
            <StyledLink>
              <Dropdown menu={{ items: menuItems }} trigger={['contextMenu']}>
                <Icon onClick={() => MinApp.start(app)} className={isActive ? 'active' : ''}>
                  <MinAppIcon size={20} app={app} style={{ borderRadius: 6 }} /> {!showAssistants ? app.name : ''}
                </Icon>
              </Dropdown>
            </StyledLink>
          </Tooltip>
        )
      }}
    </DragableList>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 0;
  padding-bottom: 12px;
  width: var(--sidebar-width);
  min-width: var(--sidebar-width);
  height: ${isMac ? 'calc(100vh - var(--navbar-height))' : '100vh'};
  -webkit-app-region: drag !important;
  margin-top: ${isMac ? 'var(--navbar-height)' : 0};
`

const AvatarImg = styled(Avatar)`
  width: 31px;
  height: 31px;
  // background-color: var(--color-background-soft);
  // margin-bottom: ${isMac ? '12px' : '12px'};
  margin-top: ${isMac ? '0px' : '2px'};
  border: none;
  cursor: pointer;
`
const AvatarSpan = styled.div`
  line-height: 31px;
  margin-bottom: 12px;

  &.exp {
    font-size: 12px;
    .ant-avatar {
      margin-right: 4px;
    }
    img {
    }
  }
`
// const EmojiAvatar = styled.div`
//   width: 31px;
//   height: 31px;
//   background-color: var(--color-background-soft);
//   margin-bottom: ${isMac ? '12px' : '12px'};
//   margin-top: ${isMac ? '0px' : '2px'};
//   border-radius: 20%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   font-size: 16px;
//   cursor: pointer;
//   -webkit-app-region: none;
//   border: 0.5px solid var(--color-border);
//   font-size: 20px;
// `

const MainMenusContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
`

const Menus = styled.div`
  &.expend {
    width: 90px;
  }
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
`

const Icon = styled.div`
  width: 35px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  -webkit-app-region: none;
  border: 0.5px solid transparent;
  .iconfont,
  .anticon {
    color: var(--color-icon);
    font-size: 20px;
    text-decoration: none;
  }
  .anticon {
    font-size: 17px;
  }
  // &:hover {
  //   background-color: var(--color-hover);
  //   cursor: pointer;
  //   .iconfont,
  //   .anticon {
  //     // color: var(--color-icon-white);
  //     color: #fff;
  //   }
  // }
  // &.active {
  //   background-color: var(--color-active);
  //   border: 0.5px solid var(--color-border);
  //   .iconfont,
  //   .anticon {
  //     // color: var(--color-icon-white);
  //     color: #fff;
  //   }
  // }
`

const StyledLink = styled.div`
  text-decoration: none;
  -webkit-app-region: none;
  display: flex;
  line-height: 35px;
  width: 100%;
  border-radius: 18px;
  cursor: pointer;
  &* {
    user-select: none;
  }
  &:hover {
    background-color: var(--color-hover);
  }
  &.active {
    background-color: var(--color-hover);
  }
`

const AppsContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  overflow-x: hidden;
  margin-bottom: 10px;
  -webkit-app-region: none;
  &::-webkit-scrollbar {
    display: none;
  }
`

const Divider = styled.div`
  width: 50%;
  margin: 8px 0;
  border-bottom: 0.5px solid var(--color-border);
`

export default Sidebar
