import { Button, Form, Input, type FormProps } from "antd";
import { HappyProvider } from "@ant-design/happy-work-theme";
import { useNavigate, useLocation } from "react-router-dom";
import { useUserInfoStore } from "@/store/userInfo";
import { userLogin, getUserInfo } from "@/api/index";
import { AdMessage } from "@/utils/AntdGlobal";
import { formatErrMsg } from "@/utils/common";
import { Local } from "@/utils/storage";
import ThemeSwitch from "@/components/ThemeSwitch";
import styles from "./index.module.scss";

type FieldType = {
  username: string;
  password: string;
  remember?: string;
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const updateUserInfo = useUserInfoStore(state => state.updateUserInfo);

  // 用户登录
  const handleLogin: FormProps<FieldType>["onFinish"] = async values => {
    console.log("Form Value", values);
    try {
      const res1 = await userLogin({
        username: values.username,
        password: values.password,
      });
      if (res1.code !== 200) return AdMessage.error(formatErrMsg(res1.message));
      Local.set("token", res1.data.token);
      Local.set("refresh", res1.data.refresh);
      const res2 = await getUserInfo();
      if (res2.code !== 200) return AdMessage.error("用户信息获取失败");
      updateUserInfo(res2.data);
      Local.set("userInfo", res2.data);
      AdMessage.success(res1.message as string);
      // 登录成功后跳转
      if (location.state.from) {
        navigate(location.state.from, { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.login}>
      <div className={styles.left}></div>
      <div className={styles.right}>
        <div className={styles.switch}>
          <ThemeSwitch></ThemeSwitch>
        </div>
        <h2>打开门户，尽情探索</h2>
        <div className={styles.container}>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ username: "admin", password: "123456", remember: true }}
            onFinish={handleLogin}
            autoComplete="off"
          >
            <Form.Item<FieldType>
              label="用户名"
              name="username"
              rules={[{ required: true, message: "请输入用户名!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="密码"
              name="password"
              rules={[{ required: true, message: "请输入密码！" }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <HappyProvider>
                <Button type="primary" htmlType="submit">
                  登录
                </Button>
              </HappyProvider>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
