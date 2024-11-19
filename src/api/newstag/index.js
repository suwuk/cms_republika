const NewsTagsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'newstags',
  version: '1.0.0',
  register: async (server, { service, logService, validator }) => {
    const newsTagsHandler = new NewsTagsHandler(service, logService, validator);
    server.route(routes(newsTagsHandler));
  },
};
