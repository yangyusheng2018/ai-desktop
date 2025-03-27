import {
  DeleteOutlined,
  EditOutlined,
  FileTextOutlined,
  PlusOutlined,
  SearchOutlined,
  SettingOutlined
} from '@ant-design/icons'
import { Navbar, NavbarCenter, NavbarRight as NavbarRightFromComponents } from '@renderer/components/app/Navbar'
import DragableList from '@renderer/components/DragableList'
import { HStack } from '@renderer/components/Layout'
import ListItem from '@renderer/components/ListItem'
import PromptPopup from '@renderer/components/Popups/PromptPopup'
import Scrollbar from '@renderer/components/Scrollbar'
import { isWindows } from '@renderer/config/constant'
import { useKnowledgeBases } from '@renderer/hooks/useKnowledge'
import { useShortcut } from '@renderer/hooks/useShortcuts'
import { NavbarIcon } from '@renderer/pages/home/Navbar'
import KnowledgeSearchPopup from '@renderer/pages/knowledge/components/KnowledgeSearchPopup'
import { KnowledgeBase } from '@renderer/types'
import { Dropdown, Empty, MenuProps } from 'antd'
import { FC, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import AddKnowledgePopup from './components/AddKnowledgePopup'
import KnowledgeSettingsPopup from './components/KnowledgeSettingsPopup'
import KnowledgeContent from './KnowledgeContent'

const KnowledgePage: FC = () => {
  const { t } = useTranslation()
  const { bases, renameKnowledgeBase, deleteKnowledgeBase, updateKnowledgeBases } = useKnowledgeBases()
  const [selectedBase, setSelectedBase] = useState<KnowledgeBase | undefined>(bases[0])
  const [isDragging, setIsDragging] = useState(false)

  const handleAddKnowledge = async () => {
    const newBase = await AddKnowledgePopup.show({ title: t('knowledge.add.title') })
    if (newBase) {
      setSelectedBase(newBase)
    }
  }

  useEffect(() => {
    const hasSelectedBase = bases.find((base) => base.id === selectedBase?.id)
    !hasSelectedBase && setSelectedBase(bases[0])
  }, [bases, selectedBase])

  const getMenuItems = useCallback(
    (base: KnowledgeBase) => {
      const menus: MenuProps['items'] = [
        {
          label: t('knowledge.rename'),
          key: 'rename',
          icon: <EditOutlined />,
          async onClick() {
            const name = await PromptPopup.show({
              title: t('knowledge.rename'),
              message: '',
              defaultValue: base.name || ''
            })
            if (name && base.name !== name) {
              renameKnowledgeBase(base.id, name)
            }
          }
        },
        {
          label: t('knowledge.settings'),
          key: 'settings',
          icon: <SettingOutlined />,
          onClick: () => KnowledgeSettingsPopup.show({ base })
        },
        { type: 'divider' },
        {
          label: t('common.delete'),
          danger: true,
          key: 'delete',
          icon: <DeleteOutlined />,
          onClick: () => {
            window.modal.confirm({
              title: t('knowledge.delete_confirm'),
              centered: true,
              onOk: () => {
                setSelectedBase(undefined)
                deleteKnowledgeBase(base.id)
              }
            })
          }
        }
      ]

      return menus
    },
    [deleteKnowledgeBase, renameKnowledgeBase, t]
  )

  useShortcut('search_message', () => {
    if (selectedBase) {
      KnowledgeSearchPopup.show({ base: selectedBase }).then()
    }
  })

  return (
    <Container>
      <Navbar>
        <NavbarCenter style={{ borderRight: 'none' }}>{t('knowledge.title')}</NavbarCenter>
        <NavbarRight>
          <HStack alignItems="center">
            <NarrowIcon onClick={() => selectedBase && KnowledgeSearchPopup.show({ base: selectedBase })}>
              <SearchOutlined />
            </NarrowIcon>
          </HStack>
        </NavbarRight>
      </Navbar>
      <ContentContainer id="content-container">
        <SideNav>
          <ScrollContainer>
            <DragableList
              list={bases}
              onUpdate={updateKnowledgeBases}
              style={{ marginBottom: 0, paddingBottom: isDragging ? 50 : 0 }}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={() => setIsDragging(false)}>
              {(base: KnowledgeBase) => (
                <Dropdown menu={{ items: getMenuItems(base) }} trigger={['contextMenu']} key={base.id}>
                  <div>
                    <ListItem
                      active={selectedBase?.id === base.id}
                      icon={<FileTextOutlined />}
                      title={base.name}
                      onClick={() => setSelectedBase(base)}
                    />
                  </div>
                </Dropdown>
              )}
            </DragableList>
            {!isDragging && (
              <AddKnowledgeItem onClick={handleAddKnowledge}>
                <AddKnowledgeName>
                  <PlusOutlined style={{ color: 'var(--color-text-2)', marginRight: 4 }} />
                  {t('button.add')}
                </AddKnowledgeName>
              </AddKnowledgeItem>
            )}
            <div style={{ minHeight: '10px' }}></div>
          </ScrollContainer>
        </SideNav>
        {bases.length === 0 ? (
          <MainContent>
            <Empty description={t('knowledge.empty')} image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </MainContent>
        ) : selectedBase ? (
          <KnowledgeContent selectedBase={selectedBase} />
        ) : null}
      </ContentContainer>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: calc(100vh - var(--navbar-height));
`

const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  min-height: 100%;
`

const MainContent = styled(Scrollbar)`
  padding: 15px 20px;
  display: flex;
  width: 100%;
  flex-direction: column;
  padding-bottom: 50px;
`

const SideNav = styled.div`
  width: var(--assistants-width);
  border-right: 0.5px solid var(--color-border);
  padding: 12px 10px;
  display: flex;
  flex-direction: column;

  .ant-menu {
    border-inline-end: none !important;
    background: transparent;
    flex: 1;
  }

  .ant-menu-item {
    height: 40px;
    line-height: 40px;
    margin: 4px 0;
    width: 100%;

    &:hover {
      background-color: var(--color-background-soft);
    }

    &.ant-menu-item-selected {
      background-color: var(--color-background-soft);
      color: var(--color-primary);
    }
  }
`

const ScrollContainer = styled(Scrollbar)`
  display: flex;
  flex-direction: column;
  flex: 1;

  > div {
    margin-bottom: 8px;

    &:last-child {
      margin-bottom: 0;
    }
  }
`

const AddKnowledgeItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 7px 12px;
  position: relative;
  font-family: Ubuntu;
  border-radius: var(--list-item-border-radius);
  border: 0.5px solid transparent;
  cursor: pointer;
  &:hover {
    background-color: var(--color-background-soft);
  }
`

const AddKnowledgeName = styled.div`
  color: var(--color-text);
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 13px;
`

const NarrowIcon = styled(NavbarIcon)`
  @media (max-width: 1000px) {
    display: none;
  }
`

const NavbarRight = styled(NavbarRightFromComponents)`
  min-width: auto;
  padding-right: ${isWindows ? '140px' : 15};
`

export default KnowledgePage
