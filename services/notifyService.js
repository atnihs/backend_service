const knex = require('../db/knex')
const { NOTIFY, RESPONSE } = require('../constants')
const { sendNotificationToTokens, sendNotificationToTopic } = require('../utils/socketIo')

const createNotify = async (payload) => {
    try {
        // TYPE: System
        if (!payload.type) {
            const dataNotify = await knex('notify').insert({
                ...payload,
                type: NOTIFY.TYPE.SYSTEM,
                notify_to:
                    payload.data.tagert === NOTIFY.SEND_TO.ALL ? 'ALL' : null
            })

            if (payload.data.tagert === NOTIFY.SEND_TO.USERS && payload.data.users.length > 0) {
                const insertPromises = payload.data.users.map((id) => {
                    return knex('notification_user').insert({
                        notify_id: dataNotify[0],
                        user_id: id,
                        read: 0
                    })
                })
                await Promise.all(insertPromises)
            }

            if (dataNotify.length === 0) {
                return { status: false, message: RESPONSE.MESSAGE.CREATE_FAILED }
            }

            if (!payload.data.sendAfterSave) {
                return {
                    status: true,
                    message: RESPONSE.MESSAGE.CREATE_SUCCESS
                }
            }

            const customData = {
                click_to: payload.data.click_to.toString(),
                link: payload.data.link?.toString(),
                title: payload.data.title?.toString(),
                body: payload.data.body?.toString(),
                screen: payload.data.screen?.toString(),
                params: Array.isArray(payload.data?.params) ? JSON.stringify(payload.data.params) : '[]'
            }
            const notificationData = {
                title: payload.notify_title,
                body: payload.notify_content,
                imageUrl: payload.notify_image
            }
            if (!payload.notify_image) delete notificationData.imageUrl
            if (payload.data.target === NOTIFY.SEND_TO.USERS) {
                let tokens = await knex('users')
                    .select('firebase_token')
                    .whereIn('id', payload.data.users)
                    .whereNotNull('firebase_token')
                    .pluck('firebase_token')
                sendNotificationToTokens(tokens, notificationData, customData)
            } else if (payload.data.target === NOTIFY.SEND_TO.ALL) {
                sendNotificationToTopic('subscribe', notificationData, customData)
            }

            return { status: true, message: RESPONSE.MESSAGE.CREATE_SUCCESS }
        }

        //TYPE: Transaction
        if (payload.notify.type === NOTIFY.TYPE.TRANSACTION) {
            const checkUser = await knex('users')
                .where({ name: payload.devices.name, device_id: payload.devices.device_id })
                .first()
            if (!checkUser)
                return { status: false, message: RESPONSE.MESSAGE.RESOURCE_NOT_FOUND }

            await knex.transaction(async (trx) => {
                const dataNotify = await trx('notify').insert(data.notify)
                await trx('notification_user').insert({
                    notify_id: dataNotify[0],
                    user_id: checkUser.id
                })
            })

            const message = {
                token: checkUser.firebase_token,
                notification: {
                    title: payload.notify.notify_title,
                    body: payload.notify.notify_content,
                    imageUrl: payload.notify.notify_image
                },
                data: payload.notify.data
            }

            try {
                firebase
                    .messaging()
                    .sendEach([message])
                    .then((response) => {
                        console.log(
                            response.successCount +
                            ' messages were sent successfully'
                        )
                    })
                    .catch((error) => {
                        console.error('Lỗi khi gửi thông báo:', error)
                    })
            } catch (error) {
                console.error(error)
            }
        }

        return {
            status: true,
            message: RESPONSE.MESSAGE.CREATE_SUCCESS
        }
    } catch (error) {
        console.error(error)
    }
}

const getNotify = async ({ notify_id }) => {
    try {
        const notifyData = await knex('notification_user')
            .join('notify', 'notification_user.notify_id', 'notify.id')
            .select(
                'notify.notify_title',
                'notify.notify_content',
                'notify.notify_image',
                'notify.data',
                'notify.type',
                'notify.type_detail',
                'notify.created_at'
            )
            .where('notification_user.notify_id', notify_id)
            .first()

        if (!notifyData)
            return { status: false, message: RESPONSE.MESSAGE.RESOURCE_NOT_FOUND }

        notifyData.data = JSON.parse(notifyData.data);

        const updateData = await knex('notification_user')
            .where({ notify_id })
            .update({ read: 1 })

        if (!updateData) return { status: false, message: RESPONSE.MESSAGE.UPDATE_FAILED }
        return { status: true, data: notifyData }
    } catch (error) {
        console.error(error)
    }
}

const getListNotify = async (query) => {
    try {
        const { device_id, name, page = 1, limit = 10 } = query
        const checkUser = await knex('users').where({ device_id, name }).first()
        if (!checkUser) return { status: false, message: RESPONSE.MESSAGE.RESOURCE_NOT_FOUND }

        const listNotify = await knex('notification_user')
            .select('notify_id')
            .where({ user_id: checkUser.id })
        if (listNotify.length === 0) return { status: true, data: '' }

        const notifyIds = listNotify.map((notify) => notify.notify_id)
        if (notifyIds.length === 0) return { status: true, data: '' }

        const notifyDetails = await knex('notify')
            .whereIn('notify.id', notifyIds)
            .orWhere('notify.notify_to', 'ALL')
            .leftJoin(
                'notification_user',
                'notify.id',
                'notification_user.notify_id'
            )
            .orderBy('created_at', 'desc')
            .select(
                'notify.id',
                'notify.notify_title',
                'notify.notify_content',
                'notify.notify_image',
                'notify.created_at',
                knex.raw('COALESCE(notification_user.read, 0) as is_read')
            )
            .paginate({
                perPage: limit,
                currentPage: page,
                isLengthAware: true
            })

        return { status: true, data: notifyDetails }
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    createNotify,
    getNotify,
    getListNotify
}
