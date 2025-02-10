import '#/Style/components/TestList/DirectoryRow.scss';

import { type EntryTree, TreeMetaSubtest } from '#/Wpt/Tree';
import { Folder } from 'lucide-preact';
import type { RowAttributes } from './Component';
import { TestCompletion } from './TestCompletion';
import { useComputed } from '@preact/signals';

export function DirectoryRow({ name, object, path }: RowAttributes) {
    const subtree = object as EntryTree;
    const href = useComputed(() => `#/v/${path.value.join('/')}/${name}`);

    function onClick() {
        window.scrollTo(0, 0);
    }

    const [passed, total] = subtree[TreeMetaSubtest];

    return <tr class='row DirectoryRow' onClick={onClick}>
        <td>
            <a class='test-name unstyled' href={href}>
                <div class='icon' aria-hidden>
                    <Folder size={16} />
                </div>

                {name}
            </a>
        </td>

        <td>
            <TestCompletion passed={passed} total={total} />
        </td>
    </tr>
}
