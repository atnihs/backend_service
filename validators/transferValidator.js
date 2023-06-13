const Joi = require('joi')

const getTransferValidator = (req, res, next) => {
    const schema = Joi.object({
        coin_id: Joi.string().required().messages({
            'any.required': 'Coin_id is required',
            'string.empty': 'Coin_id must not be empty',
            'string.base': 'Coin_id must be a string',
        }),
        address: Joi.string().required().messages({
            'any.required': 'Address is required',
            'string.empty': 'Address must not be empty',
            'string.base': 'Address must be a string',
        })
    })

    const { error } = schema.validate(req.query)

    if (error)
        return res.status(400).json({ message: error.details[0].message })

    next()
}

module.exports = {
    getTransferValidator,
}
