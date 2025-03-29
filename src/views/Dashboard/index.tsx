import { Card, Row, Col, Table, Modal, Spin } from 'antd';
import type { TableColumnsType } from 'antd';
import React, { useState, useEffect, useMemo } from 'react';
import request from '@/utils/request'; // 引入 request 工具类
import JsonComparator from '@/components/JsonComparator';

// 修改 ApiLogType 接口以匹配新的数据结构
interface ApiLogType {
  id: string;
  key: React.Key; // 这是唯一标识
  url: string;
  successNumber: number;
  failedNumber: number | null;
  totalNumber: number;
  name: string;
  createTime: string;
}

interface ApiSummaryData {
  totalSuccessNumber: number;
  totalFailedNumber: number;
  totalNumber: number;
}

// 新增接口定义成功调用详细记录类型
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


export default function Dashboard() {
  const [metriciData, setMetriciData] = useState({
    successNumber: 0,
    failedNumber: 0,
    totalNumber: 0,
  });
  // 新增状态来管理 apiLogs 数据
  const [apiLogs, setApiLogs] = useState<ApiLogType[]>([]);
  // 新增状态来管理分页信息
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  // 使用 useMemo 来稳定 pagination 对象
  const stablePagination = useMemo(() => pagination, [
    pagination.current,
    pagination.pageSize,
    pagination.total,
  ]);

  // 新增状态管理成功详细调用记录
  const [successCallLogs, setSuccessCallLogs] = useState<SuccessCallLogType[]>([]);
  // 新增状态管理模态框显示隐藏
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  // 新增状态管理加载状态
  const [isLoadingSuccessLogs, setIsLoadingSuccessLogs] = useState(false);
  const [isJsonComparatorVisible, setIsJsonComparatorVisible] = useState(false);
  const [compareDate, setCompareDate] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      // 获取 API 调用统计数据
      const summaryResponse = await request.get('/v1/mongodb/summary');
      const summaryData = summaryResponse as unknown as ApiSummaryData;
      setMetriciData({
        successNumber: summaryData.totalSuccessNumber,
        failedNumber: summaryData.totalFailedNumber,
        totalNumber: summaryData.totalNumber,
      });

      // 获取 API 日志数据，这里需要根据分页信息请求对应数据
      const logsResponse = await request.get('/v1/mongodb/findAll', {
        params: {
          page: pagination.current - 1, // 后端分页从 0 开始，前端从 1 开始，所以减 1
          pageSize: pagination.pageSize,
        },
      }) as {
        _embedded: { apiCallSummaryList: ApiLogType[] };
        page: {
          totalElements: number;
          size: number;
          number: number;
        };
      };

      // 适配新的接口返回格式
      const logsData = logsResponse._embedded.apiCallSummaryList as ApiLogType[];
      const total = logsResponse.page.totalElements;

      setApiLogs(logsData);
      setPagination({
        ...pagination,
        pageSize: logsResponse.page.size, // 保持 pageSize 不变
        current: logsResponse.page.number + 1, // 保持 current 不变
        total,
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
    // 检查新的分页信息是否和当前的分页信息不同
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
        // 可根据实际情况传递筛选参数，比如根据 record 中的信息筛选成功记录
        params: {
          // 示例参数，可根据实际调整
          // 假设根据 URL 筛选成功记录
          url: record.url,
          success: true,
        },
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

  const apiLogColumns: TableColumnsType<ApiLogType> = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: '15%',
    },
    {
      title: 'URL',
      dataIndex: 'url',
      width: '20%',
    },
    {
      title: '成功次数',
      dataIndex: 'successNumber',
      width: '15%',
      render: (text, record) => (
        <span style={{ cursor: 'pointer' }} onClick={() => handleShowSuccessModal(record)}>
          {text}
        </span>
      ),
    },
    {
      title: '失败次数',
      dataIndex: 'failedNumber',
      width: '15%',
    },
    {
      title: '总次数',
      dataIndex: 'totalNumber',
      width: '15%',
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: '15%',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: '20%',
    },
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
            {/* 使用从接口获取的 apiLogs 数据，并配置 pagination 属性 */}
            <Table<ApiLogType>
              columns={apiLogColumns}
              dataSource={apiLogs}
              onChange={onTableChange}
              pagination={pagination}
            />
          </Card>
        </Col>
      </Row>
      <Modal
        title="成功详细调用记录"
        open={isSuccessModalVisible}
        onCancel={handleCloseSuccessModal}
        width="90%"
      >
        {isLoadingSuccessLogs ? (
          <Spin />
        ) : (<>
          <Table
            dataSource={successCallLogs}
            columns={[
              {
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
              },
              {
                title: 'URL',
                dataIndex: 'url',
                key: 'url',
              },
              {
                title: '请求方法',
                dataIndex: 'method',
                key: 'method',
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
                key: 'statusCode',
              },
              {
                title: '响应时间',
                dataIndex: 'responseTime',
                key: 'responseTime',
              },
            ]}
          />
          {/* 新增单选框组 */}
          <div style={{ margin: '16px 0' }}>
            <input
              type="radio"
              id="requestPayload"
              name="comparisonOption"
              value="request"
            />
            <label htmlFor="requestPayload">Request Payload</label>
            <input
              type="radio"
              id="headers"
              name="comparisonOption"
              value="headers"
            />
            <label htmlFor="headers">Headers</label>
            <input
              type="radio"
              id="responsePayload"
              name="comparisonOption"
              value="response"
            />
            <label htmlFor="responsePayload">Response Payload</label>
          </div>
          {/* 新增比较按钮 */}
          <button
            onClick={() => {
              const selectedOption = document.querySelector(
                'input[name="comparisonOption"]:checked'
              ) as HTMLInputElement;
              if (selectedOption) {
                const selectedValue = selectedOption.value;
                let dataToCompare: any[] = [];
                switch (selectedValue) {
                  case 'request':
                    dataToCompare = successCallLogs.map(log => log.request);
                    break;
                  case 'headers':
                    dataToCompare = successCallLogs.map(log => log.headers);
                    break;
                  case 'response':
                    dataToCompare = successCallLogs.map(log => log.response);
                    break;
                  default:
                    break;
                }
                console.log('Data to compare:', dataToCompare);
                setCompareDate(dataToCompare );
                // 点击按钮后显示 JsonComparator 组件
                setIsJsonComparatorVisible(true);
              }
            }}
          >
            比较选中的数据
          </button>
          {/* 根据状态控制 JsonComparator 组件的显示与隐藏 */}
          {isJsonComparatorVisible && (
            <JsonComparator
              blueJson={compareDate[0]}
              greenJson={compareDate[1]}
            />
          )}
        </>
        )}
      </Modal>
    </>
  );
}