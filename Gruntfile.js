module.exports = function (grunt) {
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

    nodeunit: {
      started: ['test/started.js'],
      stopped: ['test/stopped.js']
    }
  })

  grunt.loadNpmTasks('grunt-contrib-nodeunit')
  grunt.loadTasks('tasks')

  process.env.SAFARIDRIVER_PORT = undefined
  grunt.registerTask('switchPort', 'Grunt task switching the safaridriver port.', function () {
    process.env.SAFARIDRIVER_PORT = alternativePort
  })

  grunt.registerTask('default', [
    'nodeunit:stopped', 'safaridriver:quiet:start',
    'nodeunit:started', 'safaridriver:quiet:stop',
    'nodeunit:stopped', 'safaridriver:verbose:start', 'switchPort',
    'nodeunit:started', 'safaridriver:verbose:stop', 'nodeunit:stopped',
    'safaridriver:otherPort:start', 'nodeunit:started'
  ])
}
