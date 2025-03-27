import db from '@renderer/databases'
import i18n from '@renderer/i18n'
import store from '@renderer/store'
import { setWebDAVSyncState } from '@renderer/store/runtime'
import dayjs from 'dayjs'

export async function backup() {
  const filename = `cherry-studio.${dayjs().format('YYYYMMDDHHmm')}.zip`
  const fileContnet = await getBackupData()
  const selectFolder = await window.api.file.selectFolder()
  if (selectFolder) {
    await window.api.backup.backup(filename, fileContnet, selectFolder)
    window.message.success({ content: i18n.t('message.backup.success'), key: 'backup' })
  }
}

export async function restore() {
  const file = await window.api.file.open({ filters: [{ name: '备份文件', extensions: ['bak', 'zip'] }] })

  if (file) {
    try {
      let data: Record<string, any> = {}

      // zip backup file
      if (file?.fileName.endsWith('.zip')) {
        const restoreData = await window.api.backup.restore(file.filePath)
        data = JSON.parse(restoreData)
      } else {
        data = JSON.parse(await window.api.zip.decompress(file.content))
      }

      await handleData(data)
    } catch (error) {
      console.error(error)
      window.message.error({ content: i18n.t('error.backup.file_format'), key: 'restore' })
    }
  }
}

export async function reset() {
  window.modal.confirm({
    title: i18n.t('common.warning'),
    content: i18n.t('message.reset.confirm.content'),
    centered: true,
    onOk: async () => {
      window.modal.confirm({
        title: i18n.t('message.reset.double.confirm.title'),
        content: i18n.t('message.reset.double.confirm.content'),
        centered: true,
        onOk: async () => {
          await localStorage.clear()
          await clearDatabase()
          await window.api.file.clear()
          window.api.reload()
        }
      })
    }
  })
}

// 备份到 webdav
export async function backupToWebdav({ showMessage = false }: { showMessage?: boolean } = {}) {
  if (isManualBackupRunning) {
    console.log('[Backup] Manual backup already in progress')
    return
  }

  store.dispatch(setWebDAVSyncState({ syncing: true, lastSyncError: null }))

  const { webdavHost, webdavUser, webdavPass, webdavPath } = store.getState().settings

  const backupData = await getBackupData()

  // 上传文件
  try {
    const success = await window.api.backup.backupToWebdav(backupData, {
      webdavHost,
      webdavUser,
      webdavPass,
      webdavPath
    })
    if (success) {
      store.dispatch(
        setWebDAVSyncState({
          lastSyncTime: Date.now(),
          lastSyncError: null
        })
      )
      showMessage && window.message.success({ content: i18n.t('message.backup.success'), key: 'backup' })
    } else {
      store.dispatch(setWebDAVSyncState({ lastSyncError: 'Backup failed' }))
      showMessage && window.message.error({ content: i18n.t('message.backup.failed'), key: 'backup' })
    }
  } catch (error: any) {
    store.dispatch(setWebDAVSyncState({ lastSyncError: error.message }))
    console.error('[backup] backupToWebdav: Error uploading file to WebDAV:', error)
    showMessage &&
      window.modal.error({
        title: i18n.t('message.backup.failed'),
        content: error.message
      })
  } finally {
    store.dispatch(setWebDAVSyncState({ syncing: false }))
    isManualBackupRunning = false
  }
}

// 从 webdav 恢复
export async function restoreFromWebdav() {
  const { webdavHost, webdavUser, webdavPass, webdavPath } = store.getState().settings
  let data = ''

  try {
    data = await window.api.backup.restoreFromWebdav({ webdavHost, webdavUser, webdavPass, webdavPath })
  } catch (error: any) {
    console.error('[backup] restoreFromWebdav: Error downloading file from WebDAV:', error)
    window.modal.error({
      title: i18n.t('message.restore.failed'),
      content: error.message
    })
  }

  try {
    await handleData(JSON.parse(data))
  } catch (error) {
    console.error('[backup] Error downloading file from WebDAV:', error)
    window.message.error({ content: i18n.t('error.backup.file_format'), key: 'restore' })
  }
}

