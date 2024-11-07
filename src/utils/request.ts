import axios, { type AxiosInstance } from "axios";
import { AdMessage } from "@/utils/AntdGlobal";
import { Local } from "@/utils/storage";
import { formatErrMsg } from "@/utils/common";

// 白名单，不需要 token 的接口
const whiteList = ["/mock/login/"];

// 退出登录并强制刷新页面
function forceLogout() {
  Local.remove("token");
  Local.remove("refresh");
  Local.remove("userInfo");
  window.location.reload();
}

// 新建一个 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 1000 * 5,
  headers: { "Content-Type": "application/json" },
});

// 配置请求拦截器
service.interceptors.request.use(
  // 在发送请求之前做些什么
  config => {
    if (config.url && !whiteList.includes(config.url)) {
      if (Local.has("token")) {
        config.headers.Authorization = `Bearer ${Local.get("token")}`;
      } else {
        forceLogout();
        return Promise.reject("token不存在，请重新登录");
      }
    }
    return config;
  },
  // 对请求错误做些什么
  error => {
    return Promise.reject(error);
  }
);

// 配置响应拦截器
service.interceptors.response.use(
  // 在 2xx 范围内的状态码都会触发该函数
  async response => {
    const { config, data } = response;
    // if (config.url !== "/api/token/refresh/" && data.code && data.code !== 200) {
    // 	if (data.msg && data.msg.code === "token_not_valid") {
    // 		const { refresh, msg } = await resetToken(); // token 过期，需要重新获取
    // 		if (refresh) {
    // 			return await service.request(config); // 重新发送请求，返回请求结果
    // 		} else {
    // 			AdMessage.error(msg);
    // 		}
    // 	} else {
    // 		AdMessage.error(formatErrMsg(data.msg));
    // 	}
    // }
    return data;
  },
  // 超出 2xx 范围的状态码都会触发该函数
  error => {
    const { message, response } = error;
    if (message.indexOf("timeout") != -1) {
      AdMessage.error("网络超时");
    } else if (message == "Network Error") {
      AdMessage.error("网络连接错误");
    } else if (response.status === 404) {
      AdMessage.error("找不到接口路径");
    } else if (response.status) {
      AdMessage.error(response.statusText);
    }
    return Promise.reject(error);
  }
);

// 导出 axios 实例
export default service;
