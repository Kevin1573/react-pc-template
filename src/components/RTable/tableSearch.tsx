import { useRef, useState, useCallback, useImperativeHandle, useEffect } from "react";
import {
  Row,
  Col,
  Form,
  Space,
  Input,
  InputNumber,
  Switch,
  Select,
  TreeSelect,
  DatePicker,
  TimePicker,
  type FormInstance,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import { fixedForwardRef } from "@/utils/fixedForwardRef";
import RButton from "@/components/RButton";

interface RTableSearchProps<DataType = AnyObjectType> {
  searchs: TableSearchs[];
  onSearch: (values: DataType) => void;
  onHeightChange?: (height: number) => void;
  onValuesChange?: (changedValues: AnyObjectType, allValues: DataType) => void;
  children?: React.ReactNode;
  defaultExpand?: boolean;
}

export interface RTableSearchInstance {
  form: FormInstance;
  element: HTMLFormElement | null;
  resetForm: () => void;
}

// 表单样式
const formStyle: React.CSSProperties = {
  padding: "0 6px 14px 2px",
  maxWidth: "none",
};

// 表单类型匹配
const switchFields = (item: TableSearchs) => {
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
      return (
        <Switch
          checkedChildren={item.checkedChildren}
          unCheckedChildren={item.unCheckedChildren}
          defaultChecked={Boolean(item.defaultValue)}
        />
      );
    default:
      return <div style={{ color: "#FF4D4F" }}>匹配不到对应的表单类型</div>;
  }
};

export default fixedForwardRef(function RTableSearch<DataType>(
  {
    searchs,
    onSearch,
    onHeightChange,
    onValuesChange,
    children,
    defaultExpand = false,
  }: RTableSearchProps<DataType>,
  ref: any
) {
  const formRef = useRef<any>();
  const [form] = Form.useForm();
  const [expand, setExpand] = useState(Boolean(defaultExpand));
  const needExpand = searchs.filter(item => !item.isHiden).length > 4;

  // 获取收起时的索引
  const getShrinkIndex = useCallback(() => {
    let count = 0;
    let index = 0;
    for (let i = 0; i < searchs.length; i++) {
      if (!searchs[i].isHiden) count++;
      if (count === 4) {
        index = i;
        break;
      }
    }
    return index;
  }, [searchs]);

  // 表单渲染函数
  const renderFields = useCallback(() => {
    const renderCount = needExpand ? (expand ? searchs.length : getShrinkIndex() + 1) : searchs.length;
    const renderList = [];
    for (let i = 0; i < renderCount; i++) {
      const item = searchs[i];
      renderList.push(
        <Col span={6} key={item.prop} style={item.isHiden ? { display: "none" } : undefined}>
          <Form.Item
            name={item.prop}
            label={item.label}
            rules={[{ required: false }]}
            style={{ marginBottom: "14px" }}
            initialValue={item.defaultValue || null}
          >
            {switchFields(item)}
          </Form.Item>
        </Col>
      );
    }
    return renderList;
  }, [searchs, expand, needExpand, getShrinkIndex]);

  // 表单重置
  const onRest = () => {
    form.resetFields();
    onSearch(form.getFieldsValue());
  };

  // 监听组件高度变化
  useEffect(() => {
    onHeightChange && onHeightChange(formRef.current?.nativeElement.offsetHeight);
  }, [expand]);

  // 自定义暴露内容
  useImperativeHandle(
    ref,
    () => ({
      // 表单实例
      form: form,
      // 表单元素
      element: formRef.current?.nativeElement,
      // 重置表单
      resetForm: () => form.resetFields(),
    }),
    [form, formRef]
  );

  return (
    <Form
      name="rtable_search"
      size="middle"
      ref={formRef}
      form={form}
      style={formStyle}
      onFinish={(values: DataType) => onSearch(values)}
      onValuesChange={onValuesChange}
    >
      <Row gutter={16}>{renderFields()}</Row>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {children ? <Space size="small">{children}</Space> : <div></div>}
        <Space size="small">
          <RButton btn_type="primary" htmlType="submit">
            搜索
          </RButton>
          <RButton btn_type="blank" onClick={onRest}>
            重置
          </RButton>
          {needExpand && (
            <a style={{ fontSize: 12 }} onClick={() => setExpand(!expand)}>
              <DownOutlined rotate={expand ? 180 : 0} /> {expand ? "收起" : "展开"}
            </a>
          )}
        </Space>
      </div>
    </Form>
  );
});
