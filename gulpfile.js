var gulp = require('gulp');
var concat = require('gulp-concat');
var flatten = require('gulp-flatten');
var inject = require('gulp-inject');
var strip = require('gulp-strip-comments');
var webserver = require('gulp-webserver');

function _transform (filepath, file, i, length) {
    return (filepath.endsWith('js')) ? '<script src="' + filepath.substring(filepath.lastIndexOf('/') + 1) + '"></script>' : '<link rel="stylesheet" type="text/css" href="' + filepath.substring((filepath.lastIndexOf('/') + 1)) + '" />';
};

gulp.task('compile', [], function () {
    var injectConfig = { transform: _transform };

    var mainHtmlComponent = 'src/html/index.html';

    var jsComponents = ['src/bower_components/**/dist/*.min.js', 'src/bower_components/**/dist/js/*.min.js', 'src/js/*.js', 'src/js/**/*.js', '!src/bower_components/bootstrap/dist/css/bootstrap-theme.min.css'];
    var htmlComponents = [mainHtmlComponent, 'src/html/**/*.html'];
    var cssComponents = ['src/bower_components/**/dist/css/*.min.css', 'src/css/*.css'];

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

gulp.task('webserver', [], function () {
    gulp.src('dist').pipe(webserver({
        livereload: true,
        port: 9003
    }));
});

gulp.task('watch', ['build', 'webserver'], function () {
    return gulp.watch(['src/html/*.html', 'src/html/**/*.html'], ['build']);
});

gulp.task('build', ['compile'], function () {
    return console.log('build complete');
});