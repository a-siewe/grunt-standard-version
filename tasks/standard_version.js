/*
 * grunt-standard-version
 * https://github.com/armel22/grunt-standard-version
 *
 * Copyright (c) 2018 Armel Siewe
 * Licensed under the MIT license.
 */

'use strict';
var exec = require('child_process').exec;
var standardVersion = require('standard-version');
var path = require('path');
var pkg = path.resolve(process.cwd(), 'package.json');

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
  files: [],
  push: false
};

module.exports = function (grunt) {

  grunt.registerMultiTask('standard_version', 'bump your package version and generate update CHANGELOG', function () {
    var done = this.async();
    var opt = this.options(DEFAULT_OPTIONS);
    var previousVersion = require(pkg).version;

    function push() {
      var cmd = 'git push';
      if (opt.push) {
        if (opt.dryRun) {
          grunt.log.ok(cmd);
          return
        } else {
          exec(cmd, function (err, stdout, stderr) {
            if (err) {
              grunt.fatal(
                'Can not push to the git default settings:\n ' + stderr
              );
            }
            grunt.log.ok('Pushed to the git default settings');
          });
        }
      }
    }


    /**
     * standard-version pumps by default package.json, bower.json, package-lock.json
     * this function pumps additional files specify in the option files.
     */
    function bumpAdditionalFiles() {

      var VERSION_REGEXP = new RegExp(previousVersion, 'gi');
      var newVersion = require(pkg).version;
      opt.files.forEach(function (element) {
        var file = path.resolve(process.cwd(), element);
        var content = grunt.file.read(file).replace(VERSION_REGEXP, function (match, prefix, parsedVersion, namedPre, noNamePre, suffix) {
          return prefix + newVersion + (suffix || '');
        })
        var logMsg = 'Version bumped to ' + newVersion +  ' (in ' + file + ')';
        if(!opt.dryRun) {
          grunt.file.write(file, content);
        }
        grunt.log.ok(logMsg);
      });
    }


    function handleError(err) {
      grunt.log.error('standard-version failed with message: ' + err.message);
    }

    standardVersion(opt)
      .then(bumpAdditionalFiles)
      .then(push)
      .catch(handleError)
  });
};
