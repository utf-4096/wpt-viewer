import '#/Style/ui/Code.scss';

import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import type { Signalish } from './types';
import { unwrap } from '#/SignalUtils';

export type Language =
    | 'python'
    | 'javascript'
    | null

interface CodeAttributes {
    code: Signalish<string>;
    language: Signalish<Language>;
}

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('python', python);

export function Code({ code, language }: CodeAttributes) {
    if (!unwrap(language)) {
        return <code class='Code'>{code}</code>
    }

    const html = {
        __html: hljs.highlight(
            unwrap(code),
            { language: unwrap(language)! },
        ).value,
    };

    return <code class='Code' dangerouslySetInnerHTML={html} />
}
