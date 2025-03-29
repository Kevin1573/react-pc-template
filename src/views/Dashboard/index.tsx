import { Card, Row, Col, Table, Modal } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import React, { useState } from 'react';

interface ApiLogType {
  key: React.Key;
  url: string;
  name: string;
  method: string;
  responseCode: number;
  headers: { [key: string]: string };
  payload: { [key: string]: string };
  response: { [key: string]: string };
  responseTime: string;
}

// 自定义组件，用于展示长文本并点击弹出模态框
const LongTextDisplay: React.FC<{ text: string }> = ({ text }) => {
  const [visible, setVisible] = useState(false);

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <>
      <span onClick={showModal} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
        {text.length > 20 ? `${text.slice(0, 20)}...` : text}
      </span>
      <Modal
        title="详细内容"
        open={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <pre>{text}</pre>
      </Modal>
    </>
  );
};

const apiLogColumns: TableColumnsType<ApiLogType> = [
  {
    title: 'URL',
    dataIndex: 'url',
    width: '20%',
  },
  {
    title: '名称',
    dataIndex: 'name',
    width: '15%',
  },
  {
    title: '方法',
    dataIndex: 'method',
    width: '10%',
  },
  {
    title: '响应代码',
    dataIndex: 'responseCode',
    width: '10%',
  },
  {
    title: '请求头',
    dataIndex: 'headers',
    width: '15%',
    render: (headers) => <LongTextDisplay text={JSON.stringify(headers, null, 2)} />,
  },
  {
    title: '请求体',
    dataIndex: 'payload',
    width: '15%',
    render: (payload) => <LongTextDisplay text={JSON.stringify(payload, null, 2)} />,
  },
  {
    title: '响应内容',
    dataIndex: 'response',
    width: '15%',
    render: (response) => <LongTextDisplay text={JSON.stringify(response, null, 2)} />,
  },
  {
    title: '响应时间',
    dataIndex: 'responseTime',
    width: '20%',
  },
];

const onChange: TableProps<ApiLogType>['onChange'] = (pagination, filters, sorter, extra) => {
  console.log('params', pagination, filters, sorter, extra);
};

export default function Dashboard() {
  const metriciData = {
    successNumber: 20,
    failedNumber: 38,
    totalNumber: 59,
  };

  const apiLogs = [
    {
      key: '1',
      url: '/api/user/login',
      name: 'API 调用成功次数',
      method: 'POST',
      responseCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer token',
      },
      payload: {
        username: 'admin',
        password: 'password',
      },
      response: {
        token: 'token',
      },
      responseTime: '2023-04-10 10:00:00',
    },
    // 可以添加更多日志项
  ];

  return (
    <>
      <Row gutter={16} style={{ marginTop: '30px' }}>
        <Col span={8}>
          <Card title="API 调用成功次数">
            <p style={{ fontSize: '24px', textAlign: 'center' }}>{metriciData.successNumber}</p>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="API 调用失败次数">
            <p style={{ fontSize: '24px', textAlign: 'center' }}>{metriciData.failedNumber}</p>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="API 调用总次数">
            <p style={{ fontSize: '24px', textAlign: 'center' }}>{metriciData.totalNumber}</p>
          </Card>
        </Col>
      </Row>
      <Row style={{ marginTop: '30px' }}>
        <Col span={24}>
          <Card title="API 日志列表">
            <Table<ApiLogType> columns={apiLogColumns} dataSource={apiLogs} onChange={onChange} />
          </Card>
        </Col>
      </Row>
    </>
  );
}
