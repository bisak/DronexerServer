var gulp = require('gulp')
var replace = require('gulp-replace-task')

gulp.task('switchProduction', function () {
  gulp.src('config/environments/index.js', { base: './' })
    .pipe(replace({
      patterns: [
        {
          match: 'production: false',
          replacement: 'production: true'
        }
      ],
      usePrefix: false
    }))
    .pipe(gulp.dest('./'))
})

gulp.task('switchDevelopment', function () {
  gulp.src('config/environments/index.js', { base: './' })
    .pipe(replace({
      patterns: [
        {
          match: 'production: true',
          replacement: 'production: false'
        }
      ],
      usePrefix: false
    }))
    .pipe(gulp.dest('./'))
})
