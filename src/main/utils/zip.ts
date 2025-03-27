import util from 'node:util'
import zlib from 'node:zlib'

import logger from 'electron-log'

// 将 zlib 的 gzip 和 gunzip 方法转换为 Promise 版本
const gzipPromise = util.promisify(zlib.gzip)
const gunzipPromise = util.promisify(zlib.gunzip)

/**
 * 压缩字符串
 * @param {string} string - 要压缩的 JSON 字符串
 * @returns {Promise<Buffer>} 压缩后的 Buffer
 */
export async function compress(str) {
  try {
    const buffer = Buffer.from(str, 'utf-8')
    const compressedBuffer = await gzipPromise(buffer)
    return compressedBuffer
  } catch (error) {
    logger.error('Compression failed:', error)
    throw error
  }
}

/**
 * 解压缩 Buffer 到 JSON 字符串
 * @param {Buffer} compressedBuffer - 压缩的 Buffer
 * @returns {Promise<string>} 解压缩后的 JSON 字符串
 */
export async function decompress(compressedBuffer) {
  try {
    const buffer = await gunzipPromise(compressedBuffer)
    return buffer.toString('utf-8')
  } catch (error) {
    logger.error('Decompression failed:', error)
    throw error
  }
}
