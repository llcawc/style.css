// import modules
import { deleteAsync } from 'del'
import { dest, parallel, series, src } from 'gulp'
import postcss from 'gulp-postcss'
import licss, { rename } from 'licss'
import postcssImport from 'postcss-import'
import postcssInlineSvg from 'postcss-inline-svg'
import tscom from 'tscom'

// style task
function style() {
  return src('src/style/*.css')
    .pipe(postcss([postcssImport(), postcssInlineSvg()]))
    .pipe(licss({ minify: false }))
    .pipe(dest('dist/style'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(licss())
    .pipe(dest('dist/style'))
}

// colormode css
function colormodeCss() {
  return src('src/colormode/colormode.css')
    .pipe(licss({ minify: false }))
    .pipe(dest('dist/colormode'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(licss())
    .pipe(dest('dist/colormode'))
}

// colormode js
function colormodeJs() {
  return tscom({
    input: 'src/colormode/colormode.ts',
    dir: 'dist/colormode',
    format: 'es',
    minify: false,
  })
}

// switcher css
function switcherCss() {
  return src('src/switcher/*.sass')
    .pipe(licss({ minify: false }))
    .pipe(dest('dist/switcher'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(licss())
    .pipe(dest('dist/switcher'))
}

// switcher js
function switcherJs() {
  return tscom({
    input: 'src/switcher/switcher.ts',
    dir: 'dist/switcher',
    format: 'es',
    minify: false,
  })
}

// scheme css
function schemeCss() {
  return src('src/scheme/*.sass')
    .pipe(licss({ minify: false }))
    .pipe(dest('dist/scheme'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(licss())
    .pipe(dest('dist/scheme'))
}

// scheme js
function schemeJs() {
  return tscom({
    input: 'src/scheme/*.ts',
    dir: 'dist/scheme',
    format: 'es',
    minify: false,
  })
}

// pcss task
function pCss() {
  return src('src/pcss/main.pcss')
    .pipe(licss({ minify: false }))
    .pipe(rename({ extname: '.css' }))
    .pipe(dest('dist/pcss'))
    .pipe(licss())
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest('dist/pcss'))
}

// prism css
function prismCss() {
  return src('src/prism/prism.css')
    .pipe(licss({ minify: false }))
    .pipe(dest('dist/prism'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(licss())
    .pipe(dest('dist/prism'))
}

// prism js copy
function copyPrism() {
  return src(['src/prism/prism.js']).pipe(dest('dist/prism'))
}

// sass task
function sass() {
  return src('src/sass/main.sass')
    .pipe(licss({ minify: false }))
    .pipe(dest('dist/sass'))
    .pipe(licss())
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest('dist/sass'))
}

// scss task
function scss() {
  return src('src/scss/main.scss')
    .pipe(licss({ minify: false }))
    .pipe(dest('dist/scss'))
    .pipe(licss())
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest('dist/scss'))
}

// clean task
function clean() {
  return deleteAsync('dist')
}

// export
export { clean }
export const copy = parallel(copyPrism)
export const styles = parallel(colormodeCss, switcherCss, schemeCss, pCss, prismCss, sass, scss, style)
export const scripts = parallel(colormodeJs, switcherJs, schemeJs)
export const build = series(clean, scripts, styles, copy)
