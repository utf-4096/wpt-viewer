import { Signal } from '@preact/signals';

export type MaybeSignal<T> = T | Signal<T>;

export function unwrap<T>(value: MaybeSignal<T>) {
    if (value instanceof Signal) {
        return value.value;
    }

    return value;
}
