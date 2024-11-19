const MenusHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'menus',
  version: '1.0.0',
  register: async (server, { service, logService, validator }) => {
    const menusHandler = new MenusHandler(service, logService, validator);
    server.route(routes(menusHandler));
  },
};
