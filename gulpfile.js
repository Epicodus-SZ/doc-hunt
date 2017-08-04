const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const $ = gulpLoadPlugins();

const browserify = require('browserify');
var source = require('vinyl-source-stream');
// var concat = require('gulp-concat');
//var uglify = require('gulp-uglify');
var utilities = require('gulp-util');
var del = require('del');
var jshint = require('gulp-jshint');
var lib = require('bower-files')({
  "overrides":{
    "bootstrap" : {
      "main": [
        "less/bootstrap.less",
        "dist/css/bootstrap.css",
        "dist/js/bootstrap.js"
      ]
    }
  }
});
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var buildProduction = utilities.env.production;

const reload = browserSync.reload;
let dev = true;

// Moves HTML files when building a distribution
gulp.task('html', () => {
  return gulp.src('app/*.html')
    .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
    .pipe($.if(/\.js$/, $.uglify({compress: {drop_console: true}})))
    .pipe($.if(/\.css$/, $.cssnano({safe: true, autoprefixer: false})))
    // .pipe($.if(/\.html$/, $.htmlmin({
    //   collapseWhitespace: true,
    //   minifyCSS: true,
    //   minifyJS: {compress: {drop_console: true}},
    //   processConditionalComments: true,
    //   removeComments: true,
    //   removeEmptyAttributes: true,
    //   removeScriptTypeAttributes: true,
    //   removeStyleLinkTypeAttributes: true
    // })))
    .pipe(gulp.dest('dist'));
});

// Converts node.js code, so it'll work in the browser
gulp.task('jsBrowserify', ['concatInterface'], function() {
  return browserify({ entries: ['./tmp/allConcat.js'] })
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('./tmp/scripts'))
    .pipe(gulp.dest('./dist/scripts'));
});

// Combines all user interface JS files into one file.
gulp.task('concatInterface', function() {
  return gulp.src(['./app/scripts/*-interface.js'])
    .pipe($.concat('allConcat.js'))
    .pipe(gulp.dest('./tmp'));
});

// Minifies the scripts
gulp.task("productionScripts", ["jsBrowserify"], function(){
  return gulp.src("./dist/scripts/app.js")
    .pipe($.uglify())
    .pipe(gulp.dest("./dist/scripts"));
});

// Builds a working web app, in the Dist folder.
gulp.task("build", ['clean'], function(){
  if (buildProduction) {
    gulp.start('productionScripts');
    gulp.start('productionCssBuild');
  } else {
    gulp.start('jsBrowserify');
    gulp.start('cssBuild');
  }
    gulp.start('bower');

    gulp.start('html');
});

// Delete's the distribution and tmp folders
gulp.task("clean", function(){
  return del(['dist', 'tmp']);
});

// Checks the JavaScript code for errors
gulp.task('lint', function(){
  return gulp.src(['js/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});


// tested ok
gulp.task('bowerJS', function () {
  return gulp.src(lib.ext('js').files)
    .pipe($.concat('vendor.min.js'))
    .pipe($.uglify())
    .pipe(gulp.dest('./tmp/scripts'))
    .pipe(gulp.dest('./dist/scripts'));
});

// tested ok
gulp.task('bowerCSS', function () {
  return gulp.src(lib.ext('css').files)
    .pipe($.concat('vendor.css'))
    .pipe(gulp.dest('./tmp/styles'))
    .pipe(gulp.dest('./dist/styles'));
});

// tested ok
gulp.task('bower', ['bowerJS', 'bowerCSS']);

gulp.task('serve', ['jsBuild', 'bower', 'cssBuild', 'html'],  function() {
  browserSync.init({
    server: {
      baseDir: ['tmp', 'app'],
      index: "index.html"
    }
  });

  gulp.watch([
    'app/*.html',
    'app/images/**/*',
    'tmp/fonts/**/*'
  ]).on('change', reload);

  gulp.watch(['app/scripts/*.js'], ['jsBuild']);
  gulp.watch(['bower.json'], ['bowerBuild']);
  gulp.watch(['*.html'], ['htmlBuild']);
  gulp.watch(["app/styles/*.scss"], ['cssBuild']);

});

gulp.task('serve:dist', ['jsBuild', 'bower', 'productionCssBuild', 'html'],  function() {
  browserSync.init({
    server: {
      baseDir: ['tmp', 'app'],
      index: "index.html"
    }
  });
});

gulp.task('jsBuild', ['jsBrowserify', 'lint', 'bower'], function(){
  browserSync.reload();
});

gulp.task('bowerBuild', ['bower'], function(){
  browserSync.reload();
});

gulp.task('htmlBuild', function() {
  browserSync.reload();
});

// Compile the CSS for development
gulp.task('cssBuild', function() {
  return gulp.src(['app/styles/*.scss'])
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./tmp/styles'))
    .pipe(browserSync.stream());
});

// Compile the CSS for distribution
gulp.task('productionCssBuild', function() {
  return gulp.src(['app/styles/*.scss'])
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/styles'))
    .pipe(browserSync.stream());
});
