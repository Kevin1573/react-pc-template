import { useMemo } from "react";
import { ConfigProvider, theme, App as AntdApp } from "antd";
import { HashRouter, useRoutes } from "react-router-dom";
import { useThemeStore } from "./store/theme";
import { useRouteStore } from "@/store/route";
import getSystemRoutes from "./router/index";
import AuthRoutes from "./router/authRoutes";
import AntdGlobal from "./utils/AntdGlobal";
import zhCN from "antd/locale/zh_CN";
import "@/styles/global.scss";

import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
dayjs.locale("zh-cn");

function App() {
  // 订阅整个ThemeStore，无论store中的哪个部分发生变化，都会触发组件重新渲染
  // const { isDark, isLight } = useThemeStore();

  // 利用useShallow订阅store里的多个字段，只有当这些字段发生了变化，组件才会重新渲染
  // const { isDark, isLight } = useThemeStore(
  //   useShallow((state) => ({ isDark: state.isDark, isLight: state.isLight })),
  // );

  // 单独订阅isDark字段，只有当isDark发生变化时，组件才会重新渲染
  const isDark = useThemeStore(state => state.isDark);

  // 路由配置组件
  function GetRoutes() {
    const pageRoutes = useRouteStore(state => state.pageRoutes);
    const systemRoutes = useMemo(() => getSystemRoutes(pageRoutes), [pageRoutes]);
    const sysUseRoutes = useRoutes(systemRoutes);
    return <AuthRoutes>{sysUseRoutes}</AuthRoutes>;
  }

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: { colorPrimary: "#1677ff" },
        algorithm: isDark === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <AntdApp>
        <AntdGlobal /> {/* 引入全局API: AdMessage, AdNotification, AdModal */}
        <HashRouter>
          <GetRoutes /> {/* 配置路由并引入路由鉴权 */}
        </HashRouter>
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
