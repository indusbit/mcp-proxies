import * as fs from 'fs'

const logFile = process.env.MCP_LOG_FILE || null

export const log = (msg: string | Object) => {
  if (logFile === null) return;
  // return;
  msg = typeof msg === 'string' ? msg : JSON.stringify(msg)
  fs.appendFileSync(logFile, msg + '\n')
}
