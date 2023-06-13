const knex = require('../db/knex')
const { RESPONSE } = require('../constants')

const createTranslation = async ({ code_id, key, value }) => {
    try {
        const isCheckCode = await knex('languages')
            .select('code')
            .where({ code: code_id })
            .first()
        if (!isCheckCode)
            return { status: false, message: RESPONSE.MESSAGE.NOT_SUPPORTED }

        const isKeyword = await knex('translation')
            .select('*')
            .where({ key, code_id })
            .first()
        if (isKeyword) {
            await knex('translation').where({ key, code_id }).update({ value })
            return { status: true, message: RESPONSE.MESSAGE.UPDATE_SUCCESS }
        } else {
            const isAddTrans = await knex('translation').insert({
                code_id,
                key,
                value,
            })

            if (!isAddTrans) {
                return {
                    status: false,
                    message: RESPONSE.MESSAGE.CREATE_FAILED,
                }
            } else {
                return {
                    status: true,
                    message: RESPONSE.MESSAGE.CREATE_SUCCESS,
                }
            }
        }
    } catch (error) {
        console.error(error)
    }
}

const createMultiTranslation = async ({ translations }) => {
    try {
        let query = 'INSERT INTO translation (`code_id`,`key`, `value`) VALUES '
        const inserts = []
        const updates = []

        for (let i = 0; i < translations.length; i++) {
            const { code_id, key, value } = translations[i]
            inserts.push([code_id, key, value])
            updates.push(`value=VALUES(value)`)
        }

        query += inserts.map(() => '(?, ?, ?)').join(', ')
        query += ' ON DUPLICATE KEY UPDATE '
        query += updates.join(', ')

        await knex.raw(query, inserts.flat())

        return { status: true, message: RESPONSE.MESSAGE.CREATE_SUCCESS }
    } catch (error) {
        console.error(error)
    }
}

const getTranslation = async ({ code }) => {
    try {
        const dataTrans = await knex('translation')
            .select('key', 'value')
            .where('code_id', code)

        if (dataTrans.length > 0) {
            return { status: true, data: dataTrans }
        }
        return { status: false, message: RESPONSE.MESSAGE.RESOURCE_NOT_FOUND }
    } catch (error) {
        console.error(error)
    }
}

const getAllTranslation = async () => {
    try {
        const data = await knex('translation').select('code_id', 'key', 'value')

        return {
            status: true,
            data: data.reduce((acc, cur) => {
                if (!acc[cur['code_id']]) {
                    acc[cur['code_id']] = {}
                }
                acc[cur['code_id']][cur.key] = cur.value
                return acc
            }, {}),
        }
    } catch (error) {
        console.error(error)
    }
}

const updateTranslation = async ({ id, key, value }) => {
    try {
        const isCheckCode = await knex('translation')
            .select('*')
            .where({ id })
            .first()

        if (isCheckCode) {
            const dataUpdate = {}
            if (key) {
                const isKeyword = await knex('translation')
                    .select('*')
                    .where({ key })
                    .first()
                if (isKeyword)
                    return { status: false, message: RESPONSE.MESSAGE.RESOURCE_EXISTING }
                dataUpdate['key'] = key
            }
            if (value) dataUpdate['value'] = value

            if (Object.keys(dataUpdate).length === 0) {
                return { status: false, message: RESPONSE.MESSAGE.UPDATE_FAILED }
            }

            dataUpdate['updated_at'] = knex.fn.now()

            const data = await knex('translation')
                .where({
                    id,
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

const deleteTranslation = async ({ id }) => {
    try {
        const existingTrans = await knex('translation')
            .select('id')
            .where({ id })
            .first()
        if (!existingTrans) return { status: false, message: RESPONSE.MESSAGE.RESOURCE_NOT_FOUND }

        const data = await knex('translation').where({ id }).del()
        if (!data) {
            return { status: false, message: RESPONSE.MESSAGE.DELETE_FAILED }
        }
        return { status: true }
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    createTranslation,
    createMultiTranslation,
    getTranslation,
    getAllTranslation,
    updateTranslation,
    deleteTranslation,
}
