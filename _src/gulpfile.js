// TLDR: to export gulp tasks to be used in terminal

const root = '/html/';

const _src = {
  page : "_pages",
  scss : ["_styles/scss/**/*.scss"],
  js   : ["_scripts/gs/**/*.js"],
};

const _dest = {
  root : "../",
  css  : "../assets/css",
  js   : "./_scripts/gjs",
};

const _gulp = {
  js: "gulp.js"
};

const { src, dest, watch, parallel } = require("gulp");
const rename = require("gulp-rename");

// pages: html and php
// : task to take pug files from _src to _dest
// : retain the same directory structure
const pug = require("gulp-pug");
function html() {
  return src(_src.page + '/**/*.html.pug')
    .pipe(pug({ pretty: false }))
    .pipe(rename(function (path) {
      path.basename = path.basename.substring(0, path.basename.lastIndexOf('.'));
    }))
    .pipe(dest(_dest.root));
}
function php() {
  return src(_src.page + '/**/*.php.pug')
    .pipe(pug({ pretty: false }))
    .pipe(rename(function (path) {
      path.basename = path.basename.substring(0, path.basename.lastIndexOf('.'));
      path.extname = '.php';
    }))
    .pipe(dest(_dest.root));
}
function pagesw() {
  watch(_src.page + '/**/*.html.pug', html);
  watch(_src.page + '/**/*.php.pug', php);
}

exports.pages = parallel(html, php);
exports.pagesw = pagesw;

// txt
// : task to take pug files from _src to _dest
// : retain the same directory structure
function txt() {
  return src(_src.page + '/**/*.txt.pug')
  .pipe(pug())
  .pipe(rename(function (path) {
    path.basename = path.basename.substring(0, path.basename.lastIndexOf('.'));
    path.extname = '';
  }))
  .pipe(dest(_dest.root));
}
function txtw() {
  watch(_src.page + '/**/*.txt.pug', txt);
}

// .htaccess
const file = require('gulp-file');
function htaccess() {
  return file(
    '.htaccess',
    `ErrorDocument 404 ${root}404.html\n`+
    `ErrorDocument 500 ${root}500.html`,
    { src: true } // indicates that the string provided as the second argument should be treated as file contents rather than a file path
  )
  .pipe(dest(_dest.root));
}

function filesw() {
  txtw()
}

exports.files = parallel(txt, htaccess);
exports.filesw = filesw;

// sass
// : task to take scss files from _src to _dest
// : outputStyle: compressed | expanded
const outputStyle = 'compressed';
const sass = require("gulp-sass")(require("sass"));
function css() {
  return src(_src.scss)
    .pipe(sass({ outputStyle: outputStyle }).on("error", sass.logError))
    .pipe(dest(_dest.css));
}
function cssw() {
  watch(_src.scss, css);
}
exports.css = css;
exports.cssw = cssw;

// js
// : task to take js files from _src to _dest
const concat = require("gulp-concat");
function js() {
  return src(_src.js)
    .pipe(concat(_gulp.js))
    .pipe(dest(_dest.js));
}
function jsw() {
  watch(_src.js, js);
}
exports.js = js;
exports.jsw = jsw;

// all
exports.all = parallel(html, php, txt, htaccess, css, js);

exports.watch = function () {
  pagesw();
  filesw();
  cssw();
  jsw();
};
