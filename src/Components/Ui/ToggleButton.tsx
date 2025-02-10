import '#/Style/ui/Button.scss';
import { type Signal, useComputed } from '@preact/signals';
import { Button, type ButtonAttributes } from './Button.tsx';
import type { Signalish } from './types.tsx';
import { unwrap } from '#/SignalUtils.tsx';

interface ToggleButtonAttributes extends Omit<ButtonAttributes, 'onClick'> {
    signal: Signal<boolean>;
    visiblyEnabled: Signalish<boolean>;
}

export function ToggleButton({ signal, visiblyEnabled, ...attributes }: ToggleButtonAttributes) {
    function onClick() {
        signal.value = !signal.value;
    }

    const visiblyDisabled = useComputed(() => !unwrap(visiblyEnabled) && !signal.value);

    return <Button
        onClick={onClick}
        visiblyDisabled={visiblyDisabled}
        {...attributes}
    />
}
