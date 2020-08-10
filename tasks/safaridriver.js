const portscanner = require('portscanner')
const tcpPortUsed = require('tcp-port-used')
const { spawn } = require('child_process')

const defaultPort = 4444

function getPortFromArgs (args) {
  let port
  if (args.some(arg => (port = /--port=(\d+)/.exec(arg)))) return +port[1]
  args.some(arg => {
    if (arg === '--port' || arg === '-p') port = true
    else if (port) {
      port = +arg
      return true
    }
  })
  return port || defaultPort
}

function finalizeArgs (options) {
  const args = options.args || []
  const port = options.port || getPortFromArgs(args)
  const promise = options.findAvailablePort ? portscanner.findAPortNotInUse(port) : Promise.resolve(port)
  return promise.then(port => {
    let skip
    return {
      args: args
        .filter(arg => {
          if (skip) {
            skip = false
            return false
          }
          if (arg === '-p') {
            skip = true
            return false
          }
          return !arg.startsWith('--port=')
        })
        .concat([`--port=${port}`]),
      port
    }
  })
}

let safaridriver

module.exports = grunt => {
  grunt.registerMultiTask('safaridriver',
    'Controls Safari on OSX using the WebDriver interface via safaridriver without Selenium.',
    function (command) {
      /* istanbul ignore next */
      if (!command) grunt.fatal('command verb missing; append ":start" or ":stop" to the task name')
      switch (command.toLowerCase()) {
        case 'start': start(this); break
        case 'stop': stop(); break
        /* istanbul ignore next */
        default: grunt.fatal(`invalid command verb: "${command}"; append ":start" or ":stop" to the task name`)
      }

      function start (task) {
        /* istanbul ignore next */
        if (safaridriver) grunt.fatal('SafariDriver already started.')
        const done = task.async()
        const options = Object.assign({
          findAvailablePort: false,
          args: [],
          force: false
        }, task.data)
        const target = this.target
        let usedPort
        finalizeArgs(options)
          .then(({ args, port }) => {
            usedPort = port
            grunt.config.set(`safaridriver.${target}.port`, port)
            grunt.log.writeln(`Starting SafariDriver on port ${port}`)
            safaridriver = spawn('/usr/bin/safaridriver', args)
            return new Promise((resolve, reject) => {
              safaridriver.stdout.pipe(process.stdout)
              safaridriver.stderr.pipe(process.stderr)
              safaridriver.on('error', error => reject(error))
              setTimeout(resolve, 1000)
            })
          })
          .then(() => tcpPortUsed.waitUntilUsed(usedPort, 200, 10000))
          .then(() => {
            grunt.log.writeln('SafariDriver was started successfully.')
            grunt.event.emit(`safaridriver.${target}.listening`, usedPort)
            process.on('exit', stop)
          })
          .catch(/* istanbul ignore next */ function (error) {
            safaridriver = null
            grunt.verbose.error(error.stack)
            const warn = options.force ? grunt.log.warn : grunt.fail.warn
            warn(`safaridriver failed: ${error.message}`)
          })
          .finally(() => done())
      }

      function stop () {
        if (safaridriver) {
          grunt.log.writeln('Stopping SafariDriver.')
          safaridriver.kill()
          safaridriver = null
          process.off('exit', stop)
        }
      }
    })
}
