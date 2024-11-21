import Mock from "mockjs";
import { defineMock } from "vite-plugin-mock-dev-server";
import { resultSuccess, pageResultSuccess } from "./utils";

export default defineMock([
  {
    url: "/mock/users/",
    delay: [150, 250],
    method: ["GET"],
    body: ({ query }) => {
      const { page, limit } = query;
      const mockData = Mock.mock({
        "list|38": [
          {
            "id|+1": 1, // id 从 1 开始，每次加 1
            name: "@name", // 使用 Mock.js 的内置占位符生成随机姓名
            "gender|1": ["male", "female"], // 随机选择 'male' 或 'female'
            "age|18-60": 1, // 随机生成一个 18 到 60 之间的整数
            address: function () {
              // 生成详细的地址信息并拼接成一个字符串
              const province = Mock.mock("@province"); // 随机省份
              const city = Mock.mock("@city"); // 随机城市
              const county = Mock.mock("@county"); // 随机县
              return `${province} ${city} ${county}`;
            },
            "isAdmin|1": true, // 随机生成布尔值
            "roles|1-3": ["@ctitle(2, 4)"], // 生成一个包含 1 到 3 个随机单词的数组
          },
        ],
      });
      return pageResultSuccess(Number(page), Number(limit), mockData.list);
    },
  },
  {
    url: "/mock/userInfo/",
    delay: [50, 150],
    method: ["GET"],
    body: () => {
      return resultSuccess(
        {
          id: 1,
          avatar: null,
          username: "Benson",
        },
        "用户信息获取成功"
      );
    },
  },
  {
    url: "/mock/userRoles/",
    delay: [50, 150],
    method: ["GET"],
    body: ({ query }) => {
      const { page, limit } = query;
      const mockData = Mock.mock({
        "list|5-10": [
          {
            "id|+1": 1, // 角色 ID，从 1 开始递增
            name: "@ctitle(2, 4)", // 角色名称，随机生成 3 到 5 个汉字的标题
            description: "@cparagraph(1, 3)", // 角色描述，随机生成 1 到 3 段中文段落
          },
        ],
      });
      if (page === "all") {
        return resultSuccess({ data: mockData.list, total: mockData.list.length });
      } else {
        return pageResultSuccess(Number(page), Number(limit), mockData.list);
      }
    },
  },
]);
