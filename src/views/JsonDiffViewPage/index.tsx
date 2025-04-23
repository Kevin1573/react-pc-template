import Copy from "@/components/Copy";
import JsonDiffPage from "@/components/JsonDiff";
import { Card, Flex, Row, Col, Divider, Space, Button } from "antd";
import Title from "antd/lib/typography/Title";
import { Differ } from 'json-diff-kit';
import { useState, useMemo } from 'react';
// 导入 JSON 文件
import beforeObj from '../../data/before.json';
import afterObj from '../../data/after.json';

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

const beforeTreeData = generateTreeData(beforeObj);
const afterTreeData = generateTreeData(afterObj);

const prefixedBeforeTreeData = addPrefixToTreeData(beforeTreeData, 'before_');
const prefixedAfterTreeData = addPrefixToTreeData(afterTreeData, 'after_');

// 自定义树组件
const CustomTree = ({ treeData, onSelect }: { treeData: any[], onSelect: (value: string) => void }) => {
    // 新增状态，用于记录当前选中的节点值
    const [selectedValue, setSelectedValue] = useState('');

    const renderNode = (node: any) => {
        const handleClick = () => {
            onSelect(node.value);
            // 点击时更新选中的节点值
            setSelectedValue(node.value);
        };

        // 根据选中状态动态设置样式
        const nodeStyle = {
            cursor: 'pointer',
            paddingLeft: node.level ? node.level * 20 : 0,
            backgroundColor: selectedValue === node.value ? '#e6f7ff' : 'transparent', // 选中时变蓝色
        };

        return (
            <div>
                <div onClick={handleClick} style={nodeStyle}>
                    {node.title}
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

export default function jsonDiffViewPage() {
    const [selectedBeforePath, setSelectedBeforePath] = useState('');
    const [selectedAfterPath, setSelectedAfterPath] = useState('');
    const differ = useMemo(() => {
        return new Differ({
            detectCircular: true,    // 默认 `true`
            maxDepth: Infinity,      // 默认 `Infinity`
            showModifications: true, // 默认 `true`
            arrayDiffMethod: 'normal',  // 默认 `"normal"`, 但 `"lcs"` 可能更有用
        });
    }, []);

    const [diff, setDiff] = useState(() => {
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
        return differ.diff(beforeValue, afterValue);
    });

    const [shouldShowDiff, setShouldShowDiff] = useState(false);
    // 新增状态来保存当前的 beforeValue 和 afterValue
    const [currentBeforeValue, setCurrentBeforeValue] = useState(beforeObj);
    const [currentAfterValue, setCurrentAfterValue] = useState(afterObj);

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

    return (
        <>
            <Card>
                <Row gutter={16}>
                    <Col span={12}>
                        <Flex justify="center" align="center" style={{ flexDirection: 'column' }}>
                            <Title level={4}>Before Tree</Title>
                            <div style={{ width: 400, marginTop: 16, border: '1px solid #d9d9d9', padding: 10 }}>
                                <CustomTree treeData={prefixedBeforeTreeData} onSelect={(path) => setSelectedBeforePath(path.replace('before_', ''))} />
                            </div>
                        </Flex>
                    </Col>
                    <Col span={12}>
                        <Flex justify="center" align="center" style={{ flexDirection: 'column' }}>
                            <Title level={4}>After Tree</Title>
                            <div style={{ width: 400, marginTop: 16, border: '1px solid #d9d9d9', padding: 10 }}>
                                <CustomTree treeData={prefixedAfterTreeData} onSelect={(path) => setSelectedAfterPath(path.replace('after_', ''))} />
                            </div>
                        </Flex>
                    </Col>
                </Row>
                <Flex justify="center" align="center" style={{ marginTop: 16 }}>
                    <Button onClick={handleShowDiff}>
                        点击展示节点差异
                    </Button>
                </Flex>
                <Space>
                    {/* 修改 toClipboard 参数 */}
                    <Copy text="复制left" toClipboard={JSON.stringify(currentBeforeValue)} />
                    <Copy text="复制right" toClipboard={JSON.stringify(currentAfterValue)} />
                </Space>
                <Divider orientation="left">Horizontal</Divider>
                <Row gutter={16}>
                    <Col span={24}>
                        {shouldShowDiff && (
                            // 传递最新的 diff 数据
                            // 通过扩展运算符将只读数组转换为可变数组
                            <JsonDiffPage diff={[...diff]} />
                        )}
                    </Col>
                </Row>
            </Card>
        </>
    );
}