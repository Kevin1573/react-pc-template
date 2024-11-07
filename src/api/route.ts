import request from "@/utils/request";

// 获取后端路由
export function getBackendRoute(): Promise<HttpResultType> {
  return request.get("/mock/backendRoute/");
}
