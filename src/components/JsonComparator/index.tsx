import React from 'react';
import { Row, Col, Card } from 'antd';
import ReactJsonViewCompare from 'react-json-view-compare';
import styles from './index.module.scss';


interface JsonComparatorProps {
  blueJson: any;
  greenJson: any;
}


const JsonComparator: React.FC<JsonComparatorProps> = ({ blueJson, greenJson }) => {
  // const formattedBlueJson = JSON.stringify(blueJson, null, 2);
  // const formattedGreenJson = JSON.stringify(greenJson, null, 2);

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