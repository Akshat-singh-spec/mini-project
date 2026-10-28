export function dashboardPathForRole(role) {
  switch (role) {
    case "DONOR":
      return "/donor/dashboard";
    case "NGO":
      return "/ngo/dashboard";
    case "ADMIN":
      return "/admin/dashboard";
    default:
      return "/";
  }
}
