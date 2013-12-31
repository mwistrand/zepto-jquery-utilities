module.exports = function(grunt) {
	'use strict';

	var nameBase = ('base,query,styles,slide,detach,render,cacheMixin,loaderMixin').split(','),
		files = nameBase.map(function(name) {
			return 'src/js/u$.' + name + '.js';
		});

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			src: ['gruntfile.js', 'src/js/**/*.js', 'test/spec/**/*.js'],
			options: {
				expr: true
			}
		},

		uglify: {
			build: {
				files: {
					'u$.js': files
				}
			}
		},

		watch: {
			js: {
				files: files,
				tasks: ['jshint', 'uglify']
			}
		}
	});

	grunt.registerTask('default', ['jshint', 'uglify']);
};