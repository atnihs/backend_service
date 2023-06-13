const Joi = require('joi')

const createUserValidator = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().required().messages({
            'any.required': 'Name is required',
            'string.empty': 'Name must not be empty',
            'string.base': 'Name must be a string'
        }),
        device_id: Joi.string().required().messages({
            'any.required': 'Device_id is required',
            'string.empty': 'Device_id must not be empty',
            'string.base': 'Device_id must be a string'
        })
    })

    const { error } = schema.validate(req.body)

    if (error)
        return res.status(400).json({ message: error.details[0].message })

    next()
}

const createAssetsValidator = (req, res, next) => {
    const schema = Joi.object({
        deviceId: Joi.string().required().messages({
            'any.required': 'Device_id is required',
            'string.empty': 'Device_id must not be empty',
            'string.base': 'Device_id must be a string'
        }),
        name: Joi.string().required().messages({
            'any.required': 'Name is required',
            'string.empty': 'Name must not be empty',
            'string.base': 'Name must be a string'
        }),
        firebase_token: Joi.string(),
        assets: Joi.array()
            .items(
                Joi.object({
                    id: Joi.string().required().messages({
                        'any.required': 'Token_id is required',
                        'string.empty': 'Token_id must not be empty',
                        'string.base': 'Token_id must be a string'
                    }),
                    address: Joi.string().required().messages({
                        'any.required': 'Address is required',
                        'string.empty': 'Address must not be empty',
                        'string.base': 'Address must be a string'
                    })
                })
            )
            .required()
    })

    const { error } = schema.validate({
        deviceId: req.params.deviceId,
        ...req.body
    })

    if (error)
        return res.status(400).json({ message: error.details[0].message })

    next()
}

const updateUserValidator = (req, res, next) => {
    const schema = Joi.object({
        deviceId: Joi.string().required().messages({
            'any.required': 'Device_id is required',
            'string.empty': 'Device_id must not be empty',
            'string.base': 'Device_id must be a string'
        }),
        old_name: Joi.string().required().messages({
            'any.required': 'Name is required',
            'string.empty': 'Name must not be empty',
            'string.base': 'Name must be a string'
        }),
        new_name: Joi.string().required().messages({
            'any.required': 'Name is required',
            'string.empty': 'Name must not be empty',
            'string.base': 'Name must be a string'
        })
    })

    const { error } = schema.validate({
        deviceId: req.params.deviceId,
        ...req.body
    })

    if (error)
        return res.status(400).json({ message: error.details[0].message })

    next()
}

const deleteUserValidator = (req, res, next) => {
    const schema = Joi.object({
        deviceId: Joi.string().required().messages({
            'any.required': 'Device_id is required',
            'string.empty': 'Device_id must not be empty',
            'string.base': 'Device_id must be a string'
        }),
        name: Joi.string().required().messages({
            'any.required': 'Name is required',
            'string.empty': 'Name must not be empty',
            'string.base': 'Name must be a string'
        })
    })

    const { error } = schema.validate({
        deviceId: req.params.deviceId,
        ...req.body
    })

    if (error)
        return res.status(400).json({ message: error.details[0].message })

    next()
}

const deleteAssetValidator = (req, res, next) => {
    const schema = Joi.object({
        deviceId: Joi.string().required().messages({
            'any.required': 'Device_id is required',
            'string.empty': 'Device_id must not be empty',
            'string.base': 'Device_id must be a string'
        }),
        name: Joi.string().required().messages({
            'any.required': 'Name is required',
            'string.empty': 'Name must not be empty',
            'string.base': 'Name must be a string'
        }),
        id: Joi.string().required().messages({
            'any.required': 'Token_id is required',
            'string.empty': 'Token_id must not be empty',
            'string.base': 'Token_id must be a string'
        })
    })

    const { error } = schema.validate({
        deviceId: req.params.deviceId,
        ...req.body
    })

    if (error)
        return res.status(400).json({ message: error.details[0].message })

    next()
}

module.exports = {
    createUserValidator,
    createAssetsValidator,
    updateUserValidator,
    deleteUserValidator,
    deleteAssetValidator
}
