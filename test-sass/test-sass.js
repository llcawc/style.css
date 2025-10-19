// import modules
import { pscss } from '@pasmurno/pscss'
import server from '@pasmurno/serve'
import { deleteAsync } from 'del'
import { dest, parallel, series, src } from 'gulp'
import { compile } from 'tscom'

const purge = {
  content: [
    'test-sass/**/*.{ts,html}',
    'vendor/bootstrap/js/dist/dom/*.js',
    'vendor/bootstrap/js/dist/{alert,base-component,button,collapse,dropdown}.js',
  ],
  safelist: [/scrolltotop$/, /on$/, /down$/],
  keyframes: true,
  variables: true,
}

// styles task
function styles() {
  return src('test-sass/styles/main.sass')
    .pipe(pscss({ purgeCSSoptions: purge }))
    .pipe(dest('dist/css'))
}

// scripts task
async function scripts() {
  await compile({
    input: 'test-sass/scripts/main.ts',
    dir: 'dist/js',
  })
}

// copy
function copyHtml() {
  return src(['test-sass/*.html']).pipe(dest('dist'))
}
function copyImg() {
  return src(['test-sass/assets/images/*.*'], { encoding: false }).pipe(dest('dist/images'))
}
function copyFonts() {
  return src(
    [
      'test-sass/assets/fonts/bootstrap-icons/*.woff*',
      'test-sass/assets/fonts/Inter/*.woff*',
      'test-sass/assets/fonts/JetBrains/*.woff*',
    ],
    {
      encoding: false,
    }
  ).pipe(dest('dist/fonts'))
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
const copy = parallel(copyHtml, copyImg, copyFonts)
export const testSass = series(clean, copy, scripts, styles, serve)
