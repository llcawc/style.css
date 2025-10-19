// import modules
import server from '@pasmurno/serve'
import { deleteAsync } from 'del'
import { dest, parallel, series, src } from 'gulp'
import licss from 'licss'
import { compile } from 'tscom'

// styles task
function styles() {
  return src('test-css/styles/main.css').pipe(licss()).pipe(dest('dist/css'))
}

// scripts task
async function scripts() {
  await compile({
    input: 'test-css/scripts/main.ts',
    dir: 'dist/js',
  })
}

// copy
function copyHtml() {
  return src(['test-css/*.html']).pipe(dest('dist'))
}
function copyPrism() {
  return src(['test-css/assets/prism/prism.*']).pipe(dest('dist/lib'))
}
function copyImg() {
  return src(['test-css/assets/images/*.*'], { encoding: false }).pipe(dest('dist/images'))
}
function copyFonts() {
  return src(
    [
      'test-css/assets/fonts/bootstrap-icons/*.woff*',
      'test-css/assets/fonts/Inter/*.woff*',
      'test-css/assets/fonts/JetBrains/*.woff*',
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
export const testCss = series(clean, copy, scripts, styles, serve)
