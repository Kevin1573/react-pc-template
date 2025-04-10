// import { AppstoreOutlined, MailOutlined, SettingOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    key: "/blank",
    // icon: <MailOutlined />,
    label: "空白页",
  },
  {
    key: "/home",
    label: "首页",
    // icon: <MailOutlined />,
  },
  {
    key: "sub1",
    children: [
      {
        key: "/basictable",
        label: "基础表格",
      },
      {
        key: "/formtable",
        label: "完整表格",
      },
      {
        key: "/usertable",
        label: "用户管理",
      },
    ],
    label: "表格",
  },
  {
    key: "sub2-demo",
    label: "转换",
    children: [
      {
        key: "/text-parse",
        label: "文本转换",
      },
    ],
  },
  {
    key: "/json-diff",
    label: "json diff page",
  },
  {
    type: "divider",
  },
  {
    key: "sub2",
    // icon: <AppstoreOutlined />,
    label: "异常页",
    children: [
      { key: "/403", label: "403" },
      { key: "/404", label: "404" },
    ],
  },
  {
    key: "systemManagers",
    // icon: <SettingOutlined />,
    label: "系统管理",
    children: [
      {
        key: "systemTenant",
        label: "租户管理",
        type: "group",
        children: [{ key: "/system/tenant/list", label: "租户列表" }],
      },
    ],
  },
];

export default items;
