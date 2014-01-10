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

		concat: {
			js: {
				src: files,
				dest: 'u$.uncompressed.js'
			}
		},

		uglify: {
			build: {
				files: {
					'u$.js': 'u$.uncompressed.js'
				}
			}
		},

		watch: {
			js: {
				files: files,
				tasks: ['jshint', 'concat', 'uglify']
			}
		}
	});

	grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
};