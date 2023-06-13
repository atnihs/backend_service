const knex = require('../db/knex')
const { STATUS, RESPONSE } = require('../constants')

const createAgent = async (payload) => {
    try {
        const isAgent = await knex('agent').where({ phone: payload.phone }).first()
        if (isAgent) return { status: false, message: RESPONSE.MESSAGE.RESOURCE_EXISTING }

        const addAgent = await knex('agent').insert(payload)
        if (addAgent) return { status: true, message: RESPONSE.MESSAGE.CREATE_SUCCESS }
        return { status: false, message: RESPONSE.MESSAGE.CREATE_FAILED }
    } catch (error) {
        console.error(error)
    }
}

const getAgent = async ({ id }) => {
    try {
        const dataAgent = await knex('agent')
            .select('id', 'agent', 'address', 'phone')
            .where({ id, status: STATUS.ACTIVE })
            .first()
        if (!dataAgent) return { status: false, message: RESPONSE.MESSAGE.RESOURCE_NOT_FOUND }
        return { status: true, data: dataAgent }
    } catch (error) {
        console.error(error)
    }
}

const getAgents = async (payload) => {
    try {
        let { page, limit, search } = payload
        if (!page) page = 1
        if (!limit) limit = 10

        const queryBuilder = knex('agent').select('id', 'agent', 'address', 'phone').where({ status: STATUS.ACTIVE })
        if (search)
            queryBuilder.where('agent.agent', 'like', `%${search}%`).orWhere('agent.phone', 'like', `%${search}%`)

        const listData = await queryBuilder.orderBy('updated_at', 'DESC').paginate({
            perPage: limit,
            currentPage: page,
            isLengthAware: true,
        })

        if (listData) return { status: true, data: listData }
        return { status: true, data: [] }
    } catch (error) {
        console.error(error)
    }
}

const updateAgent = async ({ id, payload }) => {
    try {
        const existAgent = await knex('agent').where({ id }).first()
        if (existAgent) {
            const { agent, address, phone, status } = payload
            const dataUpdate = {}

            if (agent) dataUpdate['agent'] = agent
            if (address) dataUpdate['address'] = address
            if (phone) {
                const existPhone = await knex('agent').where({ phone }).first()
                if (existPhone) {
                    return { status: false, message: RESPONSE.MESSAGE.UPDATE_FAILED }
                }
                dataUpdate['phone'] = phone
            }
            if (status) dataUpdate['status'] = status

            if (Object.keys(dataUpdate).length === 0) return { status: false, message: RESPONSE.MESSAGE.UPDATE_FAILED }

            dataUpdate['updated_at'] = knex.fn.now()
            const data = await knex('agent')
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

const deleteAgent = async ({ id }) => {
    try {
        const existAgent = await knex('agent').where({ id, status: STATUS.ACTIVE }).first()
        if (existAgent) {
            await knex('agent').where({ id }).update({ status: STATUS.DEACTIVE })
            return { status: true }
        }
        return { status: false, message: RESPONSE.MESSAGE.RESOURCE_NOT_FOUND }
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    createAgent,
    getAgent,
    getAgents,
    updateAgent,
    deleteAgent,
}
