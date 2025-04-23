import { Card, Row, Col, Table, Modal, Spin, Radio, Button, Space, Tooltip, Statistic, Segmented, Flex } from 'antd';
import type { TableColumnsType } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDashboardStore } from '@/store/dashboard';
import JsonComparator from '@/components/JsonComparator';
import Copy from '@/components/Copy';
import { AppstoreOutlined, ArrowDownOutlined, ArrowUpOutlined, BarsOutlined } from '@ant-design/icons';

// 统计卡片组件
const MetricCards = () => {
  const { metriciData } = useDashboardStore();
  const [compare] = useState(false);
  //style={{ marginTop: '30px', marginLeft: '30px' }}
  return (
    <Row gutter={16} style={{ marginTop: 40 }}>
      <Col span={4} offset={2}>
        <Statistic title="Successed API calls" valueStyle={{ color: '#3f8600' }} value={metriciData.totalSuccessNumber} />
      </Col>
      <Col span={4}>
        <Statistic title="Failed API calls" valueStyle={{ color: '#cf1322' }} value={metriciData.totalFailedNumber} />
      </Col>
      <Col span={4}>
        <Statistic title="Total number of API calls" value={metriciData.totalSuccessNumber} />
      </Col>
      <Col span={4}>
        <Statistic title="Failed / Total number of API calls" value={metriciData.totalFailedNumber} suffix={"/ " + metriciData.totalNumber} />
      </Col>
      <Col>
        {compare ? (<Statistic
          title="趋势"
          value={10}
          valueStyle={{ color: '#3f8600' }}
          prefix={<ArrowUpOutlined />}
          suffix='%'
        />) :
          (<Statistic
            title="趋势"
            value={9}
            valueStyle={{ color: '#cf1322' }}
            prefix={<ArrowDownOutlined />}
            suffix='%'
          />)}
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
      key: 'name',
      title: '名称',
      dataIndex: 'name',
      width: '15%'
    },
    {
      key: 'failedNumber',
      title: '查看详情',
      dataIndex: 'failedNumber',
      width: '15%',
      render: (_, record) => (
        <Button type='link' onClick={() => handleShowSuccessModal(record)}>
          {'查看详情'}
        </Button>
      )
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
  const [selectedRadioValue, setSelectedRadioValue] = React.useState<string | null>(null); // 新增状态来存储 Radio 选择值

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedValue = e.target.value;
    let dataToCompare: any[] = [];

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
    setSelectedRadioValue(selectedValue); // 更新选择的 Radio 值
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => {
      setSelectedRowKeys(keys);
    },
  };

  const handleCloseModal = () => {
    handleCloseSuccessModal();
    setSelectedRadioValue(null); // 关闭模态框时重置 Radio 选择值
    setSelectedRowKeys([]); // 可选：如果需要，也可以重置行选择
    setCompareDate([]); // 重置比较数据
  };

  return (
    <Modal
      title="成功详细调用记录"
      open={isSuccessModalVisible}
      onCancel={handleCloseModal}
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
                width: '100px',
                key: 'id',
                ellipsis: {
                  showTitle: false,
                },
              },
              {
                title: 'URL',
                dataIndex: 'url',
                key: 'url',
                width: '180px',
                ellipsis: {
                  showTitle: false,
                },
              },
              {
                title: '请求方法',
                dataIndex: 'method',
                width: '90px',
                key: 'method'
              },
              {
                title: '请求体',
                dataIndex: 'request',
                key: 'request',
                width: '150px',
                ellipsis: {
                  showTitle: false,
                },
                //render: (text) => <pre>{text.length > 100 ? `${text.slice(0, 100)}...` : text}</pre>
              },
              {
                title: '请求头',
                dataIndex: 'headers',
                key: 'headers',
                width: '180px',
                ellipsis: {
                  showTitle: false,
                },
                render: (headers) => (
                  <Tooltip placement="topLeft" title={headers}>
                    <pre style={{
                      maxWidth: '100%',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>{headers}</pre>
                  </Tooltip>
                )
              },
              {
                title: '响应体',
                dataIndex: 'response',
                key: 'response',
                width: '280px',
                ellipsis: {
                  showTitle: false,
                },
                render: (text) => (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip
                      placement="topLeft"
                      title={
                        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                          {text}
                        </div>
                      }
                    >
                      <pre style={{
                        maxWidth: '100%',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>{text.length > 100 ? `${text.slice(0, 100)}` : text}</pre>
                    </Tooltip>
                    <Copy toClipboard={text} text="复制" />
                  </div>
                )
              },
              {
                title: '状态码',
                dataIndex: 'statusCode',
                width: '80px',
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
            rowKey={(record) => record.id}
          />
          <div style={{ margin: '16px 0' }}>
            <Flex gap="middle" justify="space-between" >
              <Flex >
                <Radio.Group
                  value={selectedRadioValue} // 绑定 Radio 选择值
                  onChange={(e) => handleRadioChange({ target: { value: e.target.value } } as React.ChangeEvent<HTMLInputElement>)}
                >
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
              </Flex>
              <Flex>
                <Segmented
                  options={[
                    { value: 'List', icon: <BarsOutlined /> },
                    { value: 'Kanban', icon: <AppstoreOutlined /> },
                  ]}
                />
              </Flex>
            </Flex>
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
