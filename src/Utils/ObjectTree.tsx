export function followDeep(obj: object, path: string[]) {
    let head = obj;

    for (let i = 0, len = path.length; i < len; i++) {
        const level = path[i];
        if (!(level in head)) {
            return;
        }

        // @ts-ignore
        head = head[level];
    }

    return head;
};

export function setDeep(obj: object, path: string[], value: any) {
    let head = obj;
    const ref = path.slice(0, -1);
    for (let i = 0, len = ref.length; i < len; i++) {
        const level = ref[i];
        if (level in head) {
            // @ts-ignore
            head = head[level];
            continue;
        }

        // @ts-ignore
        head = head[level] = Object.create(null);
    }

    // @ts-ignore
    head[path.at(-1)] = value;

    return value;
};
