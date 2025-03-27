import db from '@renderer/databases'
import store from '@renderer/store'
import { FileType } from '@renderer/types'
import { getFileDirectory } from '@renderer/utils'

class FileManager {
  static async selectFiles(options?: Electron.OpenDialogOptions): Promise<FileType[] | null> {
    const files = await window.api.file.select(options)
    return files
  }

  static async addFile(file: FileType): Promise<FileType> {
    const fileRecord = await db.files.get(file.id)

    if (fileRecord) {
      await db.files.update(fileRecord.id, { ...fileRecord, count: fileRecord.count + 1 })
      return fileRecord
    }

    await db.files.add(file)

    return file
  }

  static async addFiles(files: FileType[]): Promise<FileType[]> {
    return Promise.all(files.map((file) => this.addFile(file)))
  }

  static async uploadFile(file: FileType): Promise<FileType> {
    console.debug(`[FileManager] Uploading file: ${JSON.stringify(file)}`)

    const uploadFile = await window.api.file.upload(file)
    const fileRecord = await db.files.get(uploadFile.id)

    if (fileRecord) {
      await db.files.update(fileRecord.id, { ...fileRecord, count: fileRecord.count + 1 })
      return fileRecord
    }

    await db.files.add(uploadFile)

    return uploadFile
  }

  static async uploadFiles(files: FileType[]): Promise<FileType[]> {
    return Promise.all(files.map((file) => this.uploadFile(file)))
  }

  static async getFile(id: string): Promise<FileType | undefined> {
    const file = await db.files.get(id)

    if (file) {
      const filesPath = store.getState().runtime.filesPath
      file.path = filesPath + '/' + file.id + file.ext
    }

    return file
  }

  static async deleteFile(id: string, force: boolean = false): Promise<void> {
    const file = await this.getFile(id)

    console.debug('[FileManager] Deleting file:', file)

    if (!file) {
      return
    }

    if (!force) {
      if (file.count > 1) {
        await db.files.update(id, { ...file, count: file.count - 1 })
        return
      }
    }

    await db.files.delete(id)

    try {
      await window.api.file.delete(id + file.ext)
    } catch (error) {
      console.error('[FileManager] Failed to delete file:', error)
    }
  }

  static async deleteFiles(files: FileType[]): Promise<void> {
    await Promise.all(files.map((file) => this.deleteFile(file.id)))
  }

  static async allFiles(): Promise<FileType[]> {
    return db.files.toArray()
  }

  static isDangerFile(file: FileType) {
    return ['.sh', '.bat', '.cmd', '.ps1', '.vbs', 'reg'].includes(file.ext)
  }

  static getSafePath(file: FileType) {
    return this.isDangerFile(file) ? getFileDirectory(file.path) : file.path
  }

  static getFileUrl(file: FileType) {
    const filesPath = store.getState().runtime.filesPath
    return 'file://' + filesPath + '/' + file.name
  }

  static async updateFile(file: FileType) {
    if (!file.origin_name.includes(file.ext)) {
      file.origin_name = file.origin_name + file.ext
    }

    await db.files.update(file.id, file)
  }
}

export default FileManager
