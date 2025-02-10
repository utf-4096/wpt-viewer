export const ShortStatus = [
    'F',
    'C',
    'E',
    'T',
    'O',
    'P',
    'S',
    'N',
    'PF',
] as const;
export type ShortStatusType = typeof ShortStatus[number];

export const LongStatus = [
    'OK', 'PASS', 'FAIL',
    'SKIP', 'ERROR', 'NOTRUN',
    'CRASH', 'TIMEOUT', 'PRECONDITION_FAILED',
] as const;
export type LongStatusType = typeof LongStatus[number];

export const PossibleSingleTestStatuses: ShortStatusType[] = [
    'F',
    'C',
    'E',
    'T',
    'O',
    'P',
    'S',
    'PF',
] as const;

export function longToShort(long: LongStatusType): ShortStatusType {
    return {
        'FAIL': 'F',
        'CRASH': 'C',
        'ERROR': 'E',
        'TIMEOUT': 'T',
        'OK': 'O',
        'PASS': 'P',
        'SKIP': 'S',
        'NOTRUN': 'N',
        'PRECONDITION_FAILED': 'PF',
    }[long] as ShortStatusType;
}
