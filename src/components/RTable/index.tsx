import { useState, useImperativeHandle } from "react";
import { Table, type TableProps, type TablePaginationConfig } from "antd";
import { fixedForwardRef } from "@/utils/fixedForwardRef";

interface RTableProps<DataType = AnyObjectType> {
  columns: TableProps<DataType>["columns"];
  data: DataType[];
  total: number;
  size?: "large" | "middle" | "small";
  scroll?: TableProps<DataType>["scroll"];
  bordered?: boolean;
  rowSelect?: boolean;
  rowSelectionType?: "checkbox" | "radio";
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
    data,
    total,
    size = "middle",
    scroll,
    bordered = true,
    rowSelect = false,
    rowSelectionType = "checkbox",
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
    type: rowSelectionType,
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setSelectedRowKeys(selectedRowKeys);
      onRowSelect && onRowSelect(selectedRowKeys, selectedRows);
    },
  };

  // 表格分页配置
  const [pagiOptions, setPagiOptions] = useState<TablePaginationConfig>({
    size: "default",
    position: ["bottomRight"],
    current: 1,
    pageSize: 5,
    simple: pageSimple && { readOnly: pageSimple },
    showQuickJumper: false,
    showSizeChanger: !pageSimple && true,
    pageSizeOptions: ["5", "15", "30", "50"],
    showTotal: () => (pageSimple ? null : `共 ${total} 条数据`),
    onChange: (page: number, pageSize: number) => {
      setPagiOptions({ ...pagiOptions, current: page, pageSize: pageSize });
      onPageChange && onPageChange(page, pageSize);
    },
  });

  // 自定义暴露的内容
  useImperativeHandle(
    ref,
    () => ({
      // 设置分页
      setPage: (page: number, pageSize?: number) => {
        setPagiOptions({
          ...pagiOptions,
          current: page,
          pageSize: pageSize ? pageSize : pagiOptions.pageSize,
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
      rowSelection={rowSelect ? rowSelection : undefined}
      columns={columns}
      dataSource={data}
      pagination={pagination ? pagiOptions : false}
      bordered={bordered}
      scroll={{ scrollToFirstRowOnChange: true, ...scroll }}
      size={size}
      rowKey="id"
      onRow={record => {
        return {
          onClick: event => onRowClick && onRowClick(record, event),
          // onDoubleClick: event => {},
          // onContextMenu: event => {},
          // onMouseEnter: event => {},
          // onMouseLeave: event => {},
        };
      }}
    ></Table>
  );
});
