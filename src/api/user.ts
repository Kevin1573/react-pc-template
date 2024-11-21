import request from "@/utils/request";

// 获取用户列表
export function getUsers(params: AnyObjectType): Promise<HttpResultType> {
  return request.get("/mock/users/", { params });
}

// 获取用户信息
export function getUserInfo(params: AnyObjectType): Promise<HttpResultType> {
  return request.get("/mock/userInfo/", { params });
}

// 获取用户角色列表
export function getUserRoles(params: AnyObjectType): Promise<HttpResultType> {
  return request.get("/mock/userRoles/", { params });
}
