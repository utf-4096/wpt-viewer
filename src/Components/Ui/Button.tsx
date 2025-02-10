import '#/Style/ui/Button.scss';

import type { ComponentChildren } from 'preact';
import type { Color, Signalish } from './types.tsx';
import { buildClass } from './utils.tsx';
import type { LucideIcon } from 'lucide-preact';
import { useComputed } from '@preact/signals';

export interface ButtonAttributes {
    inverted?: Signalish<boolean>;
    size?: Signalish<'mini'>;
    color?: Signalish<Color>;
    disabled?: Signalish<boolean>;
    visiblyDisabled?: Signalish<boolean>;
    icon?: LucideIcon;
    onClick?: () => void;
    children?: ComponentChildren;
}

export function Button(
    {
        inverted,
        size,
        color = 'secondary',
        disabled,
        visiblyDisabled,
        onClick,
        icon: Icon,
        children,
    }: ButtonAttributes
) {
    const class_ = buildClass('Button')
        .with(() => `Button-${color.valueOf()}`)
        .if(visiblyDisabled, 'Button-visibly-disabled')
        .if(size, () => `Button-${size!.valueOf()}`)
        .if(inverted, 'Button-inverted')
        .computed();

    const iconSize = useComputed(() => size === 'mini' ? 14: 16);
    const icon = useComputed(() => Icon && <Icon size={iconSize.value} />);

    return <button type='submit' class={class_} disabled={disabled} onClick={onClick}>
        {Icon && <div class='icon' aria-hidden>{icon}</div>}

        <div class='content'>
            {children}
        </div>
    </button>
}
