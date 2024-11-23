export const rolesToInt = (roles: string): number => {
  switch (roles) {
    case "superadmin":
      return 0;
    case "admin":
      return 1;
    case "dev":
      return 2;
    case "poster":
      return 3;
    default:
      return 4;
  }
};

export const intToRoles = (role: number): string => {
  switch (role) {
    case 0:
      return "superadmin";
    case 1:
      return "admin";
    case 2:
      return "dev";
    case 3:
      return "poster";
    default:
      return "shopper";
  }
};

export const roles = ["superadmin", "admin", "dev", "poster"];

export const rolesToOptions = roles.map((role) => ({
  label: role,
  value: rolesToInt(role),
}));

export const isRoleSupported = (role: string): boolean => {
  return roles.includes(role);
};
