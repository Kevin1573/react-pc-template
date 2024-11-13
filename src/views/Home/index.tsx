import { Row, Col, Tooltip, Avatar, List } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import BigColumn from "./components/BigColumn";
import FirstLine from "./components/FirstLine";
import FirstArea from "./components/FirstArea";
import FirstTiny from "./components/FirstTiny";
import FirstScatter from "./components/FirstScatter";
import styles from "./index.module.scss";

export default function Home() {
  // 列表数据
  const listData = [
    {
      title: "Ant Design Title 1",
    },
    {
      title: "Ant Design Title 2",
    },
    {
      title: "Ant Design Title 3",
    },
    {
      title: "Ant Design Title 4",
    },
    {
      title: "Ant Design Title 5",
    },
    {
      title: "Ant Design Title 6",
    },
  ];
  // 栅栏间距
  const gtrNum = 14;

  return (
    <Row gutter={[gtrNum, gtrNum]} className={styles.container}>
      <Col xs={24} xl={16} xxl={19}>
        <Row gutter={[gtrNum, gtrNum]} className={styles.card_container}>
          <Col xs={24} sm={12} lg={6}>
            <div className={styles.card_item}>
              <p style={{ fontSize: 18, margin: 0, display: "flex", justifyContent: "space-between" }}>
                <span>访问量</span>
                <Tooltip placement="top" title="指示器提示">
                  <QuestionCircleOutlined />
                </Tooltip>
              </p>
              <div style={{ height: 125, textAlign: "center" }}>
                <FirstLine />
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <div className={styles.card_item}>
              <p style={{ fontSize: 18, margin: 0, display: "flex", justifyContent: "space-between" }}>
                <span>销售额</span>
                <Tooltip placement="top" title="指示器提示">
                  <QuestionCircleOutlined />
                </Tooltip>
              </p>
              <div style={{ height: 125, textAlign: "center" }}>
                <FirstArea />
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <div className={styles.card_item}>
              <p style={{ fontSize: 18, margin: 0, display: "flex", justifyContent: "space-between" }}>
                <span>进度</span>
                <Tooltip placement="top" title="指示器提示">
                  <QuestionCircleOutlined />
                </Tooltip>
              </p>
              <div style={{ height: 125, textAlign: "center" }}>
                <FirstTiny />
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <div className={styles.card_item}>
              <p style={{ fontSize: 18, margin: 0, display: "flex", justifyContent: "space-between" }}>
                <span>散点图</span>
                <Tooltip placement="top" title="指示器提示">
                  <QuestionCircleOutlined />
                </Tooltip>
              </p>
              <div style={{ height: 125, textAlign: "center" }}>
                <FirstScatter />
              </div>
            </div>
          </Col>
        </Row>
        <div className={`${styles.chart_container} mt${gtrNum}`}>
          <BigColumn />
        </div>
      </Col>
      <Col xs={24} xl={8} xxl={5}>
        <div className={styles.list_container}>
          <List
            itemLayout="horizontal"
            dataSource={listData}
            renderItem={(item, index) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
                  title={<a href="https://ant.design">{item.title}</a>}
                  description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                />
              </List.Item>
            )}
          />
        </div>
      </Col>
    </Row>
  );
}
