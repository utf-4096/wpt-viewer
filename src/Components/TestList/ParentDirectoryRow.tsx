import { type Signal, useComputed } from '@preact/signals';
import { ArrowUp } from 'lucide-preact';

export function ParentDirectoryRow({ path }: { path: Signal<string[]> }) {
    const href = useComputed(() => `#/v/${path.value.slice(0, -1).join('/')}`);

    function onClick() {
        window.scrollTo(0, 0);
    }

    return <tr class='row' onClick={onClick}>
        <td colSpan={2}>
            <a class='test-name unstyled' href={href}>
                <div class='icon' aria-hidden>
                    <ArrowUp size={16} />
                </div>

                ..
            </a>
        </td>
    </tr>
}
