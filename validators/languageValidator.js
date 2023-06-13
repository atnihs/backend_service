const Joi = require('joi')

const createLanguageValidator = (req, res, next) => {
    const schema = Joi.object({
        code: Joi.string()
            .regex(/^[a-z_]+$/i)
            .required()
            .messages({
                'any.required': 'Code is required',
                'string.empty': 'Code must not be empty',
                'string.pattern.base':
                    'Code must only contain letters and underscores',
            }),
        name: Joi.string().required().messages({
            'any.required': 'Name is required',
            'string.empty': 'Name must not be empty',
            'string.base': 'Name must be a string',
        }),
    })

    const { error } = schema.validate(req.body)

    if (error)
        return res.status(400).json({ message: error.details[0].message })

    next()
}

const getLanguageValidator = (req, res, next) => {
    const schema = Joi.object({
        code: Joi.string()
            .regex(/^[a-z_]+$/i)
            .required()
            .messages({
                'any.required': 'Code is required',
                'string.empty': 'Code must not be empty',
                'string.pattern.base':
                    'Code must only contain letters and underscores',
            }),
    })

    const { error } = schema.validate({ code: req.params.code })

    if (error)
        return res.status(400).json({ message: error.details[0].message })

    next()
}

const updateLanguageValidator = (req, res, next) => {
    const schema = Joi.object({
        code: Joi.string()
            .regex(/^[a-z_]+$/i)
            .required()
            .messages({
                'any.required': 'Code is required',
                'string.empty': 'Code must not be empty',
                'string.pattern.base':
                    'Code must only contain letters and underscores',
            }),
        name: Joi.string().required().messages({
            'any.required': 'Name is required',
            'string.empty': 'Name must not be empty',
            'string.base': 'Name must be a string',
        }),
    })

    const { error } = schema.validate({ code: req.params.code, ...req.body })

    if (error)
        return res.status(400).json({ message: error.details[0].message })

    next()
}

const deleteLanguageValidator = (req, res, next) => {
    const schema = Joi.object({
        code: Joi.string()
            .regex(/^[a-z_]+$/i)
            .required()
            .messages({
                'any.required': 'Code is required',
                'string.empty': 'Code must not be empty',
                'string.pattern.base':
                    'Code must only contain letters and underscores',
            }),
    })

    const { error } = schema.validate({ code: req.params.code })

    if (error)
        return res.status(400).json({ message: error.details[0].message })

    next()
}

module.exports = {
    createLanguageValidator,
    getLanguageValidator,
    updateLanguageValidator,
    deleteLanguageValidator,
}
