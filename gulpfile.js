var gulp = require('gulp');
var concat = require('gulp-concat');
var flatten = require('gulp-flatten');
var inject = require('gulp-inject');
var strip = require('gulp-strip-comments');

function _transform (filepath, file, i, length) {
    return (filepath.endsWith('js')) ? '<script src="' + filepath.substring(filepath.lastIndexOf('/') + 1) + '"></script>' : '<link rel="stylesheet" type="text/css" href="' + filepath.substring((filepath.lastIndexOf('/') + 1)) + '" />';
};

gulp.task('compile', [], function () {
    var injectConfig = { transform: _transform };

    var mainHtmlComponent = 'src/html/index.html';

    var jsComponents = ['src/js/*.js', 'src/js/**/*.js'];
    var htmlComponents = [mainHtmlComponent, 'src/html/**/*.html'];
    var cssComponents = ['src/css/*.css'];

    gulp.src(htmlComponents).pipe(flatten()).pipe(gulp.dest('dist/app'));

    return gulp.src(mainHtmlComponent)
            .pipe(inject(
                gulp.src(jsComponents)
                .pipe(concat('app.js'))
                .pipe(gulp.dest('dist/app')), injectConfig)
            )
            .pipe(inject(
                gulp.src(cssComponents)
                .pipe(concat('app.css'))
                .pipe(gulp.dest('dist/app')), injectConfig)
            )
            .pipe(strip())
            .pipe(gulp.dest('dist/app'));
});

gulp.task('build', ['compile'], function () {
    return console.log('build complete');
});