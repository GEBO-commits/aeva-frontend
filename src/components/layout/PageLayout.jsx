import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import ChatWindow from '../chat/ChatWindow';

/**
 * Common wrapper for all views
 */
export default function PageLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col pt-16 selection:bg-primary/20 bg-background text-text-dark font-sans relative">
            <Navbar />
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
                {children}
            </main>
            <ChatWindow />
            <Footer />
        </div>
    );
}
