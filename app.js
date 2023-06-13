const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
require('dotenv').config()
const crawlTasks = require('./utils/crawlData')
const routes = require('./routes')
const proxyRoutes = require('./routes/proxyRoutes')
const { registerSocketServer } = require('./utils/socketIo')
const app = express()
const bodyParser = require('body-parser')
const server = require('http').Server(app)
const cors = require('cors')
registerSocketServer(server)



const firebase = require('firebase-admin')
const serviceAccount = require('./serviceAccountKey.json')

global.firebase = firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
})

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static('public'))

// crawl data
crawlTasks.start()
require('./utils/webSocketCoin')

app.use('/api/transactions', proxyRoutes)
app.use('/api/v1', routes)

// error handler

/**
 *
 * @param {Error} err
 * @param {express.Request}req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const errorHandler = (err, req, res, next) => {
    res.status(err.status || 500)
    res.json({
        error: {
            message: err.message,
        },
    })
}
app.use(errorHandler)

const port = process.env.APP_PORT
const address = process.env.APP_ADDRESS

server.listen(port, address, () => {
    console.log(`Server listening on http://localhost:${port}`)
})
