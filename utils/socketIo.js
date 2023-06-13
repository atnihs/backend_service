const socketio = require('socket.io')
const { boolean } = require('boolean')

global.io = null

function sendNotificationToTokens(tokens, notificationData, customData) {
    if (global.firebase && boolean(process.env.FIREBASE_ENABLE)) {
        const message = {
            tokens,
            notification: notificationData,
            data: customData
        }
        try {
            const messaging = global.firebase.messaging().sendEachForMulticast(message)
            messaging.then((response) => {
                console.log(
                    response.successCount + ' messages were sent successfully'
                )
            }).catch((error) => {
                console.error('Error: ', error)
            })
        } catch (error) {
            console.error(error)
        }
    }
}

function sendNotificationToTopic(topic, notificationData, customData) {
    if (global.firebase && process.env.FIREBASE_ENABLE) {
        const message = {
            topic: topic,
            notification: notificationData,
            data: customData
        }
        try {
            const messaging = global.firebase.messaging().send(message)
            messaging.then((response) => {
                console.log(
                    response.successCount + ' messages were sent successfully'
                )
            }).catch((error) => {
                console.error('Error: ', error)
            })
        } catch (error) {
            console.error(error)
        }

    }
}

function registerSocketServer(server) {
    global.io = socketio(server, {
        path: '/websocket'
    })
    io.on('connection', function (socket) {
        console.log('Have user connection')
        socket.on('disconnect', function () {

        })
    })
}

module.exports = { registerSocketServer, sendNotificationToTokens, sendNotificationToTopic }
