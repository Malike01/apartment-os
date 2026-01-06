import React from "react";
import { Form, Input, Button, Typography, theme, Checkbox } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./AuthForm.module.css";

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
  const { token } = theme.useToken();

  const containerVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  const formVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, delay: 0.2 },
    },
  };
  return (
    <div className={styles.container}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          background: `linear-gradient(135deg, ${token.colorPrimary} 0%, #001529 100%)`,
        }}
        className={`${styles.leftPanel} hidden-mobile`}
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className={styles.leftPanelContent}
        >
          <div className={styles.logoEmoji}>🏢</div>

          <Title level={1} className={styles.welcomeTitle}>
            {isLogin ? "ApartmentOS" : "Ailemize Katılın"}
          </Title>
          <Text className={styles.welcomeSubtitle}>
            {isLogin
              ? "Site ve apartman yönetiminin en modern hali."
              : "Yüzlerce yönetici arasına katılın ve işlerinizi kolaylaştırın."}
          </Text>
        </motion.div>
      </motion.div>

      <div className={styles.rightPanel}>
        <motion.div
          variants={formVariants}
          initial="hidden"
          animate="visible"
          className={styles.formWrapper}
        >
          <div className={styles.formHeader}>
            <Title level={2} className={styles.formTitle}>
              {isLogin ? "Tekrar Hoşgeldiniz" : "Hesap Oluştur"}
            </Title>
            <Text type="secondary">
              {isLogin
                ? "Lütfen hesabınıza giriş yapın"
                : "Yönetici bilgilerinizi giriniz"}
            </Text>
          </div>

          <Form
            name={type}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
            size="large"
            requiredMark={false}
          >
            {!isLogin && (
              <Form.Item
                name="name"
                rules={[{ required: true, message: "Lütfen ad soyad giriniz" }]}
              >
                <Input
                  prefix={
                    <UserOutlined
                      style={{ color: token.colorTextDescription }}
                    />
                  }
                  placeholder="Ad Soyad"
                />
              </Form.Item>
            )}

            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Lütfen email giriniz" },
                { type: "email", message: "Geçerli bir email giriniz" },
              ]}
            >
              <Input
                prefix={
                  <MailOutlined style={{ color: token.colorTextDescription }} />
                }
                placeholder="Email Adresi"
              />
            </Form.Item>

            {!isLogin && (
              <Form.Item
                name="phone"
                rules={[{ required: true, message: "Lütfen telefon giriniz" }]}
              >
                <Input
                  prefix={
                    <PhoneOutlined
                      style={{ color: token.colorTextDescription }}
                    />
                  }
                  placeholder="Telefon Numarası"
                />
              </Form.Item>
            )}

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Lütfen şifre giriniz" },
                { min: 6, message: "En az 6 karakter" },
              ]}
            >
              <Input.Password
                prefix={
                  <LockOutlined style={{ color: token.colorTextDescription }} />
                }
                placeholder="Şifre"
              />
            </Form.Item>

            {isLogin && (
              <div className={styles.rememberContainer}>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Beni Hatırla</Checkbox>
                </Form.Item>
                <a style={{ color: token.colorPrimary }}>Şifremi unuttum</a>
              </div>
            )}

            <Form.Item
              className={isLogin ? styles.submitItemLogin : styles.submitItem}
            >
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                className={styles.submitButton}
              >
                {isLogin ? "Giriş Yap" : "Kayıt Ol"}
              </Button>
            </Form.Item>

            <div className={styles.footer}>
              <Text type="secondary">
                {isLogin ? "Hesabınız yok mu? " : "Zaten hesabınız var mı? "}
              </Text>
              <Link
                to={isLogin ? "/register" : "/login"}
                className={styles.link}
              >
                {isLogin ? "Kayıt Olun" : "Giriş Yapın"}
              </Link>
            </div>
          </Form>
        </motion.div>
      </div>
    </div>
  );
};
