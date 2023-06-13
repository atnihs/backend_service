const knex = require('../db/knex')
const { RESPONSE } = require('../constants')

const createConfig = async ({ key, value }) => {
    try {
        const isKeyConfig = await knex('config').where({ key }).first()
        if (isKeyConfig) {
            await knex('config').where({ key }).update({ value })
            return { status: true, message: RESPONSE.MESSAGE.CREATE_SUCCESS }
        }
        const isCreateConfig = await knex('config').insert({ key, value })
        if (isCreateConfig.length > 0) return { status: true, message: RESPONSE.MESSAGE.CREATE_SUCCESS }
    } catch (error) {
        console.error(error)
    }
}

const createMultiConfig = async ({ configs }) => {
    try {
        let query = 'INSERT INTO config (`key`, `value`) VALUES '
        const inserts = []
        const updates = []

        for (let i = 0; i < configs.length; i++) {
            const { key, value } = configs[i]
            inserts.push([key, value])
            updates.push(`value=VALUES(value)`)
        }

        query += inserts.map(() => '(?, ?)').join(', ')
        query += ' ON DUPLICATE KEY UPDATE '
        query += updates.join(', ')

        await knex.raw(query, inserts.flat())

        return { status: true, message: RESPONSE.MESSAGE.CREATE_SUCCESS }
    } catch (error) {
        console.error(error)
    }
}

const getConfig = async ({ id }) => {
    try {
        const isKeyConfig = await knex('config')
            .select('id', 'key', 'value')
            .where({ id })
            .first()
        if (!isKeyConfig) return { status: false, message: RESPONSE.MESSAGE.RESOURCE_NOT_FOUND }
        return { status: true, data: isKeyConfig }
    } catch (error) {
        console.error(error)
    }
}

const getAllConfig = async () => {
    try {
        const data = await knex('config').select('id', 'key', 'value')
        return {
            status: true, data: data.reduce((accumulator, value) => {
                return { ...accumulator, [value.key]: value.value }
            }, {})
        }
    } catch (error) {
        console.error(error)
    }
}

const updateConfig = async ({ id, key, value }) => {
    try {
        const isConfig = await knex('config').select('id').where({ id }).first()

        if (isConfig) {
            const dataUpdate = {}
            if (key) dataUpdate['key'] = key
            if (value) dataUpdate['value'] = value

            if (Object.keys(dataUpdate).length === 0) {
                return { status: false, message: RESPONSE.MESSAGE.UPDATE_FAILED }
            }

            dataUpdate['updated_at'] = knex.fn.now()
            const data = await knex('config')
                .where({
                    id
                })
                .update(dataUpdate)

            if (data) {
                return { status: true, message: RESPONSE.MESSAGE.UPDATE_SUCCESS }
            }
            return { status: false, message: RESPONSE.MESSAGE.UPDATE_FAILED }
        }
        return { status: false, message: RESPONSE.MESSAGE.RESOURCE_NOT_FOUND }
    } catch (error) {
        console.error(error)
    }
}

const deleteConfig = async ({ id }) => {
    try {
        const isConfig = await knex('config').select('id').where({ id }).first()
        if (!isConfig) return { status: false, message: RESPONSE.MESSAGE.RESOURCE_NOT_FOUND }

        const data = await knex('config').where({ id }).del()
        if (!data) {
            return { status: false, message: RESPONSE.MESSAGE.DELETE_FAILED }
        }
        return { status: true }
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    createConfig,
    createMultiConfig,
    getConfig,
    getAllConfig,
    updateConfig,
    deleteConfig
}
