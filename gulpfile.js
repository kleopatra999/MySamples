var gulp = require('gulp');
var react = require('gulp-react');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var livereload = require('gulp-livereload');
var filter = require('gulp-filter');
var plumber = require('gulp-plumber');
var watch = require('gulp-watch');

gulp.task('watch', function () {
    var project = gulp.env.project;
    watch({glob:[project + '/*.jsx']}, function(files) {
        files.pipe(filter('*.jsx'))
            .pipe(plumber())
            .pipe(react())
            .pipe(gulp.dest(project));
    });

    watch({glob:[project + '/*.js', '!'+project+'/bundle.js']}, function(files) {
        var bundleStream = browserify('./'+project+'/components.js').bundle();
        bundleStream.pipe(source('bundle.js'))
            .pipe(gulp.dest('./'+project));
    });

    watch({glob:[project+'/bundle.js', project+'/*.css', project+'/*.html']}, function(files) {
        files.pipe(livereload());
    });
});