import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";

export default function NotPermissions() {
  const navigate = useNavigate();
  const handleClick = () => navigate("/home");

  return (
    <div className={styles.container}>
      <Result
        className="pb150"
        title="403"
        status="403"
        subTitle="抱歉，你当前没有权限访问此页面"
        extra={
          <Button type="primary" onClick={handleClick}>
            回到首页
          </Button>
        }
      />
    </div>
  );
}
