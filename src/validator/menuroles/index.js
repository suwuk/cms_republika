const InvariantError = require('../../exceptions/InvariantError');
const { MenuRolePayloadSchema, MenuRoleBulkPayloadSchema } = require('./schema');

const MenuRolesValidator = {
  validateMenuRolePayload: (payload) => {
    const validationResult = MenuRolePayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateMenuRoleBulkPayload: (payload) => {
    const validationResult = MenuRoleBulkPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = MenuRolesValidator;
