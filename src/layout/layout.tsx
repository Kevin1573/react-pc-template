import { useEffect, useMemo, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { Layout, type MenuProps } from "antd";
import { useRouteStore } from "@/store/route";
import { useUserInfoStore } from "@/store/userInfo";
import { constructTree } from "@/utils/common";
import { Local } from "@/utils/storage";
import SvgIcon from "@/components/SvgIcon";
import ReHeader from "./components/ReHeader";
import ReSider from "./components/ReSider";
import styles from "./layout.module.scss";

const { Content } = Layout;

// 菜单数据处理
type MenuItem = Required<MenuProps>["items"][number];
function getMenuItem(
  label: React.ReactNode,
  key: React.Key,
  iconName: string | null,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  const icon = iconName ? <SvgIcon name={iconName} size="1.2em" /> : null;
  return { key, icon, children, label, type } as MenuItem;
}
function getMenuTree(tree: AnyArrayType) {
  return tree.map(item => {
    // 如果存在子节点，则先递归处理子节点
    if (item.children && item.children.length > 0) {
      item.children = getMenuTree(item.children);
    }
    // 应用 getMenuItem 函数
    return getMenuItem(
      item.meta.label,
      item.meta.isRouter ? item.path : item.id,
      item.meta.icon,
      item.children
    );
  });
}

export default function LayoutContent() {
  const [collapsed, setCollapsed] = useState(false);
  // const collapsedRef = useRef(false);

  const handleCollapse = (collapsed: boolean) => {
    setCollapsed(collapsed);
    // collapsedRef.current = collapsed;
  };

  // 缓存菜单数据
  const pageRoutes = useRouteStore(state => state.pageRoutes);
  const menuTree = useMemo(() => getMenuTree(constructTree(pageRoutes)), [pageRoutes]);

  // 从缓存中提取用户信息
  const updateUserInfo = useUserInfoStore(state => state.updateUserInfo);
  useEffect(()=>{
    const userInfo = Local.get("userInfo");
    if (userInfo) updateUserInfo(userInfo);
  }, [updateUserInfo]);


  return (
    <Layout style={{ overflow: "hidden" }}>
      <ReSider menuTree={menuTree} collapsed={collapsed} onCollapse={handleCollapse} />
      <Layout>
        <ReHeader menuTree={menuTree} collapsed={collapsed} onCollapse={handleCollapse} />
        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
