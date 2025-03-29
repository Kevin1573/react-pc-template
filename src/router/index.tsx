import React from "react";
import { Navigate } from "react-router-dom";
import { lazyLoader } from "./lazyLoader";
import { cloneDeep } from "lodash";
import LayoutContent from "@/layout/layout";
import Login from "@/views/Login";
import Dashboard from "@/views/Dashboard";

// 获取 views 目录下的全部 .jsx .tsx 文件
// eslint-disable-next-line @typescript-eslint/ban-types
const viewsModules: Record<string, Function> = import.meta.glob("../views/**/*.{jsx,tsx}");

// 根据 path 匹配文件，返回 import 函数
const dynamicImport = (path: string) => {
  const keys = Object.keys(viewsModules);
  const matchKeys = keys.filter(key => {
    const k = key.replace(/..\/views|../, "");
    return k.startsWith(`${path}`) || k.startsWith(`/${path}`);
  });
  if (matchKeys.length === 1) {
    return viewsModules[matchKeys[0]];
  } else {
    return null;
  }
};

// 将后端路由数据转为 React Router 格式
const transformRoutes = (routes: PageRouteItem[]) => {
  return cloneDeep(routes)
    .filter(item => item.meta.isRouter)
    .map(item => {
      const { path, element } = item;
      const importFunc = dynamicImport(element as string);

      return {
        path: path as string,
        type: 'group',
        element: importFunc ? lazyLoader(React.lazy(importFunc as any)) : <Navigate to="/404"></Navigate>,
      };
    });
};

// 获取系统路由
export default function getSystemRoutes(pageRoutes: PageRouteItem[]) {
  return [
    {
      path: "/",
      element: <Navigate to="/login" />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />
    },
    {
      element: <LayoutContent />,
      children: [...transformRoutes(pageRoutes)],
    },
    {
      path: "*",
      element: <Navigate to="/404" />,
    },
  ];
}
