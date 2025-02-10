import type { Signal } from '@preact/signals';

export type Color =
     | 'primary'
     | 'secondary'
     | 'success'
     | 'danger'
     | 'warning';

export type Signalish<T> = T | Signal<T>;
