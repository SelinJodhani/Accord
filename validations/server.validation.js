const Joi = require('joi');

const nameSchema = Joi.string()
  .trim()
  .min(3)
  .max(15)
  .required()
  .label('Server Name');

const imageSchema = Joi.string().default('Accord.png');

const createServerSchema = Joi.object({
  name: nameSchema,
  slug: Joi.string(),
  image: imageSchema,
});

const updateServerSchema = Joi.object({
  name: nameSchema,
  image: imageSchema,
});

module.exports = {
  createServerSchema,
  updateServerSchema,
};
