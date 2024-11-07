import request from "@/utils/request";

type LoginRequestData = {
  username: number | string;
  password: number | string;
};

// 用户登录
export function userLogin(data: LoginRequestData): Promise<HttpResultType> {
  return request.post("/mock/login/", data);
}

// 获取用户信息
export function getUserInfo(): Promise<HttpResultType> {
  return request.get("/mock/userInfo/");
}
