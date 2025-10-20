// import modules
import { pscss } from '@pasmurno/pscss'
import autoprefixer from 'autoprefixer'
import cssnanoPlugin from 'cssnano'
import { dest, src } from 'gulp'
import postcss from 'gulp-postcss'
import postcssImport from 'postcss-import'
import postcssInlineSvg from 'postcss-inline-svg'
import { compile } from 'tscom'
import rename from 'xren'
// export tasks
export { css } from './tests/css.js'
export { pcss } from './tests/pcss.js'
export { sass } from './tests/sass.js'
export { scss } from './tests/scss.js'

// compile style from parts
function compileStyle() {
  return src('source/style/src/*.css')
    .pipe(postcss([postcssImport(), postcssInlineSvg(), autoprefixer()]))
    .pipe(dest('source/style'))
}

// make style for production
function minifyStyle() {
  return src('source/style/*.css')
    .pipe(postcss([cssnanoPlugin()]))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest('source/style'))
}

// prism
function prism(cb) {
  src('source/prism/src/prism.css').pipe(pscss()).pipe(dest('source/prism'))
  src('source/prism/src/prism.js').pipe(dest('source/prism'))
  return cb()
}

// colormode
async function colormode() {
  return await compile({
    input: 'source/colormode/colormode.ts',
    dir: 'source/colormode',
    format: 'es',
    minify: false,
  })
}

// switcher
async function switcher() {
  return await compile({
    input: 'source/switcher/switcher.ts',
    dir: 'source/switcher',
    format: 'es',
    minify: false,
  })
}

// switcher
async function scheme() {
  return await compile({
    input: 'source/scheme/scheme.ts',
    dir: 'source/scheme',
    format: 'es',
    minify: false,
  })
}

// export
export { colormode, compileStyle, minifyStyle, prism, scheme, switcher }
