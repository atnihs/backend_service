const Joi = require('joi')

const createTranslationValidator = (req, res, next) => {
    const schema = Joi.object({
        code_id: Joi.string()
            .regex(/^[a-z_]+$/i)
            .required()
            .messages({
                'string.pattern.base':
                    'Code_id should contain only letters and underscores',
                'any.required': 'Code_id is required',
            }),
        key: Joi.string().required().messages({
            'any.required': 'Key is required',
            'string.empty': 'Key must not be empty',
            'string.base': 'Key must be a string',
        }),
        value: Joi.string().required().messages({
            'any.required': 'Value is required',
            'string.empty': 'Value must not be empty',
            'string.base': 'Value must be a string',
        }),
    })

    const { error } = schema.validate(req.body)

    if (error)
        return res.status(400).json({ message: error.details[0].message })

    next()
}

const createMultiTranslationValidator = (req, res, next) => {
    const schema = Joi.array().items(
        Joi.object({
            code_id: Joi.string()
                .regex(/^[a-z_]+$/i)
                .required()
                .messages({
                    'string.pattern.base':
                        'Code_id should contain only letters and underscores',
                    'any.required': 'Code_id is required',
                }),
            key: Joi.string().required().messages({
                'any.required': 'Key is required',
                'string.empty': 'Key must not be empty',
                'string.base': 'Key must be a string',
            }),
            value: Joi.string().required().messages({
                'any.required': 'Value is required',
                'string.empty': 'Value must not be empty',
                'string.base': 'Value must be a string',
            }),
        })
    )

    const { error } = schema.validate(req.body)

    if (error)
        return res.status(400).json({ message: error.details[0].message })

    next()
}

const getTranslationValidator = (req, res, next) => {
    const schema = Joi.object({
        code: Joi.string()
            .regex(/^[a-z_]+$/i)
            .required()
            .messages({
                'string.pattern.base':
                    'Code_id should contain only letters and underscores',
            }),
    })

    const { error } = schema.validate({ code: req.params.code })

    if (error)
        return res.status(400).json({ message: error.details[0].message })

    next()
}

const updateTranslationValidator = (req, res, next) => {
    const schema = Joi.object({
        id: Joi.number().min(1).required().messages({
            'any.required': 'Id is required',
            'number.base': 'Id must be a number',
            'number.integer': 'Id must be an integer',
            'number.positive': 'Id must be a positive number',
            'number.min': 'Id must be a positive number',
        }),
        key: Joi.string().required().messages({
            'any.required': 'Key is required',
            'string.empty': 'Key must not be empty',
            'string.base': 'Key must be a string',
        }),
        value: Joi.string().required().messages({
            'any.required': 'Value is required',
            'string.empty': 'Value must not be empty',
            'string.base': 'Value must be a string',
        }),
    })

    const { error } = schema.validate({ id: req.params.id, ...req.body })

    if (error)
        return res.status(400).json({ message: error.details[0].message })

    next()
}

const deleteTranslationValidator = (req, res, next) => {
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
    createTranslationValidator,
    createMultiTranslationValidator,
    getTranslationValidator,
    updateTranslationValidator,
    deleteTranslationValidator,
}
