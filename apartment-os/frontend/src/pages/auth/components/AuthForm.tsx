import React from "react";
import { Form, Input, Button, Card, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

interface AuthFormProps {
  type: "login" | "register";
  onFinish: (values: any) => void;
  loading: boolean;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  type,
  onFinish,
  loading,
}) => {
  const isLogin = type === "login";

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      <Card
        style={{ width: 400, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
        bordered={false}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={3} style={{ marginBottom: 0 }}>
            {isLogin ? "ApartmentOS" : "Kayıt Ol"}
          </Title>
          <Text type="secondary">
            {isLogin ? "Yönetici Paneline Giriş" : "Yeni Yönetici Hesabı"}
          </Text>
        </div>

        <Form
          name={type}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Lütfen e-posta girin!",
                type: "email",
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="E-posta Adresi" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Lütfen şifre girin!", min: 6 }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Şifre" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              {isLogin ? "Giriş Yap" : "Hesap Oluştur"}
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center" }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {isLogin ? (
                <>
                  Hesabınız yok mu? <Link to="/register">Kayıt Olun</Link>
                </>
              ) : (
                <>
                  Zaten hesabınız var mı? <Link to="/login">Giriş Yap</Link>
                </>
              )}
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};
