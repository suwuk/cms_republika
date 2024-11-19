const { NewsPayloadSchema } = require('./schema');

const NewsValidator = {
  validateNewsPayload: (payload) => {
    const validationResult = NewsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new Error(validationResult.error.message);
    }
  },
};

module.exports = NewsValidator;
