import Copy from "@/components/Copy";
import JsonDiffPage from "@/components/JsonDiff";
import { Card, Flex, Row, Col, Divider, Space, Button, Input, Switch } from "antd";
import Title from "antd/lib/typography/Title";
import { Differ } from 'json-diff-kit';
import { useState, useMemo, useRef } from 'react';
const { TextArea } = Input;

// 移除原有的文件导入
// import beforeObj from '../../data/before.json';
// import afterObj from '../../data/after.json';

// 递归生成节点路径
const generatePaths = (obj: any, prefix = ''): string[] => {
    let paths: string[] = [];
    if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) {
            const newPath = prefix ? `${prefix}.${key}` : key;
            paths.push(newPath);
            paths = paths.concat(generatePaths(obj[key], newPath));
        }
    }
    return paths;
};

// 生成树形结构数据
const generateTreeData = (obj: any, prefix = ''): any[] => {
    let treeData: any[] = [];
    if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) {
            const newPath = prefix ? `${prefix}.${key}` : key;
            const children = generateTreeData(obj[key], newPath);
            const node: any = {
                title: key,
                value: newPath,
                key: newPath,
            };
            if (children.length > 0) {
                node.children = children;
            }
            treeData.push(node);
        }
    }
    return treeData;
};

// Add prefix to tree data keys
const addPrefixToTreeData = (treeData: any[], prefix: string): any[] => {
    return treeData.map((node) => {
        const newNode = { ...node };
        newNode.value = `${prefix}${node.value}`;
        newNode.key = `${prefix}${node.key}`;
        if (newNode.children) {
            newNode.children = addPrefixToTreeData(newNode.children, prefix);
        }
        return newNode;
    });
};

