import React, { type ReactElement } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "antd";

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ConfigProvider>
      <BrowserRouter>{children}</BrowserRouter>
    </ConfigProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
