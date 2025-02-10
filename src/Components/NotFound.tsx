import '#/Style/components/NotFound.scss';

import { FileQuestion } from 'lucide-preact';

export function NotFound() {
    return <div class='NotFound'>
        <FileQuestion size={128} />
        <p>Page not found</p>
    </div>
}
