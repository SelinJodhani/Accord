const Joi = require('joi');

const imageSchema = Joi.string().default('Accord.png');

const emailSchema = Joi.string()
  .trim()
  .email({
    minDomainSegments: 1,
    tlds: { allow: ['com'] },
  })
  .required()
  .label('Email');

const passwordSchema = Joi.string()
  .pattern(
    new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')
  )
  .required()
  .label('Password')
  .messages({
    'string.pattern.base': '"Password" is not strong enough!',
  });

const passwordConfirmSchema = Joi.any()
  .valid(Joi.ref('password'))
  .required()
  .label('Confirm Password')
  .messages({
    'any.only': '"Password" does not match!',
  });

const loginSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema,
});

const signupSchema = Joi.object({
  name: Joi.string().trim().min(3).max(30).required().label('Name'),
  image: imageSchema,
  email: emailSchema,
  password: passwordSchema,
  passwordConfirm: passwordConfirmSchema,
});

const updateUserSchema = Joi.object({
  name: Joi.string().trim().min(3).max(30).label('Name'),
  image: imageSchema,
});

const updatePasswordSchema = Joi.object({
  passwordCurrent: Joi.string().required().label('Current Password'),
  password: passwordSchema,
  passwordConfirm: passwordConfirmSchema,
});

module.exports = {
  loginSchema,
  signupSchema,
  updateUserSchema,
  updatePasswordSchema,
};
