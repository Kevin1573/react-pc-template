import React from 'react';
import { Row, Col, Card } from 'antd';
import ReactJsonViewCompare from 'react-json-view-compare';
import styles from './index.module.scss';


interface JsonComparatorProps {
  blueJson: any;
  greenJson: any;
}


const JsonComparator: React.FC<JsonComparatorProps> = ({ blueJson, greenJson }) => {
  // 判断下如果bluejson和greenjson都是字符串的话，需要先解析成对象在比较
  if (typeof blueJson === 'string') {
    blueJson = JSON.parse(blueJson);
  }
  if (typeof greenJson === 'string') {
    greenJson = JSON.parse(greenJson);
  }

  console.log('blueJson', blueJson);
  console.log('greenJson', greenJson);
  return (
    <Row gutter={16}>
      <Col span={24}>
        <Card title="JSON 比较结果">
          <div className={styles.diffContainer}>
            <ReactJsonViewCompare oldData={blueJson} newData={greenJson} />
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default JsonComparator;