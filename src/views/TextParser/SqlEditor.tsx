import React, { useCallback, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import { Parser } from "node-sql-parser";
// import { debounce } from 'lodash';
import { HappyProvider } from "@ant-design/happy-work-theme";
import RButton from "@/components/RButton";
import { Col, Flex, Row, Segmented } from "antd";
import { AppstoreOutlined, BarsOutlined } from "@ant-design/icons";
import type { ReactCodeMirrorProps } from "@uiw/react-codemirror";

interface SqlEditorProps {
  // 可以在这里定义一些外部传入的属性，比如初始代码内容等，当前示例暂未使用外部传入属性
}

const prepareHandleSql = (sql: string) => {
  let _sql = sql.replace("\\n", "");
  _sql = _sql.replace(";", "");
  console.log(_sql);

  return _sql;
};

const parseInsertFunc = (text: string) => {
  let sql = text; //text.toUpperCase();
  /**
   * sql预处理
   * replace /n
   */
  sql = prepareHandleSql(sql);
  const opt = {
    database: "MySQL", // MySQL 是默认数据库
  };
  try {
    const parser = new Parser();
    console.log(parser);
    const ast: any = parser.astify(sql, opt);
    const sql2 = parser.sqlify(ast, opt);
    console.log("ast:", ast, "sql2:", sql2);

    // 处理now()函数值
    const processedValues = ast.values[0].value.map((item: any) => {
      if (item.type === 'function' && item.name?.name[0].value === 'now') {
        return {
          type: 'function',
          value: 'now()',
          name: 'now'
        };
      }
      return item;
    });
    return {
      header: ast.columns,
      rowdata: processedValues  // 使用处理后的值
    };
  } catch (error: any) {
    console.error("解析SQL语句出错:", error?.message);
  }

  return { header: [], rowdata: [] };
};

const SqlEditor: React.FunctionComponent<SqlEditorProps> = () => {
  const [value, setValue] = React.useState(
    "insert into table_str(name, age, hobby, time) values(?,?,?,now());"
  );
  const [sqlColumns, setSqlColumns] = useState<string[]>([]);
  const [sqlValues, setSqlValues] = useState<string[]>([]);
  const [tableStatus, setTableStatus] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ReactCodeMirrorProps['theme']>('dark');

  const themeConfig = [{
    theme: 'light', // 初始主题为 'light'
    styles: {
      border: '1px solid #d9d9d9',
      borderRadius: '6px',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08)',
      overflow: 'hidden'
    }
  }, {
    theme: 'dark', // 初始主题为 'light'
    styles: {
      border: '1px solid #434343',
      borderRadius: '6px',
      overflow: 'hidden'
    }
  }];

  const onChange = useCallback((val: string, viewUpdate: any) => {
    console.log("val:", val, viewUpdate);
    setValue(val);
  }, []);

  const handleSqlParse = () => {
    const parseSqlObject = parseInsertFunc(value);

    setSqlColumns(() => {
      return parseSqlObject.header;
    });
    setSqlValues(() => {
      return parseSqlObject.rowdata;
    });
    setTableStatus(true);
  };

  return (
    <>
      <div className="flex flex-col space-y-2">
        <Row>
          <Col span={6} offset={6}>
            <HappyProvider>
              <Flex justify="center">
                <RButton block style={{ width: 200 }} onClick={handleSqlParse}>
                  转换
                </RButton>
              </Flex>
            </HappyProvider>
          </Col>
          <Col span={6} offset={6}>
            <Flex justify="end">
              <Segmented
                defaultValue={currentTheme === 'dark' ? 'dark' : 'light'}
                options={[
                  { value: 'light', icon: <BarsOutlined /> },
                  { value: 'dark', icon: <AppstoreOutlined /> },
                ]}
                onChange={(value: 'light' | 'dark') => { setCurrentTheme(value) }}
              />
            </Flex>
          </Col>
        </Row>

        <CodeMirror value={value}
          height="400px"
          extensions={[sql()]}
          onChange={onChange}
          style={{
            ...themeConfig.filter(item => item.theme === currentTheme)[0]?.styles,
            fontFamily: '"JetBrains Mono", monospace', // 添加等宽字体
            fontSize: '16px',
            lineHeight: '1.5',
            letterSpacing: '0.3px'
          }}
          theme={currentTheme} />
        <div className="overflow-x-auto">
          {tableStatus ? (
            <>
              <table className=" divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr key={"header"}>
                    {sqlColumns.length > 0 ? (
                      sqlColumns.map((item, index) => (
                        <th
                          key={index}
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {item as string}
                        </th>
                      ))
                    ) : (
                      <th key={"2"}>no field</th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr key={"row"} className="hover:bg-gray-50">
                    {sqlValues.length > 0 ? (
                      sqlValues.map((item: any, index) => {
                        if (item.type === "origin" || item.type === 'single_quote_string') {
                          return (
                            <td key={index} className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.value}
                            </td>
                          );
                        } else if (item.type === 'function' && item.name === 'now') {
                          return (
                            <td key={index} className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.value}
                            </td>
                          );
                        }
                        return <td key={index}>no</td>;
                      })
                    ) : (
                      <td key={"3"}>no field</td>
                    )}
                  </tr>
                </tbody>
              </table>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default SqlEditor;
