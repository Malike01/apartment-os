import React, { useState } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuthStore } from "../../../store/authStore";
import { AuthForm } from "./components/AuthForm";

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = async (values: any) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/login", values);
      login(response.data.access_token, response.data.user);
      message.success("Giriş başarılı!");
      navigate("/");
    } catch (error) {
      message.error("Giriş başarısız. Bilgilerinizi kontrol edin.");
    } finally {
      setLoading(false);
    }
  };

  return <AuthForm type="login" onFinish={handleLogin} loading={loading} />;
};

export default LoginPage;
