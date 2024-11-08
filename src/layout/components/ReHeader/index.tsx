import React, { useEffect, useState } from "react";
import { Breadcrumb, Layout, Avatar, Dropdown, type MenuProps } from "antd";
import { type ItemType } from "antd/es/menu/interface";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import { useUserInfoStore } from "@/store/userInfo";
import { findParentNode } from "@/utils/common";
import { AdModal } from "@/utils/AntdGlobal";
import { Local } from "@/utils/storage";
import ThemeSwitch from "@/components/ThemeSwitch";
import SvgIcon from "@/components/SvgIcon";
import no_avatar from "@/assets/images/no-avatar.png";
import styles from "./index.module.scss";

interface UserAvatarProps {
  src: string;
}
const UserAvatar = React.memo(({ src }: UserAvatarProps) => {
  return <Avatar src={src} size={38} alt="avatar" style={{ margin: "0 10px" }} />;
});

const { Header } = Layout;
interface ReHeaderProps {
  menuTree: ItemType[];
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

// 下拉菜单项
const dropdownItems: MenuProps["items"] = [
  {
    key: 1,
    icon: <SvgIcon name="github" size="1.2em" />,
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://github.com/BensonStark">
        GitHub
      </a>
    ),
  },
  {
    key: 2,
    icon: <SvgIcon name="gitee" size="1.2em" />,
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://gitee.com/mj-project">
        Gitee
      </a>
    ),
  },
  {
    type: "divider",
  },
  {
    key: 3,
    icon: <SvgIcon name="logout" size="1.2em" />,
    label: (
      <a target="" onClick={handleLogout}>
        退出登录
      </a>
    ),
  },
];

// 退出登录
function handleLogout() {
  AdModal.confirm({
    title: "系统提示",
    content: "是否确认退出登录？",
    okText: "确认",
    cancelText: "取消",
    centered: true,
    onOk: () => {
      Local.remove("token");
      Local.remove("refresh");
      Local.remove("userInfo");
      window.location.reload();
    },
  });
}

// 递归获取面包屑文本
function extractLabels(obj: any, key: string) {
  // 初始化结果数组
  var labels: any = [];
  // 如果对象有标签信息 label，则将其添加到结果数组中
  if (obj.label) {
    labels.push({ title: obj.label });
  }
  // 如果对象有子数组 children，则递归遍历 children
  if (Array.isArray(obj.children)) {
    obj.children.forEach((child: any) => {
      if (child.key === key) {
        // 递归调用 extractLabels 函数，并将结果合并到 labels 数组中
        labels = labels.concat(extractLabels(child, key));
      }
    });
  }
  // 返回结果数组
  return labels;
}

export default function ReHeader({ menuTree, collapsed, onCollapse }: ReHeaderProps) {
  const { pathname } = useLocation();
  const [breadcrumbs, setBreadcrumds] = useState([]);

  // 获取用户信息
  const userInfo = useUserInfoStore(state => state.userInfo);

  useEffect(() => {
    const res = findParentNode(pathname, menuTree);
    setBreadcrumds(extractLabels(res, pathname));
  }, [pathname]);

  return (
    <Header className={styles.header}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {collapsed ? (
          <MenuUnfoldOutlined
            style={{ marginRight: "10px" }}
            onClick={() => {
              onCollapse(false);
            }}
          />
        ) : (
          <MenuFoldOutlined
            style={{ marginRight: "10px" }}
            onClick={() => {
              onCollapse(true);
            }}
          />
        )}
        <Breadcrumb items={breadcrumbs} />
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <ThemeSwitch />
        <UserAvatar src={userInfo?.avatar || no_avatar} />
        <Dropdown menu={{ items: dropdownItems }} placement="bottomRight" arrow>
          <span onClick={e => e.preventDefault()} style={{ fontWeight: 500 }}>
            {userInfo?.username}
          </span>
        </Dropdown>
      </div>
    </Header>
  );
}
