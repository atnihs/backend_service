const express = require('express')
const router = express.Router()

const {
    createAgentValidator,
    getAgentValidator,
    getListValidator,
    updateAgentValidator,
    deleteAgentValidator,
} = require('../validators/agentValidator')
const { createAgent, getAgents, getAgent, updateAgent, deleteAgent } = require('../controllers/agentController')

router.route('/').get(getListValidator, getAgents).post(createAgentValidator, createAgent)
router
    .route('/:id')
    .get(getAgentValidator, getAgent)
    .put(updateAgentValidator, updateAgent)
    .delete(deleteAgentValidator, deleteAgent)

module.exports = router
