/*
 * grunt-standard-version
 * https://github.com/armel22/grunt-standard-version
 *
 * Copyright (c) 2018 Armel Siewe
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },


    clean: {
      tests: ['tmp']
    },

    standard_version: {
      options: {
        dryRun: true,
      },
      release: {
        options: {
          skip: {
            changelog: true
          }
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'standard_version', 'nodeunit']);

  grunt.registerTask('default', ['jshint', 'test']);
};
