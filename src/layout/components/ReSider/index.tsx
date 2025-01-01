import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu } from "antd";
import { type ItemType } from "antd/es/menu/interface";
import { useThemeStore } from "@/store/theme";
import { findParentNode } from "@/utils/common";
import SvgIcon from "@/components/SvgIcon";
import styles from "./index.module.scss";

const { Sider } = Layout;
interface ReSiderProps {
  menuTree: ItemType[];
  collapsed: boolean;
  onCollapse: (broken: boolean) => void;
}

export default function ReSider({ menuTree, collapsed, onCollapse }: ReSiderProps) {
  const navigate = useNavigate();

  console.log('system', menuTree);

  const isDark = useThemeStore(state => state.isDark);
  const { pathname } = useLocation();
  const [defaultKey, setDefaultKey] = useState(["/home"]);
  const [defaultMenu, setDefaultMenu] = useState<string[]>([]);

  useEffect(() => {
    setDefaultKey([pathname]);
    const res = findParentNode(pathname, menuTree);
    res ? setDefaultMenu([res.key]) : setDefaultMenu([]);
    console.log('useEffect', defaultMenu);

  }, [pathname, menuTree]);

  const changeRoutes = (e: any) => {
    // setDefaultKey(e.key);
    setDefaultKey(e.keyPath);
    console.log('change routes', e);

    navigate(e.key);
  };

  const openChange = (keys: string[]) => {
    console.log('openChange', 'keys=',keys);

    if (keys.length) {
      // setDefaultMenu(["systemManagers"]);
      //setDefaultMenu(keys.slice(keys.length - 1));
      setDefaultMenu(keys)
    }
    else {
      setDefaultMenu([]);
    }
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
      <div className={styles.title}>
        <SvgIcon name="logo" size="1.1em" />
        {!collapsed ? <span className="ml6">React PC Template</span> : null}
      </div>
      <div className="bg-white">{JSON.stringify(defaultMenu)}</div>
      <Menu
        theme={isDark === "dark" ? "dark" : "light"}
        mode="inline"
        selectedKeys={defaultKey}
        openKeys={defaultMenu}
        style={{ height: "100%" }}
        items={menuTree}
        onOpenChange={openChange}
        onSelect={changeRoutes}
      />
    </Sider>
  );
}
