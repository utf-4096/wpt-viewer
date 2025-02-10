import {
    Check,
    CircleAlert,
    CircleOff,
    CopyCheck,
    CopyMinus,
    CopyX,
    Flame,
    Hourglass,
    type LucideIcon,
    SkipForward,
    TriangleAlert,
    X,
} from 'lucide-preact';
import type { ShortStatusType } from './Wpt/Status';
import type { Color } from './Components/Ui/types';
import type { PartialEntry } from './Wpt/Tree';

interface Style {
    color: Color;
    textColor: 'white' | 'inverted';
    label: string;
    plural: string;
    icon: LucideIcon;
}

export const StatusStyleMap: {[k in ShortStatusType]: Style}  = {
    'F': { label: 'fail', plural: 'failures', textColor: 'white', color: 'danger', icon: X },
    'C': { label: 'crash', plural: 'crashes', textColor: 'white', color: 'danger', icon: Flame },
    'E': { label: 'error', plural: 'errors', textColor: 'white', color: 'danger', icon: CircleAlert },
    'T': { label: 'timeout', plural: 'timeouts', textColor: 'white', color: 'warning', icon: Hourglass },
    'O': { label: 'ok', plural: 'partial passes', textColor: 'inverted', color: 'warning', icon: CopyMinus },
    'P': { label: 'pass', plural: 'passes', textColor: 'inverted', color: 'success', icon: Check },
    'S': { label: 'skipped', plural: 'skips', textColor: 'white', color: 'secondary', icon: SkipForward },
    'N': { label: 'not run', plural: 'not run', textColor: 'white', color: 'secondary', icon: CircleOff },
    'PF': { label: 'precondition failed', plural: 'failed preconditions', textColor: 'white', color: 'secondary', icon: TriangleAlert },
};

export const MultistageTestStatusIconMap: {[k: string]: LucideIcon|undefined} = {
    'F': CopyX,
    'O': CopyMinus,
    'P': CopyCheck,
};

export function getTestStyle(test: PartialEntry): Style {
    const style = StatusStyleMap[test.status];
    if (!style) {
        throw new Error(`No style for status [${test.status}]`);
    }

    if (test.hasSubtests && test.status in MultistageTestStatusIconMap) {
        return {
            ...style,
            icon: MultistageTestStatusIconMap[test.status]!,
        };
    }

    return style;
}
