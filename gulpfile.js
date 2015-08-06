// General.
var gulp = require('gulp');
var shell = require('gulp-shell');
var source = require("vinyl-source-stream");
var watch = require('gulp-watch');
var flatten = require('gulp-flatten');
var nodemon = require('gulp-nodemon');

// Javascript.
var browserify = require('browserify');
var reactify = require('reactify');

// CSS.
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer-core');


// TASKS **********************************************************************

// Kill any existing node servers.
gulp.task('node:kill', shell.task([
  'pkill node'
]));

// Run live node server.
gulp.task('nodemon', function () {
  nodemon({
    script: 'app.js',
    ext: 'js html',
    ignore: ['node_modules/'],
    env: { 'NODE_ENV': 'development' }
  });
});

// Compile jsx into Javascript.
gulp.task('browserify', function(){
  var b = browserify();
  b.transform(reactify); // Use the reactify transform.
  b.add('src/js/script.js');
  return b.bundle()
    .pipe(source('script.js'))
    .pipe(gulp.dest('public'));
});

gulp.task('watch', function() {
  gulp.watch('src/**/*.js*', ['browserify']);

  // TODO: Not sure why this is necessary.
  gulp.watch('src/**/*.scss', ['scss:watch']);
  gulp.watch('scss/**/*.scss', ['scss']);
});

// Compile Sass into css.
gulp.task('scss', function() {
  var processors = [
    autoprefixer({browsers: ['last 2 version']})
  ];

  gulp.src('scss/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(gulp.dest('public'));
});

gulp.task('scss:watch', function() {
  gulp.src('src/**/*.scss', {base: 'src'})
    .pipe(watch('src/**/*.scss', {base: 'src'}))
    .pipe(flatten())
    .pipe(gulp.dest('scss/_components'));
});

gulp.task('default', ['node:kill','nodemon', 'watch']);
