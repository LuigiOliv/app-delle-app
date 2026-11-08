import AgrumiApp from '@agrumi/App.jsx';

import '../embeddedFrame.css';

// Scoped styles: safe to import because they no longer touch body/#root
import '@agrumi/index.css';
import '@agrumi/App.css';

export default function AgrumiDemo() {
    return (
        <div className="embedded-demo-frame">
            <AgrumiApp />
        </div>
    );
}
