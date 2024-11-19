const Joi = require('joi');

const NewsPayloadSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  status: Joi.string().required(),
  scheduleDate: Joi.string().required(),
  // publicationDate: Joi.string().required(),
  description: Joi.string().required(),
  isHeadline: Joi.boolean().required(),
  isUnggulan: Joi.boolean().required(),
  reporter: Joi.string().required(),
  categoryId: Joi.string(),
});

module.exports = { NewsPayloadSchema };
