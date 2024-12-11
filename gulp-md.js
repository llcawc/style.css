import { Buffer } from 'node:buffer'
import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'
import through2 from 'through2'
/**
 * Parse md file - transform markdown to html
 * @type { function parse({ options?: obj | null }) }
 */
export default function gulpMd(options) {
  if (options) {
    marked.use(options)
  }

  return through2.obj(function (file, _, cb) {
    if (file.isBuffer()) {
      const mark = marked.parse(file.contents.toString())
      const sanit = DOMPurify.sanitize(mark.toString())
      file.contents = Buffer.from(sanit)
      file.extname = '.html'
    }
    cb(null, file)
  })
}
