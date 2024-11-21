/**
 * src/components/RTable/index.tsx
 * 表格基础配置
 */
declare type TableConfig = {
  page: number;
  limit: number;
  total: number;
  loading: boolean;
  bordered: boolean;
  params: AnyObjectType;
};

// 声明选择器的选项类型
declare type SelectOption = {
  label: string;
  value: string | number | null;
  children?: SelectOption[];
};
declare type TreeSelectOption = {
  title: React.ReactNode;
  value: string | number;
  children?: TreeSelectOption[];
  disabled?: boolean;
  selectable?: boolean;
  checkable?: boolean;
  disableCheckbox?: boolean;
};

/**
 * src/components/RTable/tableSearch.tsx
 * 表格-条件搜索表单
 */
declare type TableSearchs = {
  prop: string;
  label: string;
  placeholder: string;
  type:
    | "input"
    | "number"
    | "select"
    | "multiSelect"
    | "treeSelect"
    | "date"
    | "time"
    | "datetime"
    | "dateRange"
    | "timeRange"
    | "datetimeRange"
    | "switch";
  defaultValue?: any;
  isHiden?: boolean;
  /* type = "number" */
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  /* type = "select" | "multiSelect" */
  options?: SelectOption[];
  /* type = "treeSelect" */
  treeData?: TreeSelectOption[];
  /* type = "switch" */
  checkedChildren?: ReactNode;
  unCheckedChildren?: ReactNode;
};

/**
 * src/components/RTable/tableModal.tsx
 * 表格-弹窗表单
 */
declare type TableModals = {
  prop: string;
  label: string;
  placeholder: string;
  required: boolean;
  type:
    | "input"
    | "number"
    | "select"
    | "multiSelect"
    | "treeSelect"
    | "date"
    | "time"
    | "datetime"
    | "dateRange"
    | "timeRange"
    | "datetimeRange"
    | "switch";
  isHiden?: boolean;
  span?: number;
  message?: string;
  /* type = "number" */
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  /* type = "select" | "multiSelect" */
  options?: SelectOption[];
  /* type = "treeSelect" */
  treeData?: TreeSelectOption[];
  /* type = "switch" */
  checkedChildren?: ReactNode;
  unCheckedChildren?: ReactNode;
};
