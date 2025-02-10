import '#/Style/components/TestView/StatusBlock.scss';

import { getTestStyle } from '#/StatusStyle';
import { buildClass } from '../Ui/utils';
import type { TestBlockAttributes } from './Component';

export function StatusBlock({ test }: TestBlockAttributes) {
    const style = getTestStyle(test.value);
    const labelIsLong = style.label.length > 10;
    const class_ = buildClass(`StatusBlock StatusBlock-${style.color} text-${style.textColor}`)
        .if(labelIsLong, 'StatusBlock-small')
        .toString();

    return <div class='Block'>
        <header>
            Status
        </header>

        <section class={class_}>
            <style.icon size={labelIsLong ? 26: 32} />
            {style.label.toUpperCase()}
        </section>
    </div>
}
