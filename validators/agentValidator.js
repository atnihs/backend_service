const Joi = require('joi')

const createAgentValidator = (req, res, next) => {
    const schema = Joi.object({
        agent: Joi.string().required(),
        address: Joi.string().max(20).required(),
        phone: Joi.string().min(9).max(15).required(),
        status: Joi.number().integer().valid(0, 1),
    })

    const { error } = schema.validate(req.body)

    if (error) return res.status(400).json({ message: error.details[0].message })

    next()
}

const getAgentValidator = (req, res, next) => {
    const schema = Joi.object({
        id: Joi.number().required(),
    })

    const { error } = schema.validate(req.params)

    if (error) return res.status(400).json({ message: error.details[0].message })

    next()
}

const getListValidator = (req, res, next) => {
    const schema = Joi.object({
        search: Joi.string(),
        page: Joi.number().min(1),
        limit: Joi.number().min(1),
    })

    const { error } = schema.validate(req.query)

    if (error) return res.status(400).json({ message: error.details[0].message })

    next()
}

const updateAgentValidator = (req, res, next) => {
    const schema = Joi.object({
        id: Joi.number().required(),
        agent: Joi.string(),
        address: Joi.string().max(20),
        phone: Joi.string().min(9).max(15),
        status: Joi.number().integer().valid(0, 1),
    })

    const { error } = schema.validate({ id: req.params.id, ...req.body })

    if (error) return res.status(400).json({ message: error.details[0].message })

    next()
}

const deleteAgentValidator = (req, res, next) => {
    const schema = Joi.object({
        id: Joi.number().required(),
    })

    const { error } = schema.validate({ id: req.params.id })

    if (error) return res.status(400).json({ message: error.details[0].message })

    next()
}

module.exports = {
    createAgentValidator,
    getAgentValidator,
    getListValidator,
    updateAgentValidator,
    deleteAgentValidator,
}
