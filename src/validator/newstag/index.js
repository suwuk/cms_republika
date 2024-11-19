const { NewsTagPayloadSchema, NewsTagParamsSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const NewsTagValidator = {
  validateNewsTagPayload: (payload) => {
    const validationResult = NewsTagPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateNewsTagParams: (params) => {
    const validationResult = NewsTagParamsSchema.validate(params);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = NewsTagValidator;
