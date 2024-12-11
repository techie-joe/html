// TLDR: pack all entry to output folder

const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    // [output-file] : [input-file]
    // "story.min.js": path.resolve(__dirname, '_scripts/sjs/story.js'),
    // "gulp.min.js": path.resolve(__dirname, '_scripts/gjs/gulp.js')
  },
  output: {
    path: path.resolve(__dirname, '../assets/js'),
    filename: '[name]'
  }
};