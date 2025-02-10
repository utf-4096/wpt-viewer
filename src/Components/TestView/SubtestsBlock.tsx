import '#/Style/components/TestView/SubtestsBlock.scss';

import { StatusStyleMap } from '#/StatusStyle';
import type { Subtest } from '#/Wpt/Fyi';
import { longToShort, type ShortStatusType } from '#/Wpt/Status';
import { Tree } from '#/Wpt/Tree';
import { InlineStatusCounter } from '../InlineStatusCounter';
import type { DetailsBlockAttributes } from './Component';
import { type Signal, useComputed, useSignal } from '@preact/signals';
import { Code } from '../Ui/Code';
import { buildClass } from '../Ui/utils';

interface SubtestStatusFilterAttributes {
    status: ShortStatusType;
    count: number;
    signal: Signal<ShortStatusType|null>;
}

function SubtestRow({ subtest }: { subtest: Subtest }) {
    const style = StatusStyleMap[longToShort(subtest.status)];
    const expanded = useSignal(false);
    const class_ = buildClass(`subtest subtest-${style.color}`)
        .if(expanded, 'subtest-expanded')
        .computed();

    function expand() {
        expanded.value = !expanded.value;
    }

    const main = <div class={class_} onClick={expand}>
        <div class='icon'>
            <style.icon size={20} />
        </div>

        {subtest.name}
    </div>

    if (!expanded.value) {
        return main;
    }

    return <>
        {main}
        <span class='subtest-description'>
            {subtest.message ?
                <Code language={null} code={subtest.message} />:
                <i>No message</i>}
        </span>
    </>
}

function SubtestStatusFilter({ status, count, signal }: SubtestStatusFilterAttributes) {
    const isActive = useComputed(() => signal.value === status);
    const style = StatusStyleMap[status];

    function onClick() {
        if (isActive.value) {
            signal.value = null;
            return;
        }

        signal.value = status as ShortStatusType;;
    }

    return <div class='with-tooltip' data-title={`Only show ${style.plural}`}>
        <InlineStatusCounter
            key={status}
            status={status as ShortStatusType}
            count={count}
            inverted={isActive}
            onClick={onClick}
        />
    </div>
}

export function SubtestsBlock({ details }: DetailsBlockAttributes) {
    const subtests = details.value.subtests;
    const statusFilter = useSignal<ShortStatusType|null>(null);
    const statusStats = Tree.emptyStatusMap();

    for (const subtest of subtests) {
        statusStats[longToShort(subtest.status)] ??= 0;
        statusStats[longToShort(subtest.status)]++;
    }

    const counters = Object.entries(statusStats)
        .filter(([_, value]) => value !== 0)
        .map(([key, value]) =>
            <SubtestStatusFilter
                key={key}
                status={key as ShortStatusType}
                count={value}
                signal={statusFilter}
            />
        );

    const subtestElements = subtests
        .filter(subtest =>
            ! statusFilter.value ||
            longToShort(subtest.status) === statusFilter.value
        )
        .map(subtest =>
            <SubtestRow
                key={subtest.name}
                subtest={subtest}
            />
        );

    return <div class='Block SubtestsBlock-wrapper'>
        <header>
            Subtests

            <div class='status-stats'>
                {counters}
            </div>
        </header>

        <section class='SubtestsBlock'>
            {subtestElements}
        </section>
    </div>
}
