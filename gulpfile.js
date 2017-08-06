var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var $ = gulpLoadPlugins();
var pump = require('pump');

var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
// var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var utilities = require('gulp-util');
var del = require('del');
var jshint = require('gulp-jshint');
var lib = require('bower-files')({
    "overrides": {
        "bootstrap": {
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

var reload = browserSync.reload;

// The main JS file.  No need to include other 'required' files
var files = [
    'app/scripts/user-interface.js'
];

var pumpCb = function(err) {
    if (err) {
        console.log('Error: ', err.toString());
    }
};

// Converts node.js code, so it'll work in the browser
gulp.task('jsBrowserify', function() {
    return browserify({
            entries: [files],
            paths: ['./app/scripts']
        })
        .bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest('./tmp/scripts'));
});

// Compresses the file for Distribution
gulp.task('jsCompress', ['jsBrowserify'], function(pumpCb) {
    // the same options as described above 
    var options = {};

    pump([
            gulp.src('./tmp/scripts/*.js'),
            $.uglify(),
            gulp.dest('dist/scripts')
        ],
        pumpCb
    );
});

// Moves HTML files when building a distribution
gulp.task('html', () => {
    return gulp.src('app/*.html')
        .pipe($.useref({ searchPath: ['.tmp', 'app', '.'] }))
        .pipe($.if(/\.js$/, $.uglify({ compress: { drop_console: true } })))
        .pipe($.if(/\.css$/, $.cssnano({ safe: true, autoprefixer: false })))
        .pipe(gulp.dest('dist'));
});

// Builds a working web app in tmp folder...or the Dist folder.
gulp.task("build", ['clean'], function() {
    if (buildProduction) {
        gulp.start('jsCompress');
        gulp.start('distCssBuild');
    } else {
        gulp.start('jsBrowserify');
        gulp.start('cssBuild');
    }
    gulp.start('bower');
    gulp.start('html');
});

// Delete's the distribution and tmp folders
gulp.task("clean", function() {
    return del(['dist', 'tmp']);
});

// Checks the JavaScript code for errors
gulp.task('lint', function() {
    return gulp.src(['js/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});


// tested ok
gulp.task('bowerJS', function() {
    return gulp.src(lib.ext('js').files)
        .pipe($.concat('vendor.min.js'))
        .pipe($.uglify())
        .pipe(gulp.dest('./tmp/scripts'))
        .pipe(gulp.dest('./dist/scripts'));
});

// tested ok
gulp.task('bowerCSS', function() {
    return gulp.src(lib.ext('css').files)
        .pipe($.concat('vendor.css'))
        .pipe(gulp.dest('./tmp/styles'))
        .pipe(gulp.dest('./dist/styles'));
});

// tested ok
gulp.task('bower', ['bowerJS', 'bowerCSS']);

gulp.task('serve', ['build'], function() {
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

gulp.task('jsBuild', ['jsBrowserify', 'lint', 'bower'], function() {
    browserSync.reload();
});

gulp.task('bowerBuild', ['bower'], function() {
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
gulp.task('distCssBuild', function() {
    return gulp.src(['app/styles/*.scss'])
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/styles'))
        .pipe(browserSync.stream());
});