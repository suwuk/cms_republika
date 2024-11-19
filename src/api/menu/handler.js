const autoBind = require('auto-bind');

class MenusHandler {
  constructor(service, logService, validator) {
    this._service = service;
    this._logService = logService;
    this._validator = validator;

    autoBind(this);
  }

  async postMenuHandler(request, h) {
    this._validator.validateMenuPayload(request.payload);
    const {
      name, url, status, id_parent,
    } = request.payload;

    const menuId = await this._service.addMenu({
      name,
      url,
      status,
      id_parent,
    });

    const { id: credentialId, fullname } = request.auth.credentials;

    await this._logService.addLog(
      credentialId,
      fullname,
      'ADD_MENU',
      `Adding menu with ID: ${menuId}`,
    );

    const response = h.response({
      status: 'success',
      message: 'Menu berhasil ditambahkan',
      data: {
        menuId,
      },
    });
    response.code(201);
    return response;
  }

  async getMenusHandler() {
    const menus = await this._service.getMenus();
    return {
      status: 'success',
      data: {
        menus,
      },
    };
  }

  async getMenuByIdHandler(request) {
    const { id } = request.params;
    const menu = await this._service.getMenuById(id);
    return {
      status: 'success',
      data: {
        menu,
      },
    };
  }

  async putMenuByIdHandler(request) {
    this._validator.validateMenuPayload(request.payload);
    const { id } = request.params;

    await this._service.editMenuById(id, request.payload);

    const { id: credentialId, fullname } = request.auth.credentials;

    await this._logService.addLog(
      credentialId,
      fullname,
      'EDIT_MENU',
      `Updated menu with ID: ${id}`,
    );

    return {
      status: 'success',
      message: 'Menu berhasil diperbarui',
    };
  }

  async deleteMenuByIdHandler(request) {
    const { id } = request.params;
    await this._service.deleteMenuById(id);

    const { id: credentialId, fullname } = request.auth.credentials;

    await this._logService.addLog(
      credentialId,
      fullname,
      'DELETE_MENU',
      `Deleted menu with ID: ${id}`,
    );

    return {
      status: 'success',
      message: 'Menu berhasil dihapus',
    };
  }
}

module.exports = MenusHandler;
