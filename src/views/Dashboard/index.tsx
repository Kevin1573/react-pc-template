import { Card, Row, Col, Table, Modal, Spin, Radio, Button, Space } from 'antd';
import type { TableColumnsType } from 'antd';
import React, { useEffect } from 'react';
import { useDashboardStore } from '@/store/dashboard';
import JsonComparator from '@/components/JsonComparator';

// 统计卡片组件
const MetricCards = () => {
  const { metriciData } = useDashboardStore();
  return (
    <Row gutter={16} style={{ marginTop: '30px' }}>
      <Col span={8}>
        <Card title="API 调用成功次数">
          <p style={{ fontSize: '24px', textAlign: 'center' }}>{metriciData.totalSuccessNumber}</p>
        </Card>
      </Col>
      <Col span={8}>
        <Card title="API 调用失败次数">
          <p style={{ fontSize: '24px', textAlign: 'center' }}>{metriciData.totalFailedNumber}</p>
        </Card>
      </Col>
      <Col span={8}>
        <Card title="API 调用总次数">
          <p style={{ fontSize: '24px', textAlign: 'center' }}>{metriciData.totalNumber}</p>
        </Card>
      </Col>
    </Row>
  );
};

// API 日志表格组件
const ApiLogTable = () => {
  const { apiLogs, pagination, onTableChange, handleShowSuccessModal } = useDashboardStore();
  const apiLogColumns: TableColumnsType<any> = [
    {
      key: 'id',
      title: 'ID',
      dataIndex: 'id',
      width: '15%'
    },
    {
      key: 'url',
      title: 'URL',
      dataIndex: 'url',
      width: '20%'
    },
    {
      key: 'id',
      title: '成功次数',
      dataIndex: 'successNumber',
      width: '15%',
      render: (text, record) => (
        <span key={`${record.key}-successNumber`} style={{ cursor: 'pointer' }} onClick={() => handleShowSuccessModal(record)}>
          {text}
        </span>
      )
    },
    {
      key: 'failedNumber',
      title: '失败次数',
      dataIndex: 'failedNumber',
      width: '15%'
    },
    {
      key: 'totalNumber',
      title: '总次数',
      dataIndex: 'totalNumber',
      width: '15%'
    },
    {
      key: 'name',
      title: '名称',
      dataIndex: 'name',
      width: '15%'
    },
    {
      key: 'createTime',
      title: '创建时间',
      dataIndex: 'createTime',
      width: '20%'
    }
  ];

  return (
    <Row style={{ marginTop: '30px' }}>
      <Col span={24}>
        <Card title="API 日志列表">
          <Table
            columns={apiLogColumns}
            dataSource={apiLogs}
            onChange={onTableChange}
            pagination={pagination}
          />
        </Card>
      </Col>
    </Row>
  );
};

// 成功调用详细记录模态框组件
const SuccessCallModal = () => {
  const {
    isSuccessModalVisible,
    handleCloseSuccessModal,
    successCallLogs,
    isLoadingSuccessLogs,
    isJsonComparatorVisible,
    compareDate,
    setIsJsonComparatorVisible,
    setCompareDate
  } = useDashboardStore();
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedValue = e.target.value;
    let dataToCompare: any[] = [];

    console.log("successCallLogs>>>", successCallLogs);
    
    switch (selectedValue) {
      case 'request':
        dataToCompare = successCallLogs.map((log) => log.request);
        break;
      case 'headers':
        dataToCompare = successCallLogs.map((log) => log.headers);
        break;
      case 'response':
        dataToCompare = successCallLogs.map((log) => log.response);
        break;
      default:
        break;
    }

    setCompareDate(dataToCompare);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => {
      setSelectedRowKeys(keys);
    },
  };

  return (
    <Modal
      title="成功详细调用记录"
      open={isSuccessModalVisible}
      onCancel={handleCloseSuccessModal}
      width="90%"
      footer={null}
    >
      {isLoadingSuccessLogs ? (
        <Spin />
      ) : (
        <>
          <Table
            dataSource={successCallLogs}
            columns={[
              {
                title: 'ID',
                dataIndex: 'id',
                key: 'id'
              },
              {
                title: 'URL',
                dataIndex: 'url',
                key: 'url'
              },
              {
                title: '请求方法',
                dataIndex: 'method',
                key: 'method'
              },
              {
                title: '请求体',
                dataIndex: 'request',
                key: 'request',
                render: (text) => <pre>{text.length > 100 ? `${text.slice(0, 100)}...` : text}</pre>
              },
              {
                title: '请求头',
                dataIndex: 'headers',
                key: 'headers',
                render: (headers) => {
                  const headersStr = JSON.stringify(headers);
                  return <pre>{headersStr.length > 100 ? `${headersStr.slice(0, 100)}...` : headersStr}</pre>;
                }
              },
              {
                title: '响应体',
                dataIndex: 'response',
                key: 'response',
                render: (text) => <pre>{text.length > 100 ? `${text.slice(0, 100)}...` : text}</pre>
              },
              {
                title: '状态码',
                dataIndex: 'statusCode',
                key: 'statusCode'
              },
              {
                title: '响应时间',
                dataIndex: 'responseTime',
                key: 'responseTime'
              }
            ]}
            pagination={false}
            rowSelection={rowSelection}
            // Ensure each row has a unique key
            rowKey={(record) => record.id} 
          />
          <div style={{ margin: '16px 0' }}>
            <Radio.Group onChange={(e) => handleRadioChange({ target: { value: e.target.value } } as React.ChangeEvent<HTMLInputElement>)}>
              <Radio.Button value="request">Request Payload</Radio.Button>
              <Radio.Button value="headers">Headers</Radio.Button>
              <Radio.Button value="response">Response Payload</Radio.Button>
            </Radio.Group>
            <Space size="middle" style={{ marginLeft: 10 }}>
              <Button
                onClick={() => {
                  setIsJsonComparatorVisible(true);
                }}
              >
                比较选中的数据
              </Button>
            </Space>
          </div>

          {isJsonComparatorVisible && compareDate.length >= 2 && (
            <JsonComparator blueJson={compareDate[0]} greenJson={compareDate[1]} />
          )}
        </>
      )}
    </Modal>
  );
};

// 主 Dashboard 组件
export default function Dashboard() {
  const { fetchData } = useDashboardStore();

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <MetricCards />
      <ApiLogTable />
      <SuccessCallModal />
    </>
  );
}