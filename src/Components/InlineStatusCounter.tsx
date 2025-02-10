import '#/Style/components/InlineStatusCounter.scss';

import { StatusStyleMap } from '#/StatusStyle';
import type { ShortStatusType } from '#/Wpt/Status';
import { formatNumber } from '#/Utils/Number';
import { buildClass } from './Ui/utils';
import type { Signalish } from './Ui/types';

interface Attributes {
    status: ShortStatusType;
    count: number;
    onClick?: () => void;
    inverted?: Signalish<boolean>;
}

export function InlineStatusCounter({ status, count, onClick, inverted = false }: Attributes) {
    const style = StatusStyleMap[status];
    const class_ = buildClass(`InlineStatusCounter InlineStatusCounter-${style.color}`)
        .if(inverted, 'InlineStatusCounter-inverted')
        .if(onClick, 'InlineStatusCounter-clickable')
        .computed();

    return <div class={class_} onClick={onClick}>
        <style.icon size={16} />
        {formatNumber(count)}
    </div>
}
