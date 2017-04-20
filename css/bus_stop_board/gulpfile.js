var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-clean-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    htmlmin = require('gulp-htmlmin'),
    del = require('del');

/*压缩html*/
gulp.task('htmls', function() {
    return gulp.src('./src/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('./dist'))
        .pipe(notify({ message: 'htmls task complete' }));
});

/*编译sass、自动添加css前缀和压缩*/
gulp.task('styles', function() {
    return sass('./src/css/**/*.scss')
        .on('error', sass.logError)
        .pipe(autoprefixer({ browsers: ['last 2 version'] }))
        .pipe(gulp.dest('./dist/css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(gulp.dest('./dist/css'))
        .pipe(notify({ message: 'styles task complete' }));
});

/*js代码校验、合并和压缩*/
gulp.task('scripts', function() {
    return gulp.src(['./src/js/jquery.min.js', './src/js/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('./dist/js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'))
        .pipe(notify({ message: 'scripts task complete' }));
});

/*压缩图片*/
gulp.task('images', function() {
    return gulp.src('./src/img/**/*')
        .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
        .pipe(gulp.dest('./dist/img'));
    //.pipe(notify({ message: 'images task complete' }));
});

//clean
gulp.task('clean', function() {
    return del(['./dist/css', './dist/js', './dist/img']);
});

//default task
gulp.task('default', ['clean'], function() {
    gulp.start('htmls', 'styles', 'scripts', 'images');
});

//watch
gulp.task('watch', function() {
    //watch .html files
    gulp.watch('./src/*.html',['htmls']);
    //watch .css files
    gulp.watch('./src/css/**/*.scss', ['styles']);
    // watch .js files
    gulp.watch('./src/js/**/*.js', ['scripts']);
    // watch image files
    gulp.watch('./src/img/**/*', ['images']);
    // create LiveReload server
    livereload.listen();
    // watch any files in dist/, reload on change
    gulp.watch(['dist/**']).on('change', livereload.changed);
});
