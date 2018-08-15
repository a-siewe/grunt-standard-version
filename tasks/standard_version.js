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
  push: true,
  pushTo: 'upstream'
};

module.exports = function (grunt) {

  grunt.registerMultiTask('standard_version', 'bump your package version and generate update CHANGELOG', function () {
    var opt = this.options(DEFAULT_OPTIONS);
    var previousVersion = require(pkg).version;

    function push() {
      var cmd;
      if (opt.push) {
      if (opt.push === 'git' && !opt.pushTo) {
        cmd = 'git push';
        if (dryRun) {
          grunt.log.ok(cmd);
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

        return;
      }

      exec('git rev-parse --abbrev-ref HEAD', function (err, stdout, stderr) {
        if (err) {
          grunt.fatal('Can not get ref for HEAD:\n' + stderr);
        }

        cmd = [];

        if (opt.push === true || opt.push === 'branch') {
          cmd.push('git push ' + opt.pushTo + ' ' + stdout.trim());
        }

        if (opt.push === true || opt.push === 'tag') {
          exec('git describe --tags', function (err, stdout, stderr) {
            if (err) {
              grunt.fatal('Can not get the most recent tag from git' + stderr);
            }
            cmd.push('git push ' + opt.pushTo + ' ' + stdout.trim());
          });
        }

        cmd = cmd.join('&&');

        if (dryRun) {
          grunt.log.ok(cmd);
        } else {
          exec(cmd, function (err, stdout, stderr) {
            if (err) {
              grunt.fatal('Can not push to ' + opt.pushTo + ':\n  ' + stderr);
            }

            grunt.log.ok('Pushed to ' + opt.pushTo);
          });
        }
      });
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
        var logMsg = 'Version bumped to ' + newVersion + ' (in ' + file + ')';
        if (!opt.dryRun) {
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
