// 模拟从后端获取的路由数据
export default <PageRouteItem[]>[
  {
    id: "/home",
    parent: null,
    order_num: 1,
    path: "/home",
    element: "/Home/index",
    meta: {
      label: "首页",
      icon: "TdesignHome",
      isRouter: true,
    },
  },
  {
    id: "sub1",
    parent: null,
    order_num: 2,
    path: null,
    element: null,
    meta: {
      label: "表格",
      icon: "TdesignTable",
      isRouter: false,
    },
  },
  {
    id: "/basictable",
    parent: "sub1",
    order_num: 1,
    path: "/basictable",
    element: "/Tables/BasicTable",
    meta: {
      label: "基础表格",
      icon: "TdesignTable1",
      isRouter: true,
    },
  },
  {
    id: "sub2",
    parent: null,
    order_num: 3,
    path: null,
    element: null,
    meta: {
      label: "异常页",
      icon: "TdesignChatBubbleError",
      isRouter: false,
    },
  },
  {
    id: "/403",
    parent: "sub2",
    order_num: 1,
    path: "/403",
    element: "/Error/403",
    meta: {
      label: "403",
      icon: "TdesignErrorCircle",
      isRouter: true,
    },
  },
  {
    id: "/404",
    parent: "sub2",
    order_num: 2,
    path: "/404",
    element: "/Error/404",
    meta: {
      label: "404",
      icon: "TdesignErrorTriangle",
      isRouter: true,
    },
  },
];
