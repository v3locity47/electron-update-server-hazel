// Packages
const Router = require('router')
const finalhandler = require('finalhandler')
const Cache = require('./cache')
require('dotenv').config()

module.exports = config => {
  const router = Router()
  let cache = null

  try {
    cache = new Cache(config)
  } catch (err) {
    const { code, message } = err

    if (code) {
      return (req, res) => {
        res.statusCode = 400

        res.end(
          JSON.stringify({
            error: {
              code,
              message
            }
          })
        )
      }
    }

    throw err
  }

  const routes = require('./routes')({ cache, config })

  // Define a route for every relevant path
  router.get('/', routes.overview)
  router.get('/update/win/releases.win.json', routes.releases)
  router.get('/update/win/:file', routes.getWinFiles)
  router.get('/download', routes.download)
  router.get('/download/:platform', routes.downloadPlatform)
  router.get('/update/:platform/:version', routes.update)

  return (req, res) => {
    router(req, res, finalhandler(req, res))
  }
}
