import { useRef } from "react";
import { Space, Tag, type TableProps } from "antd";
import RButton from "@/components/RButton";
import RTable, { RTableInstance } from "@/components/RTable";

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

// 表格数据
const data: DataType[] = [
  {
    id: 1,
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"],
  },
  {
    id: 2,
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"],
  },
  {
    id: 3,
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
  {
    id: 4,
    name: "Disabled User",
    age: 58,
    address: "Beijing No. 1 Lake Park",
    tags: ["loser"],
  },
  {
    id: 5,
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"],
  },
  {
    id: 6,
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"],
  },
  {
    id: 7,
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
  {
    id: 8,
    name: "Disabled User",
    age: 58,
    address: "Beijing No. 1 Lake Park",
    tags: ["loser"],
  },
];

export default function BasicTable() {
  const tableRef = useRef<RTableInstance>();
  const onRowSelect = (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, "selectedRows: ", selectedRows);
  };
  const onPageChange = (page: number, pageSize: number) => {
    console.log(`page: ${page}, pageSize: ${pageSize}`);
  };

  return (
    <>
      <div className="mb10" style={{ display: "flex" }}>
        <RButton className="mr10" onClick={tableRef.current?.clearSelection}>
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
        data={data}
        total={data.length}
        rowSelect={true}
        onRowSelect={onRowSelect}
        onPageChange={onPageChange}
      />
    </>
  );
}
