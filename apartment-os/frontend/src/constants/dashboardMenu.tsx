import React from "react";
import {
  HomeOutlined,
  UserOutlined,
  BankOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { APP_ROUTES } from "./index";

export interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  path?: string;
}

export const SIDEBAR_MENU_ITEMS: MenuItem[] = [
  {
    key: APP_ROUTES.HOME,
    icon: <HomeOutlined />,
    label: "Genel Bakış",
    path: APP_ROUTES.HOME,
  },
  {
    key: APP_ROUTES.PROPERTIES,
    icon: <BankOutlined />,
    label: "Sitelerim",
    path: APP_ROUTES.PROPERTIES,
  },
  {
    key: APP_ROUTES.RESIDENTS,
    icon: <UserOutlined />,
    label: "Sakinler",
  },
  {
    key: APP_ROUTES.FINANCE,
    icon: <WalletOutlined />,
    label: "Kasa & Finans",
    path: APP_ROUTES.FINANCE,
  },
];
