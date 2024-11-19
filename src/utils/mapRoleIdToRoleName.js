const mapRoleIdToRoleName = (roleId) => {
  const rolesMap = {
    1: 'admin',
    2: 'redaktur',
    3: 'reporter',
  };
  return rolesMap[roleId] || 'unknown';
};

module.exports = mapRoleIdToRoleName;
