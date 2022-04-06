import chalk from "chalk"
import fs from "fs-extra"
import minimist from "minimist"
import * as path from "path"
import { performance } from "perf_hooks"
import { isFile } from "./shared"

const args = minimist(process.argv.slice(2))
const scripts = args._

const packagesDir = path.resolve(__dirname, "../packages")
const resolve = (p: string) => path.resolve(packagesDir, p)

async function run() {
  if (!scripts.length) {
    console.log(chalk.red(`No script specified.`))
    return
  }

  // 分别引入scripts文件下index.js文件，然后将options作为参数传递进去执行
  for (let script of scripts) {
    const scriptPath = resolve(script)
    if (!fs.existsSync(scriptPath)) {
      console.log(
        `script ${chalk.red(script)} does not exist. Please check the path.`
      )
      continue
    }
    if (isFile(scriptPath)) {
      await import(resolve(`${script}/index.js`))
    } else {
      const packageJsonPath = resolve(`${script}/package.json`)
      if (!fs.existsSync(packageJsonPath)) {
        await import(resolve(`${script}/index.js`))
      } else {
        const { main } = await fs.readJson(packageJsonPath)
        await import(resolve(`${script}/${main}`))
      }
    }
  }
  
  console.log(`✨  Done in ${performance.now()}s.\n`)
}

run()
