import { useRef } from "react";
import { Space, Tag, type TableProps } from "antd";
import { deleteEmptyProperty } from "@/utils/common";
import RButton from "@/components/RButton";
import RTable from "@/components/RTable";
import RTableSearch from "@/components/RTable/tableSearch";
import RTableModal, { type RTableModalInstance } from "@/components/RTable/tableModal";
import data from "@/components/RTable/data";

// 搜索表单配置
const searchs: TableSearchs[] = [
  {
    prop: "name",
    label: "姓名",
    placeholder: "请输入姓名",
    type: "input",
  },
  {
    prop: "age",
    label: "年龄",
    placeholder: "请输入年龄",
    type: "number",
    min: 0,
    step: 1,
    precision: 0,
  },
  {
    prop: "tags1",
    label: "单选",
    placeholder: "请选择标签",
    type: "select",
    options: [
      { label: "nice", value: "nice" },
      { label: "cool", value: "cool" },
      { label: "teacher", value: "teacher" },
      { label: "developer", value: "developer" },
    ],
  },
  {
    prop: "tags2",
    label: "多选",
    placeholder: "请选择标签",
    type: "multiSelect",
    options: [
      { label: "nice", value: "nice" },
      { label: "cool", value: "cool" },
      { label: "teacher", value: "teacher" },
      { label: "developer", value: "developer" },
    ],
  },
  {
    prop: "treeSelect",
    label: "树形",
    placeholder: "请选择数据",
    type: "treeSelect",
    treeData: [
      {
        title: "1",
        value: 1,
        children: [
          { title: "1-1", value: 11 },
          { title: "1-2", value: 12 },
        ],
        selectable: false,
      },
      {
        title: "2",
        value: 2,
        children: [
          {
            title: "2-1",
            value: 21,
            children: [
              { title: "2-1-1", value: 211 },
              { title: "2-1-2", value: 212 },
            ],
          },
          { title: "2-2", value: 22 },
        ],
        selectable: false,
      },
    ],
  },
  {
    prop: "date",
    label: "日期",
    placeholder: "请选择日期",
    type: "date",
  },
  {
    prop: "time",
    label: "时间",
    placeholder: "请选择时间",
    type: "time",
  },
  {
    prop: "datetime",
    label: "日期时间",
    placeholder: "请选择日期时间",
    type: "datetime",
  },
  {
    prop: "dateRange",
    label: "日期范围",
    placeholder: "请选择日期范围",
    type: "dateRange",
  },
  {
    prop: "timeRange",
    label: "时间范围",
    placeholder: "请选择时间范围",
    type: "timeRange",
  },
  {
    prop: "datetimeRange",
    label: "日时范围",
    placeholder: "请选择日时范围",
    type: "datetimeRange",
  },
  {
    prop: "switch",
    label: "开关",
    placeholder: "请选择开或关",
    type: "switch",
    defaultValue: true,
    checkedChildren: "开启",
    unCheckedChildren: "关闭",
  },
];
// 弹窗表单配置
const options: TableModals[] = [
  {
    prop: "name",
    label: "姓名",
    placeholder: "请输入姓名",
    required: true,
    type: "input",
  },
  {
    prop: "age",
    label: "年龄",
    placeholder: "请输入年龄",
    required: true,
    type: "number",
    min: 0,
    step: 1,
    precision: 0,
  },
  {
    prop: "tags1",
    label: "单选",
    placeholder: "请选择标签",
    required: true,
    type: "select",
    options: [
      { label: "nice", value: "nice" },
      { label: "cool", value: "cool" },
      { label: "teacher", value: "teacher" },
      { label: "developer", value: "developer" },
    ],
  },
  {
    prop: "tags2",
    label: "多选",
    placeholder: "请选择标签",
    required: true,
    type: "multiSelect",
    options: [
      { label: "nice", value: "nice" },
      { label: "cool", value: "cool" },
      { label: "teacher", value: "teacher" },
      { label: "developer", value: "developer" },
    ],
  },
  {
    prop: "treeSelect",
    label: "树形",
    placeholder: "请选择数据",
    required: false,
    type: "treeSelect",
    treeData: [
      {
        title: "1",
        value: 1,
        children: [
          { title: "1-1", value: 11 },
          { title: "1-2", value: 12 },
        ],
        selectable: false,
      },
      {
        title: "2",
        value: 2,
        children: [
          {
            title: "2-1",
            value: 21,
            children: [
              { title: "2-1-1", value: 211 },
              { title: "2-1-2", value: 212 },
            ],
          },
          { title: "2-2", value: 22 },
        ],
        selectable: false,
      },
    ],
  },
  {
    prop: "date",
    label: "日期",
    placeholder: "请选择日期",
    required: false,
    type: "date",
  },
  {
    prop: "time",
    label: "时间",
    placeholder: "请选择时间",
    required: false,
    type: "time",
  },
  {
    prop: "datetime",
    label: "日期时间",
    placeholder: "请选择日期时间",
    required: false,
    type: "datetime",
  },
  {
    prop: "dateRange",
    label: "日期范围",
    placeholder: "请选择日期范围",
    required: false,
    type: "dateRange",
  },
  {
    prop: "timeRange",
    label: "时间范围",
    placeholder: "请选择时间范围",
    required: false,
    type: "timeRange",
  },
  {
    prop: "datetimeRange",
    label: "日时范围",
    placeholder: "请选择日时范围",
    required: false,
    type: "datetimeRange",
  },
  {
    prop: "switch",
    label: "开关",
    placeholder: "请选择开或关",
    required: false,
    type: "switch",
    defaultValue: true,
    checkedChildren: "开启",
    unCheckedChildren: "关闭",
  },
];
// 表格列配置
const columns: TableProps["columns"] = [
  {
    title: "姓名",
    dataIndex: "name",
    render: text => <a>{text}</a>,
  },
  {
    title: "年龄",
    dataIndex: "age",
  },
  {
    title: "地址",
    dataIndex: "address",
  },
  {
    title: "标签",
    dataIndex: "tags",
    render: (_, { tags }) => (
      <>
        {tags.map((tag: string) => {
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
    title: "操作",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
  },
];

export default function FormTable() {
  const modalRef = useRef<RTableModalInstance>();
  const onTableSearch = (values: AnyObjectType) => {
    console.log("Received values of form: ", deleteEmptyProperty(values));
  };
  const onTableSubmit = (values: AnyObjectType) => {
    console.log("Received values of form: ", deleteEmptyProperty(values));
    modalRef.current?.closeModal();
  };

  return (
    <>
      <RTableSearch defaultExpand searchs={searchs} onSearch={onTableSearch}>
        <RButton btn_type="info" onClick={() => modalRef.current?.openModal("add")}>
          添加
        </RButton>
        <RButton btn_type="warning" onClick={() => modalRef.current?.openModal("edit")}>
          编辑
        </RButton>
      </RTableSearch>
      <RTable columns={columns} data={data} total={data.length} rowSelect={true} />
      <RTableModal ref={modalRef} title="完整表格" options={options} onSubmit={onTableSubmit} />
    </>
  );
}
