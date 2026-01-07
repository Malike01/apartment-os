import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ConfigProvider } from "antd";
import { COLORS, LAYOUT_CONFIG, FONT_SIZES } from "./constants";
import "./utils/chartSetup";
import { BrowserRouter } from "react-router-dom";
import { color } from "chart.js/helpers";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: COLORS.PRIMARY,
            colorSuccess: COLORS.SUCCESS,
            colorWarning: COLORS.WARNING,
            colorError: COLORS.ERROR,
            colorInfo: COLORS.INFO,
            borderRadius: LAYOUT_CONFIG.BORDER_RADIUS,
            fontFamily:
              "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            fontSize: parseInt(FONT_SIZES.SM),
          },
          components: {
            Layout: {
              colorBgBody: COLORS.BACKGROUND.BODY,
              colorBgHeader: COLORS.BACKGROUND.CONTAINER,
              siderBg: COLORS.BACKGROUND.CONTAINER,
              triggerBg: COLORS.BACKGROUND.CONTAINER,
              triggerColor: COLORS.PRIMARY,
            },
            Card: {
              colorBgContainer: COLORS.BACKGROUND.CONTAINER,
              borderRadiusLG: LAYOUT_CONFIG.BORDER_RADIUS,
            },
            Menu: {
              colorItemText: COLORS.PRIMARY,
              colorItemTextHover: COLORS.PRIMARY,
              colorItemTextSelected: COLORS.BACKGROUND.BODY,
              colorItemBgSelected: COLORS.PRIMARY,
            },
          },
        }}
      >
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </StrictMode>
);
