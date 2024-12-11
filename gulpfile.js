// import modules
import { Buffer } from 'node:buffer'
import through2 from 'through2'
import { readFileSync } from 'node:fs'
import gulp from 'gulp'
const { src, dest, parallel, series, watch } = gulp
import { deleteAsync as del } from 'del'
import postcss from 'gulp-postcss'
import cssnano from 'cssnano'
import autoprefixer from 'autoprefixer'
import postcssImport from 'postcss-import'
import postcssInlineSvg from 'postcss-inline-svg'
import replace from 'gulp-replace'
import { rollup } from 'rollup'
import terser from '@rollup/plugin-terser'
import markdown from './gulp-md.js'
import rename from './gulp-ren.js'
import mini from './gulp-min.js'

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
  compile('vendor/style/src/*.css', 'vendor/style/dist')
  compile('vendor/prism/src/*.css', 'vendor/prism/dist')
  compile('vendor/colormode/src/*.css', 'vendor/colormode/dist')
  cb()
}

// tiny compresed
function tiny() {
  return src('vendor/style/tiny/style.css')
    .pipe(postcss([autoprefixer()]))
    .pipe(postcss([cssnano({ preset: 'default', comments: false })]))
    .pipe(dest('vendor/style/tiny/min'))
}

// styles task
function styles() {
  return src('src/style.css')
    .pipe(postcss([postcssImport()]))
    .pipe(postcss([cssnano({ preset: 'default', comments: false })]))
    .pipe(dest('dist'))
}

// assemble bandle js task
async function scripts() {
  const bundle = await rollup({
    input: 'src/main.js',
  })
  await bundle.write({
    file: 'dist/main.js',
    format: 'iife',
    name: 'main',
    plugins: [terser({ format: { comments: false } })],
  })
}

// minify colormode
function mode() {
  return src('./vendor/colormode/src/colormode.js')
    .pipe(mini({ format: { comments: false } }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest('./vendor/colormode/dist'))
}

// parse and sanitize markdown files (*.md -> *.html)
function parse() {
  return src('src/md/*.md').pipe(markdown()).pipe(dest('src/md'))
}

// inline past html code
function inline() {
  return src('src/layout/index.html')
    .pipe(
      replace(/{{\s?slug\s?}}/, () => {
        const file = readFileSync('src/md/page.html', 'utf8')
        return file
      })
    )
    .pipe(dest('src'))
}

// copy assets files
function copy() {
  return src(['src/*.html']).pipe(dest('dist'))
}

// clean task
function clean() {
  return del(['dist/**'])
}

// watch
function watcher() {
  watch('vendor/style/src/**/*.css', series(css, tiny, styles))
  watch('vendor/**/*.js', scripts)
  watch('src/**/*.{html,md}', series(parse, inline, copy))
}

// export
export { clean, tiny, css, styles, scripts, mode, parse, inline, watcher }
export const style = series(css, tiny)
export const build = series(clean, scripts, styles, parse, inline, copy)
export const dev = series(build, watcher)
