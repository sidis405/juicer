var elixir = require('laravel-elixir');
var fs = require('fs');
var del = require('del');
var gulp = require('gulp');
var task = elixir.Task;

require('laravel-elixir-jade');
require('elixir-juice');
require('laravel-elixir-imagemin');

elixir.config.assetsPath = 'src';
elixir.config.publicPath = 'dist';
elixir.config.viewPath = './';

elixir.extend('prioritiseJquery', function(message) {

        new task('prioritiseJquery', function() {

            var jquery = "src/assets/vendor/jquery";
            
            if (fs.lstatSync(jquery).isDirectory()) {

                fs.rename(jquery, "src/assets/vendor/--jquery");

            }

    });

});

elixir(function(mix) {
    mix.sass('app.scss').scripts('app.js').copy('bower_components/**/fonts', 'dist/fonts' );

    mix.jade({
        baseDir: './',
        src: '/src/jade/',
        dest: '/dist/',
        search: ['*.jade'],
        blade: false,
        html: true,
    });

    del.sync('src/assets/vendor');

    mix.bower({
        src: 'bower_components/',
        output: 'src/assets/vendor'
    }).prioritiseJquery();

    mix.scripts('../assets/vendor/**/*.js', 'dist/js/vendor.js').styles('../assets/vendor/**/*.css', 'dist/css/vendor.css').imagemin("/img", "dist/img/");

    mix.browserSync({
        files: ['**/*.html', '**/*.jade', 'dist/js/**/*.js', 'dist/css/**/*.css'],
        proxy: undefined,
        server: {
            baseDir: "./dist"
        }
    });
});
