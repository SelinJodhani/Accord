const Joi = require('joi');

const createChannelSchema = Joi.object({
  name: Joi.string().trim().min(3).max(15).required().label('Channel Name'),
  type: Joi.string().valid('Text', 'Voice').default('Text'),
});

module.exports = {
  createChannelSchema,
};
