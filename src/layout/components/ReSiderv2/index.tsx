import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu } from "antd";
import { type ItemType } from "antd/es/menu/interface";
// import { useThemeStore } from "@/store/theme";
// import { findParentNode } from "@/utils/common";
import { AppstoreOutlined, MailOutlined, SettingOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useThemeStore } from "@/store/theme";

const { Sider } = Layout;
interface ReSiderProps {
  menuTree: ItemType[];
  collapsed: boolean;
  onCollapse: (broken: boolean) => void;
}

interface LevelKeysProps {
  key?: string;
  children?: LevelKeysProps[];
}

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    key: "/blank",
    icon: <MailOutlined />,
    label: "空白页",
  },
  {
    key: "/home",
    label: "首页",
    icon: <MailOutlined />,
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
    type: "divider",
  },
  {
    key: "sub2",
    icon: <AppstoreOutlined />,
    label: "异常页",
    children: [
      { key: "/403", label: "403" },
      { key: "/404", label: "404" },
      // {
      //   key: "23",
      //   label: "Submenu",
      //   children: [
      //     { key: "231", label: "Option 1" },
      //     { key: "232", label: "Option 2" },
      //     { key: "233", label: "Option 3" },
      //   ],
      // },
      // {
      //   key: "24",
      //   label: "Submenu 2",
      //   children: [
      //     { key: "241", label: "Option 1" },
      //     { key: "242", label: "Option 2" },
      //     { key: "243", label: "Option 3" },
      //   ],
      // },
    ],
  },
  {
    key: "systemManagers",
    icon: <SettingOutlined />,
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

const getLevelKeys = (items1: LevelKeysProps[]) => {
  const key: Record<string, number> = {};
  const func = (items2: LevelKeysProps[], level = 1) => {
    items2.forEach(item => {
      if (item.key) {
        key[item.key] = level;
      }
      if (item.children) {
        func(item.children, level + 1);
      }
    });
  };
  func(items1);
  return key;
};

const levelKeys = getLevelKeys(items as LevelKeysProps[]);

export default function ReSiderv2({ menuTree, collapsed, onCollapse }: ReSiderProps) {
  const navigate = useNavigate();
  const [stateOpenKeys, setStateOpenKeys] = useState(["/home"]);
  const isDark = useThemeStore(state => state.isDark);
  console.log("menuTree", menuTree, items);

  const onOpenChange: MenuProps["onOpenChange"] = openKeys => {
    const currentOpenKey = openKeys.find(key => stateOpenKeys.indexOf(key) === -1);
    // open
    if (currentOpenKey !== undefined) {
      const repeatIndex = openKeys
        .filter(key => key !== currentOpenKey)
        .findIndex(key => levelKeys[key] === levelKeys[currentOpenKey]);

      setStateOpenKeys(
        openKeys
          // remove repeat key
          .filter((_, index) => index !== repeatIndex)
          // remove current level all child
          .filter(key => levelKeys[key] <= levelKeys[currentOpenKey])
      );
    } else {
      // close
      setStateOpenKeys(openKeys);
    }
  };

  const selectRoute = (e: any) => {
    navigate(e.key);
  };

  const breakpoint = (broken: boolean) => {
    onCollapse(broken);
  };

  return (
    <Sider
      breakpoint="xl"
      width="220"
      trigger={null}
      collapsible={true}
      collapsed={collapsed}
      onBreakpoint={breakpoint}
    >
      <Menu
        theme={isDark === "dark" ? "dark" : "light"}
        mode="inline"
        style={{ height: "100%" }}
        defaultSelectedKeys={["/home"]}
        openKeys={stateOpenKeys}
        onOpenChange={onOpenChange}
        onSelect={selectRoute}
        items={menuTree}
      />
    </Sider>
  );
}
