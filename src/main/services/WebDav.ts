import { WebDavConfig } from '@types'
import Logger from 'electron-log'
import Stream from 'stream'
import { BufferLike, createClient, GetFileContentsOptions, PutFileContentsOptions, WebDAVClient } from 'webdav'

export default class WebDav {
  public instance: WebDAVClient | undefined
  private webdavPath: string

  constructor(params: WebDavConfig) {
    this.webdavPath = params.webdavPath

    this.instance = createClient(params.webdavHost, {
      username: params.webdavUser,
      password: params.webdavPass,
      maxBodyLength: Infinity,
      maxContentLength: Infinity
    })

    this.putFileContents = this.putFileContents.bind(this)
    this.getFileContents = this.getFileContents.bind(this)
  }

  public putFileContents = async (
    filename: string,
    data: string | BufferLike | Stream.Readable,
    options?: PutFileContentsOptions
  ) => {
    if (!this.instance) {
      return new Error('WebDAV client not initialized')
    }

    try {
      if (!(await this.instance.exists(this.webdavPath))) {
        await this.instance.createDirectory(this.webdavPath, {
          recursive: true
        })
      }
    } catch (error) {
      Logger.error('[WebDAV] Error creating directory on WebDAV:', error)
      throw error
    }

    const remoteFilePath = `${this.webdavPath}/${filename}`

    try {
      return await this.instance.putFileContents(remoteFilePath, data, options)
    } catch (error) {
      Logger.error('[WebDAV] Error putting file contents on WebDAV:', error)
      throw error
    }
  }

  public getFileContents = async (filename: string, options?: GetFileContentsOptions) => {
    if (!this.instance) {
      throw new Error('WebDAV client not initialized')
    }

    const remoteFilePath = `${this.webdavPath}/${filename}`

    try {
      return await this.instance.getFileContents(remoteFilePath, options)
    } catch (error) {
      Logger.error('[WebDAV] Error getting file contents on WebDAV:', error)
      throw error
    }
  }
}
