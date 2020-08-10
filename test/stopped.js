const tcpPortUsed = require('tcp-port-used')
const defaultPort = 4444

exports.safaridriver = {
  stopped: test => {
    const port = +process.env.SAFARIDRIVER_PORT || defaultPort
    tcpPortUsed
      .waitUntilFree(port)
      .then(() => test.ok(true, `port ${port} is free`))
      .catch(error => {
        console.error(error.stack)
        test.ok(false, error.message)
      })
      .finally(() => test.done())
  }
}
