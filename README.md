# grunt-safaridriver
[![NPM version](https://badge.fury.io/js/grunt-safaridriver.png)](http://badge.fury.io/js/grunt-safaridriver)
[![codecov](https://codecov.io/gh/prantlf/grunt-safaridriver/branch/master/graph/badge.svg)](https://codecov.io/gh/prantlf/grunt-safaridriver)
[![codebeat badge](https://codebeat.co/badges/1777e780-ea70-4ebd-8f5a-df278c5761d6)](https://codebeat.co/projects/github-com-prantlf-grunt-safaridriver-master)
[![Dependency Status](https://david-dm.org/prantlf/grunt-safaridriver.svg)](https://david-dm.org/prantlf/grunt-safaridriver)
[![devDependency Status](https://david-dm.org/prantlf/grunt-safaridriver/dev-status.svg)](https://david-dm.org/prantlf/grunt-safaridriver#info=devDependencies)
[![peerDependency Status](https://david-dm.org/prantlf/grunt-safaridriver/peer-status.svg)](https://david-dm.org/prantlf/grunt-safaridriver#info=peerDependencies)

[![NPM Downloads](https://nodei.co/npm/grunt-safaridriver.png?downloads=true&stars=true)](https://www.npmjs.com/package/grunt-safaridriver)

Controls Safari on OSX using the WebDriver interface via safaridriver without Selenium.

If you use a modern test driver like [webdriverio], you will not need [Selenium] to run the tests, because the browser driver itself implements the [WebDriver] interface. This module provides a [Grunt] multi-task for installing, starting and stopping the [safaridriver] executable. You take care of maintaining the reasonably recent vewsion of OSX and Safari. Starting with Safari 10 on OS X El Capitan and macOS Sierra, Safari comes bundled with a new driver implementation that's maintained by the Web Developer Experience team at Apple. You might need to run `safaridriver --enable` to enable this feature.

This task, [grunt-chromedriver] and [grunt-geckodriver] can be used as a replacement for [grunt-selenium-standalone] for tasks like [grunt-html-dom-snapshot], to simplify the whole scenario by removing [Selenium] and [Java] from the requirements.

## Installation

You need [node >= 10][node], [npm] and [grunt >= 1.0.0][Grunt] installed and
your project build managed by a [Gruntfile]. If you have not used Grunt before,
be sure to check out the [Getting Started] guide, as it explains how to create
a Gruntfile as well as install and use Grunt plugins.  Once you are familiar
with that process, you may install this plugin with this command:

    npm install grunt-safaridriver --save-dev

## Configuration

Add the `safaridriver` entry with one or more tasks to the options of the
`grunt.initConfig` method in `Gruntfile.js`:

```js
grunt.initConfig({
  safaridriver: {
    default: {}
  }
});
```

Load the plugin:

```javascript
grunt.loadNpmTasks('grunt-safaridriver');
```

Add use the task to start and stop the browser driver before and after the tests:

```js
grunt.registerTask('default', ['safaridriver:default:start', ..., 'safaridriver:default:stop']);
```

### Options

Default task options support the most usual usage scenario:

```js
safaridriver: {
  default: {
    port: 4444,
    findAvailablePort: false,
    args: [],
    force: false
  }
}
```

#### port
Type: `Number`
Default value: `4444`

The port for the `safaridriver` to listen to. If `findAvailablePort` is set to
`true`, this port will be used to start the search for a free port with.

### findAvailablePort
Type: `Boolean`
Default value: `false`

If set to `true`, the value of `port` will be used to start the search for a
free port with.

### args
Type: `Array<String>`
Default value: `[]`

Command-line arguments for the `safaridriver` executable. Available ones:

    -p, --port  Port number the driver should use. If the server
                is already running, the port cannot be changed.
                If port 0 is specified, a default port will be used.
    --enable    Applies configuration changes so that subsequent WebDriver
                sessions will run without further authentication.
    --diagnose  Causes safaridriver to log diagnostic information for
                all sessions hosted by this instance. See the safaridriver(1)
                man page for more details about diagnostic logging.

### force
Type: `Boolean`
Default value: `false`

If set to `true`, it suppresses failures. Instead of making the Grunt fail,
the errors will be written only to the console.

### Events

If `findAvailablePort` is set to `true`, the actual chosen port can be read by:

```js
grunt.config.get(`safaridriver.<task-name>.port`)
```

As soon es the browser driver process starts listening, an event will be
triggered with the actually chosen port:

```js
grunt.event.on(`safaridriver.<task-name>.listening`, port => {...})
```

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding
style.  Add unit tests for any new or changed functionality. Lint and test
your code using Grunt.

## License

Copyright (c) 2020 Ferdinand Prantl

Licensed under the MIT license.

[node]: https://nodejs.org
[npm]: https://npmjs.org
[Grunt]: https://gruntjs.com
[Gruntfile]: https://gruntjs.com/sample-gruntfile
[Getting Gtarted]: https://github.com/gruntjs/grunt/wiki/Getting-started
[Selenium]: http://www.seleniumhq.org/download/
[safaridriver]: https://developer.apple.com/documentation/webkit/testing_with_webdriver_in_safari
[webdriverio]: http://webdriver.io/
[Java]: https://java.com/en/download/
[WebDriver]: https://www.w3.org/TR/webdriver/
[grunt-html-dom-snapshot]: https://github.com/prantlf/grunt-html-dom-snapshot#readme
[grunt-selenium-standalone]: https://github.com/zs-zs/grunt-selenium-standalone#readme
[grunt-chromedriver]: https://github.com/prantlf/grunt-chromedriver#readme
[grunt-geckodriver]: https://github.com/prantlf/grunt-geckodriver#readme
