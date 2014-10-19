/* jshint strict:false, node:true */

var gulp = require('gulp'),
    browserify = require('browserify'),
    jshint = require('gulp-jshint'),
    Uglify = require('uglify-js'),
    karma = require('karma').server,
    path = require('path'),
    fs = require('fs')

var file = './whitespace.js',
    minFile = './whitespace.min.js'

gulp.task('browserify', function () {
  return browserify(file, { standalone: 'collapse' })
    .bundle()
    .pipe(fs.createWriteStream('whitespace.min.js'))
})

gulp.task('minify', ['browserify'], function (done) {
  fs.writeFile(minFile, Uglify.minify(minFile).code, done)
})

gulp.task('lint', function () {
  gulp.src(file)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
})

gulp.task('test', ['minify'], function () {
  console.log('To run the tests, open "test.html" in your browser.')
})

gulp.task('watch', ['lint', 'minify'], function () {
  var watcher = gulp.watch(file, ['lint', 'minify'])

  function log (e) {
    var folder = new RegExp(__dirname + '/'),
        path = e.path.replace(folder, '')

    console.log('File ' + path + ' was ' + e.type + ', compiling...')
  }

  watcher.on('change', log)
})

gulp.task('default', ['lint', 'minify'])
