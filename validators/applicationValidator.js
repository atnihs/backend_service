const Joi = require('joi')

const createAppValidator = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        coin: Joi.number().integer().min(1).required(),
        logo: Joi.string().required(),
        url: Joi.string().required(),
        description: Joi.string().required(),
        is_verify: Joi.boolean().required(),
        category_ids: Joi.array().items(Joi.number().required()).required(),
    })

    const { error } = schema.validate(req.body)

    if (error) return res.status(400).json({ message: error.details[0].message })

    next()
}

const getAppValidator = (req, res, next) => {
    const schema = Joi.object({
        id: Joi.number().integer().min(1).required(),
    })

    const { error } = schema.validate(req.params)

    if (error) return res.status(400).json({ message: error.details[0].message })

    next()
}

const updateValidator = (req, res, next) => {
    const schema = Joi.object({
        id: Joi.number().integer().min(1).required(),
        coin: Joi.number().integer().min(1),
        name: Joi.string(),
        logo: Joi.string(),
        url: Joi.string(),
        description: Joi.string(),
        is_verify: Joi.boolean(),
        category_ids: Joi.array().items(Joi.number())
    })

    const { error } = schema.validate({ id: req.params.id, ...req.body })

    if (error) return res.status(400).json({ message: error.details[0].message })

    next()
}

const deleteValidator = (req, res, next) => {
    const schema = Joi.object({
        id: Joi.number().integer().min(1).required(),
    })

    const { error } = schema.validate(req.params)

    if (error) return res.status(400).json({ message: error.details[0].message })

    next()
}

module.exports = {
    createAppValidator,
    getAppValidator,
    updateValidator,
    deleteValidator,
}
