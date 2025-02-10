import '#/Style/components/Header.scss';

import { Github, Settings, Undo2 } from 'lucide-preact';
import { Breadcrumbs } from './Ui/Breadcrumbs';
import { globalPath, page } from '#/Routing';
import { useComputed } from '@preact/signals';

export function Header() {
    const backToWptLink = useComputed(() =>
        page.value !== 'wpt' && <a
            href='#/'
            class='unstyled'
            title='Go back to WPT'
            tabIndex={-1}>
            <Undo2 size={24} aria-hidden />
        </a>
    );

    return <header class='Header'>
        <Breadcrumbs signal={globalPath} />

        <div class='links'>
            {backToWptLink}

            <a
                href='#/settings'
                class='unstyled'
                title='Settings'>
                <Settings size={24} aria-hidden />
            </a>

            <a
                href='https://github.com/utf-4096/wpt-viewer'
                target='_blank'
                class='unstyled'
                title='View the source code on GitHub'
                tabIndex={-1}
                rel='noreferrer'>
                <Github size={24} aria-hidden />
            </a>
        </div>
    </header>
}
