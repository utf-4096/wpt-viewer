import '#/Style/components/StatusSelector.scss';

import { ToggleButton } from './Ui/ToggleButton.tsx';
import { type Signal, useComputed } from '@preact/signals';
import { PossibleSingleTestStatuses, type ShortStatusType } from '#/Wpt/Status.ts';
import { StatusStyleMap } from '#/StatusStyle.tsx';

export type FilterMap = {
    [k in ShortStatusType]: Signal<boolean>;
};

export function StatusSelector({ filters }: { filters: FilterMap }) {
    const visiblyEnabled = useComputed(() => Object.values(filters).every(s => !s.value));
    const badges = PossibleSingleTestStatuses
        .map(status => {
            const style = StatusStyleMap[status];

            return <li key={status}>
                <ToggleButton
                    color={style.color}
                    signal={filters[status]}
                    visiblyEnabled={visiblyEnabled}
                    icon={style.icon}>
                    {style.label}
                </ToggleButton>
            </li>
        });

    return <ul class='StatusSelector' aria-label='test status filters'>
        {badges}
    </ul>
}
