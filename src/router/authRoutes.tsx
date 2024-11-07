import { Navigate, useLocation } from "react-router-dom";
import { useRouteStore } from "@/store/route";
import { Local } from "@/utils/storage";

interface AuthRoutesProps {
  children: React.ReactElement | null;
}

// 路由鉴权组件
export default function AuthRoutes({ children }: AuthRoutesProps) {
  // 获取登录状态
  const isLogin = Local.has("token") && Local.has("userInfo");
  // 获取全局路由数据
  const { pageRoutes, getPageRoutes } = useRouteStore();
  // 获取目标路由数据
  const location = useLocation();
  // 判断是否已登录
  if (isLogin) {
    if (pageRoutes.length === 0) {
      // 已登录但无路由数据，先获取路由数据再渲染页面
      getPageRoutes().then(() => <>{children}</>);
    } else if (location.pathname == "/login") {
      // 已登录的状态下前往登录页，跳转回首页
      return <Navigate to="/home" replace />;
    } else {
      // 已登录且有路由数据，直接渲染页面
      return <>{children}</>;
    }
  } else {
    if (location.pathname == "/login") {
      // 未登录的状态下前往登录页，打开登录页
      return <>{children}</>;
    } else {
      // 未登录的状态下前往其它页面则跳转到登录页面，state保存目标路由
      return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }
  }
}
