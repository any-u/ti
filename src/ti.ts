import chalk from "chalk"
import fs from "fs-extra"
import minimist from "minimist"
import * as path from "path"
import { performance } from "perf_hooks"
import { downloadDependencies, isFile } from "./shared"

const args = minimist(process.argv.slice(2))
const scripts = args._
const alias = args.alias || args.a
const deps = args.deps || args.d

const packagesDir = path.resolve(__dirname, "../packages")
const resolve = (p: string) => path.resolve(packagesDir, p)

async function run() {
  // 检测时脚本地址是否存在
  if (!scripts.length) {
    console.log(chalk.red(`No script specified.`))
    return
  }

  if (scripts.length > 1) {
    console.log(
      chalk.yellow(
        "\n Info: You provided more than one argument. The first one will be used as the app's name, the rest are ignored."
      )
    )
  }

  /**
   * 检测路径是相对地址还是绝对地址
   * 检测脚本地址是文件还是目录
   * 文件|| 目录 =>
   */
  const script = scripts[0]
  const isAbsolute = path.isAbsolute(script)
  const scriptPath = isAbsolute ? script : path.resolve(process.cwd(), script)
  // 路径是否存在
  if (!fs.existsSync(scriptPath)) {
    console.log(
      chalk.red(`script ${scriptPath} does not exist. Please check the path.`)
    )
    return
  }

  let name = alias || path.basename(scriptPath, path.extname(scriptPath))
  if (fs.existsSync(resolve(name))) {
    console.log(
      chalk.yellow(
        `\n Info: The alias ${name} has already existed, please change it.`
      )
    )
    return
  }

  // 检测script对应的是一个文件还是文件夹
  if (isFile(scriptPath)) {
    const dest = resolve(`${name}/index.js`)
    await fs.copy(scriptPath, dest)

    // 下载依赖
    const dependencies = deps.split("&").filter(Boolean)
    if (dependencies.length) {
      await downloadDependencies(dependencies, path.dirname(dest))
    }
  } else {
    // 文件
    const dest = resolve(`${name}/${path.basename(scriptPath)}`)
    await fs.copy(scriptPath, dest)
  }

  console.log(`✨  Done in ${performance.now()}s.`)
}

run().catch((err) => console.error(err))
