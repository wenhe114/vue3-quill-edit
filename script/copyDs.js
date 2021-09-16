'use strict'
/* eslint-disable @typescript-eslint/no-var-requires */
const { series, src, dest } = require('gulp')
const cssmin = require('gulp-cssmin')
const rename=require("gulp-rename")
function copydist() {
  return src('../webpack/vue3-quill-edit/dist/webpack/vue3-quill-edit/src/index.vue.d.ts')
  .pipe(rename(function(path){
    return {
      dirname: path.dirname,
      basename:"index.vue",
      extname:".d.ts"
    }
  }))
    .pipe(dest('../webpack/vue3-quill-edit/types/'))
}
function copyds() {
  return src('../webpack/vue3-quill-edit/dist/webpack/vue3-quill-edit/index.d.ts')
  .pipe(rename(function(path){
    return {
      dirname: path.dirname,
      basename:"index",
      extname:".d.ts"
    }
  }))
    .pipe(dest('../webpack/vue3-quill-edit/types/'))
}

function copyPubuilc(){
    return src('../webpack/vue3-quill-edit/dist/webpack/vue3-quill-edit/until/options.d.ts')
    .pipe(dest('../webpack/vue3-quill-edit/types/'))
}

exports.build = series(copydist,copyPubuilc,copyds)
