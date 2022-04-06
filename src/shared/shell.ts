import execa from 'execa'


export async function downloadDependencies(
  dependencies: string[],
  cwd: string,
): Promise<void> {
  let deps = ``
  for (let dep of dependencies) {
    deps += ` ${dep}`
  }

  await execa.command(`npm init -f`, { stdio: 'inherit', encoding: 'utf-8', cwd })
  await execa.command(`npm install ${deps}`, { stdio: 'inherit', encoding: 'utf-8', cwd })
}
