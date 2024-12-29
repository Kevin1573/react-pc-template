import { Form, Input, type FormProps } from "antd";
import { HappyProvider } from "@ant-design/happy-work-theme";
import { useNavigate, useLocation } from "react-router-dom";
import { useUserInfoStore } from "@/store/userInfo";
import { userLogin, getUserInfo } from "@/api";
import { AdMessage } from "@/utils/AntdGlobal";
import { formatErrMsg } from "@/utils/common";
import { Local } from "@/utils/storage";
import ThemeSwitch from "@/components/ThemeSwitch";
import RButton from "@/components/RButton";
import styles from "./index.module.scss";

type FieldType = {
  username: string;
  password: string;
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
      const res2 = await getUserInfo({});
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
            name="login"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            style={{ width: "100%" }}
            initialValues={{ username: "admin", password: "123456" }}
            onFinish={handleLogin}
            autoComplete="off"
          >
            <Form.Item label="用户名" name="username" rules={[{ required: true, message: "请输入用户名!" }]}>
              <Input />
            </Form.Item>
            <Form.Item label="密码" name="password" rules={[{ required: true, message: "请输入密码！" }]}>
              <Input.Password />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
              <HappyProvider>
                <RButton block htmlType="submit">
                  登录
                </RButton>
              </HappyProvider>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