// 自定义树组件
const CustomTree = ({ treeData, onSelect, beforeObj, afterObj }: { treeData: any[], onSelect: (value: string) => void, beforeObj: any, afterObj: any }) => {
    // 新增状态，用于记录当前选中的节点值
    const [selectedValue, setSelectedValue] = useState('');

    // 根据路径获取对象的值
    const getValueByPath = (obj: any, path: string) => {
        const keys = path.split('.');
        let value = obj;
        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                return undefined;
            }
        }
        return value;
    };

    const renderNode = (node: any) => {
        const handleClick = () => {
            onSelect(node.value);
            // 点击时更新选中的节点值
            setSelectedValue(node.value);
        };

        // 判断是 before 还是 after 的路径
        let objToUse;
        if (node.value.startsWith('before_')) {
            objToUse = beforeObj;
            node.value = node.value.replace('before_', '');
        } else if (node.value.startsWith('after_')) {
            objToUse = afterObj;
            node.value = node.value.replace('after_', '');
        }

        const nodeValue = getValueByPath(objToUse, node.value);
        const displayValue = typeof nodeValue === 'object' ? JSON.stringify(nodeValue) : nodeValue;

        // 判断当前节点是否为数组下标
        const isArrayIndex = Array.isArray(getParentObject(objToUse, node.value)) && !isNaN(Number(node.title));

        // 根据选中状态动态设置样式
        const nodeStyle = {
            cursor: 'pointer',
            paddingLeft: node.level ? node.level * 20 : 0,
            backgroundColor: selectedValue === node.value ? '#e6f7ff' : 'transparent', // 选中时变蓝色
            whiteSpace: 'nowrap', // 防止文本换行
            overflow: 'hidden', // 隐藏溢出内容
            textOverflow: 'ellipsis', // 溢出内容用省略号表示
            maxWidth: '100%', // 限制最大宽度
        };

        // 新增获取父对象的函数
        function getParentObject(obj: any, path: string) {
            const keys = path.split('.');
            let parent = obj;
            for (let i = 0; i < keys.length - 1; i++) {
                const key = keys[i];
                if (parent && typeof parent === 'object' && key in parent) {
                    parent = parent[key];
                } else {
                    return null;
                }
            }
            return parent;
        }

        return (
            <div>
                <div onClick={handleClick} style={nodeStyle}>
                    {/* 对 node.title 加粗处理 */}
                    <span style={{ fontWeight: 'bold' }}>{node.title}</span>: {isArrayIndex ? '' : displayValue}
                </div>
                {node.children && node.children.map((child: any) => (
                    <div key={child.key}>
                        {renderNode({ ...child, level: (node.level || 0) + 1 })}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div>
            {treeData.map((node) => (
                <div key={node.key}>
                    {renderNode(node)}
                </div>
            ))}
        </div>
    );
};

// 修改主组件的返回部分，传递 beforeObj 和 afterObj 给 CustomTree
export default function jsonDiffViewPage() {
    const showDiffButtonRef = useRef<HTMLButtonElement>(null);

    const scrollToShowDiffButton = () => {
        if (showDiffButtonRef.current) {
            showDiffButtonRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // 定义滚动到页面顶部的函数
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const [beforeJsonInput, setBeforeJsonInput] = useState('');
    const [afterJsonInput, setAfterJsonInput] = useState('');
    const [beforeObj, setBeforeObj] = useState<any>({});
    const [afterObj, setAfterObj] = useState<any>({});

    const [selectedBeforePath, setSelectedBeforePath] = useState('');
    const [selectedAfterPath, setSelectedAfterPath] = useState('');
    const differ = useMemo(() => {
        return new Differ({
            detectCircular: true,
            maxDepth: Infinity,
            showModifications: true,
            arrayDiffMethod: 'lcs',
            ignoreCase: false,
            ignoreCaseForKey: false,
            recursiveEqual: true
        });
    }, []);

    const [diff, setDiff] = useState(() => {
        return differ.diff(beforeObj, afterObj);
    });

    const [shouldShowDiff, setShouldShowDiff] = useState(false);
    // 新增状态来保存当前的 beforeValue 和 afterValue
    const [currentBeforeValue, setCurrentBeforeValue] = useState(beforeObj);
    const [currentAfterValue, setCurrentAfterValue] = useState(afterObj);
    // 使用 useState 来管理开关状态
    const [isWordMode, setIsWordMode] = useState(false);
    // 根据路径获取对象的值
    const getValueByPath = (obj: any, path: string) => {
        // Remove the prefix
        const actualPath = path.replace(/^(before_|after_)/, '');
        const keys = actualPath.split('.');
        let value = obj;
        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                return undefined;
            }
        }
        return value;
    };

    // 定义一个函数用于格式化和排序 JSON 数据
    const formatAndSortJson = (jsonObj: any): any => {
        if (typeof jsonObj !== 'object' || jsonObj === null) {
            return jsonObj;
        }
        if (Array.isArray(jsonObj)) {
            return jsonObj.map(item => formatAndSortJson(item));
        }
        const sortedKeys = Object.keys(jsonObj).sort();
        const sortedObj: Record<string, any> = {};
        for (const key of sortedKeys) {
            sortedObj[key] = formatAndSortJson(jsonObj[key]);
        }
        return sortedObj;
    };

    // 修改 handleBeforeJsonChange 函数
    const handleBeforeJsonChange = (value: string) => {
        try {
            const parsedObj = JSON.parse(value);
            const formattedObj = formatAndSortJson(parsedObj);
            const formattedJsonString = JSON.stringify(formattedObj, null, 2);
            setBeforeJsonInput(formattedJsonString);
            setBeforeObj(formattedObj);
        } catch (error: any) {
            console.error('Before JSON 解析失败:', error);
            setBeforeJsonInput(value);
            // 设置包含错误信息的对象
            setBeforeObj({ error: `JSON 解析错误: ${error.message}` });
        }
    };

    // 修改 handleAfterJsonChange 函数
    const handleAfterJsonChange = (value: string) => {
        try {
            const parsedObj = JSON.parse(value);
            const formattedObj = formatAndSortJson(parsedObj);
            const formattedJsonString = JSON.stringify(formattedObj, null, 2);
            setAfterJsonInput(formattedJsonString);
            setAfterObj(formattedObj);
        } catch (error: any) {
            console.error('After JSON 解析失败:', error);
            setAfterJsonInput(value);
            // 设置包含错误信息的对象
            setAfterObj({ error: `JSON 解析错误: ${error.message}` });
        }
    };

    const handleShowDiff = () => {
        let beforeValue = beforeObj;
        let afterValue = afterObj;
        if (selectedBeforePath) {
            const tempBefore = getValueByPath(beforeObj, `before_${selectedBeforePath}`);
            if (tempBefore !== undefined) {
                beforeValue = tempBefore;
            }
        }
        if (selectedAfterPath) {
            const tempAfter = getValueByPath(afterObj, `after_${selectedAfterPath}`);
            if (tempAfter !== undefined) {
                afterValue = tempAfter;
            }
        }

        const newDiff = differ.diff(beforeValue, afterValue);

        // 打印当前选择节点 before 和 after 的节点数据以及比对时的数据
        console.log('当前选择节点的 before 数据:', beforeValue);
        console.log('当前选择节点的 after 数据:', afterValue);
        console.log('比对时的数据:', newDiff);

        setDiff(newDiff);
        setShouldShowDiff(true);
        // 更新当前的 beforeValue 和 afterValue
        setCurrentBeforeValue(beforeValue);
        setCurrentAfterValue(afterValue);
    };

    // 新增一个函数，用于在模式切换时重新计算 diff
    const handleModeChange = () => {
        setIsWordMode(!isWordMode);
        let beforeValue = beforeObj;
        let afterValue = afterObj;
        if (selectedBeforePath) {
            const tempBefore = getValueByPath(beforeObj, `before_${selectedBeforePath}`);
            if (tempBefore !== undefined) {
                beforeValue = tempBefore;
            }
        }
        if (selectedAfterPath) {
            const tempAfter = getValueByPath(afterObj, `after_${selectedAfterPath}`);
            if (tempAfter !== undefined) {
                afterValue = tempAfter;
            }
        }

        const newDiff = differ.diff(beforeValue, afterValue);
        setDiff(newDiff);
        setCurrentBeforeValue(beforeValue);
        setCurrentAfterValue(afterValue);
    };

    const beforeTreeData = generateTreeData(beforeObj);
    const afterTreeData = generateTreeData(afterObj);

    const prefixedBeforeTreeData = addPrefixToTreeData(beforeTreeData, 'before_');
    const prefixedAfterTreeData = addPrefixToTreeData(afterTreeData, 'after_');

    return (
        <>
            {/* 悬浮按钮组 */}
            <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 1000, display: 'flex', gap: 10 }}>
                <Button onClick={scrollToShowDiffButton}>Scroll to the difference button</Button>
                {/* 新增滚动到顶部的按钮 */}
                <Button onClick={scrollToTop}>Back To Top</Button>
            </div>
            <Card>
                <Row gutter={16}>
                    <Col span={12}>
                        <Title level={4}>Input Left JSON</Title>
                        <TextArea
                            rows={10}
                            value={beforeJsonInput}
                            onChange={(e) => handleBeforeJsonChange(e.target.value)}
                        />
                    </Col>
                    <Col span={12}>
                        <Title level={4}>Input Right JSON</Title>
                        <TextArea
                            rows={10}
                            value={afterJsonInput}
                            onChange={(e) => handleAfterJsonChange(e.target.value)}
                        />
                    </Col>
                </Row>
                {/* 修改这里的 Row，设置 gutter 为 20 */}
                <Row gutter={20}>
                    <Col span={12}>
                        <Flex justify="center" align="center" style={{ flexDirection: 'column' }}>
                            <Title level={4}>Before Tree</Title>
                            {/* 修改这里的宽度为 100% */}
                            <div style={{ width: '100%', marginTop: 16, border: '1px solid #d9d9d9', padding: 10 }}>
                                <CustomTree treeData={prefixedBeforeTreeData} onSelect={(path) => setSelectedBeforePath(path.replace('before_', ''))} beforeObj={beforeObj} afterObj={afterObj} />
                            </div>
                        </Flex>
                    </Col>
                    <Col span={12}>
                        <Flex justify="center" align="center" style={{ flexDirection: 'column' }}>
                            <Title level={4}>After Tree</Title>
                            {/* 修改这里的宽度为 100% */}
                            <div style={{ width: '100%', marginTop: 16, border: '1px solid #d9d9d9', padding: 10 }}>
                                <CustomTree treeData={prefixedAfterTreeData} onSelect={(path) => setSelectedAfterPath(path.replace('after_', ''))} beforeObj={beforeObj} afterObj={afterObj} />
                            </div>
                        </Flex>
                    </Col>
                </Row>
                <Flex justify="center" align="center" style={{ marginTop: 16 }}>
                    <Button ref={showDiffButtonRef} onClick={handleShowDiff}>
                        Click to display node differences
                    </Button>
                </Flex>
                <Space>
                    {/* 修改 toClipboard 参数 */}
                    <Copy text="Copy Left" toClipboard={JSON.stringify(currentBeforeValue)} />
                    <Copy text="Copy Right" toClipboard={JSON.stringify(currentAfterValue)} />
                </Space>
                <Row gutter={16}>
                    <Col span={24}>
                        {shouldShowDiff && (
                            <>
                                <Switch
                                    checked={isWordMode}
                                    onChange={handleModeChange}
                                    checkedChildren="Word 模式"
                                    unCheckedChildren="Char 模式"
                                    style={{ marginTop: 16 }}
                                />
                                 <Divider orientation="left">Horizontal</Divider>
                                {/* // 传递最新的 diff 数据
                                // 通过扩展运算符将只读数组转换为可变数组 */}
                                <JsonDiffPage diff={[...diff]} mode={isWordMode} />
                            </>
                        )}
                    </Col>
                </Row>
            </Card>
        </>
    )
}