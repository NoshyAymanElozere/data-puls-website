// Boots the real herz Laravel API for E2E runs on a throwaway SQLite database.
// The developer's own .env database is never touched: every DB setting is overridden here
// and migrations are pinned to the `sqlite` connection.
import { spawn, spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const backendDir = resolve(process.env.HERZ_BACKEND_PATH ?? resolve(here, '../../../../../herz-backend/Backend'))
const port = process.env.E2E_API_PORT ?? '8010'
const php = process.env.PHP_BINARY ?? 'php'

if (!existsSync(resolve(backendDir, 'artisan'))) {
  console.error(`[e2e] herz backend not found at ${backendDir}. Set HERZ_BACKEND_PATH.`)
  process.exit(1)
}

const cacheDir = resolve(here, '../.cache')
const database = resolve(cacheDir, 'herz-e2e.sqlite')
mkdirSync(cacheDir, { recursive: true })
rmSync(database, { force: true })
writeFileSync(database, '')

const env = {
  ...process.env,
  APP_ENV: 'local',
  APP_DEBUG: 'true',
  APP_URL: `http://127.0.0.1:${port}`,
  DB_CONNECTION: 'sqlite',
  DB_DATABASE: database,
  DB_URL: '',
  CACHE_STORE: 'array',
  SESSION_DRIVER: 'array',
  QUEUE_CONNECTION: 'sync',
  BROADCAST_CONNECTION: 'null',
  MAIL_MAILER: 'array',
  TELESCOPE_ENABLED: 'false',
  PULSE_ENABLED: 'false',
  NIGHTWATCH_ENABLED: 'false',
}

const migrate = spawnSync(php, ['artisan', 'migrate:fresh', '--seed', '--force', '--database=sqlite'], {
  cwd: backendDir,
  env,
  stdio: 'inherit',
})
if (migrate.status !== 0) process.exit(migrate.status ?? 1)

const server = spawn(php, ['artisan', 'serve', '--host=127.0.0.1', `--port=${port}`, '--no-reload'], {
  cwd: backendDir,
  env,
  stdio: 'inherit',
})

const stop = () => server.kill()
process.on('SIGINT', stop)
process.on('SIGTERM', stop)
process.on('exit', stop)
server.on('exit', (code) => process.exit(code ?? 0))
