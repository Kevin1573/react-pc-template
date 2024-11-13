import { useState, useImperativeHandle } from "react";
import { Table, type TableProps, type TablePaginationConfig } from "antd";
import { fixedForwardRef } from "@/utils/fixedForwardRef";

interface RTableProps<DataType = AnyObjectType> {
  columns: TableProps<DataType>["columns"];
  data: DataType[];
  total: number;
  size?: "large" | "middle" | "small";
  bordered?: boolean;
  rowSelect?: boolean;
  rowSelectionType?: "checkbox" | "radio";
  onRowSelect?: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => void;
  pagination?: boolean;
  pageSimple?: boolean;
  onPageChange?: (page: number, pageSize: number) => void;
}

export interface RTableInstance {
  clearSelection: () => void;
  setPage: (page: number, pageSize?: number) => void;
}

export default fixedForwardRef(function RTable<DataType>(
  {
    columns,
    data,
    total,
    size = "middle",
    bordered = true,
    rowSelect = false,
    rowSelectionType = "checkbox",
    onRowSelect,
    pagination = true,
    pageSimple = false,
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
    showSizeChanger: !pageSimple && true,
    showQuickJumper: !pageSimple && true,
    pageSizeOptions: ["5", "20", "50", "100"],
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
      // 清除多选
      clearSelection: () => {
        setSelectedRowKeys([]);
        onRowSelect && onRowSelect([], []);
      },
      // 手动设置分页
      setPage: (page: number, pageSize?: number) => {
        setPagiOptions({
          ...pagiOptions,
          current: page,
          pageSize: pageSize ? pageSize : pagiOptions.pageSize,
        });
      },
    }),
    []
  );

  return (
    <Table<DataType>
      rowSelection={rowSelect ? rowSelection : undefined}
      columns={columns}
      dataSource={data}
      pagination={pagination ? pagiOptions : false}
      bordered={bordered}
      size={size}
      rowKey="id"
    ></Table>
  );
});
