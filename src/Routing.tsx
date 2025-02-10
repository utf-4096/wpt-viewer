import { effect, signal } from '@preact/signals';

type Page =
    | 'settings'
    | 'wpt'
    | 'not-found'

export const page = signal<Page>(getPage());

function getPage(): Page {
    const hash = window.location.hash.replace('#', '');

    if (hash === '/settings') {
        return 'settings';
    }

    if (!hash || hash === '/' || hash.startsWith('/v/')) {
        return 'wpt';
    }

    return 'not-found';
}

function getPath() {
    const hash = window.location.hash;
    if (page.value !== 'wpt') {
        return [];
    }

    if (hash === '#/') {
        return [];
    }

    return hash.replace('#/v/', '').split('/').filter(Boolean);
}

export const globalPath = signal<string[]>(getPath());
window.addEventListener('hashchange', () => {
    page.value = getPage();

    if (page.value === 'wpt') {
        if (globalPath.value.join('/') !== getPath().join('/')) {
            globalPath.value = getPath();
        }
    }
});

effect(() => {
    if (page.value !== 'wpt') {
        return;
    }

    window.location.hash = `#/v/${globalPath.value.join('/')}`;
});

effect(() => {
    switch (page.value) {
    case 'wpt':
        document.title = `view: /${globalPath.value.join('/')}`;
        break;

    case 'not-found':
        document.title = 'not found';
        break;

    case 'settings':
        document.title = 'settings';
        break;
    }
})
