// --- APP CONFIG ---
export const APP_CONFIG = {
  NAME: "ApartmentOS",
  DESCRIPTION: "Profesyonel Site Yönetim Platformu",
  VERSION: "1.0.0",
  COPYRIGHT: `© ${new Date().getFullYear()} ApartmentOS Inc.`,
};

export const COLORS = {
  PRIMARY: "#231942",
  SECONDARY: "#5E548E",
  SUCCESS: "#4c956c",
  WARNING: "#ee9b00",
  ERROR: "#a41623",
  INFO: "#90dbf4",

  TEXT: {
    PRIMARY: "rgba(0, 0, 0, 0.88)",
    SECONDARY: "rgba(0, 0, 0, 0.65)",
    DISABLED: "rgba(0, 0, 0, 0.25)",
  },

  BACKGROUND: {
    BODY: "#f0f2f5",
    CONTAINER: "#ffffff",
    SIDEBAR: "#001529",
  },

  BORDER: "#d9d9d9",
};

// Typography
export const FONT_SIZES = {
  XS: "12px",
  SM: "14px",
  MD: "16px", // Base body size
  LG: "20px", // Card Titles
  XL: "24px", // Page Titles
  XXL: "30px", // Dashboard Stats
  XXXL: "38px", // Hero Titles
};

// Layout
export const LAYOUT_CONFIG = {
  HEADER_HEIGHT: 64,
  SIDER_WIDTH: 220,
  SIDER_COLLAPSED_WIDTH: 80,
  CONTENT_PADDING: 24,
  BORDER_RADIUS: 8,
};

// --- API ENDPOINTS ---
export const API_ROUTES = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  ME: "/auth/me",
  PROPERTIES: "/properties",
  BLOCKS: "/blocks",
  UNITS: "/units",
  RESIDENTS: "/residents",
};

// --- APP ROUTES ---
export const APP_ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/",
  PROPERTIES: "/properties",
  CUSTOMERS: "/customers",
  USERS: "/users",
};

// --- ROLES & PERMISSIONS ---
export const ROLES = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
};

// --- BUSINESS LOGIC CONSTANTS ---

export const RESIDENT_TYPES = {
  OWNER: "OWNER",
  TENANT: "TENANT",
};

export const RESIDENT_TYPE_OPTIONS = [
  { label: "Kat Maliki (Ev Sahibi)", value: RESIDENT_TYPES.OWNER },
  { label: "Kiracı", value: RESIDENT_TYPES.TENANT },
];

export const UNIT_TYPES = [
  { label: "1+0 (Stüdyo)", value: "1+0" },
  { label: "1+1", value: "1+1" },
  { label: "2+1", value: "2+1" },
  { label: "3+1", value: "3+1" },
  { label: "4+1", value: "4+1" },
  { label: "Dubleks", value: "duplex" },
  { label: "Ticari", value: "commercial" },
];

export const TRANSACTION_TYPES = {
  INCOME: "INCOME",
  EXPENSE: "EXPENSE",
};

export const EXPENSE_CATEGORIES = [
  { label: "Elektrik", value: "electricity" },
  { label: "Su", value: "water" },
  { label: "Doğalgaz", value: "gas" },
  { label: "Personel/Maaş", value: "staff" },
  { label: "Bakım/Onarım", value: "maintenance" },
  { label: "Temizlik", value: "cleaning" },
  { label: "Demirbaş", value: "fixture" },
];
