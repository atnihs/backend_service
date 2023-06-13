const knex = require('../db/knex')
const { RESPONSE } = require('../constants')
const axios = require('axios')

const createUser = async ({ name, device_id }) => {
    try {
        const checkUser = await knex('users').where({ name, device_id }).first()

        if (checkUser) return { status: false, message: RESPONSE.MESSAGE.CREATE_FAILED }

        await knex('users').insert({ name, device_id })
        return { status: true, message: RESPONSE.MESSAGE.CREATE_SUCCESS }
    } catch (error) {
        console.error(error)
    }
}

const createAssets = async ({ deviceId: device_id, name, assets, firebase_token }) => {
    try {
        const isUser = await knex('users').where({ name, device_id }).first()
        if (!isUser) {
            await knex('users').insert({ name, device_id, firebase_token })
        } else {
            await knex('users').where({ name, device_id }).update({ firebase_token: firebase_token })
        }

        const existingAssets = await knex('assets')
            .where({ name, device_id })
            .whereIn(
                'token_id',
                assets.map((asset) => asset.id)
            )
            .select('token_id', 'address')

        const existingTokens = existingAssets.map((asset) => asset.token_id)
        const existingAddresses = existingAssets.map((asset) => asset.address)
        let insertAssets = []

        assets.forEach((asset) => {
            const isTokenExist = existingTokens.includes(asset.id)
            const isAddressExist = existingAddresses.includes(asset.address)

            if (!isTokenExist || (isTokenExist && !isAddressExist)) {
                insertAssets.push({
                    name,
                    device_id,
                    token_id: asset.id,
                    address: asset.address
                })
            }
        })

        if (insertAssets.length > 0) {
            for (const insertAsset of insertAssets) {
                try {
                    await knex('assets').insert(insertAsset)
                } catch (e) {
                }
            }
        }

        const addresses = await knex('assets')
            .where({ name, device_id })
            .select('address').groupBy('address').pluck('address')
        console.log({ addresses })
        if (addresses.length > 0) {
            for (const address of addresses) {
                let is_evm = 1
                // if (chain === 'solana') {
                //     is_evm = 1;
                // }
                console.log(process.env.API_PARSE_URL + '/users/post-wallet', {
                    address,
                    is_evm: is_evm === 1
                })
                try {
                    const response = await axios.post(process.env.API_PARSE_URL + '/users/post-wallet', {
                        address,
                        is_evm: is_evm === 1
                    })
                    console.log(response)
                } catch (e) {
                    if (e.response) console.log(e.response.data)
                }
            }
        }
        return { status: true, message: RESPONSE.MESSAGE.CREATE_SUCCESS }
    } catch (error) {
        if (error.response) console.log(error.response.data)
        else console.error(error)
    }
}

const getListUser = async () => {
    try {
        const data = await knex('users').select('id', 'name', 'device_id')
        if (data.length > 0) {
            return { status: true, data }
        }
        return { status: true, data: null }
    } catch (error) {
        console.error(error)
    }
}
const getListUserNotify = async () => {
    try {
        const data = await knex('users').select('id', 'name', 'device_id').whereNotNull('firebase_token')
        if (data.length > 0) {
            return { status: true, data }
        }
        return { status: true, data: null }
    } catch (error) {
        console.error(error)
    }
}

const updateUser = async ({ deviceId: device_id, old_name, new_name }) => {
    try {
        const isUser = await knex('users')
            .where({ name: old_name, device_id })
            .first()
        if (!isUser) return { status: false, message: RESPONSE.MESSAGE.RESOURCE_NOT_FOUND }

        const updateUser = await knex('users')
            .where({ name: old_name, device_id })
            .update({ name: new_name })
            .then(async () => {
                return await knex('assets')
                    .where({ device_id, name: old_name })
                    .update({ name: new_name })
            })
            .then()
            .catch()

        if (!updateUser) return { status: false, message: RESPONSE.MESSAGE.UPDATE_FAILED }

        return { status: true, message: RESPONSE.MESSAGE.UPDATE_SUCCESS }
    } catch (error) {
        console.error(error)
    }
}

const deleteUser = async ({ deviceId: device_id, name }) => {
    try {
        const isUser = await knex('users').where({ device_id, name }).first()
        if (!isUser) return { status: true, message: RESPONSE.MESSAGE.DELETE_FAILED }

        await knex.transaction(async (trx) => {
            await trx('users').where({ device_id, name }).del()
            await trx('assets').where({ device_id, name }).del()
        })

        return { status: true }
    } catch (error) {
        console.error(error)
    }
}

const deleteAsset = async ({ deviceId: device_id, name, id: token_id }) => {
    try {
        const isUser = await knex('users').where({ device_id, name }).first()
        if (!isUser) return { status: false, message: RESPONSE.MESSAGE.RESOURCE_NOT_FOUND }

        const isAsset = await knex('assets')
            .where({ device_id, name, token_id })
            .del()
        if (isAsset) {
            return { status: true }
        }
        return { status: false, message: RESPONSE.MESSAGE.DELETE_FAILED }
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    createUser,
    createAssets,
    getListUser,
    updateUser,
    deleteUser,
    deleteAsset,
    getListUserNotify
}
