const MediaHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'media',
  version: '1.0.0',
  register: async (server, { service, logService, validator }) => {
    const mediaHandler = new MediaHandler(service, logService, validator);
    server.route(routes(mediaHandler));
  },
};
