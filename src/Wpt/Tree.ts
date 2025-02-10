import { formatSeconds } from '#/Utils/Number.tsx';
import { setDeep, followDeep } from '#/Utils/ObjectTree.tsx';
import type { Fyi } from './Fyi.ts';
import { ShortStatus, type ShortStatusType } from './Status.ts';

export const TreeMeta = Symbol('TreeMeta');
export const TreeMetaSubtest = Symbol('TreeMetaSubtest');

interface CompactEntry {
    s: ShortStatusType;
    c: [number, number];
}

type ITreeMeta = {
    [key in ShortStatusType]: number;
}

export interface EntryTree {
    [key: string]: PartialEntry|EntryTree;

    [TreeMeta]: ITreeMeta;
    [TreeMetaSubtest]: [number, number];
}

interface FlatCompactEntryTree {
    [key: string]: CompactEntry;
}

interface NavigateParams {
    search?: string;
    statuses?: ShortStatusType[];
}

type TreeStatusMap = {
    [key in ShortStatusType]: number;
};

interface IPartialEntry {
    status: ShortStatusType;
    passedTests: number;
    totalTests: number;
}

export class PartialEntry {
    status: ShortStatusType;
    hasSubtests: boolean;
    passedTests: number;
    totalTests: number;
    path: string;

    #fyi: Fyi;

    constructor(fyi: Fyi, path: string, {status, passedTests, totalTests}: IPartialEntry) {
        this.status = status;
        this.hasSubtests = (totalTests !== 0);
        this.passedTests = (totalTests === 0 && status === 'P') ? 1: passedTests;
        this.totalTests = totalTests || 1;
        this.#fyi = fyi;
        this.path = path;
    }

    async getDetails() {
        return await this.#fyi.getTestDetails(this.path);
    }
}

export class Tree {
    static emptyStatusMap() {
        return Object.fromEntries(ShortStatus.map(k => [k, 0])) as TreeStatusMap;
    }

    static recomputeTestEntry(entry: CompactEntry): CompactEntry {
        let status = entry.s;
        const [passedTests, totalTests] = entry.c;

        if (status === 'O') {
            // PASS if v === max
            if (passedTests === totalTests) {
                status = 'P';
            }
            // FAIL if v === 0
            else if (passedTests === 0) {
                status = 'F';
            }
        }

        return {
            s: status,
            c: [passedTests, totalTests],
        };
    }

    static populateMetadata(parent: EntryTree) {
        const stats = Tree.emptyStatusMap();
        let passedTests = 0;
        let totalTests = 0;

        for (const value of Object.values(parent)) {
            if (value instanceof PartialEntry) {
                // entry
                totalTests += value.totalTests;
                if (value.status === 'O' || value.status === 'P') {
                    if (value.status === 'P' && value.totalTests === 0) {
                        passedTests += 1;
                    } else {
                        passedTests += value.passedTests;
                    }
                }

                stats[value.status] += 1;
            } else {
                // directory
                Tree.populateMetadata(value);

                for (const sk in value[TreeMeta]) {
                    // @ts-ignore
                    stats[sk] += value[TreeMeta][sk];
                }

                passedTests += value[TreeMetaSubtest][0];
                totalTests += value[TreeMetaSubtest][1];
            }

            parent[TreeMeta] = stats;
            parent[TreeMetaSubtest] = [passedTests, totalTests];
        }
    }

    tree: EntryTree;

    constructor(fyi: Fyi, flat: FlatCompactEntryTree) {
        const start = window.performance.now();

        // create the tree from the flat map
        const tree = Object.create(null);
        for (let [key, value] of Object.entries(flat)) {
            // remove leading slash
            key = key.slice(1);

            // some status values are wrong, we need to fix them
            value = Tree.recomputeTestEntry(value);
            const status = value.s;
            const [passedTests, totalTests] = value.c;

            // makes things easier to work with
            const entry = new PartialEntry(
                fyi,
                key,
                {
                    status,
                    passedTests,
                    totalTests,
                },
            );

            // created a nested key
            const path = key.split('/');
            setDeep(tree, path, entry);
        }

        // populate metadata
        Tree.populateMetadata(tree);

        this.tree = tree;

        const taken = (window.performance.now() - start) / 1000;
        const numEntries = Object.keys(flat).length;
        if (numEntries !== 0) {
            console.groupCollapsed('WPT tree build');
            console.log(`${numEntries} entries`);
            console.log(`took ${formatSeconds(taken)}`);
            console.groupEnd();
        }
    }

    statusCount() {
        return this.tree[TreeMeta] ?? Tree.emptyStatusMap();
    }

    navigate(path: string[], { search = '', statuses = [] }: NavigateParams = {}): PartialEntry|EntryTree|null {
        let branch = followDeep(this.tree, path);

        if (!branch) {
            return null;
        }

        if (branch instanceof PartialEntry) {
            return branch;
        }

        if (!(TreeMeta in branch || TreeMetaSubtest in branch)) {
            return null;
        }

        const filters: ((key: string, value: PartialEntry|EntryTree) => boolean)[] = [];
        if (statuses.length !== 0) {
            filters.push((_, value) => {
                if (value instanceof PartialEntry) {
                    return statuses.includes(value.status);
                }

                const stats = value[TreeMeta];
                return statuses.some((status) => stats && stats[status] > 0);
            });
        }

        search = search?.trim()?.toLowerCase()
        if (search) {
            filters.push(key => key.toLowerCase().includes(search));
        }

        branch = Reflect.ownKeys(branch as EntryTree)
            // @ts-ignore
            .map(key => [key, branch[key]])
            .filter(([key, value]) => {
                return typeof key === 'symbol' ||
                    filters.every(fn => fn(key, value))
            });

        // @ts-ignore
        return Object.fromEntries(branch);
    }
}
