module.exports = function(grunt) {
	'use strict';

	var nameBase = ('base,query,styles,slide,detach,render,cacheMixin,loaderMixin').split(','),
		files = nameBase.map(function(name) {
			return 'src/js/u$.' + name + '.js';
		});

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		karma: {
			unit: {
				configFile: 'karma.conf.js',
				background: true
			}
		},

		uglify: {
			build: {
				files: {
					'u$.js': files
				}
			}
		},

		lint: {
      files: ['gruntfile.js', 'src/js/*.js', 'test/spec/*.js']
    },

    jshint: {
      options: {
        expr: true
      },

      all: ['gruntfile.js', 'src/js/*.js', 'test/spec/*.js']
    },

		watch: {
			js: {
				files: files,
				tasks: ['jshint', 'uglify']
			},

			karma: {
				files: ['src/js/*.js', 'test/**/*.js'],
				tasks: ['karma:unit:run']
			}
		}
	});

	grunt.registerTask('default', []);
};