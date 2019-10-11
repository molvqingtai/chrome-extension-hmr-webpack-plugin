/* -------------------------------------------------- */
/*  Start of Webpack Chrome Hot Extension Middleware  */
/* ================================================== */
/*  This will be converted into a lodash templ., any  */
/*  external argument must be provided using it       */
/* -------------------------------------------------- */
let WebpackReloadPlugin = false
(function (chrome, window) {
  const name = '<%= name %>'
  const id = parseInt('<%= id %>')
  const host = '<%= host %>'
  const filename = '<%= filename %>'
  const { runtime, tabs } = chrome

  const logger = (msg, level = 'info') => console[level](`[ WCER: ${msg}]`)
  const manifest = (runtime && runtime.getManifest) ? runtime.getManifest() : undefined
  let path = (manifest ? manifest.name + ' | ' : '') + (name || filename)
  if (path.length > 43) {
    path = path.slice(0, 20) + '...' + path.slice(-20)
  }

  function init () {
    let timerId = null
    let socket = null
    try {
      socket = new WebSocket(host + id.toString())
    } catch (err) {
      console.log(err)
    }

    let send = (type, data) => {
      if (typeof data === 'string') {
        data = (new Date()).toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1') + ' - ' + path + ' | ' + data
      }
      socket.send(JSON.stringify({ type, data }))
    }
    socket.onopen = () => {
      logger(host)
      clearTimeout(timerId)
      WebpackReloadPlugin = true
    }
    socket.onmessage = ({ data: json }) => {
      const { type, data } = JSON.parse(json)
      if (runtime.reload && type === 'restart') {
        send('restart', 'successfully restart')
        runtime.reload()
        runtime.restart()
      }
      if (type === 'reload' && id === data.id) {
        send('reloaded', 'successfully reloaded')
        window.location.reload()
      }
    }

    socket.onclose = ({ code }) => {
      logger('Socket connection closed.', 'warn')
      timerId = setTimeout(() => {
        logger('WEPR Attempting to reconnect ...')
        init()
        logger('Reconnected. Reloading plugin')
      }, 2000)
    }
    window.onbeforeunload = () => socket.close()
  }
  !WebpackReloadPlugin ? init() : logger('WebpackReloadPlugin: Socket already started !')
})(chrome, window)
/* ----------------------------------------------- */
/* End of Webpack Chrome Hot Extension Middleware  */
/* ----------------------------------------------- */
