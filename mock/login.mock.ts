import { defineMock } from "vite-plugin-mock-dev-server";
import { resultSuccess, resultError } from "./utils";

export default defineMock([
  {
    url: "/mock/login",
    delay: [50, 150],
    method: ["POST"],
    body: ({ body }) => {
      const { username, password } = body;
      if (username === "admin" && password === "123456") {
        return resultSuccess(
          {
            token: "123456abc",
            refresh: "cba654321",
          },
          "登录成功"
        );
      } else {
        return resultError({}, "用户名或密码错误");
      }
    },
  },
  {
    url: "/mock/userInfo",
    delay: [50, 150],
    method: ["GET"],
    body: () => {
      return resultSuccess(
        {
          id: 1,
          username: "GGBOND",
        },
        "用户信息获取成功"
      );
    },
  },
]);
