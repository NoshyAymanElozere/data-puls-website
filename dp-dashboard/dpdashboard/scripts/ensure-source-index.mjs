import { readFileSync } from 'node:fs'
import { execSync } from 'node:child_process'

const INDEX = 'index.html'
const html = readFileSync(INDEX, 'utf8')

if (html.includes('/src/app/main.tsx')) {
  process.exit(0)
}

console.warn('index.html is a production build artifact — restoring source from git...')
try {
  execSync(`git checkout -- ${INDEX}`, { stdio: 'inherit' })
} catch {
  console.error(
    'Failed to restore index.html. Run manually: git checkout -- index.html'
  )
  process.exit(1)
}
