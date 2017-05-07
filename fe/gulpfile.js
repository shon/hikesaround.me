var gulp            = require('gulp'),
    sass            = require('gulp-sass'),
    jade            = require('gulp-jade'),
    uglify          = require('gulp-uglify'),
    autoprefixer    = require('gulp-autoprefixer'),
    usemin          = require('gulp-usemin'),
    uglify          = require('gulp-uglify'),
    minifyHtml      = require('gulp-minify-html'),
    minifyCss       = require('gulp-minify-css'),
    rev             = require('gulp-rev'),
    del             = require('del'),
    plumber         = require('gulp-plumber');

// bug override
//require('events').EventEmitter.prototype._maxListeners = 30;

var src_base = './src/';
var dist_base = './dist/';
var bower_base = dist_base + 'bower_components/';
var cdn_base = './cdn/';
var paths = {
    css: { src: src_base + 'scss/*.scss',
           dest: dist_base + 'css/' }
};

// scss to css
gulp.task('sass', function () {
    return gulp.src(src_base + 'scss/*.scss')
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(sass())
        .pipe(autoprefixer({'browsers': 'last 2 versions'}))
        .pipe(gulp.dest(dist_base + 'css'));
});

gulp.task('uglify', function () {
    return gulp.src(src_base + 'js/**/*.js')
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(uglify({mangle: false}))
        .pipe(gulp.dest(src_base + 'jsmin'))
        .pipe(gulp.dest(dist_base + 'js'));
        //.pipe(gulp.dest(cdn_base + 'js'));
});
        
// jade to html
gulp.task('jade', ['sass', 'uglify'], function () {
    var jade_opts = {'pretty': true};
    return gulp.src(src_base + '*.jade')
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(jade(jade_opts))
        .pipe(gulp.dest(dist_base));
});

// cdn
gulp.task('usemin', function() {
    return gulp.src([dist_base + '*.html'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(usemin({
            css: [rev()],
            html: [],
            js: [rev()]
        }))
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(gulp.dest(cdn_base));
});

gulp.task('usemin-dist', function() {
    return gulp.src([dist_base + '*.html'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(usemin({
            css: [minifyCss(), rev()],
            html: [minifyHtml({empty: true})],
            js: [uglify({mangle: false}), rev()]
        }))
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(gulp.dest(cdn_base))
        .pipe(rev.manifest())
        .pipe(gulp.dest(cdn_base));
});


// copy
gulp.task('copyfiles', function() {
    return gulp.src([bower_base + 'foundation-icon-fonts/foundation-icons.ttf'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(gulp.dest(cdn_base + 'css/'));
});

gulp.task('copyimages', function() {
    return gulp.src(src_base+'img/*.*')
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(gulp.dest(dist_base +'img/'));
});


gulp.task('clean', function(cb) {
    del.sync([src_base+'jsmin', dist_base+'js', dist_base+'css', dist_base+'*.html', cdn_base+'js', cdn_base+'css', cdn_base+'*.html']);
    cb();
});


/*
* Use gulp build to test locally
*/
gulp.task('build', function() {
    return gulp.start(['copyfiles', 'copyimages', 'jade', 'usemin']);
});
