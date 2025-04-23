import { Viewer } from 'json-diff-kit';
import type { DiffResult } from 'json-diff-kit';
import React from 'react';

import 'json-diff-kit/dist/viewer.css';
import 'json-diff-kit/dist/viewer-monokai.css';

interface PageProps {
    mode: boolean;
    diff: [DiffResult[], DiffResult[]];
}

const JsonDiffPage: React.FC<PageProps> = props => {
   

    return (
        <>
            
            <Viewer
                diff={props.diff}          // required
                indent={4}                 // default `2`
                lineNumbers={true}         // default `false`
                highlightInlineDiff={false} // default `false`
                inlineDiffOptions={{
                    mode: props.mode ? 'word' : 'char', // 根据开关状态设置 mode
                    wordSeparator: ' ',      // default `""`, but `" "` is more useful for sentences
                }}
                // syntaxHighlight={{theme: 'monokai'}}    // default `false`
                virtual={false}
            />
        </>
    );
};

export default JsonDiffPage;