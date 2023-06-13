const Joi = require('joi')

const createCateValidator = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        position: Joi.number().required(),
    })

    const { error } = schema.validate(req.body)

    if (error) return res.status(400).json({ message: error.details[0].message })

    next()
}

const getCateValidator = (req, res, next) => {
    const schema = Joi.object({
        id: Joi.number().required(),
    })

    const { error } = schema.validate({ id: req.params.id })

    if (error) return res.status(400).json({ message: error.details[0].message })

    next()
}

const updateCateValidator = (req, res, next) => {
    const schema = Joi.object({
        id: Joi.number().required(),
        name: Joi.string(),
        position: Joi.number(),
    })

    const { error } = schema.validate({ id: req.params.id, ...req.body })

    if (error) return res.status(400).json({ message: error.details[0].message })

    next()
}

const deleteCateValidator = (req, res, next) => {
    const schema = Joi.object({
        id: Joi.number().required(),
    })

    const { error } = schema.validate({ id: req.params.id })

    if (error) return res.status(400).json({ message: error.details[0].message })

    next()
}

module.exports = {
    createCateValidator,
    getCateValidator,
    updateCateValidator,
    deleteCateValidator,
}
