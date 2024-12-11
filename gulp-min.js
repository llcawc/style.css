import { Buffer } from 'node:buffer'
import through2 from 'through2'
import { minify } from 'terser'
/**
 * minify js file with
 * @type { function mini(options?: obj) }
 */
export default function gulpMin(options = {}) {
  return through2.obj(async function (file, _, cb) {
    if (file.isBuffer()) {
      const data = file.contents.toString()
      const result = await minify(data.toString(), options)
      file.contents = Buffer.from(result.code)
    }
    cb(null, file)
  })
}
