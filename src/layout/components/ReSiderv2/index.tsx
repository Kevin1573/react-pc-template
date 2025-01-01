import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu } from "antd";
import { type ItemType } from "antd/es/menu/interface";
import { findParentNodev2 } from "@/utils/common";
import routeConfig from "@/router/routeConfig";

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

const levelKeys = getLevelKeys(routeConfig as LevelKeysProps[]);

export default function ReSiderv2({ menuTree, collapsed, onCollapse }: ReSiderProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [defaultSelectKey] = useState([pathname]);
  const [stateOpenKeys, setStateOpenKeys] = useState<string[]>([]);
  const isDark = useThemeStore(state => state.isDark);
  console.log("menuTree", menuTree, routeConfig);

  useEffect(() => {
    const res = findParentNodev2(pathname, routeConfig);
    setStateOpenKeys([res.key]);
  }, [pathname]);

  const onOpenChange: MenuProps["onOpenChange"] = openKeys => {
    console.log("openKeys", openKeys);

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
        defaultSelectedKeys={defaultSelectKey}
        defaultOpenKeys={stateOpenKeys}
        openKeys={stateOpenKeys}
        onOpenChange={onOpenChange}
        onSelect={selectRoute}
        items={routeConfig}
      />
    </Sider>
  );
}
