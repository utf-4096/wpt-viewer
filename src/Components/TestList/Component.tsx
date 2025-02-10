import '#/Style/components/TestList/Component.scss';
import '#/Style/components/TestList/Row.scss';

import { PartialEntry, type EntryTree, TreeMetaSubtest, TreeMeta } from '#/Wpt/Tree.ts'
import { signal, type Signal, useComputed } from '@preact/signals';
import { TestRow } from './TestRow';
import { DirectoryRow } from './DirectoryRow';
import { ParentDirectoryRow } from './ParentDirectoryRow';
import { InlineStatusCounter } from '../InlineStatusCounter';
import { PossibleSingleTestStatuses } from '#/Wpt/Status';
import { ChevronDown, ChevronUp, TestTube2 } from 'lucide-preact';
import { formatNumber } from '#/Utils/Number';
import { ratioToColorClass } from '../Ui/utils';
import type { JSX } from 'preact/jsx-runtime';
import { StatusStyleMap } from '#/StatusStyle';
import { capitalize } from '#/Utils/Text';

type SortColumn =
    | 'name'
    | 'ratio';

interface SortParams {
    column: Signal<SortColumn>;
    direction: Signal<1|-1>;
}

interface TestListAttributes {
    tree: Signal<EntryTree>;
    path: Signal<string[]>;
}

interface EntryContext extends SortParams {
    //
}

type TreeObjEntry = [string, PartialEntry | EntryTree];

export interface RowAttributes {
    name: string;
    path: Signal<string[]>;
    object: PartialEntry|EntryTree;
}

function FooterStats({ tree }: { tree: Signal<EntryTree> }) {
    const counters = PossibleSingleTestStatuses
        .map((key) => {
            const count = tree.value[TreeMeta][key];
            const style = StatusStyleMap[key];
            const title = capitalize(style.plural);

            return <div class='with-tooltip' data-title={title} key={key}>
                <InlineStatusCounter
                    status={key}
                    count={count}
                />
            </div>
        });

    const [passed, total] = tree.value[TreeMetaSubtest];
    const ratioColor = ratioToColorClass(passed/total);

    return <div class='footer-stats'>
        <span>Folder total:</span>
        <div class='counters'>
            {counters}
        </div>

        <div class='subtests with-tooltip' data-title='Subtests passed / total subtests'>
            <TestTube2 size={16} />
            <span class={`subtests-passed subtests-passed-${ratioColor}`}>
                {formatNumber(passed)}
            </span>
            &nbsp;/&nbsp;
            {formatNumber(total)}
        </div>
    </div>
}

interface SortableColumnAttributes extends JSX.HTMLAttributes<HTMLTableCellElement> {
    sort: SortParams;
    column: string;
}

function SortableColumn({ sort, column, children, class: class_, ...rest }: SortableColumnAttributes) {
    const chevron = useComputed(() => {
        if (sort.column.value !== column) {
            return;
        }

        if (sort.direction.value === 1) {
            return <ChevronDown size={16} />
        }

        return <ChevronUp size={16} />
    });

    function toggleSort() {
        if (sort.column.value !== column) {
            sort.column.value = column as SortColumn;
            sort.direction.value = 1;
        } else {
            sort.direction.value *= -1;
        }
    }

    return <th
        onClick={toggleSort}
        class={`${class_} with-tooltip`}
        data-title={`Sort by ${column}`}
        {...rest}>
        {children}
        {chevron}
    </th>
}

function entryOrTreeRatio(value: PartialEntry | EntryTree) {
    if (value instanceof PartialEntry) {
        return value.passedTests / value.totalTests;
    }

    return value[TreeMetaSubtest][0] / value[TreeMetaSubtest][1];
}

function sortCallback(sort: EntryContext, [ka, va]: TreeObjEntry, [kb, vb]: TreeObjEntry) {
    let order = (Number(va instanceof PartialEntry) - Number(vb instanceof PartialEntry));

    if (sort.column.value === 'name') {
        order ||= ka.localeCompare(kb) * sort.direction.value;
    } else if (sort.column.value === 'ratio') {
        const ratioA = entryOrTreeRatio(va);
        const ratioB = entryOrTreeRatio(vb);

        order ||= (ratioA - ratioB) * sort.direction.value;
    }

    return order;
}

const sort: SortParams = {
    column: signal('name'),
    direction: signal(1),
};

export function TestList({ path, tree }: TestListAttributes) {
    const elements = useComputed(() =>
        tree.value &&
        !(tree.value instanceof PartialEntry) &&
        Object.entries(tree.value)
            .sort((a, b) => sortCallback(sort, a, b))
            .map(([key, value]) => {
                const Component = (value instanceof PartialEntry) ? TestRow: DirectoryRow;

                return <Component
                    key={key}
                    name={key}
                    path={path}
                    object={value}
                />
            })
    );

    const openParentDirectory = useComputed(() =>
        path.value.length !== 0 && <ParentDirectoryRow key='_up' path={path} />
    );

    return <table class='TestList'>
        <thead>
            <tr>
                <SortableColumn sort={sort} column='name'>
                    Name
                </SortableColumn>

                <SortableColumn class='ratio' sort={sort} column='ratio'>
                    %
                </SortableColumn>
            </tr>
        </thead>

        <tbody>
            {openParentDirectory}
            {elements}
        </tbody>

        <tfoot>
            <tr>
                <th colSpan={2}>
                    <FooterStats tree={tree} />
                </th>
            </tr>
        </tfoot>
    </table>
}
