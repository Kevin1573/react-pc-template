import { Viewer } from 'json-diff-kit';
import type { DiffResult } from 'json-diff-kit';

import 'json-diff-kit/dist/viewer.css';
import 'json-diff-kit/dist/viewer-monokai.css';

interface PageProps {
    diff: [DiffResult[], DiffResult[]];
}

const JsonDiffPage: React.FC<PageProps> = props => {
    return (
        <Viewer
            diff={props.diff}          // required
            indent={4}                 // default `2`
            lineNumbers={true}         // default `false`
            highlightInlineDiff={true} // default `false`
            inlineDiffOptions={{
                mode: 'char',            // default `"char"`, but `"word"` may be more useful
                wordSeparator: ' ',      // default `""`, but `" "` is more useful for sentences
            }}
            syntaxHighlight={{theme: 'monokai'}}    // default `false`
            virtual={false}
            />
    );
};

export default JsonDiffPage;