/*
 * grunt-standard-version
 * https://github.com/armel22/grunt-standard-version
 *
 * Copyright (c) 2018 Armel Siewe
 * Licensed under the MIT license.
 */

'use strict';

var standardVersion = require('standard-version');
var DEFAULT_OPTIONS = {
  infile: 'CHANGELOG.md',
  message: 'chore(release): %s',
  firstRelease: false,
  sign: false,
  noVerify: false,
  commitAll: false,
  silent: false,
  tagPrefix: 'v',
  scripts: {},
  skip: {},
  dryRun: false,
  files: []
};

module.exports = function(grunt) {

  grunt.registerMultiTask('standard_version', 'bump your package version and generate update CHANGELOG', function() {
      var done = this.async();
      var options = this.options(DEFAULT_OPTIONS);
  
      standardVersion(options, function (err) {
        if(err) {
            grunt.log.error('standard-version failed with message: ' + err.message);
        }
        done();
      });
  });
};
