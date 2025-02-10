import '#/Style/components/TestView/MetadataBlock.scss';

import { AppWindow, Calendar, type LucideIcon, Monitor, Tag, TestTube2, Timer } from 'lucide-preact';
import type { DetailsBlockAttributes } from './Component';
import { formatSeconds } from '#/Utils/Number';
import RelativeTime from '@yaireo/relative-time';
import type { ComponentChildren } from 'preact';

interface StatAttributes {
    title: string;
    icon: LucideIcon;
    children: ComponentChildren;
}

function Stat({ title, icon: Icon, children }: StatAttributes) {
    return <div class='stat with-tooltip' data-title={title}>
        <Icon size={16} />
        <span>{children}</span>
    </div>
}

const formatter = new RelativeTime();
export function MetadataBlock({ details }: DetailsBlockAttributes) {
    const runDate = formatter.from(new Date(details.value.run.time_start));

    return <div class='Block'>
        <header>
            Run metadata
        </header>

        <section class='MetadataBlock'>
            <div class='column'>
                <Stat icon={Timer} title='Run time'>
                    {formatSeconds(details.value.duration / 1000)}
                </Stat>

                <Stat icon={Calendar} title='Run date'>
                    {runDate}
                </Stat>

                <Stat icon={Monitor} title='OS'>
                    {details.value.run.os_name} {details.value.run.os_version}
                </Stat>
            </div>

            <div class='column'>
                <Stat icon={AppWindow} title='Browser'>
                    {details.value.run.browser_name}
                </Stat>

                <Stat icon={Tag} title='Browser version'>
                    {details.value.run.browser_version}
                </Stat>

                <Stat icon={TestTube2} title='Subsuite'>
                    {details.value.subsuite || 'no subsuite'}
                </Stat>
            </div>
        </section>
    </div>
}
