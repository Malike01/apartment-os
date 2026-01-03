import React from "react";
import { Layout, Menu, Button, theme } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import styles from "./DashboardLayout.module.css";
import { SIDEBAR_MENU_ITEMS } from "../constants/dashboardMenu";

const { Header, Sider, Content } = Layout;

export const DashboardLayout: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Layout className={styles.mainLayout}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div className={styles.logo}>
          ApartmentOS
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={SIDEBAR_MENU_ITEMS.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: item.label,
            onClick: item.path ? () => navigate(item.path!) : undefined,
          }))}
        />
      </Sider>
      <Layout>
        <Header
          className={styles.header}
          style={{ background: colorBgContainer }}
        >
          <span className={styles.welcomeText}>Hoşgeldin, {user?.email}</span>
          <Button type="text" icon={<LogoutOutlined />} onClick={handleLogout}>
            Çıkış
          </Button>
        </Header>
        <Content className={styles.content}>
          <div
            className={styles.contentInner}
            style={{
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
