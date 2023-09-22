import cp from 'child_process'
import util from 'util'
import log from 'electron-log'
const execFilePromise = util.promisify(cp.execFile)

export async function execFile(path: string, args: string[], cwd?: string) {
  log.info('[execFile]', path, args.join(' '), cwd || '')
  const { stdout } = await execFilePromise(path, args, { cwd })
  return stdout
}
