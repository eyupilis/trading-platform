const Joi = require('joi');

const registerValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(3).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
        role: Joi.string().valid('user', 'trader').default('user')
    });
    return schema.validate(data);
};

const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });
    return schema.validate(data);
};

const signalValidation = (data) => {
    const schema = Joi.object({
        symbol: Joi.string().required(),
        direction: Joi.string().valid('long', 'short').required(),
        entry_price: Joi.number().required(),
        stop_loss: Joi.number().required(),
        take_profit: Joi.number().required(),
        timeframe: Joi.string().required(),
        risk_level: Joi.string().valid('low', 'medium', 'high').required()
    });
    return schema.validate(data);
};

module.exports = {
    registerValidation,
    loginValidation,
    signalValidation
};
