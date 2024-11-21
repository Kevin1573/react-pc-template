import { useState, useEffect, useImperativeHandle } from "react";
import { useImmer } from "use-immer";
import { Table, type TableProps, type TablePaginationConfig } from "antd";
import { fixedForwardRef } from "@/utils/fixedForwardRef";

interface RTableProps<DataType = AnyObjectType> {
  columns: TableProps<DataType>["columns"];
  config: TableConfig;
  data: DataType[];
  size?: "large" | "middle" | "small";
  scroll?: TableProps<DataType>["scroll"];
  rowSelect?: boolean;
  rowSelectType?: "checkbox" | "radio";
  expandable?: TableProps<DataType>["expandable"];
  pagination?: boolean;
  pageSimple?: boolean;
  onRowClick?: (record: DataType, event: React.MouseEvent<HTMLElement>) => void;
  onRowSelect?: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => void;
  onPageChange?: (page: number, pageSize: number) => void;
}

export interface RTableInstance {
  setPage: (page: number, pageSize?: number) => void;
  clearSelection: () => void;
}

export default fixedForwardRef(function RTable<DataType>(
  {
    columns,
    config,
    data,
    size = "middle",
    scroll,
    rowSelect = false,
    rowSelectType = "checkbox",
    expandable,
    pagination = true,
    pageSimple = false,
    onRowClick,
    onRowSelect,
    onPageChange,
  }: RTableProps<DataType>,
  ref: any
) {
  // 表格多选配置
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const rowSelection: TableProps<DataType>["rowSelection"] = {
    type: rowSelectType,
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setSelectedRowKeys(selectedRowKeys);
      onRowSelect && onRowSelect(selectedRowKeys, selectedRows);
    },
  };

  // 表格分页配置
  const [pagiOptions, setPagiOptions] = useImmer<TablePaginationConfig>({
    size: "default",
    position: ["bottomRight"],
    total: config.total,
    current: config.page,
    pageSize: config.limit,
    simple: pageSimple && { readOnly: pageSimple },
    showQuickJumper: false,
    showSizeChanger: !pageSimple && true,
    pageSizeOptions: ["5", "15", "30", "50"],
    showTotal: total => (pageSimple ? null : `共 ${total} 条数据`),
    onChange: (page: number, pageSize: number) => {
      setPagiOptions(draft => {
        draft.current = page;
        draft.pageSize = pageSize;
      });
      onPageChange && onPageChange(page, pageSize);
    },
  });
  useEffect(() => {
    setPagiOptions(draft => {
      draft.total = config.total;
      draft.current = config.page;
      draft.pageSize = config.limit;
    });
  }, [config]);

  // 自定义暴露的内容
  useImperativeHandle(
    ref,
    () => ({
      // 设置分页
      setPage: (page: number, pageSize?: number) => {
        setPagiOptions(draft => {
          draft.current = page;
          draft.pageSize = pageSize || pagiOptions.pageSize;
        });
      },
      // 清除多选
      clearSelection: () => {
        setSelectedRowKeys([]);
        onRowSelect && onRowSelect([], []);
      },
    }),
    [pagiOptions]
  );

  return (
    <Table<DataType>
      rowKey="id"
      columns={columns}
      dataSource={data}
      expandable={expandable}
      pagination={pagination ? pagiOptions : false}
      rowSelection={rowSelect ? rowSelection : undefined}
      bordered={config.bordered}
      loading={config.loading}
      scroll={{ scrollToFirstRowOnChange: true, ...scroll }}
      size={size}
      onRow={record => {
        return {
          onClick: event => onRowClick && onRowClick(record, event),
          // onDoubleClick: event => {},
          // onContextMenu: event => {},
          // onMouseEnter: event => {},
          // onMouseLeave: event => {},
        };
      }}
    />
  );
});
