const Joi = require('joi')

const getCurrencyValidator = (req, res, next) => {
    const schema = Joi.object({
        slug: Joi.string()
            .regex(/^[a-z][a-z0-9,-_]*$/)
            .min(1)
            .required()
            .messages({
                'any.required': 'Slug is required',
                'string.base': 'Slug must be a string',
                'string.pattern.base': 'Slug must be a string',
            }),
    })

    const { error } = schema.validate(req.params)

    if (error)
        return res.status(400).json({ message: error.details[0].message })

    next()
}

const getAllCurrencyValidator = (req, res, next) => {
    const schema = Joi.object({
        search: Joi.string()
            .regex(/^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/)
            .min(1)
            .messages({
                'any.required': 'Search is required',
                'string.base': 'Search must be a string',
                'string.pattern.base': 'Search must be a string',
            }),
        page: Joi.number().min(1).messages({
            'any.required': 'Page is required',
            'number.base': 'Page must be a number',
            'number.integer': 'Page must be an integer',
            'number.positive': 'Page must be a positive number',
            'number.min': 'Page must be a positive number',
        }),
        limit: Joi.number().min(1).messages({
            'any.required': 'Limit is required',
            'number.base': 'Limit must be a number',
            'number.integer': 'Limit must be an integer',
            'number.positive': 'Limit must be a positive number',
            'number.min': 'Limit must be a positive number',
        }),
    })

    const { error } = schema.validate(req.query)

    if (error)
        return res.status(400).json({ message: error.details[0].message })

    next()
}

const getCurrencyDetailValidator = (req, res, next) => {
    const schema = Joi.object({
        slug: Joi.string()
            .regex(/^[a-z\-]+$/)
            .min(1)
            .required()
            .messages({
                'any.required': 'Slug is required',
                'string.base': 'Slug must be a string',
                'string.pattern.base': 'Slug must be a string',
            }),
    })

    const { error } = schema.validate(req.params)

    if (error)
        return res.status(400).json({ message: error.details[0].message })

    next()
}

module.exports = {
    getCurrencyValidator,
    getAllCurrencyValidator,
    getCurrencyDetailValidator,
}
