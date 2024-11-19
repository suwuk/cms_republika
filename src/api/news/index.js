const NewsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'news',
  version: '1.0.0',
  register: async (server, { service, logService, validator }) => {
    const newsHandler = new NewsHandler(service, logService, validator);
    server.route(routes(newsHandler));
  },
};

// untuk mongodb
// module.exports = {
//   name: 'news',
//   version: '1.0.0',
//   register: async (server, { service }) => {
//     const newsHandler = new NewsHandler(service);
//     server.route(routes(newsHandler));
//   },
// };
