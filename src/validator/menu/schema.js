const Joi = require('joi');

const MenuPayloadSchema = Joi.object({
  name: Joi.string().required(),
  url: Joi.string().required(),
  status: Joi.number().integer().required().valid(0, 1),
});

module.exports = { MenuPayloadSchema };
