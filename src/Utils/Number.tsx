const formatter = new Intl.NumberFormat();
export function formatNumber(number: number): string {
    return formatter.format(number);
}

export function formatSeconds(seconds: number) {
    if (seconds < 1.0) {
        return `${Math.floor(seconds * 1000)}ms`;
    }

    return `${seconds.toFixed(2)}s`;
}
