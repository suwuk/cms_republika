const Joi = require('joi');

const UserPayloadSchema = Joi.object({
  username: Joi.string().required(),
  fullname: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  forgetPassword: Joi.string(),
  roleId: Joi.number().integer(),
});

module.exports = { UserPayloadSchema };
