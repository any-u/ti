import chalk from "chalk"
import fs from "fs-extra"
import minimist from "minimist"
import * as path from "path"
import { performance } from "perf_hooks"

const args = minimist(process.argv.slice(2))
const scripts = args._

const packagesDir = path.resolve(__dirname, "../packages")
const resolve = (p: string) => path.resolve(packagesDir, p)

async function run() {
  if (!scripts.length) {
    console.log(chalk.red(`No script specified.`))
    return
  }

  // 删除scripts中所有的文件或文件夹
  for (let script of scripts) {
    if (fs.existsSync(resolve(script))) {
      await fs.remove(resolve(script))
    }
  }

  console.log(`✨  Done in ${performance.now()}s.`)
}

run()
