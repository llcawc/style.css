// import modules
import server from '@pasmurno/serve'
import { deleteAsync } from 'del'
import { dest, parallel, series, src } from 'gulp'
import licss from 'licss'
import { compile } from 'tscom'

// styles task
function styles() {
  return src('test-scheme/styles/main.css').pipe(licss()).pipe(dest('dist/css'))
}

// scripts task
async function scripts() {
  await compile({
    input: 'test-scheme/scripts/main.ts',
    dir: 'dist/js',
  })
}

// copy
function copyHtml() {
  return src(['test-scheme/*.html']).pipe(dest('dist'))
}
function copyPrism() {
  return src(['test-scheme/assets/prism/prism.*']).pipe(dest('dist/lib'))
}
function copyImg() {
  return src(['test-scheme/assets/images/*.*'], { encoding: false }).pipe(dest('dist/images'))
}
function copyFonts() {
  return src(
    [
      'test-scheme/assets/fonts/bootstrap-icons/*.woff*',
      'test-scheme/assets/fonts/Inter/*.woff*',
      'test-scheme/assets/fonts/JetBrains/*.woff*',
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
const copy = parallel(copyHtml, copyImg, copyFonts, copyPrism)
export const scheme = series(clean, copy, scripts, styles, serve)
