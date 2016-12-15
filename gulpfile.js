var gulp = require('gulp');
var concat = require('gulp-concat');
var flatten = require('gulp-flatten');
var inject = require('gulp-inject');
var imagemin = require('gulp-imagemin');
var rename = require('gulp-rename');
var strip = require('gulp-strip-comments');
var webserver = require('gulp-webserver');

function _transform (filepath, file, i, length) {
    return (filepath.endsWith('js')) ? '<script src="' + filepath.substring(filepath.lastIndexOf('/') + 1) + '"></script>' : '<link rel="stylesheet" type="text/css" href="' + filepath.substring((filepath.lastIndexOf('/') + 1)) + '" />';
};

function _toLower (file) {
    file.basename = file.basename.toLowerCase();
};

gulp.task('compile', [], function () {
    var injectConfig = { transform: _transform };

    var mainHtmlComponent = 'src/html/index.html';

    var jsComponents = ['src/bower_components/**/dist/*.min.js', 'src/bower_components/**/dist/js/*.min.js', 'src/bower_components/**/*.min.js', 'src/js/*.js', 'src/js/**/*.js'];
    var htmlComponents = [mainHtmlComponent, 'src/html/**/*.html'];
    var cssComponents = ['!src/bower_components/bootstrap/dist/css/bootstrap-theme.min.css', 'src/bower_components/**/dist/css/*.min.css', 'src/bower_components/**/css/*.min.css', 'src/css/*.css'];
    var fonts = ['src/fonts/*.*ttf'];
    var images = ['src/images/*.jpg', 'src/images/*.jpeg'];
    var bowerFonts = ['src/bower_components/**/fonts/*.ttf'];

    gulp.src(htmlComponents).pipe(flatten()).pipe(gulp.dest('dist/app'));

    gulp.src(fonts).pipe(flatten()).pipe(rename(_toLower)).pipe(gulp.dest('dist/app'));
    gulp.src(bowerFonts).pipe(flatten()).pipe(rename(_toLower)).pipe(gulp.dest('dist/fonts'));

    gulp.src(images).pipe(imagemin()).pipe(gulp.dest('dist/app'));

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
    return gulp.watch(['src/html/*.html', 'src/html/**/*.html', 'src/js/*.js', 'src/js/**/*.js', 'src/css/*.css', 'src/fonts/*.ttf', 'src/images/*.jpg', 'src/images/*.jpeg'], ['build']);
});

gulp.task('build', ['compile'], function () {
    return console.log('build complete');
});