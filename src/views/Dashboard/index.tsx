import { Card, Row, Col, Table, Modal, Spin, Radio, Button, Space } from 'antd';
import type { TableColumnsType } from 'antd';
import React, { useState, useEffect, useMemo } from 'react';
import request from '@/utils/request';
import JsonComparator from '@/components/JsonComparator';

// 定义 API 日志类型接口
interface ApiLogType {
  id: string;
  key: React.Key;
  url: string;
  successNumber: number;
  failedNumber: number | null;
  totalNumber: number;
  name: string;
  createTime: string;
}

// 定义 API 统计数据接口
interface ApiSummaryData {
  totalSuccessNumber: number;
  totalFailedNumber: number;
  totalNumber: number;
}

// 定义成功调用详细记录类型接口
interface SuccessCallLogType {
  id: string;
  key: string;
  url: string;
  method: string;
  request: string;
  headers: { [key: string]: string };
  response: string;
  statusCode: number;
  responseTime: string;
}

// 统计卡片组件
const MetricCards = ({ metriciData }: { metriciData: ApiSummaryData }) => {
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
const ApiLogTable = ({
  apiLogs,
  pagination,
  onTableChange,
  handleShowSuccessModal
}: {
  apiLogs: ApiLogType[];
  pagination: { current: number; pageSize: number; total: number };
  onTableChange: (newPagination: any) => void;
  handleShowSuccessModal: (record: ApiLogType) => void;
}) => {
  const apiLogColumns: TableColumnsType<ApiLogType> = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: '15%'
    },
    {
      title: 'URL',
      dataIndex: 'url',
      width: '20%'
    },
    {
      title: '成功次数',
      dataIndex: 'successNumber',
      width: '15%',
      render: (text, record) => (
        <span style={{ cursor: 'pointer' }} onClick={() => handleShowSuccessModal(record)}>
          {text}
        </span>
      )
    },
    {
      title: '失败次数',
      dataIndex: 'failedNumber',
      width: '15%'
    },
    {
      title: '总次数',
      dataIndex: 'totalNumber',
      width: '15%'
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: '15%'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: '20%'
    }
  ];

  return (
    <Row style={{ marginTop: '30px' }}>
      <Col span={24}>
        <Card title="API 日志列表">
          <Table<ApiLogType>
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
const SuccessCallModal = ({
  isSuccessModalVisible,
  handleCloseSuccessModal,
  successCallLogs,
  isLoadingSuccessLogs,
  isJsonComparatorVisible,
  compareDate,
  setIsJsonComparatorVisible,
  setCompareDate
}: {
  isSuccessModalVisible: boolean;
  handleCloseSuccessModal: () => void;
  successCallLogs: SuccessCallLogType[];
  isLoadingSuccessLogs: boolean;
  isJsonComparatorVisible: boolean;
  compareDate: any[];
  setIsJsonComparatorVisible: (visible: boolean) => void;
  setCompareDate: (data: any[]) => void;
}) => {
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
                render: (text) => <pre>{text}</pre>
              },
              {
                title: '请求头',
                dataIndex: 'headers',
                key: 'headers',
                render: (headers) => <pre>{JSON.stringify(headers, null, 2)}</pre>
              },
              {
                title: '响应体',
                dataIndex: 'response',
                key: 'response',
                render: (text) => <pre>{text}</pre>
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
          />
          <div style={{ margin: '16px 0' }}>
            {/* 使用 Ant Design 的 Radio.Group 和 Radio.Button 组件 */}
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
  const [metriciData, setMetriciData] = useState<ApiSummaryData>({
    totalSuccessNumber: 0,
    totalFailedNumber: 0,
    totalNumber: 0
  });
  const [apiLogs, setApiLogs] = useState<ApiLogType[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0
  });
  const stablePagination = useMemo(() => pagination, [
    pagination.current,
    pagination.pageSize,
    pagination.total
  ]);
  const [successCallLogs, setSuccessCallLogs] = useState<SuccessCallLogType[]>([]);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [isLoadingSuccessLogs, setIsLoadingSuccessLogs] = useState(false);
  const [isJsonComparatorVisible, setIsJsonComparatorVisible] = useState(false);
  const [compareDate, setCompareDate] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const summaryResponse = await request.get('/v1/mongodb/summary');
      const summaryData = summaryResponse as unknown as ApiSummaryData;
      setMetriciData(summaryData);

      const logsResponse = await request.get('/v1/mongodb/findAll', {
        params: {
          page: pagination.current - 1,
          pageSize: pagination.pageSize
        }
      }) as {
        _embedded: { apiCallSummaryList: ApiLogType[] };
        page: {
          totalElements: number;
          size: number;
          number: number;
        };
      };

      const logsData = logsResponse._embedded.apiCallSummaryList as ApiLogType[];
      const total = logsResponse.page.totalElements;

      setApiLogs(logsData);
      setPagination({
        ...pagination,
        pageSize: logsResponse.page.size,
        current: logsResponse.page.number + 1,
        total
      });
    } catch (error) {
      console.error('获取数据时出错:', error);
    }
  };

  useEffect(() => {
    const fetchDataAsync = async () => {
      console.log('stablePagination changed:', stablePagination);
      await fetchData();
    };
    fetchDataAsync();
  }, [stablePagination]);

  const onTableChange = (newPagination: any) => {
    if (
      newPagination.current !== stablePagination.current ||
      newPagination.pageSize !== stablePagination.pageSize
    ) {
      setPagination(newPagination);
    }
  };

  const handleShowSuccessModal = async (record: ApiLogType) => {
    setIsLoadingSuccessLogs(true);
    try {
      const response = await request.get('/v1/apiCall/findAll', {
        params: {
          url: record.url,
          success: true
        }
      });
      const data = response as unknown as SuccessCallLogType[];
      setSuccessCallLogs(data);
      setIsSuccessModalVisible(true);
    } catch (error) {
      console.error('获取成功详细调用记录时出错:', error);
    } finally {
      setIsLoadingSuccessLogs(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalVisible(false);
  };

  return (
    <>
      <MetricCards metriciData={metriciData} />
      <ApiLogTable
        apiLogs={apiLogs}
        pagination={pagination}
        onTableChange={onTableChange}
        handleShowSuccessModal={handleShowSuccessModal}
      />
      <SuccessCallModal
        isSuccessModalVisible={isSuccessModalVisible}
        handleCloseSuccessModal={handleCloseSuccessModal}
        successCallLogs={successCallLogs}
        isLoadingSuccessLogs={isLoadingSuccessLogs}
        isJsonComparatorVisible={isJsonComparatorVisible}
        compareDate={compareDate}
        setIsJsonComparatorVisible={setIsJsonComparatorVisible}
        setCompareDate={setCompareDate}
      />
    </>
  );
}