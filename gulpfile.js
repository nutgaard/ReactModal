var gulp = require('gulp');
var browserify = require('browserify');
var reactify = require('reactify');
var watchify = require('watchify');
var notify = require('gulp-notify');
var source = require('vinyl-source-stream');
var globalShim = require('browserify-global-shim');

var scriptDir = './src';
var buildDir = './dist';

function build(file, watch, debug) {
    var props = watchify.args;
    props.entries = [scriptDir + '/' + file];
    props.debug = debug;
    props.standalone = 'Modal';

    globalShim.configure({
        'react': 'react'
    });

    var bundler = watch ? watchify(browserify(props)) : browserify(props);
    bundler.transform(reactify);
    bundler.transform(globalShim);

    function rebundle() {
        var stream = bundler.ignore('react').bundle();
        return stream
            .on('error', notify.onError({
                title: 'Compile Error',
                message: '<%= error.message %>'
            }))
            .pipe(source(file))
            .pipe(gulp.dest(buildDir));
    }

    bundler.on('update', function () {
        var start = new Date();
        console.log('Rebundling...');
        rebundle();
        console.log('Rebundled in ' + (new Date() - start) + 'ms');
    });
    return rebundle();
}

gulp.task('dev', function () {
    return build('index.js', true, true);
})

gulp.task('default', function () {
    return build('index.js', false, false);
});