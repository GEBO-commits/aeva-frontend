import React from 'react';
import { Shell } from './Shell';
import ChatWindow from '../chat/ChatWindow';

/**
 * Common wrapper for all views — uses new Shell (TopNav + Footer)
 */
export default function PageLayout({ children }) {
    return (
        <Shell>
            <main style={{ flexGrow: 1, width: '100%', position: 'relative' }}>
                {children}
            </main>
            <ChatWindow />
        </Shell>
    );
}
