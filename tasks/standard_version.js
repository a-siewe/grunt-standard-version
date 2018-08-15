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
  push: true,
  pushTo: 'origin'
};

module.exports = function (grunt) {

  grunt.registerMultiTask('standard_version', 'bump your package version and generate update CHANGELOG', function () {
    var done = this.async();
    var opt = this.options(DEFAULT_OPTIONS);

    function push() {
      var pkgVersion = require(pkg).version;
      var cmd;

      if (opt.push) {
        if (opt.push === 'git' && !opt.pushTo) {
          cmd = 'git push';
          if (opt.dryRun) {
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
            var tagName = opt.tagPrefix + pkgVersion;
            cmd.push('git push ' + opt.pushTo + ' ' + tagName);
          }

          cmd = cmd.join(' && ');
          if (opt.dryRun) {
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

    function handleError(err) {
      grunt.log.error('standard-version failed with message: ' + err.message);
    }

    standardVersion(opt)
      .then(push)
      .catch(handleError)
  });
};
