import '#/Style/components/Pages/Settings.scss';
import { Browsers, type FyiBrowser } from '#/Wpt/Fyi';
import { Save } from 'lucide-preact';
import { Button } from '../Ui/Button';
import { settings } from '#/State';

export function Settings() {
    function onSubmit(e: SubmitEvent) {
        e.preventDefault();

        const form = new FormData(e.currentTarget as HTMLFormElement);
        settings.browser.value = form.get('browser') as FyiBrowser;
        window.location.hash = '#/';
    }

    const browsers = Browsers.map(browser =>
        <option key={browser} value={browser} selected={settings.browser.peek() === browser}>
            {browser}
        </option>
    );

    return <form class='Settings' onSubmit={onSubmit}>
        <label>
            <span>Browser</span>
            <select name='browser'>{browsers}</select>
        </label>

        <Button color='primary' icon={Save}>
            Save settings
        </Button>
    </form>
}
