import { create } from "zustand";
import { getBackendRoute } from "@/api";
import { AdMessage } from "@/utils/AntdGlobal";
import frontEndRoutes from "@/router/frontEnd"; // 引入前端静态路由

interface RouteStore {
  pageRoutes: PageRouteItem[];
  getPageRoutes: () => Promise<PageRouteItem[]>;
}

export const useRouteStore = create<RouteStore>((set, get) => ({
  pageRoutes: [],
  getPageRoutes: async () => {
    if (JSON.parse(import.meta.env.VITE_USE_FRONT_ROUTE)) {
      // 获取前端静态路由
      set({ pageRoutes: frontEndRoutes });
    } else {
      // 获取后端动态路由
      try {
        const { code, data } = await getBackendRoute();
        if (code !== 200) throw new Error();
        set({ pageRoutes: data });
      } catch (error) {
        console.error(error);
        AdMessage.error("路由获取失败");
        set({
          // 设置默认路由404
          pageRoutes: [
            {
              id: "/404",
              parent: 0,
              order_num: 0,
              path: "/404",
              element: "/Error/404",
              meta: {
                label: "404",
                icon: null,
                isRouter: true,
              },
            },
          ],
        });
      }
    }
    return get().pageRoutes;
  },
}));
