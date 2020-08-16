const { src, dest } = require("gulp");
const gulp = require("gulp");

const output = "dist";

const ttf2woff2 = require("gulp-ttf2woff2");
const ttf2woff = require("gulp-ttf2woff");
const ttf2eot = require("gulp-ttf2eot");
const browsersync = require("browser-sync").create();
const del = require("del");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const groupMediaCss = require("gulp-group-css-media-queries");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const imageMin = require("gulp-imagemin");
const webP = require('gulp-webp');
const webpHTML = require('gulp-webp-html');
const webpCSS = require('gulp-webp-css');
const cleanDir = require('gulp-clean-dir');
const uglify = require('gulp-uglify');

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
    .pipe(webpHTML())
    .pipe(dest(output))
    .pipe(browsersync.stream());
}

function css() {
  return src("#src/sass/style.sass")
    .pipe(
      sass({
        outputStyle: "expanded",
      })
    )
    .pipe(groupMediaCss())
    .pipe(
      autoprefixer({
        cascade: true,
        overrideBrowserslist: ["last 5 version"],
      })
    )
    .pipe(webpCSS())
    .pipe(dest(output + "/css/"))
    .pipe(cleanCSS())
    .pipe(
      rename({
        extname: ".min.css",
      })
    )
    .pipe(dest(output + "/css/"))
    .pipe(browsersync.stream());
}

function js() {
  return src("#src/js/**/*.js")    
    .pipe(dest(output+"/js/"))
    .pipe(uglify())
    .pipe(rename({
      extname: ".min.js"
    }))
    .pipe(dest(output+"/js/"));
}

function image() {
  return src("#src/img/**/*.{jpg,png,svg,gif,ico,webp}")
    .pipe(webP({
      quality: 70
    }))
    .pipe(cleanDir(output + "/img/"))
    .pipe(dest(output + "/img/"))
    .pipe(src("#src/img/**/*.{jpg,png,svg,gif,ico,webp}"))
    .pipe(imageMin(
      {
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        interlaced: true,
        optimizationLevel: 3
      }
    ))
    .pipe(cleanDir(output + "/img/"))
    .pipe(dest(output + "/img/"))
    .pipe(browsersync.stream());
}

function norm() {
  return src("node_modules/normalize.css/normalize.css")
    .pipe(
      dest(output + "/css/")
    );
}

function clean() {
  return del("./" + output + "/");
}

function watchFiles(params) {
  gulp.watch(["#src/*.html"], html);
  gulp.watch(["#src/sass/**/*.sass"], css);
  gulp.watch(["#src/img/**/*.{jpg,png,svg,gif,ico,webp}"], image);
  gulp.watch(["#src/js/**/*.js"], js);

}

const out = gulp.series(clean, gulp.parallel(norm, js, image, css, html));
const watch = gulp.parallel(out, watchFiles, browserSync);


exports.js = js;
exports.image = image;
exports.norm = norm;
exports.css = css;
exports.html = html;
exports.out = out;
exports.watch = watch;
exports.default = watch;
