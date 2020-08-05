const { src, dest } = require("gulp");
const gulp = require("gulp");

const output = "dist";

const ttf2woff2 = require("gulp-ttf2woff2");
const ttf2woff = require("gulp-ttf2woff");
const ttf2eot = require("gulp-ttf2eot");
const browsersync = require("browser-sync").create();
const del = require('del');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');

function browserSync() {
  browsersync.init({
    server: {
      baseDir: "./" + output + "/",
    },
    port: 5500,
    notify: false,
  });
}

gulp.task("fonts", function () {
  return src("#src/fonts/*.ttf")
    .pipe(ttf2woff2())
    .pipe(src("#src/fonts/*.ttf"))
    .pipe(ttf2woff())
    .pipe(src("#src/fonts/*.ttf"))
    .pipe(ttf2eot())
    .pipe(dest("#src/fonts/"));
});

function html() {
  return src("#src/*.html")
    .pipe(dest(output))
    .pipe(browsersync.stream());
}

function css() {
  return src("#src/sass/style.sass")
    .pipe(sass(
      {
        outputStyle: "expanded"        
      }
    ))
    .pipe(autoprefixer({
      cascade: true,
      overrideBrowserslist: ["last 5 version"]
    }))
    .pipe(dest(output+"/css/"))
    .pipe(browsersync.stream());
}

function norm() {
  return src("node_modules/normalize.css/normalize.css")
    .pipe(dest(output+"/css/"));
}

function clean() {
  return del("./" + output + "/");
}

function watchFiles(params) {
  gulp.watch(["#src/*.html"], html);
  gulp.watch(["#src/sass/**/*.sass"], css);
}

const out = gulp.series(clean, gulp.parallel(norm, css, html));
const watch = gulp.parallel(out, watchFiles, browserSync);

exports.norm = norm;
exports.css = css;
exports.html = html;
exports.out = out;
exports.watch = watch;
exports.default = watch;
