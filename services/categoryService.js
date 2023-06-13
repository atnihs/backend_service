const knex = require('../db/knex')
const { RESPONSE } = require('../constants')

const createCate = async (payload) => {
    try {
        const { name, position } = payload
        const isCate = await knex('category').where({ name }).first()
        if (isCate) return { status: false, message: RESPONSE.MESSAGE.RESOURCE_EXISTING }

        const isCreateCate = await knex('category').insert({ name, position })
        if (isCreateCate.length > 0) return { status: true, message: RESPONSE.MESSAGE.CREATE_SUCCESS }
    } catch (error) {
        console.error(error)
    }
}

const getCates = async () => {
    try {
        const categories = await knex('category').select('id', 'name', 'position').orderBy('position', 'ASC')

        const categoryList = []

        for (const category of categories) {
            const applications = await knex('category_application')
                .join('application', 'category_application.application_id', 'application.id')
                .where('category_application.category_id', category.id)
                .select(
                    'application.id',
                    'application.name',
                    'application.coin',
                    'application.logo',
                    'application.url',
                    'application.description',
                    'application.is_verify'
                )

            categoryList.push({
                id: category.id,
                name: category.name,
                applications: applications.map((application) => ({
                    ...application,
                    is_verify: application.is_verify === 1 ? true : false,
                })),
                position: category.position
            })
        }

        return { status: true, data: { query: { total: categoryList.length, data: categoryList } } }
    } catch (error) {
        console.error(error)
    }
}

const getCate = async ({ id }) => {
    try {
        const category = await knex('category').select('id', 'name', 'position').where({ id }).first()
        if (!category) {
            return { status: false, message: RESPONSE.MESSAGE.RESOURCE_NOT_FOUND }
        }

        const applications = await knex('category_application')
            .join('application', 'category_application.application_id', 'application.id')
            .where('category_application.category_id', category.id)
            .select(
                'application.id',
                'application.name',
                'application.coin',
                'application.logo',
                'application.url',
                'application.description',
                'application.is_verify'
            )

        const categoryWithApplications = {
            id: category.id,
            name: category.name,
            applications: applications.map((application) => ({
                ...application,
                is_verify: application.is_verify === 1 ? true : false,
            })),
        }

        return { status: true, data: categoryWithApplications }
    } catch (error) {
        console.error(error)
    }
}

const updateCate = async ({ id, payload }) => {
    try {
        let { name, position } = payload

        const isCate = await knex('category').where({ id }).first()

        if (isCate) {
            const dataUpdate = {}

            if (name) dataUpdate['name'] = name
            if (position) dataUpdate['position'] = position

            if (Object.keys(dataUpdate).length === 0) {
                return { status: false, message: RESPONSE.MESSAGE.UPDATE_FAILED }
            }

            dataUpdate['updated_at'] = knex.fn.now()

            const data = await knex('category')
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

const deleteCate = async ({ id }) => {
    try {
        return await knex.transaction(async (trx) => {
            const isDeleteCate = await trx('category').where({ id }).del()
            if (!isDeleteCate) {
                return { status: false, message: RESPONSE.MESSAGE.DELETE_FAILED }
            }

            await trx('category_application').where('category_id', id).del()

            return { status: true }
        })
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    createCate,
    getCates,
    getCate,
    updateCate,
    deleteCate,
}
