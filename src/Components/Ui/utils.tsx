import { Signal, useComputed } from '@preact/signals';

class ClassBuilder {
    #conditions: any[] = [];

    constructor(base?: string) {
        if (base) {
            this.with(base.trim());
        }
    }

    if(condition: any, value: string|(() => string)) {
        this.#conditions.push([condition, value]);

        return this;
    }

    with(value: string|null|undefined|(() => string)) {
        this.#conditions.push([value, value]);

        return this;
    }

    #calculate() {
        const class_ = [];

        for (let [condition, value] of this.#conditions) {
            if (condition instanceof Signal) {
                condition = condition.value;
            }

            if (condition) {
                if (typeof value === 'function') {
                    class_.push(value());
                } else {
                    class_.push(value);
                }
            }
        }

        return class_.join(' ');
    }

    toString() {
        return this.#calculate();
    }

    computed() {
        return useComputed(() => this.#calculate());
    }

    valueOf() {
        return this.toString();
    }

    [Symbol.toPrimitive]() {
        return this.toString();
    }
}

export function buildClass(base?: string) {
    return new ClassBuilder(base);
}

export function px<T>(value: number|T): string|T {
    if (typeof value === 'number') {
        return `${value}px`;
    }

    return value;
}

export function ratioToColorClass(ratio: number): string {
    if (ratio === 1) {
        return 'success bold';
    }

    if (ratio > .75) {
        return 'success';
    }

    if (ratio > .50) {
        return 'warning';
    }

    if (ratio !== 0) {
        return 'danger';
    }

    return 'danger bold';
}
