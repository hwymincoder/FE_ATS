export function hasAllowedRole(userRole, allowedRoles) {
  if (!allowedRoles?.length) {
    return true;
  }

  return allowedRoles.includes(userRole);
}
