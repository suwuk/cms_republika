const InvariantError = require('../../exceptions/InvariantError');
const { TagPayloadSchema } = require('./schema');

const TagsValidator = {
  validateTagPayload: (payload) => {
    const validationResult = TagPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = TagsValidator;
