//--------------+
"use strict";//+
//--------------+

//=====================================================
//Pressets:
const source_folder = "src";
const project_folder = "dist";
//----------------------------
//Pathes Map:
let path = {
    build: {
        html: "./indx.html",
        css: project_folder + "/style/",
        js: project_folder + "/js/",
        img: project_folder + "/img/",
        fonts: project_folder + "/fonts/",
    },
    src: {
        css: source_folder + "/scss/style.scss",
        js: source_folder + "/js/*.js",
        img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
        fonts: source_folder + "/fonts/*.ttf",
    },
    watch: {
        html: "./index.html",
        css: source_folder + "/scss/**/*.scss",
        js: source_folder + "/js/**/*.js",
        img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}"
    },
    clean: "./" + project_folder + "/"
}

//Imports:
//=====================================================
const { src, dest, watch, series } = require("gulp");
const gulp = require("gulp");
//-----
const clean = require("gulp-clean");
//-----
const browserSync = require("browser-sync").create();
//-----
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
//-----
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
//-----
const rename = require("gulp-rename");
//-----
const imagemin = require("gulp-imagemin");
//=====================================================

//Declarations:
//--------------------------------------------
//Sass, Gulp-autoprefixer:
function createCSS() {
  return src(path.src.css)
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(rename("style/styles.min.css"))
    .pipe(dest(project_folder))
    .pipe(browserSync.stream());
}
//--------------------------------------------
//Clean:
function cleanDist() {
  if (path.clean)
  return src(path.clean, { read: false, allowEmpty: true }).pipe(clean());
}
//--------------------------------------------
//Scripts (gulp-concat, gulp-uglify):
function scripts() {
  return src(path.src.js)
    .pipe(concat("index.js"))
    .pipe(uglify())
    .pipe(rename("js/scripts.min.js"))
    .pipe(dest(project_folder))
    .pipe(browserSync.stream());
}
//Gulp-imagemin:
function addImages() {
  return src(path.src.img)
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        interplaced: true,
        optimizationlevel: 3,
      })
    )
    .pipe(dest(path.build.img));
}
//--------------------------------------------
//:Browse-sync:
//Server:
function server() {
  return browserSync.init({
    server: {
      baseDir: "./",
    },
    port: 3000,
    notify: false,
  });
}
//Lunch and watch:
function lunchAndWatch() {
  server();
  watch(path.watch.css, createCSS);
  watch(path.watch.js, scripts);
  watch(path.watch.html).on("change", browserSync.reload);
}
//=====================================================

//Exports (Work Tasks):
exports.build = series(cleanDist, createCSS, scripts, addImages);
exports.dev = lunchAndWatch;
