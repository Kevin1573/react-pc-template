import { Input } from 'antd';
import { FC, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

const SqlCodeHighlight: FC = () => {
  const [sqlCode, setSqlCode] = useState('');

  const handlePaste = (e: any) => {
    e.preventDefault();
    const clipboardData = (e.clipboardData /*|| window.clipboardData */) as { getData: (s: string) => string };
    const pastedText = clipboardData.getData('text/plain');
    setSqlCode(pastedText);
  };

  return (
    <div>
      <Input.TextArea
        onPaste={handlePaste}
        placeholder='在此处粘贴SQL代码'
        onChange={(e) => setSqlCode(e.target.value)}
        rows={5} />

      {sqlCode && (
        <SyntaxHighlighter language="sql" style={dark}>
          {sqlCode}
        </SyntaxHighlighter>
      )}
    </div>
  );
};

export default SqlCodeHighlight;
