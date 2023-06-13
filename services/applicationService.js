const knex = require('../db/knex')
const { RESPONSE } = require('../constants')
const { boolean } = require('boolean')

const createApp = async (payload) => {
    try {
        const { category_ids, ...dataApp } = payload

        const isApp = await knex('application').where({ coin: dataApp.coin }).first()
        if (isApp) return { status: false, message: RESPONSE.MESSAGE.RESOURCE_EXISTING }

        const existingCategories = await knex('category').whereIn('id', category_ids).select('id').pluck('id')

        const invalidCategoryIds = category_ids.filter((categoryId) => !existingCategories.includes(categoryId))

        if (invalidCategoryIds.length > 0) {
            console.log(`Invalid category IDs: ${invalidCategoryIds.join(', ')}`)
        }

        const appIds = await knex('application').insert({ ...dataApp, is_verify: boolean(dataApp.is_verify) })

        const validCategoryIds = existingCategories.filter((categoryId) => !invalidCategoryIds.includes(categoryId))
        const categoryIdPairs = validCategoryIds.map((categoryId) => ({
            category_id: categoryId,
            application_id: appIds[0],
        }))

        await knex('category_application').insert(categoryIdPairs)

        return { status: true, message: RESPONSE.MESSAGE.CREATE_SUCCESS }
    } catch (error) {
        console.error(error)
    }
}

const getApp = async ({ id }) => {
    try {
        const app = await knex('application').where({ id }).first()

        if (!app) return { status: false, message: RESPONSE.MESSAGE.RESOURCE_NOT_FOUND }

        const categories = await knex('category')
            .join('category_application', 'category.id', 'category_application.category_id')
            .where('category_application.application_id', app.id)
            .select('category.id', 'category.name')

        const data = {
            id: app.id,
            name: app.name,
            coin: app.coin,
            logo: app.logo,
            url: app.url,
            description: app.description,
            is_verify: !!app.is_verify,
            categories: categories.map((category) => ({
                id: category.id,
                name: category.name,
            })),
        }

        return { status: true, data }
    } catch (error) {
        console.error(error)
    }
}

const updateApp = async ({ id, payload }) => {
    try {
        let { name, logo, url, description, is_verify, category_ids } = payload

        const isApp = await knex('application').where({ id }).first()

        if (isApp) {
            const dataUpdate = {}

            if (name) dataUpdate['name'] = name
            if (logo) dataUpdate['logo'] = logo
            if (url) dataUpdate['url'] = url
            if (description) dataUpdate['description'] = description
            if (is_verify !== undefined) dataUpdate['is_verify'] = boolean(is_verify)

            if (Object.keys(dataUpdate).length === 0) {
                return { status: false, message: RESPONSE.MESSAGE.UPDATE_FAILED }
            }

            dataUpdate['updated_at'] = knex.fn.now()

            await knex.transaction(async (trx) => {
                const updateResult = await trx('application').where({ id }).update(dataUpdate)

                if (!updateResult) return { status: false, message: RESPONSE.MESSAGE.UPDATE_FAILED }

                const currentCategoryIds = await trx('category_application')
                    .where({ application_id: id })
                    .select('category_id')
                    .pluck('category_id')

                const categoryIdsToAdd = category_ids.filter((categoryId) => !currentCategoryIds.includes(categoryId))
                const categoryIdsToRemove = currentCategoryIds.filter(
                    (categoryId) => !category_ids.includes(categoryId)
                )

                if (categoryIdsToAdd.length > 0) {
                    const newLinks = categoryIdsToAdd.map((categoryId) => ({
                        application_id: id,
                        category_id: categoryId,
                    }))

                    await trx('category_application').insert(newLinks)
                }

                if (categoryIdsToRemove.length > 0) {
                    await trx('category_application')
                        .where({ application_id: id })
                        .whereIn('category_id', categoryIdsToRemove)
                        .del()
                }
            })

            return { status: true, message: RESPONSE.MESSAGE.UPDATE_SUCCESS }
        }
        return { status: false, message: RESPONSE.MESSAGE.RESOURCE_NOT_FOUND }
    } catch (error) {
        console.error(error)
    }
}

const deleteApp = async ({ id }) => {
    try {
        await knex.transaction(async (trx) => {
            await trx('category_application').where({ application_id: id }).del()

            const isDeleteApp = await trx('application').where({ id }).del()

            if (!isDeleteApp) return { status: false, message: RESPONSE.MESSAGE.DELETE_FAILED }
            return { status: true }
        })

        return { status: true }
    } catch (error) {
        console.error(error)
        return { status: false, message: RESPONSE.MESSAGE.DELETE_FAILED }
    }
}

module.exports = {
    createApp,
    getApp,
    updateApp,
    deleteApp,
}
