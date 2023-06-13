const Joi = require('joi')
const { NOTIFY } = require('../constants')

const createNotifyValidator = (req, res, next) => {
    const schema = Joi.object({
        notify_title: Joi.string().min(1).required().messages({
            'any.required': 'Notify_title is required',
            'string.base': 'Notify_title must be a string',
            'string.empty': 'Notify_title must not be empty',
        }),
        notify_content: Joi.string().min(1).required().messages({
            'any.required': 'Notify_content is required',
            'string.base': 'Notify_content must be a string',
            'string.empty': 'Notify_content must not be empty',
        }),
        notify_image: Joi.string().allow(null, '').min(1).messages({
            'any.required': 'Notify_image is required',
            'string.base': 'Notify_image must be a string',
            'string.empty': 'Notify_image must not be empty',
        }),
        type: Joi.string().valid('advertisement'),
        data: Joi.object().required(),
        type_detail: Joi.string().min(1).messages({
            'any.required': 'type_detail is required',
            'string.base': 'type_detail must be a string',
            'string.empty': 'type_detail must not be empty',
        }),
        variables: Joi.string().min(1).messages({
            'any.required': 'Variables is required',
            'string.base': 'Variables must be a string',
            'string.empty': 'Variables must not be empty',
        }),
    })

    const { error, value } = schema.validate(req.body)

    if (error)
        return res.status(400).json({ message: error.details[0].message })

    const dataSchema =
        value.type === 'advertisement' ? Joi.object() : Joi.object()

    const { error: dataError } = dataSchema.validate(value.data)

    if (dataError)
        return res.status(400).json({ message: dataError.details[0].message })

    if (Object.getOwnPropertyNames(value.data).length > 0) {
        const additionalSchema = Joi.object({
            click_to: Joi.number()
                .valid(
                    NOTIFY.ACTION.OPEN_URL,
                    NOTIFY.ACTION.WEB_VIEW,
                    NOTIFY.ACTION.GOTO_SCREEN,
                    NOTIFY.ACTION.ON_APP_MODAL
                )
                .required()
                .strict(),
            link: Joi.when('click_to', {
                is: NOTIFY.ACTION.OPEN_URL,
                then: Joi.string().required(),
                otherwise: Joi.alternatives().conditional('click_to', {
                    is: NOTIFY.ACTION.WEB_VIEW,
                    then: Joi.string().required(),
                    otherwise: Joi.string(),
                }),
            }),
            screen: Joi.when('click_to', {
                is: NOTIFY.ACTION.GOTO_SCREEN,
                then: Joi.number().required(),
                otherwise: Joi.number(),
            }),
            params: Joi.when('click_to', {
                is: NOTIFY.ACTION.GOTO_SCREEN,
                then: Joi.array().items(Joi.string().required()).required(),
                otherwise: Joi.array(),
            }),
            title: Joi.when('click_to', {
                is: NOTIFY.ACTION.ON_APP_MODAL,
                then: Joi.string().required(),
                otherwise: Joi.string(),
            }),
            body: Joi.when('click_to', {
                is: NOTIFY.ACTION.ON_APP_MODAL,
                then: Joi.string().required(),
                otherwise: Joi.string(),
            }),
            sendAfterSave: Joi.when('click_to', {
                is: Joi.valid(
                    NOTIFY.ACTION.OPEN_URL,
                    NOTIFY.ACTION.WEB_VIEW,
                    NOTIFY.ACTION.GOTO_SCREEN,
                    NOTIFY.ACTION.ON_APP_MODAL
                ),
                then: Joi.boolean().required(),
                otherwise: Joi.boolean().allow('').optional(),
            }),
            target: Joi.number().when('sendAfterSave', {
                is: true,
                then: Joi.number().required(),
                otherwise: Joi.number().disallow(),
            }),
            users: Joi.array().when('target', {
                is: NOTIFY.SEND_TO.USERS,
                then: Joi.array().items(Joi.string().required()).required(),
                otherwise: Joi.array().disallow(),
            }),
        })
        const { error: additionalError } = additionalSchema.validate(value.data)

        if (additionalError)
            return res
                .status(400)
                .json({ message: additionalError.details[0].message })
    } else {
        return res.status(400).json({
            message: 'Object data not empty',
        })
    }

    next()
}

const getNotifyValidator = (req, res, next) => {
    const schema = Joi.object({
        notify_id: Joi.number().min(1).required().messages({
            'any.required': 'Notify_id is required',
            'number.base': 'Notify_id must be a number',
            'number.integer': 'Notify_id must be an integer',
            'number.positive': 'Notify_id must be a positive number',
            'number.min': 'Notify_id must be a positive number',
        }),
    })

    const { error } = schema.validate(req.params)

    if (error)
        return res.status(400).json({ message: error.details[0].message })
    next()
}

const getListNotifyValidator = (req, res, next) => {
    const schema = Joi.object({
        device_id: Joi.string().required().messages({
            'any.required': 'Device_id is required',
            'string.empty': 'Device_id must not be empty',
            'string.base': 'Device_id must be a string',
        }),
        name: Joi.string().required().messages({
            'any.required': 'Name is required',
            'string.empty': 'Name must not be empty',
            'string.base': 'Name must be a string',
        }),
        page: Joi.number().min(1).messages({
            'number.base': 'Page must be a number',
            'number.integer': 'Page must be an integer',
            'number.positive': 'Page must be a positive number',
            'number.min': 'Page must be a positive number',
        }),
        limit: Joi.number().min(1).messages({
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

module.exports = {
    createNotifyValidator,
    getNotifyValidator,
    getListNotifyValidator,
}
