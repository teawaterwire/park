var gulp = require('gulp')
var browserSync = require('browser-sync')
var webpack = require('gulp-webpack')

// Webpack config
gulp.task('webpack', function () {
  return gulp.src('app/components/search-results.js')
    .pipe(webpack({
      output: {filename: 'index.js'},
      module: {
        loaders: [
          {test: /\.js/, exclude: /node_modules/, loader: 'babel-loader'}
        ]
      }
    }))
    .pipe(gulp.dest('app/'))
})

// Setting up browserSync and watchers
gulp.task('serve', function () {
  browserSync({
    server: {
      baseDir: 'app',
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  })
  gulp.watch(['index.html', 'index.js'], {cwd: 'app'}, browserSync.reload)
  gulp.watch('app/components/*.js', ['webpack'])
})

// Ya know
gulp.task('default', ['webpack', 'serve'])
