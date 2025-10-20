// import modules
import { pscss } from '@pasmurno/pscss'
import server from '@pasmurno/serve'
import { deleteAsync } from 'del'
import { dest, series, src } from 'gulp'
import { compile } from 'tscom'

// styles task
function styles() {
  return src('tests/pcss/styles/main.pcss')
    .pipe(pscss({ presetEnv: true }))
    .pipe(dest('dist/css'))
}

// scripts task
async function scripts() {
  await compile({
    input: 'tests/pcss/scripts/main.ts',
    dir: 'dist/js',
  })
}

// copy
function copy() {
  return src(['tests/pcss/*.html', 'tests/assets/**/*.*'], { encoding: false }).pipe(dest('dist'))
}

// clean task
async function clean() {
  await deleteAsync(['dist'])
}

// serve
async function serve() {
  await server()
}

// export
export const pcss = series(clean, copy, scripts, styles, serve)