let autoSyncStarted = false
let syncTimeout: NodeJS.Timeout | null = null
let isAutoBackupRunning = false
let isManualBackupRunning = false

export function startAutoSync() {
  if (autoSyncStarted) {
    return
  }

  const { webdavAutoSync, webdavHost } = store.getState().settings

  if (!webdavAutoSync || !webdavHost) {
    console.log('[AutoSync] Invalid sync settings, auto sync disabled')
    return
  }

  autoSyncStarted = true

  stopAutoSync()

  scheduleNextBackup()

  function scheduleNextBackup() {
    if (syncTimeout) {
      clearTimeout(syncTimeout)
      syncTimeout = null
    }

    const { webdavSyncInterval } = store.getState().settings

    if (webdavSyncInterval <= 0) {
      console.log('[AutoSync] Invalid sync interval, auto sync disabled')
      stopAutoSync()
      return
    }

    syncTimeout = setTimeout(performAutoBackup, webdavSyncInterval * 60 * 1000)

    console.log(`[AutoSync] Next sync scheduled in ${webdavSyncInterval} minutes`)
  }

  async function performAutoBackup() {
    if (isAutoBackupRunning || isManualBackupRunning) {
      console.log('[AutoSync] Backup already in progress, rescheduling')
      scheduleNextBackup()
      return
    }

    isAutoBackupRunning = true
    try {
      console.log('[AutoSync] Performing auto backup...')
      await backupToWebdav({ showMessage: false })
    } catch (error) {
      console.error('[AutoSync] Auto backup failed:', error)
    } finally {
      isAutoBackupRunning = false
      scheduleNextBackup()
    }
  }
}

export function stopAutoSync() {
  if (syncTimeout) {
    console.log('[AutoSync] Stopping auto sync')
    clearTimeout(syncTimeout)
    syncTimeout = null
  }
  isAutoBackupRunning = false
  autoSyncStarted = false
}

async function getBackupData() {
  return JSON.stringify({
    time: new Date().getTime(),
    version: 3,
    localStorage,
    indexedDB: await backupDatabase()
  })
}

/************************************* Backup Utils ************************************** */
async function handleData(data: Record<string, any>) {
  if (data.version === 1) {
    await clearDatabase()

    for (const { key, value } of data.indexedDB) {
      if (key.startsWith('topic:')) {
        await db.table('topics').add({ id: value.id, messages: value.messages })
      }
      if (key === 'image://avatar') {
        await db.table('settings').add({ id: key, value })
      }
    }

    await localStorage.setItem('persist:cherry-studio', data.localStorage['persist:cherry-studio'])
    window.message.success({ content: i18n.t('message.restore.success'), key: 'restore' })
    setTimeout(() => window.api.reload(), 1000)
    return
  }

  if (data.version >= 2) {
    localStorage.setItem('persist:cherry-studio', data.localStorage['persist:cherry-studio'])
    await restoreDatabase(data.indexedDB)
    window.message.success({ content: i18n.t('message.restore.success'), key: 'restore' })
    setTimeout(() => window.api.reload(), 1000)
    return
  }

  window.message.error({ content: i18n.t('error.backup.file_format'), key: 'restore' })
}

async function backupDatabase() {
  const tables = db.tables
  const backup = {}

  for (const table of tables) {
    backup[table.name] = await table.toArray()
  }

  return backup
}

async function restoreDatabase(backup: Record<string, any>) {
  await db.transaction('rw', db.tables, async () => {
    for (const tableName in backup) {
      await db.table(tableName).clear()
      await db.table(tableName).bulkAdd(backup[tableName])
    }
  })
}

async function clearDatabase() {
  const storeNames = await db.tables.map((table) => table.name)

  await db.transaction('rw', db.tables, async () => {
    for (const storeName of storeNames) {
      await db[storeName].clear()
    }
  })
}
