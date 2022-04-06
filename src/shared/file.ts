import fs from "fs-extra"

// 函数，检测路径是文件还是目录
export function isFile(path: string): boolean {
  return fs.existsSync(path) && fs.statSync(path).isFile()
}
