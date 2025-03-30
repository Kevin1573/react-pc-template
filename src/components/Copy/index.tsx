import React from 'react';
import { Tooltip, message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';

interface CopyProps {
  toClipboard: any;
  text: string;
}

const Copy: React.FC<CopyProps> = (props) => {
  const { toClipboard, text } = props;

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(toClipboard);
      // 移除国际化，直接显示中文消息
      message.success('Text copied to clipboard');
    } catch (err) {
      // 移除国际化，直接显示中文消息
      message.error('Copy failed');
    }
  };

  return (
    <Tooltip
      // 移除国际化，直接显示中文提示
      title="Copy data to clipboard"
    >
      <span onClick={copyText} style={{ color: '#1890ff', cursor: 'pointer' }}>
        <CopyOutlined /> {text}
      </span>
    </Tooltip>
  );
};

export default Copy;