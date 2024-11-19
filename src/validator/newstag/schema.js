const Joi = require('joi');

const NewsTagPayloadSchema = Joi.object({
  newsId: Joi.string()
    .required()
    .messages({
      'string.empty': 'News ID tidak boleh kosong',
      'any.required': 'News ID harus diisi',
    }),
  tagId: Joi.string()
    .required()
    .messages({
      'string.empty': 'Tag ID tidak boleh kosong',
      'any.required': 'Tag ID harus diisi',
    }),
});

const NewsTagParamsSchema = Joi.object({
  newsId: Joi.string()
    .required()
    .messages({
      'string.empty': 'News ID tidak boleh kosong',
      'any.required': 'News ID harus diisi',
    }),
  tagId: Joi.string()
    .messages({
      'string.empty': 'Tag ID tidak boleh kosong',
    }),
});

module.exports = { NewsTagPayloadSchema, NewsTagParamsSchema };
