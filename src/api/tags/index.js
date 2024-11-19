const TagsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'tags',
  version: '1.0.0',
  register: async (server, { service, logService, validator }) => {
    const tagsHandler = new TagsHandler(service, logService, validator);
    server.route(routes(tagsHandler));
  },
};
