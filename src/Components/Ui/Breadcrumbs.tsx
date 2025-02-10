import '#/Style/ui/Breadcrumbs.scss';

import { type Signal, useComputed } from '@preact/signals';
import { Bird, ChevronRight } from 'lucide-preact';
import { Fragment } from 'preact/jsx-runtime';

function Crumb({ path }: { path: string[] }) {
    return <a class='crumb' href={`#/v/${path.join('/')}`}>
        {path.at(-1)}
    </a>
}

export function Breadcrumbs({ signal }: { signal: Signal<string[]> }) {
    const crumbs = useComputed(() =>
        signal.value.map((_, index) => {
            const path = signal.value.slice(0, index + 1);

            return <Fragment key={path.join('/')}>
                {index !== 0 && <ChevronRight size={16} />}
                <Crumb path={path} />
            </Fragment>
        })
    );

    const rightChevron = useComputed(() =>
        signal.value.length !== 0 &&
        <ChevronRight size={16} />
    );

    return <div class='Breadcrumbs'>
        <a class='crumb home-crumb' href='#/'>
            <Bird size={24} />
        </a>

        {rightChevron}
        {crumbs}
    </div>
}
