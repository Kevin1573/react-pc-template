import { create } from 'zustand';
import request from '@/utils/request';

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

interface DashboardStore {
  metriciData: ApiSummaryData;
  apiLogs: ApiLogType[];
  pagination: { current: number; pageSize: number; total: number };
  successCallLogs: SuccessCallLogType[];
  isSuccessModalVisible: boolean;
  isLoadingSuccessLogs: boolean;
  isJsonComparatorVisible: boolean;
  compareDate: any[];
  fetchData: () => Promise<void>;
  onTableChange: (newPagination: any) => void;
  handleShowSuccessModal: (record: ApiLogType) => Promise<void>;
  handleCloseSuccessModal: () => void;
  setIsJsonComparatorVisible: (visible: boolean) => void;
  setCompareDate: (data: any[]) => void;
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  metriciData: {
    totalSuccessNumber: 0,
    totalFailedNumber: 0,
    totalNumber: 0
  },
  apiLogs: [],
  pagination: {
    current: 1,
    pageSize: 5,
    total: 0
  },
  successCallLogs: [],
  isSuccessModalVisible: false,
  isLoadingSuccessLogs: false,
  isJsonComparatorVisible: false,
  compareDate: [],
  fetchData: async () => {
    try {
      const summaryResponse = await request.get('/v1/mongodb/summary');
      const summaryData = summaryResponse as unknown as ApiSummaryData;

      const { pagination } = get();
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

      set({
        metriciData: summaryData,
        apiLogs: logsData,
        pagination: {
          ...pagination,
          pageSize: logsResponse.page.size,
          current: logsResponse.page.number + 1,
          total
        }
      });
    } catch (error) {
      console.error('获取数据时出错:', error);
    }
  },
  onTableChange: (newPagination: any) => {
    const { pagination } = get();
    if (
      newPagination.current !== pagination.current ||
      newPagination.pageSize !== pagination.pageSize
    ) {
      set({ pagination: newPagination });
    }
  },
  handleShowSuccessModal: async (record: ApiLogType) => {
    set({ isLoadingSuccessLogs: true });
    try {
      set({ successCallLogs: [] });
      const requestUrl = `/v1/apiCall/findBy/${record.key}`;
      console.log('请求 URL:', requestUrl);
      const response = await request.get(requestUrl, {
        params: {
          url: record.url,
          success: true
        }
      });
      console.log('返回的数据:', response);

      const data = response as unknown as SuccessCallLogType[];
      set({
        successCallLogs: data,
        isSuccessModalVisible: true
      });
    } catch (error) {
      console.error('获取成功详细调用记录时出错:', error);
    } finally {
      set({ isLoadingSuccessLogs: false });
    }
  },
  handleCloseSuccessModal: () => {
    set({
      isSuccessModalVisible: false,
      successCallLogs: []
    });
  },
  setIsJsonComparatorVisible: (visible: boolean) => {
    set({ isJsonComparatorVisible: visible });
  },
  setCompareDate: (data: any[]) => {
    set({ compareDate: data });
  }
}));