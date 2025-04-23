import { Viewer } from 'json-diff-kit';
import type { DiffResult, ViewerProps } from 'json-diff-kit';
import React from 'react';

import 'json-diff-kit/dist/viewer.css';
import 'json-diff-kit/dist/viewer-monokai.css';

interface PageProps {
    mode: boolean;
    diff: [DiffResult[], DiffResult[]];
}

const JsonDiffPage: React.FC<PageProps> = props => {

    const viewerProps = {
        diff: props.diff,          // required
        indent: 4,
        lineNumbers: true,
        highlightInlineDiff: true,
        inlineDiffOptions: {
            mode: props.mode ? 'word' : 'char',
            wordSeparator: ' '
        },
        hideUnchangedLines: true,
        syntaxHighlight: false,
        virtual: false
    } as ViewerProps;
    return (
        <>

            <Viewer
                {...viewerProps}
            />
        </>
    );
};

export default JsonDiffPage;