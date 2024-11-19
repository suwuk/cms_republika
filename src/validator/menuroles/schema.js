const Joi = require('joi');

const MenuRolePayloadSchema = Joi.object({
  roleId: Joi.number().integer().required(),
  menuId: Joi.number().required(),
});

const MenuRoleBulkPayloadSchema = Joi.object({
  role_id: Joi.string().required(),
  menu_ids: Joi.array().items(Joi.string()).required(),
});

module.exports = {
  MenuRolePayloadSchema,
  MenuRoleBulkPayloadSchema,
};
