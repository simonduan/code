var webpack = require("webpack-stream");
var gulp = require("gulp");
var concat = require("gulp-concat");
var merge = require("merge2");

gulp.task('bundle', function () {
	// 用webpack插件打包js
    var js = gulp.src(__dirname + '/javascript/main.js')
	    .pipe(webpack({
		    output: {
			    filename: 'script.js',
			    pathinfo: true
		    }
	    }))
	    .pipe(gulp.dest(__dirname + '/js/'));

	var lib = gulp.src(__dirname + '/javascript/lib/*.js')
		// 用gulp-concat插件把js简单地拼起来
		.pipe(concat('lib.js'))
		.pipe(gulp.dest(__dirname + '/js/'));

	return merge(lib, js)
});

gulp.task('default', ['bundle'], function () {
    gulp.watch(__dirname + '/javascript/**/*.js', ['bundle']);
});