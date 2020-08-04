const { src, dest } = require("gulp");
const gulp = require("gulp");

const output = "out";

const ttf2woff2 = require("gulp-ttf2woff2");
const ttf2woff = require("gulp-ttf2woff");
const ttf2eot = require("gulp-ttf2eot");
const browsersync = require("browser-sync").create();

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
    .pipe(dest("out"))
    .pipe(browsersync.stream());
}

function watchFiles(params) {
  gulp.watch(["#src/*.html"], html);
}

const out = gulp.series(html);
const watch = gulp.parallel(out, watchFiles, browserSync);

exports.html = html;
exports.out = out;
exports.watch = watch;
exports.default = watch;
