# grunt-standard-version

> grunt.js plugin with automatic versioning and CHANGELOG generation using standard-version

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-standard-version --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-standard-version');
```

## The "standard_version" task

### Overview
In your project's Gruntfile, add a section named `standard_version` to the data object passed into `grunt.initConfig()`. The options(and defaults) are:

```js
grunt.initConfig({
  standard_version: {
    options: {
      releaseAs:  '',
      prerelease: '',
      infile: 'CHANGELOG.md',
      message: 'chore(release): %s',
      firstRelease: false,
      sign: false
      noVerify: false,
      commitAll: false,
      silent: false,
      tagPrefix: 'v',
      scripts: {},
      skip: {},
      dryRun: false
    },
  },
});
```

### Options

#### options.releaseAs
Type: `String`
Default value: `undefined`

To forgo the automated version bump use `releaseAs` with the argument `major`, `minor` or `patch`:

Suppose the last version of your code is `1.0.0`, you've only landed `fix:` commits, but
you would like your next release to be a `minor`. Simply do:

```js
grunt.initConfig({
  standard_version: {
    options: {
      releaseAs: 'minor'
    },
  },
});
```

you will get version `1.1.0` rather than the auto generated version `1.0.1`.

#### options.prerelease
Type: `Boolean|String`
Default value: `false`

Use this option to generate pre-releases:

Suppose the last version of your code is `1.0.0`, and your code to be committed has patched changes: with:

```js
grunt.initConfig({
  standard_version: {
    options: {
      prerelease: true
    },
  },
});
```
you will get version `1.0.1-0`.

If you want to name the pre-release, you specify the name via `prerelease: <name>`.

For example, suppose your pre-release should contain the `alpha` prefix:

```js
grunt.initConfig({
  standard_version: {
    options: {
      prerelease: alpha
    },
  },
});
```

this will tag the version `1.0.1-alpha.0`

#### options.infile
Type: `String`
Default value: `CHANGELOG.md`

Read the CHANGELOG from this file

#### options.message
Type: `String`
Default value: `chore(release): %s`

Commit message, replaces %s with new version

#### options.firstRelease
Type: `Boolean`
Default value: `false`

To generate your changelog for your first release, simply do:

```js
grunt.initConfig({
  standard_version: {
    options: {
      firstRelease: true
    },
  },
});
```

This will tag a release **without bumping the version in package.json (_et al._)**.

When ready, push the git tag and `npm publish` your first release. \o/

#### options.sign
Type: `String`
Default value: `'.'`

If you have your GPG key set up, add this option.

#### options.noVerify
Type: `Boolean`
Default value: `false`

If you use git hooks, like pre-commit, to test your code before committing, you can prevent hooks from being verified during the commit step by passing this option:


#### options.commitAll
Type: `Boolean`
Default value: `false`

Commit all staged changes, not just files affected by standard-version

#### options.silent
Type: `Boolean`
Default value: `false`

Don't print logs and errors

#### options.tagPrefix
Type: `String`
Default value: `'.'`

#### options.scripts
Type: `Object`
Default value: `{}`

`grunt-standard-version` supports lifecycle scripts. These allow you to execute your
own supplementary commands during the release. The following
hooks are available and execute in the order documented:

* `prerelease`: executed before anything happens. If the `prerelease` script returns a
  non-zero exit code, versioning will be aborted, but it has no other effect on the
  process.
* `prebump`/`postbump`: executed before and after the version is bumped. If the `prebump`
  script returns a version #, it will be used rather than
  the version calculated by `standard-version`.
* `prechangelog`/`postchangelog`: executes before and after the CHANGELOG is generated.
* `precommit`/`postcommit`: called before and after the commit step.
* `pretag`/`posttag`: called before and after the tagging step.

Simply add the following to your taks's option to configure lifecycle scripts:

```js
grunt.initConfig({
  standard_version: {
    options: {
      prebump: "echo 9.9.9"
    },
  },
});
```


As an example to change from using GitHub to track your items to using your projects Jira use a 
`postchangelog` script to replace the url fragment containing 'https://github.com/`myproject`/issues/'
with a link to your Jira - assuming you have already installed [replace](https://www.npmjs.com/package/replace)

```js
grunt.initConfig({
  standard_version: {
    options: {
      postchangelog: "replace 'https://github.com/myproject/issues/' 'https://myjira/browse/' CHANGELOG.md"
    },
  },
});
```

#### options.skip
Type: `Object`
Default value: `{}`

You can skip any of the lifecycle steps (`bump`, `changelog`, `commit`, `tag`), by using this option:

```js
grunt.initConfig({
  standard_version: {
    options: {
      skip: {
      changelog: true
    }
    },
  },
});
```

#### options.dryRun
Type: `Boolean`
Default value: `false`

 Allow you to see what commands would be run, without committing to git or updating files.

### Usage Examples

_TODO_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
