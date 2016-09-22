var gulp = require( 'gulp' );
var plugins = require( 'gulp-load-plugins' )();
var globAll = require( 'glob-all' );


/**
 * Process modern CSS.
 * @returns {PassThrough} A source stream.
 */
function stylesModern() {
  return gulp.src( './src/css/main.less' )
    .pipe( plugins.sourcemaps.init() )
    .pipe( plugins.less( {
      compress: true
    } ) )
    .pipe( plugins.autoprefixer( {
      browsers: [ 'last 2 version',
                  'not ie <= 8',
                  'android 4',
                  'BlackBerry 7',
                  'BlackBerry 10' ]
    } ) )
    .pipe( plugins.sourcemaps.write( '.' ) )
    .pipe( gulp.dest( 'dist' ) );
}


/**
 * Process Capital Framework CSS.
 * @returns {PassThrough} A source stream.
 */
function stylesCF() {
  return gulp.src( './src/css/cf.less' )
    .pipe( plugins.sourcemaps.init() )
    .pipe( plugins.less( {
      paths:  globAll.sync( [
        'node_modules/capital-framework/**'
      ] ),
      compress: true
    } ) )
    .pipe( plugins.autoprefixer( {
      browsers: [ 'last 2 version',
                  'not ie <= 8',
                  'android 4',
                  'BlackBerry 7',
                  'BlackBerry 10' ]
    } ) )
    .pipe( plugins.sourcemaps.write( '.' ) )
    .pipe( gulp.dest( 'dist' ) );
}

gulp.task( 'styles:modern', stylesModern );
gulp.task( 'styles:cf', stylesCF );


gulp.task( 'styles', [
  'styles:modern',
  'styles:cf'
] );