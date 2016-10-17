var webpack = require("webpack-stream");
var gulp = require("gulp");

gulp.task('bundle', function () {
    return gulp.src(__dirname + '/javascript/main.js')
	    .pipe(webpack({
		    output: {
			    filename: 'script.js',
			    pathinfo: true
		    }
	    }))
	    .pipe(gulp.dest(__dirname + '/js/'));
});

gulp.task('default', ['bundle'], function () {
    gulp.watch(__dirname + '/javascript/**/*.js', ['bundle']);
});