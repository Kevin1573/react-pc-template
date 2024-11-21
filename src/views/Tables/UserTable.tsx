import { useRef, useState, useEffect } from "react";
import { useImmer } from "use-immer";
import { Space, Tag, type TableProps } from "antd";
import { getUsers, getUserRoles } from "@/api";
import { AdMessage, AdModal } from "@/utils/AntdGlobal";
import { deleteEmptyProperty } from "@/utils/common";
import RButton from "@/components/RButton";
import RTable from "@/components/RTable";
import RTableModal, { type RTableModalInstance } from "@/components/RTable/tableModal";
import RTableSearch, { type RTableSearchInstance } from "@/components/RTable/tableSearch";

interface DataType {
  id: number;
  name: string;
  gender: "male" | "female";
  age: number;
  address: string;
  isAdmin: boolean;
  roles: string[];
}

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
    prop: "gender",
    label: "性别",
    placeholder: "请选择性别",
    type: "select",
    options: [
      { label: "男", value: "male" },
      { label: "女", value: "female" },
    ],
  },
  {
    prop: "address",
    label: "地址",
    placeholder: "请输入地址",
    type: "input",
  },
  {
    prop: "roles",
    label: "角色权限",
    placeholder: "请选择角色权限",
    type: "multiSelect",
    options: [],
  },
  {
    prop: "isAdmin",
    label: "管理员",
    placeholder: "请选择是否管理员",
    type: "select",
    options: [
      { label: "是", value: 1 },
      { label: "否", value: 0 },
    ],
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
    prop: "gender",
    label: "性别",
    placeholder: "请选择性别",
    required: true,
    type: "select",
    options: [
      { label: "男", value: "male" },
      { label: "女", value: "female" },
    ],
  },
  {
    prop: "address",
    label: "地址",
    placeholder: "请输入地址",
    required: true,
    type: "input",
  },
  {
    prop: "roles",
    label: "角色权限",
    placeholder: "请选择角色权限",
    required: true,
    type: "multiSelect",
    options: [],
  },
  {
    prop: "isAdmin",
    label: "管理员",
    placeholder: "请选择",
    required: false,
    type: "switch",
    checkedChildren: "是",
    unCheckedChildren: "否",
  },
];
// 表格基础配置
const config: TableConfig = {
  page: 1,
  limit: 15,
  total: 0,
  loading: false,
  bordered: true,
  params: {},
};

export default function UserTable() {
  const modalRef = useRef<RTableModalInstance>();
  const searchRef = useRef<RTableSearchInstance>();
  const [tableSearchs, setTableSearchs] = useImmer<TableSearchs[]>(searchs);
  const [tableModals, setTableModals] = useImmer<TableModals[]>(options);
  const [tableConfig, setTableConfig] = useImmer<TableConfig>(config);
  const [tableData, setTableData] = useState<DataType[]>([]);

  // 获取字典数据
  const initDictData = async () => {
    try {
      const { code, data } = await getUserRoles({ page: "all" });
      if (code !== 200) return AdMessage.error("字典数据获取失败");
      const roleOptions = data.data.map((item: AnyObjectType) => ({
        label: item.name,
        value: item.id,
      }));
      setTableSearchs(draft => {
        draft.find(item => item.prop === "roles")!.options = roleOptions;
      });
      setTableModals(draft => {
        draft.find(item => item.prop === "roles")!.options = roleOptions;
      });
    } catch (error) {
      console.log(error);
      AdMessage.error("字典数据请求失败");
    }
  };
  // 获取表单数据
  const initTableData = async () => {
    setTableConfig(draft => {
      draft.loading = true;
    });
    try {
      const { code, data } = await getUsers({
        ...tableConfig.params,
        page: tableConfig.page,
        limit: tableConfig.limit,
      });
      if (code !== 200) return AdMessage.error("表格数据获取失败");
      setTableData(data.data);
      setTableConfig(draft => {
        draft.total = data.total;
        draft.loading = false;
      });
    } catch (error) {
      console.log(error);
      AdMessage.error("表格数据请求失败");
    }
  };
  // 条件搜索
  const onTableSearch = (values: AnyObjectType) => {
    console.log("onTableSearch:", deleteEmptyProperty(values));
    setTableConfig(draft => {
      draft.page = 1;
      draft.params = deleteEmptyProperty(values);
    });
  };
  // 表单提交
  const onTableSubmit = (values: AnyObjectType) => {
    console.log("onTableSubmit: ", deleteEmptyProperty(values));
    modalRef.current?.closeModal();
  };
  // 表格删除
  const onTableDelete = (record: DataType) => {
    AdModal.confirm({
      title: "系统提示",
      content: "确定删除吗？",
      okText: "确认",
      cancelText: "取消",
      centered: true,
      onOk: () => {
        console.log("onTableDelete: ", record);
      },
    });
  };
  // 切换分页
  const onPageChange = (page: number, pageSize: number) => {
    setTableConfig(draft => {
      draft.page = page;
      draft.limit = pageSize;
    });
  };

  // 触发搜索
  useEffect(() => {
    initTableData();
  }, [tableConfig.page, tableConfig.limit, tableConfig.params]);

  // 生命周期 Mounted
  useEffect(() => {
    initDictData();
  }, []);

  // 表格列配置
  const tableColumns: TableProps<DataType>["columns"] = [
    {
      title: "姓名",
      dataIndex: "name",
      width: 200,
    },
    {
      title: "性别",
      dataIndex: "gender",
      width: 70,
      align: "center",
      render: (_, { gender }) => (
        <Tag className="mr0" color={gender == "male" ? "geekblue" : "volcano"}>
          {gender == "male" ? "男" : "女"}
        </Tag>
      ),
    },
    {
      title: "年龄",
      dataIndex: "age",
      width: 70,
      align: "center",
    },
    {
      title: "地址",
      dataIndex: "address",
      ellipsis: true,
    },
    {
      title: "角色权限",
      dataIndex: "roles",
      render: (_, { roles }) => (
        <Space size="small">
          {roles.map(role => (
            <Tag color="cyan" key={role}>
              {role}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "管理员",
      dataIndex: "isAdmin",
      width: 70,
      align: "center",
      render: (_, { isAdmin }) => (
        <Tag className="mr0" color={isAdmin ? "green" : "volcano"}>
          {isAdmin ? "是" : "否"}
        </Tag>
      ),
    },
    {
      title: "操作",
      key: "action",
      width: 150,
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <RButton
            btn_type="primary"
            size="small"
            onClick={() => modalRef.current?.openModal("edit", record)}
          >
            编辑
          </RButton>
          <RButton btn_type="error" size="small" onClick={() => onTableDelete(record)}>
            删除
          </RButton>
        </Space>
      ),
    },
  ];

  return (
    <>
      <RTableSearch<DataType> ref={searchRef} searchs={tableSearchs} onSearch={onTableSearch}>
        <RButton btn_type="info" onClick={() => modalRef.current?.openModal("add", { isAdmin: true })}>
          新增用户
        </RButton>
      </RTableSearch>
      <RTable
        columns={tableColumns}
        config={tableConfig}
        data={tableData}
        rowSelect={true}
        onPageChange={onPageChange}
      />
      <RTableModal<DataType> ref={modalRef} title="用户" options={tableModals} onSubmit={onTableSubmit} />
    </>
  );
}
