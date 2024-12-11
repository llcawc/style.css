import { join, resolve } from 'node:path'
import { readFile, writeFile } from 'node:fs/promises'
const __dirname = resolve()

// service function
async function createJsCss(ligtName, darkName, fileName) {
  const light = await readFile(join(__dirname, ligtName), 'utf8')
  const dark = await readFile(join(__dirname, darkName), 'utf8')
  const file = 'export default { light: `' + light + '`, dark: `' + dark + '`,}'
  const response = writeFile(join(__dirname, fileName + '.css.js'), file)
}

// task make
async function make() {
  createJsCss(
    'vendor/prism/dist/prism-light.min.css',
    'vendor/prism/dist/prism-dark.min.css',
    'vendor/prism/src/light-dark'
  )
}

export default make
