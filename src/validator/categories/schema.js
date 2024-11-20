const Joi = require('joi');

const CategoryPayloadSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Nama kategori tidak boleh kosong',
    'any.required': 'Nama kategori harus diisi',
  }),
  id_parent: Joi.number().integer(),
  // slug: Joi.string().allow(null, '').messages({
  //   'string.base': 'Slug harus berupa string',
  // }),
});

module.exports = { CategoryPayloadSchema };
