// import modules
import server from '@pasmurno/serve'
import { deleteAsync } from 'del'
import { dest, series, src } from 'gulp'
import licss from 'licss'
import { compile } from 'tscom'

// styles task
function styles() {
  return src('tests/css/styles/main.css').pipe(licss()).pipe(dest('dist/css'))
}

// scripts task
async function scripts() {
  await compile({
    input: 'tests/css/scripts/main.ts',
    dir: 'dist/js',
  })
}

// copy
function copy() {
  return src(['tests/css/*.html', 'tests/assets/**/*.*'], { encoding: false }).pipe(dest('dist'))
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
export const css = series(clean, copy, scripts, styles, serve)
