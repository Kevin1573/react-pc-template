import { Form, Input, type FormProps } from "antd";
import { HappyProvider } from "@ant-design/happy-work-theme";
import RButton from "@/components/RButton";
import styles from "./index.module.scss";
import { useRef, useState } from "react";
import { Parser } from 'node-sql-parser'
import SqlEditor from "./SqlEditor";

type FieldType = {
  username: string;
  password: string;
};

const parseInsertFunc = (text: string) => {
  const sql = text.toUpperCase();
  const opt = {
    database: 'MySQL' // MySQL 是默认数据库
  }
  try {
    const parser = new Parser()
    console.log(parser);
    const ast: any = parser.astify(sql, opt);
    const sql2 = parser.sqlify(ast, opt);
    console.log(ast, sql2);
    console.log('header', ast.columns);
    console.log('row-data', ast.values[0].value);
    return {
      header: ast.columns,
      rowdata: ast.values[0].value
    }
  } catch (error: any) {
    console.error("解析SQL语句出错:", error?.message);
  }

  return { header: [], rowdata: [] };
}


export default function TextParser() {
  const [sqlColumns, setSqlColumns] = useState<string[]>([]);
  const useStateRef = useRef([] as string[])
  const [sqlValues, setSqlValues] = useState<string[]>([]);
  const [tableStatus, setTableStatus] = useState(false);


  // 用户登录
  const handleLogin: FormProps<FieldType>["onFinish"] = async values => {
    console.log("Form Value", values);
    // setParsedText(parseFunc(values.username));
    const parseSqlObject = parseInsertFunc(values.username);

    setSqlColumns(() => {
      return parseSqlObject.header;
    });
    setSqlValues(() => {
      return parseSqlObject.rowdata;
    });
    console.log('after set value', sqlColumns.length, sqlValues.length, useStateRef.current);

    // 显示sql列表格
    setTableStatus(true);
  };

  return (
    <div className={styles.login}>
      <div className={styles.right}>

        {/* <div className={styles.container}>
          <Form
            name="login"
            labelCol={{ span: 0 }}
            wrapperCol={{ span: 24 }}
            style={{ width: "100%" }}
            initialValues={{ username: "insert into table_str(name, age, hobby, time) values(?,?,?,now())", password: "123456" }}
            onFinish={handleLogin}
            autoComplete="off"
          >
            <Form.Item label="用户名" name="username" rules={[{ required: true, message: "请输入用户名!" }]}>
              <Input.TextArea rows={5} />
            </Form.Item>
             <Form.Item label="密码" name="password" rules={[{ required: false, message: "请输入密码！" }]}>
              <Input.Password />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 3, span: 6 }}>
              <HappyProvider>
                <RButton block htmlType="submit">
                  转换
                </RButton>
              </HappyProvider>
            </Form.Item>
          </Form>
        </div> */}

        <SqlEditor />

      </div>
    </div>
  );


}
