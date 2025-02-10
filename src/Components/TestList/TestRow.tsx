import '#/Style/components/TestList/TestRow.scss';

import type { PartialEntry } from '#/Wpt/Tree';
import type { RowAttributes } from './Component';
import { getTestStyle } from '#/StatusStyle';
import { TestCompletion } from './TestCompletion';
import { useComputed } from '@preact/signals';

export function TestRow({ name, object, path }: RowAttributes) {
    const test = object as PartialEntry;
    const style = getTestStyle(test);
    const Icon = style.icon;
    const href = useComputed(() => `#/v/${path.value.join('/')}/${name}`);

    return <tr class={`row TestRow TestRow-${style.color}`}>
        <td colSpan={1}>
            <a class='test-name unstyled' href={href}>
                <div class='icon' aria-hidden>
                    <Icon size={16} />
                </div>

                {name}
            </a>
        </td>

        <td>
            <TestCompletion
                passed={test.passedTests}
                total={test.totalTests}
            />
        </td>
    </tr>
}

