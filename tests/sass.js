// import modules
import { pscss } from '@pasmurno/pscss'
import server from '@pasmurno/serve'
import { deleteAsync } from 'del'
import { dest, series, src } from 'gulp'
import { compile } from 'tscom'

const purge = {
  content: [
    'tests/sass/**/*.{ts,html}',
    'vendor/bootstrap/js/dist/dom/*.js',
    'vendor/bootstrap/js/dist/{alert,base-component,button,collapse,dropdown}.js',
  ],
  safelist: [/scrolltotop$/, /on$/, /down$/],
  keyframes: true,
  variables: true,
}

// styles task
function styles() {
  return src('tests/sass/styles/main.sass')
    .pipe(pscss({ purgeCSSoptions: purge }))
    .pipe(dest('dist/css'))
}

// scripts task
async function scripts() {
  await compile({
    input: 'tests/sass/scripts/main.ts',
    dir: 'dist/js',
  })
}

// copy
function copy() {
  return src(['tests/sass/*.html', 'tests/assets/{images,fonts}/*.*'], { encoding: false }).pipe(dest('dist'))
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
export const sass = series(clean, copy, scripts, styles, serve)
