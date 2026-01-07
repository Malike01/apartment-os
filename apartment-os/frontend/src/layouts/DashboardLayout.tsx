import React from "react";
import { Layout, Menu, Button, theme } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import styles from "./DashboardLayout.module.css";
import { SIDEBAR_MENU_ITEMS } from "../constants/dashboardMenu";
import logo from "../../public/apartmen-os-logo.png";

const { Header, Sider, Content } = Layout;

export const DashboardLayout: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Layout className={styles.mainLayout}>
      <Sider
        breakpoint="lg"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        className={styles.sider}
        style={{
          borderRadius: "16px 16px 16px 16px",
          overflow: "hidden",
          margin: "0px 10px 10px 0px",
        }}
      >
        <img src={logo} alt="NetPortfoy Logo" className={styles.logo} />
        <Menu
          mode="inline"
          theme="light"
          style={{ flex: 1, overflowY: "auto", borderRight: 0 }}
          defaultSelectedKeys={["1"]}
          items={SIDEBAR_MENU_ITEMS.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: item.label,
            onClick: item.path ? () => navigate(item.path!) : undefined,
          }))}
        />
        {!collapsed && (
          <div className={styles.promoBanner}>
            <div className={styles.promoContent}>
              <div className={styles.promoTitle}>Premium 🚀</div>
              <div className={styles.promoText}>
                Sınırsız özellikler için yükseltin.
              </div>
            </div>
            <Button className={styles.promoButton}>Yükselt</Button>
          </div>
        )}
      </Sider>
      <Layout>
        <Header
          className={styles.header}
          style={{
            background: colorBgContainer,
            borderRadius: 16,
            margin: "12px 12px 0px 12px",
          }}
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
