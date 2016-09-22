'use strict';

var gulp = require('gulp');
var gulpRename = require('gulp-rename');
var gulpUglify = require('gulp-uglify');
var webpack = require('webpack');
var webpackStream = require('webpack-stream');
var babel = require('babel-loader');


/**
 * Generate main bundle.
 * @returns {PassThrough} A source stream.
 */
function buildJS() {
  return gulp.src( './new_src/form-explainer.jsx' )
    .pipe(webpackStream({
      entry: ['babel-polyfill', './new_src/form-explainer.jsx'],
      output: {
        filename: 'form-explainer.js',
        library: ["FormExplainer"],
        libraryTarget: "var"
      },
      resolve: {
         extensions: ['', '.js', '.jsx', ]
      },
      module: {
        loaders: [{
          test: /\.jsx?$/,
          exclude: /(node_modules)/,
          loader: 'babel',
          query: {
            presets: ['es2015', 'stage-0', 'react'],
            plugins: [
              'transform-runtime'
            ]
          }
        }],
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
        })
      ]
    }))
    .pipe( gulpUglify() )
    .pipe(gulpRename('form-explainer.min.js'))
    .pipe(gulp.dest( 'dist/' ))
}



function buildCompiledJS() {
  return gulp.src( './src/js/render-form-explainer.jsx' )
    .pipe(webpackStream({
      entry: ['babel-polyfill', './src/js/render-form-explainer.jsx'],
      output: {
        filename: 'render-form-explainer.js',
        library: ["FormExplainer"],
        libraryTarget: "var"
      },
      resolve: {
         extensions: ['', '.js', '.jsx', ]
      },
      module: {
        loaders: [{
          test: /\.jsx?$/,
          exclude: /(node_modules)/,
          loader: 'babel',
          query: {
            presets: ['es2015', 'stage-0', 'react'],
            plugins: [
              'transform-runtime'
            ]
          }
        }],
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
        })
      ]
    }))
    .pipe( gulpUglify() )
    .pipe(gulpRename('render-form-explainer.min.js'))
    .pipe(gulp.dest( 'dist/' ))
}

function buildExample() {
  return gulp.src( './example/js/main.jsx' )
    .pipe(webpackStream({
      entry: './example/js/main.jsx',
      output: {
        filename: 'main.js'
      },
      resolve: {
         extensions: ['', '.js', '.jsx', ]
      },
      module: {
        loaders: [{
          test: /\.jsx?$/,
          exclude: /(node_modules)/,
          loader: 'babel',
          query: {
            presets: ['es2015', 'stage-0', 'react'],
          }
        }],
      }
    }))
    .pipe( gulpUglify() )
    .pipe(gulpRename('main.min.js'))
    .pipe(gulp.dest( 'example/dist/' ))
}

gulp.task( 'buildJS', buildJS );
gulp.task( 'buildCompiledJS', buildCompiledJS );

gulp.task( 'scripts', ['buildJS', 'buildCompiledJS'] );