const Joi = require('joi');

const MediaPayloadSchema = Joi.object({
  filename: Joi.string().required(),
  url: Joi.string().required(),
  mediaType: Joi.string().required(),
  newsId: Joi.string().required(),
});

module.exports = { MediaPayloadSchema };
