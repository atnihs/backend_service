const knex = require('../db/knex')
const { RESPONSE } = require('../constants')

const createLanguage = async ({ code, name }) => {
    try {
        const isLanguage = await knex('languages').where({ code }).first()
        if (isLanguage) return { status: false, message: RESPONSE.MESSAGE.RESOURCE_EXISTING }

        const isCreateLanguage = await knex('languages').insert({ code, name })
        if (isCreateLanguage.length > 0)
            return { status: true, message: RESPONSE.MESSAGE.CREATE_SUCCESS }
    } catch (error) {
        console.error(error)
    }
}

const getAllLanguages = async () => {
    try {
        const data = await knex('languages').select('code', 'name')
        return { status: true, data }
    } catch (error) {
        console.error(error)
    }
}

const getLanguage = async ({ code }) => {
    try {
        const isLanguage = await knex('languages')
            .select('code', 'name')
            .where({ code })
            .first()
        if (!isLanguage) return { status: false, message: RESPONSE.MESSAGE.RESOURCE_NOT_FOUND }

        return { status: true, data: isLanguage }
    } catch (error) {
        console.error(error)
    }
}

const updateLanguage = async ({ code, name }) => {
    try {
        const isLanguage = await knex('languages')
            .select('code')
            .where({ code })
            .first()

        if (isLanguage) {
            const dataUpdate = {}
            if (name) {
                const checkNameExist = await knex('languages').where({ name }).first()
                if (checkNameExist) return { status: false, message: RESPONSE.MESSAGE.RESOURCE_EXISTING }
                dataUpdate['name'] = name
            }

            if (Object.keys(dataUpdate).length === 0) {
                return { status: false, message: RESPONSE.MESSAGE.UPDATE_FAILED }
            }

            dataUpdate['updated_at'] = knex.fn.now()
            
            const data = await knex('languages')
                .where({
                    code,
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

const deleteLanguage = async ({ code }) => {
    try {
        const data = await knex('languages').where({ code }).del()
        if (!data) {
            return { status: false, message: RESPONSE.MESSAGE.DELETE_FAILED }
        }
        return { status: true }
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    createLanguage,
    getAllLanguages,
    getLanguage,
    updateLanguage,
    deleteLanguage,
}
