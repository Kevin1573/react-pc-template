import { useRef } from "react";
import { useImmer } from "use-immer";
import { Space, Tag, type TableProps } from "antd";
import RButton from "@/components/RButton";
import RTable, { RTableInstance } from "@/components/RTable";
import data from "@/components/RTable/data";

interface DataType {
  id: number;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

// 表格列配置
const columns: TableProps<DataType>["columns"] = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: text => <a>{text}</a>,
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Tags",
    key: "tags",
    dataIndex: "tags",
    render: (_, { tags }) => (
      <>
        {tags.map(tag => {
          let color = tag.length > 5 ? "geekblue" : "green";
          if (tag === "loser") {
            color = "volcano";
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
  },
];
// 表格基础配置
const config: TableConfig = {
  page: 1,
  limit: 5,
  total: data.length,
  loading: false,
  bordered: true,
  params: {},
};

export default function BasicTable() {
  const tableRef = useRef<RTableInstance>();
  const [myConfig, setMyConfig] = useImmer<TableConfig>(config);

  // 表格行点击
  const onRowClick = (record: DataType) => {
    console.log("row click:", record);
  };
  // 表格多选
  const onRowSelect = (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, "selectedRows: ", selectedRows);
  };
  // 分页切换
  const onPageChange = (page: number, pageSize: number) => {
    setMyConfig(draft => {
      draft.page = page;
      draft.limit = pageSize;
    });
  };

  return (
    <>
      <div className="mb10" style={{ display: "flex" }}>
        <RButton className="mr10" onClick={() => tableRef.current?.clearSelection()}>
          Clear Selection
        </RButton>
        <RButton className="mr10" btn_type="warning" onClick={() => tableRef.current?.setPage(1)}>
          Set Page 1
        </RButton>
        <RButton className="mr10" btn_type="success" onClick={() => tableRef.current?.setPage(2)}>
          Set Page 2
        </RButton>
      </div>
      <RTable<DataType>
        ref={tableRef}
        columns={columns}
        config={myConfig}
        data={data}
        rowSelect={true}
        rowSelectType="checkbox"
        onRowClick={onRowClick}
        onRowSelect={onRowSelect}
        onPageChange={onPageChange}
      />
    </>
  );
}
