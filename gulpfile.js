// import modules
import { Buffer } from 'node:buffer'
import through2 from 'through2'
import { rollup } from 'rollup'
import terser from '@rollup/plugin-terser'
import { deleteAsync as del } from 'del'
import postcss from 'gulp-postcss'
import cssnano from 'cssnano'
import autoprefixer from 'autoprefixer'
import postcssImport from 'postcss-import'
import postcssInlineSvg from 'postcss-inline-svg'
import { minify } from 'terser'
import rename from 'gulp-ren'
import gulp from 'gulp'
const { src, dest, parallel, series, watch } = gulp

// compile styles task
function compile(srcdir, distdir) {
  return src(srcdir)
    .pipe(postcss([postcssImport(), postcssInlineSvg(), autoprefixer()]))
    .pipe(dest(distdir))
    .pipe(postcss([cssnano({ preset: 'default', comments: false })]))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(distdir))
}

// pre style vendors css
function css(cb) {
  compile('style/src/*.css', 'style/dist')
  compile('prism/src/*.css', 'prism/dist')
  compile('colormode/src/*.css', 'colormode/dist')
  cb()
}

//minify js
function jsmin(options = {}) {
  return through2.obj(async function (file, _, cb) {
    if (file.isBuffer()) {
      const data = file.contents.toString()
      const result = await minify(data.toString(), options)
      file.contents = Buffer.from(result.code)
    }
    cb(null, file)
  })
}

// minify colormode
function mode() {
  return src('colormode/src/colormode.js')
    .pipe(jsmin({ format: { comments: false } }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest('colormode/dist'))
}

// copy
function copyMode() {
  return src(['colormode/src/colormode.js']).pipe(dest('colormode/dist'))
}
function copyPrism() {
  return src(['prism/src/prism.js']).pipe(dest('prism/dist'))
}

// styles task
function styles() {
  return src('test/css/base.css')
    .pipe(postcss([postcssImport()]))
    .pipe(postcss([cssnano({ preset: 'default', comments: false })]))
    .pipe(rename({ basename: 'style.css' }))
    .pipe(dest('test/css'))
}

// assemble bandle js task
async function scripts() {
  const bundle = await rollup({
    input: 'test/js/base.js',
  })
  await bundle.write({
    file: 'test/js/main.js',
    format: 'iife',
    name: 'main',
    plugins: [terser({ format: { comments: false } })],
  })
}

// clean task
function clean() {
  return del(['colormode/dist/*', 'prism/dist/*', 'style/dist/*'])
}

// export
export { clean, css, mode, styles, scripts }
export const copy = parallel(copyMode, copyPrism)
export const build = series(clean, css, mode, copy)
export const test = parallel(styles, scripts)
