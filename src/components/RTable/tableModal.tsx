import { useState, useCallback, useImperativeHandle } from "react";
import {
  Modal,
  Row,
  Col,
  Form,
  Input,
  InputNumber,
  Switch,
  Select,
  TreeSelect,
  DatePicker,
  TimePicker,
  type FormInstance,
} from "antd";
import { fixedForwardRef } from "@/utils/fixedForwardRef";

interface RTableModalProps<DataType = AnyObjectType> {
  title: string;
  width?: number | string;
  options: TableModals[];
  onSubmit: (values: DataType) => void;
  onValuesChange?: (changedValues: AnyObjectType, allValues: DataType) => void;
}

export interface RTableModalInstance {
  form: FormInstance;
  resetForm: () => void;
  openModal: (type?: string, data?: AnyObjectType) => void;
  closeModal: () => void;
}

// 表单文本匹配
const typeMap: Record<string, AnyObjectType> = {
  add: { title: "新增", okText: "确认", cancelText: "取消" },
  edit: { title: "编辑", okText: "保存", cancelText: "取消" },
};
// 表单类型匹配
const switchFields = (item: TableModals) => {
  switch (item.type) {
    case "input":
      return <Input allowClear placeholder={item.placeholder} />;
    case "number":
      return (
        <InputNumber
          placeholder={item.placeholder}
          min={item.min}
          max={item.max}
          step={item.step}
          precision={item.precision}
          style={{ width: "100%" }}
        />
      );
    case "select":
      return (
        <Select
          showSearch
          allowClear
          options={item.options}
          placeholder={item.placeholder}
          filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
          dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
        />
      );
    case "multiSelect":
      return (
        <Select
          mode="multiple"
          showSearch
          allowClear
          options={item.options}
          placeholder={item.placeholder}
          filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
          dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
        />
      );
    case "treeSelect":
      return (
        <TreeSelect
          treeLine
          showSearch
          allowClear
          treeDefaultExpandAll
          treeData={item.treeData}
          placeholder={item.placeholder}
          treeNodeLabelProp="title"
          treeNodeFilterProp="title"
          dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
        />
      );
    case "date":
      return (
        <DatePicker
          showNow
          allowClear
          format="YYYY-MM-DD"
          placeholder={item.placeholder}
          style={{ width: "100%" }}
        />
      );
    case "time":
      return (
        <TimePicker
          showNow
          allowClear
          format="HH:mm:ss"
          placeholder={item.placeholder}
          style={{ width: "100%" }}
        />
      );
    case "datetime":
      return (
        <DatePicker
          showNow
          showTime
          allowClear
          format="YYYY-MM-DD HH:mm:ss"
          placeholder={item.placeholder}
          style={{ width: "100%" }}
        />
      );
    case "dateRange":
      return (
        <DatePicker.RangePicker
          showNow
          allowClear
          format="YYYY-MM-DD"
          placeholder={["开始日期", "结束日期"]}
          style={{ width: "100%" }}
        />
      );
    case "timeRange":
      return (
        <TimePicker.RangePicker
          showNow
          allowClear
          format="HH:mm:ss"
          placeholder={["开始时间", "结束时间"]}
          style={{ width: "100%" }}
        />
      );
    case "datetimeRange":
      return (
        <DatePicker.RangePicker
          showNow
          showTime
          allowClear
          format="YYYY-MM-DD HH:mm:ss"
          placeholder={["开始时间", "结束时间"]}
          style={{ width: "100%" }}
        />
      );
    case "switch":
      return <Switch checkedChildren={item.checkedChildren} unCheckedChildren={item.unCheckedChildren} />;
    default:
      return <div style={{ color: "#FF4D4F" }}>匹配不到对应的表单类型</div>;
  }
};

export default fixedForwardRef(function RTableModal<DataType>(
  { title, width = 1000, options, onSubmit, onValuesChange }: RTableModalProps<DataType>,
  ref: any
) {
  const [form] = Form.useForm();
  const [type, setType] = useState("add");
  const [show, setShow] = useState(false);
  const [initVals, setInitVals] = useState<AnyObjectType | undefined>();

  // 表单渲染函数
  const renderFields = useCallback(() => {
    const renderList = [];
    for (let i = 0; i < options.length; i++) {
      const item = options[i];
      renderList.push(
        <Col span={item.span || 12} key={item.prop} style={item.isHiden ? { display: "none" } : undefined}>
          <Form.Item
            name={item.prop}
            label={item.label}
            rules={[{ required: item.required, message: item.message || `${item.label}不能为空` }]}
          >
            {switchFields(item)}
          </Form.Item>
        </Col>
      );
    }
    return renderList;
  }, [options]);

  // 自定义暴露内容
  useImperativeHandle(
    ref,
    () => ({
      // 表单实例
      form: form,
      // 重置表单
      resetForm: () => form.resetFields(),
      // 打开弹窗表单
      openModal: (type: string = "add", data: AnyObjectType | undefined) => {
        setInitVals(data);
        setType(type);
        setShow(true);
      },
      // 关闭弹窗表单
      closeModal: () => {
        setInitVals(undefined);
        setShow(false);
      },
    }),
    [form]
  );

  return (
    <Modal
      centered
      open={show}
      width={width}
      title={(typeMap[type].title || "") + title}
      okText={typeMap[type].okText || "确认"}
      cancelText={typeMap[type].cancelText || "取消"}
      okButtonProps={{ htmlType: "submit" }}
      onCancel={() => setShow(false)}
      maskClosable={false}
      destroyOnClose
      styles={{ body: { paddingTop: "14px" } }}
      modalRender={dom => (
        <Form
          name="rtable_modal"
          size="middle"
          form={form}
          clearOnDestroy
          initialValues={initVals}
          onFinish={(values: DataType) => onSubmit(values)}
          onValuesChange={onValuesChange}
        >
          {dom}
        </Form>
      )}
    >
      <Row gutter={16}>{renderFields()}</Row>
    </Modal>
  );
});
