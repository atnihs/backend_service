const Joi = require('joi')

const createConfigValidator = (req, res, next) => {
    const schema = Joi.object({
        key: Joi.string()
            .regex(/^[a-zA-Z][a-zA-Z0-9._]*$/)
            .min(1)
            .required()
            .messages({
                'any.required': 'Key is required',
                'string.base': 'Key must be a string',
                'string.empty': 'Key must not be empty',
                'string.pattern.base':
                    'Key must start with a letter and contain only letters, numbers, dots, or underscores',
            }),
        value: Joi.string().min(1).required().messages({
            'any.required': 'Value is required',
            'string.base': 'Value must be a string',
            'string.empty': 'Value must not be empty',
        }),
    })

    const { error } = schema.validate(req.body)

    if (error)
        return res.status(400).json({ message: error.details[0].message })

    next()
}

const createMultiConfigValidator = (req, res, next) => {
    const schema = Joi.array()
        .items(
            Joi.object({
                key: Joi.string()
                    .regex(/^[a-zA-Z][a-zA-Z0-9._]*$/)
                    .min(1)
                    .required()
                    .messages({
                        'any.required': 'Key is required',
                        'string.base': 'Key must be a string',
                        'string.empty': 'Key must not be empty',
                        'string.pattern.base':
                            'Key must start with a letter and contain only letters, numbers, dots, or underscores',
                    }),
                value: Joi.string().min(1).required().messages({
                    'any.required': 'Value is required',
                    'string.base': 'Value must be a string',
                    'string.empty': 'Value must not be empty',
                }),
            })
        )
        .required()

    const { error } = schema.validate(req.body)

    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }

    next()
}

const getConfigValidator = (req, res, next) => {
    const schema = Joi.object({
        id: Joi.number().min(1).required().messages({
            'any.required': 'Id is required',
            'number.base': 'Id must be a number',
            'number.integer': 'Id must be an integer',
            'number.positive': 'Id must be a positive number',
            'number.min': 'Id must be a positive number',
        }),
    })

    const { error } = schema.validate({ id: req.params.id })

    if (error)
        return res.status(400).json({ message: error.details[0].message })

    next()
}

const updateConfigValidator = (req, res, next) => {
    const schema = Joi.object({
        id: Joi.number().min(1).required().messages({
            'any.required': 'Id is required',
            'number.base': 'Id must be a number',
            'number.integer': 'Id must be an integer',
            'number.positive': 'Id must be a positive number',
            'number.min': 'Id must be a positive number',
        }),
        key: Joi.string()
            .regex(/^[a-zA-Z][a-zA-Z0-9._]*$/)
            .min(1)
            .messages({
                'any.required': 'Key is required',
                'string.base': 'Key must be a string',
                'string.empty': 'Key must not be empty',
                'string.pattern.base':
                    'Key must start with a letter and contain only letters, numbers, dots, or underscores',
            }),
        value: Joi.string().min(1).messages({
            'any.required': 'Value is required',
            'string.base': 'Value must be a string',
            'string.empty': 'Value must not be empty',
        }),
    })

    const { error } = schema.validate({ id: req.params.id, ...req.body })

    if (error)
        return res.status(400).json({ message: error.details[0].message })

    next()
}

const deleteConfigValidator = (req, res, next) => {
    const schema = Joi.object({
        id: Joi.number().min(1).required().messages({
            'any.required': 'Id is required',
            'number.base': 'Id must be a number',
            'number.integer': 'Id must be an integer',
            'number.positive': 'Id must be a positive number',
            'number.min': 'Id must be a positive number',
        }),
    })

    const { error } = schema.validate({ id: req.params.id })

    if (error)
        return res.status(400).json({ message: error.details[0].message })

    next()
}

module.exports = {
    createConfigValidator,
    createMultiConfigValidator,
    getConfigValidator,
    updateConfigValidator,
    deleteConfigValidator,
}
