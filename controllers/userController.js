const userService = require('../services/userService')
const handleResponse = require('../utils/responseMessage')

const createUser = async (req, res) => {
    const { name, device_id } = req.body
    const addUser = await userService.createUser({ name, device_id })
    handleResponse(res, addUser, 201, 400)
}

const createAssets = async (req, res) => {
    const { deviceId } = req.params
    const { name, assets, firebase_token } = req.body
    const addUser = await userService.createAssets({ deviceId, name, assets, firebase_token })
    handleResponse(res, addUser, 201, 400)
}

const getListUser = async (req, res) => {
    const listUser = await userService.getListUser()
    handleResponse(res, listUser, 200, 400)
}
const getListUserNotify = async (req, res) => {
    const listUser = await userService.getListUserNotify()
    handleResponse(res, listUser, 200, 400)
}

const updateUser = async (req, res) => {
    const { deviceId } = req.params
    const { old_name, new_name } = req.body
    const updateUser = await userService.updateUser({ deviceId, old_name, new_name })
    handleResponse(res, updateUser, 200, 404)
}

const deleteUser = async (req, res) => {
    const { deviceId } = req.params
    const { name } = req.body
    const deleteUser = await userService.deleteUser({ deviceId, name })
    handleResponse(res, deleteUser, 200, 404)
}

const deleteAsset = async (req, res) => {
    const { deviceId } = req.params
    const { name, id } = req.body
    const deleteAsset = await userService.deleteAsset({ deviceId, name, id })
    handleResponse(res, deleteAsset, 200, 404)
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
