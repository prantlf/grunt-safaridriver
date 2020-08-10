module.exports = function (grunt) {
  const coverage = grunt.option('coverage')
  const alternativePort = '9517'

  grunt.initConfig({
    safaridriver: {
      quiet: {},
      verbose: { verbose: true, args: [`--port=${alternativePort}`] },
      otherPort: { port: +alternativePort, findAvailablePort: true },
      fail: { args: ['--invalid'] }
    },

    standard: {
      all: {
        src: [
          'Gruntfile.js',
          'tasks/**/*.js',
          '<%= nodeunit.started %>',
          '<%= nodeunit.stopped %>'
        ]
      }
    },

    instrument: {
      files: 'tasks/**/*.js',
      options: {
        lazy: true,
        basePath: 'coverage/'
      }
    },

    storeCoverage: {
      options: { dir: 'coverage' }
    },

    makeReport: {
      src: 'coverage/coverage.json',
      options: {
        type: 'lcov',
        dir: 'coverage',
        print: 'detail'
      }
    },

    nodeunit: {
      started: ['test/started.js'],
      stopped: ['test/stopped.js']
    }
  })

  grunt.loadNpmTasks('grunt-contrib-nodeunit')
  grunt.loadNpmTasks('grunt-istanbul')
  grunt.loadNpmTasks('grunt-standard')
  grunt.loadTasks(coverage ? 'coverage/tasks' : 'tasks')

  process.env.SAFARIDRIVER_PORT = undefined
  grunt.registerTask('switchPort', 'Grunt task switching the safaridriver port.', function () {
    process.env.SAFARIDRIVER_PORT = alternativePort
  })

  let test = [
    'standard', 'nodeunit:stopped', 'safaridriver:quiet:start',
    'nodeunit:started', 'safaridriver:quiet:stop',
    'nodeunit:stopped', 'safaridriver:verbose:start', 'switchPort',
    'nodeunit:started', 'safaridriver:verbose:stop', 'nodeunit:stopped',
    'safaridriver:otherPort:start', 'nodeunit:started'
  ]
  if (coverage) test = test.concat(['storeCoverage', 'makeReport'])
  grunt.registerTask('default', test)
}
