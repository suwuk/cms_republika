const autoBind = require('auto-bind');

class MenuRolesHandler {
  constructor(service, logService, validator) {
    this._service = service;
    this._logService = logService;
    this._validator = validator;

    autoBind(this);
  }

  async postMenuRoleHandler(request, h) {
    // this._validator.validateMenuRolePayload(request.payload);
    const { roleId, menuId } = request.payload;
    const { id: credentialId, fullname, roles } = request.auth.credentials;
    if (!roles.includes('admin')) {
      const response = h.response({
        status: 'fail',
        message: 'Anda tidak memiliki akses untuk menambahkan menu role',
      });
      response.code(403);
      return response;
    }

    const menuRole = await this._service.addMenuRole(roleId, menuId);
    await this._logService.addLog(
      credentialId,
      fullname,
      'ADD_MENU_ROLE',
      `Added menu role with roleId: ${roleId} and menuId: ${menuId}`,
    );

    const response = h.response({
      status: 'success',
      message: 'Menu role berhasil ditambahkan',
      data: menuRole,
    });
    response.code(201);
    return response;
  }

  async postBulkMenuRolesHandler(request, h) {
    try {
      this._validator.validateMenuRoleBulkPayload(request.payload);
      const { roleId, menuIds } = request.payload;

      await this._service.addBulkMenuRoles(roleId, menuIds);

      await this._logService.addLog({
        action: 'BULK_ADD',
        module: 'menu_roles',
        user: request.auth.credentials.username,
        data: { roleId, menuIds },
      });

      const response = h.response({
        status: 'success',
        message: 'Menu roles berhasil ditambahkan',
      });
      response.code(201);
      return response;
    } catch (error) {
      await this._logService.addLog({
        action: 'BULK_ADD',
        module: 'menu_roles',
        user: request.auth.credentials.username,
        data: request.payload,
        error: error.message,
      });
      throw error;
    }
  }

  async getMenuRolesByRoleIdHandler(request) {
    const { roleId } = request.params;
    const menuRoles = await this._service.getMenuRolesByRoleId(roleId);
    return {
      status: 'success',
      data: {
        menuRoles,
      },
    };
  }

  async deleteMenuRoleHandler(request) {
    const { roleId, menuId } = request.params;
    await this._service.deleteMenuRole(roleId, menuId);

    const { id: credentialId, fullname } = request.auth.credentials;
    await this._logService.addLog(
      credentialId,
      fullname,
      'DELETE_MENU_ROLE',
      `Deleted menu role with roleId: ${roleId} and menuId: ${menuId}`,
    );

    return {
      status: 'success',
      message: 'Menu role berhasil dihapus',
    };
  }
}

module.exports = MenuRolesHandler;
