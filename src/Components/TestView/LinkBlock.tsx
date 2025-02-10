import '#/Style/components/TestView/LinkBlock.scss';

import { BookMarked, BookOpen, Play } from 'lucide-preact';
import type { TestBlockAttributes } from './Component';
import { useComputed } from '@preact/signals';

export function LinkBlock({ test }: TestBlockAttributes) {
    const liveUrl = useComputed(
        () => `https://wpt.live/${test.value.path}`
    );

    const githubUrl = useComputed(
        () => `https://github.com/web-platform-tests/wpt/blob/master/${test.value.path}`
    );

    const mdnUrl = useComputed(() => {
        const path = test.value.path;
        return `https://developer.mozilla.org/search?q=${encodeURIComponent(path)}&sort=relevance`;
    });

    return <div class='Block'>
        <header>
            Resources
        </header>

        <section class='LinkBlock'>
            <div class='link'>
                <Play size={16} />
                <a href={liveUrl} title={test.value.path} target='_blank' rel="noreferrer">
                    Run on wpt.live
                </a>
            </div>

            <div class='link'>
                <BookMarked size={16} />
                <a href={githubUrl} target='_blank' rel="noreferrer">
                    View source on GitHub
                </a>
            </div>

            <div class='link'>
                <BookOpen size={16} />
                <a href={mdnUrl} target='_blank' rel="noreferrer">
                    Search on MDN
                </a>
            </div>
        </section>
    </div>
}
