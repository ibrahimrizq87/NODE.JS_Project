import Joi from 'joi';

const RegSchema = Joi.object({
    
    userName: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required(),// turns off this check, meaning the validator will not check if the TLD is valid or known.

    user_ID: Joi.string()
        .alphanum()
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required(),
        
    repeat_password: Joi.ref('password'),


    age: Joi.number()
        .integer()
        .min(0)
        .optional(),

    gender: Joi.string()
        .valid('male', 'female', 'other')
        .optional(),

    phone: Joi.string()
        .pattern(new RegExp('^[0-9]{10,15}$'))
        .optional()
    
});

const logSchema = Joi.object({
    password: Joi.string()
    .required() 
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required() // turns off this check, meaning the validator will not check if the TLD is valid or known.
});



export default {
    RegSchema,
    logSchema
};
