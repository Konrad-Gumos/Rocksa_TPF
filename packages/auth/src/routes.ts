export const defaultRouteForRole = (role: string): "/" | "/workspace/overview" =>
  role === "curator" || role === "admin" ? "/workspace/overview" : "/";
