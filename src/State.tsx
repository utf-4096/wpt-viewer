import { effect, signal } from '@preact/signals';
import { Browsers, type FyiBrowser } from './Wpt/Fyi';

const DefaultBrowser: FyiBrowser = 'ladybird';

function getStoredBrowser() {
    const browser: string|null = localStorage.getItem('browser');
    if (!browser || ! Browsers.includes(browser as FyiBrowser)) {
        return DefaultBrowser;
    }

    return browser as FyiBrowser;
}

export const settings = {
    browser: signal<FyiBrowser>(getStoredBrowser()),
};

effect(() => {
    localStorage.setItem('browser', settings.browser.value);
});
