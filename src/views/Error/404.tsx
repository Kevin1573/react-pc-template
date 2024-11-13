import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";

export default function NotFound() {
  const navigate = useNavigate();
  const handleClick = () => navigate("/home");

  return (
    <div className={styles.container}>
      <Result
        className="pb150"
        title="404"
        status="404"
        subTitle="抱歉，你访问的页面不存在"
        extra={
          <Button type="primary" onClick={handleClick}>
            回到首页
          </Button>
        }
      />
    </div>
  );
}
