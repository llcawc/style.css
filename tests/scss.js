// import modules
import { pscss } from '@pasmurno/pscss'
import server from '@pasmurno/serve'
import { deleteAsync } from 'del'
import { dest, series, src } from 'gulp'
import { compile } from 'tscom'

const purge = {
  content: [
    'tests/scss/**/*.{ts,html}',
    'vendor/bootstrap/js/dist/dom/*.js',
    'vendor/bootstrap/js/dist/{alert,base-component,button,collapse,dropdown}.js',
  ],
  safelist: [/scrolltotop$/, /on$/, /down$/],
  keyframes: true,
  variables: true,
}

// styles task
function styles() {
  return src('tests/scss/styles/main.scss')
    .pipe(pscss({ purgeCSSoptions: purge }))
    .pipe(dest('dist/css'))
}

// scripts task
async function scripts() {
  await compile({
    input: 'tests/scss/scripts/main.ts',
    dir: 'dist/js',
  })
}

// copy
function copy() {
  return src(['tests/scss/*.html', 'tests/assets/{images,fonts}/*.*'], { encoding: false }).pipe(dest('dist'))
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
export const scss = series(clean, copy, scripts, styles, serve)
