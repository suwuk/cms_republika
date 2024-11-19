const InvariantError = require('../../exceptions/InvariantError');
const { MediaPayloadSchema } = require('./schema');

const MediaValidator = {
  validateMediaPayload: (payload) => {
    const validationResult = MediaPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = MediaValidator;
