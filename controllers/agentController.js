const agentService = require('../services/agentService')
const handleResponse = require('../utils/responseMessage')

const createAgent = async (req, res) => {
    const isAgent = await agentService.createAgent(req.body)
    handleResponse(res, isAgent, 201, 400)
}

const getAgent = async (req, res) => {
    const { id } = req.params
    const dataAgent = await agentService.getAgent({ id })
    handleResponse(res, dataAgent, 200, 400)
}

const getAgents = async (req, res) => {
    const dataAgents = await agentService.getAgents(req.query)
    handleResponse(res, dataAgents, 200, 400)
}

const updateAgent = async (req, res) => {
    const { id } = req.params
    const dataUpdate = await agentService.updateAgent({ id, payload: req.body })
    console.log({ 1: 'Agent updated' })
    handleResponse(res, dataUpdate, 200, 400)
}

const deleteAgent = async (req, res) => {
    const { id } = req.params
    const dataUpdate = await agentService.deleteAgent({ id })
    handleResponse(res, dataUpdate, 200, 400)
}

module.exports = { createAgent, getAgent, getAgents, updateAgent, deleteAgent }
