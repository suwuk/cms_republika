const MenuRolesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'menuroles',
  register: async (server, { service, logService, validator }) => {
    const menuRolesHandler = new MenuRolesHandler(service, logService, validator);
    server.route(routes(menuRolesHandler));
  },
};
