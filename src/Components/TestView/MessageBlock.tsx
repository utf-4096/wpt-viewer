import '#/Style/components/TestView/MessageBlock.scss';

import { Code, type Language } from '../Ui/Code';
import type { BlockAttributes } from './Component';

export function MessageBlock({ details }: BlockAttributes) {
    const message = details.value.message;

    let guessedLanguage: Language = null;
    if (message) {
        if (message.includes('is not defined') ||
            message.includes('Unhandled rejection:')) {
            guessedLanguage = 'javascript';
        } else if (message.includes('/usr/lib/python')) {
            guessedLanguage = 'python';
        }
    }

    return <div class='Block'>
        <header>
            Message
        </header>

        <section class='MessageBlock'>
            {message ?
                <Code language={guessedLanguage} code={message} />:
                <i>No message</i>
            }
        </section>
    </div>
}
