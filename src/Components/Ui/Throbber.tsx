import '#/Style/ui/Throbber.scss';

import { Signal } from '@preact/signals';
import type { ComponentChildren } from 'preact';

interface SuspenseAttributes {
    until: any;
    children?: ComponentChildren;
}

export function Suspense({ until, children }: SuspenseAttributes) {
    if (until instanceof Signal) {
        until = until.value;
    }

    if (!until) {
        return <Throbber />
    }

    return children;
}

export function Throbber() {
    return <div class='Throbber' aria-hidden>
        <div class='dot'/>
        <div class='dot'/>
        <div class='dot'/>
    </div>
}
