import Copy from "@/components/Copy";
import JsonDiffPage from "@/components/JsonDiff";
import { Card, Flex, Row, Col, Divider, Space } from "antd";
import Title from "antd/lib/typography/Title";
import { Differ } from 'json-diff-kit';


export default function jsonDiffViewPage() {
    const before = {
        a: 1,
        b: 2,
        d: [1, 5, 4],
        e: ['1', 2, { f: 3, g: null, h: [5], i: [] }, 9],
        m: [],
        q: 'JSON diff can\'t be possible',
        r: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        s: 1024,
    };
    const after = {
        b: 2,
        c: 3,
        d: [1, 3, 4, 6],
        e: ['1', 2, 3, { f: 4, g: false, i: [7, 8] }, 10],
        j: { k: 11, l: 12 },
        m: [
            { n: 1, o: 2 },
            { p: 3 },
        ],
        q: 'JSON diff is possible!',
        r: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed quasi architecto beatae incididunt ut labore et dolore magna aliqua.',
        s: '1024',
    };
    // all configs are optional
    const differ = new Differ({
        detectCircular: true,    // default `true`
        maxDepth: Infinity,      // default `Infinity`
        showModifications: true, // default `true`
        arrayDiffMethod: 'normal',  // default `"normal"`, but `"lcs"` may be more useful
    });
    const diff = differ.diff(before, after);
    return (
        <>
            <Card>
                <Row gutter={16}>
                    <Col span={24}>
                        <Flex justify="center">
                            <Title level={4}>Json Diff View Page</Title>
                        </Flex>
                    </Col>
                </Row>
                <Space>
                    <Copy text="复制left" toClipboard={`${JSON.stringify(before)}`} />
                    <Copy text="复制right" toClipboard={`${JSON.stringify(after)}`} />
                </Space>
                <Divider orientation="left">Horizontal</Divider>
                <Row gutter={16}>
                    <Col span={24}>
                        <JsonDiffPage diff={[...diff]} />
                    </Col>
                </Row>
            </Card>
        </>
    );
}