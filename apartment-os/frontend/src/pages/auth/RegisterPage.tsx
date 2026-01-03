import React, { useState } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuthStore } from "../../../store/authStore";
import { AuthForm } from "./components/AuthForm";

const RegisterPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const onRegister = async (values: any) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/register", values);
      login(response.data.access_token, response.data.user);
      message.success("Kayıt başarılı!");
      navigate("/");
    } catch (error) {
      message.error("Kayıt başarısız. Bilgilerinizi kontrol edin.");
    } finally {
      setLoading(false);
    }
  };

  return <AuthForm type="register" onFinish={onRegister} loading={loading} />;
};

export default RegisterPage;
