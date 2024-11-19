const Joi = require('joi');

const TagPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

module.exports = { TagPayloadSchema };
