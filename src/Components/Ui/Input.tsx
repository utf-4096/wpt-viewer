import '#/Style/ui/Input.scss';

import type { Signal } from '@preact/signals';
import type { LucideIcon } from 'lucide-preact';

export interface InputAttributes {
    icon?: LucideIcon;
    placeholder?: string;
    signal: Signal<string>;
}

export function Input({ icon: Icon, placeholder, signal }: InputAttributes) {
    function onInput({ target }: InputEvent) {
        signal.value = (target as HTMLInputElement).value;
    }

    return <label class='Input'>
        {Icon && <div class='icon' aria-hidden><Icon size={20} /></div>}
        <input
            type='text'
            placeholder={placeholder}
            onInput={onInput}
            value={signal}
        />
    </label>
}
