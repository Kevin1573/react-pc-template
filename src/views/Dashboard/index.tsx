import { Card, Row, Col, Table, Modal } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import React, { useState, useEffect, useMemo } from 'react';
import request from '@/utils/request'; // 引入 request 工具类

// 修改 ApiLogType 接口以匹配新的数据结构
interface ApiLogType {
  id: string;
  url: string;
  successNumber: number;
  failedNumber: number | null;
  totalNumber: number;
  name: string;
  createTime: string;
}

interface MetricSummary {
  successNumber: number;
  failedNumber: number;
  totalNumber: number;
}

interface ApiSummaryData {
  totalSuccessNumber: number;
  totalFailedNumber: number;
  totalNumber: number;
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

const onChange: TableProps<ApiLogType>['onChange'] = (pagination, filters, sorter, extra) => {
  console.log('params', pagination, filters, sorter, extra);
};

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

  useEffect(() => {
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
          _embedded: { myDocumentList: ApiLogType[] };
          page: { totalElements: number };
        };

        // 适配新的接口返回格式
        const logsData = logsResponse._embedded.myDocumentList as ApiLogType[];
        const total = logsResponse.page.totalElements;
        setApiLogs(logsData);
        setPagination({
          ...pagination,
          total,
        });
      } catch (error) {
        console.error('获取数据时出错:', error);
      }
    };

    fetchData();
  }, [stablePagination]);

  const onTableChange = (newPagination: any, filters: any, sorter: any) => {
    // 检查新的分页信息是否和当前的分页信息不同
    if (
      newPagination.current !== stablePagination.current ||
      newPagination.pageSize !== stablePagination.pageSize
    ) {
      setPagination(newPagination);
    }
  };

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
    </>
  );
}
