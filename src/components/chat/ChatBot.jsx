/**
 * ChatBot.jsx
 *
 * Floating AI chat widget — styled like MakeMyTrip's assistant card.
 *
 * CLOSED STATE: A small white card (200×160px) in the bottom-right
 *   corner showing a bot avatar, "How can I help you today?", and a compact
 *   input bar. Clicking anywhere on the card opens the full panel.
 *
 * OPEN STATE: Slides up into a full 380×520px chat panel with header,
 *   scrollable messages, typing indicator, quick prompt chips, and input.
 *
 * AUTO-OPEN: If navigated to with state { openChat: true } (e.g. from
 *   the Plan Builder "Want AI?" button), the panel opens automatically.
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles } from 'lucide-react';
import { useLocation } from 'react-router-dom';

/** Quick-prompt chips shown above the input field */
const QUICK_PROMPTS = [
    'Plan a wedding 💍',
    'Find a venue 🏛️',
    'Set my budget 💰',
    'Birthday party 🎂',
];

/**
 * Returns an AI response string based on keyword matching.
 * @param {string} message - The user's raw message
 * @returns {string} AI reply
 */
function getAIResponse(message) {
    const lower = message.toLowerCase();
    if (lower.includes('wedding'))
        return "Perfect! I found 6 elegant indoor venues for weddings in Cairo. What's your approximate budget? 💍";
    if (lower.includes('birthday'))
        return "Fun! For birthdays I recommend checking our outdoor venues. How many guests are you expecting? 🎂";
    if (lower.includes('corporate'))
        return "For corporate events, we have premium hotel ballrooms and conference halls. What's your guest count?";
    if (lower.includes('budget') || /\d{4,}/.test(lower))
        return "Great! Based on your budget, I'm filtering the best venues and catering options... Check /recommendations now! 🏛️";
    if (lower.includes('catering') || lower.includes('food'))
        return "We have 6 top-rated caterers from buffet to fine dining. Head to /catering to browse them! 🍽️";
    if (lower.includes('venue'))
        return "I can show you dozens of stunning venues across Cairo. Tell me your event type, guest count and budget and I'll filter them for you!";
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey'))
        return "Hi there! 👋 I'm AEVA. Tell me: what type of event are you planning, how many guests, and your budget?";
    return "I can help you build the perfect event! Tell me the type (wedding, birthday, corporate), your guest count, and total budget. 🎉";
}

/** Format a Date object as HH:MM */
function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function ChatBot() {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'ai', content: "Hi! I'm AEVA 👋 What type of event are you planning today?", timestamp: new Date() }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-open if navigated with { openChat: true }
    useEffect(() => {
        if (location.state?.openChat) setIsOpen(true);
    }, [location.state]);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const sendMessage = (text) => {
        const content = (text || input).trim();
        if (!content) return;
        const userMsg = { role: 'user', content, timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, { role: 'ai', content: getAIResponse(content), timestamp: new Date() }]);
        }, 1500);
    };

    const handleKey = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    };

    if (isDismissed) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-2">

            {/* ── Open: Full chat panel ── */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="panel"
                        initial={{ opacity: 0, y: 30, scale: 0.94 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 30, scale: 0.94 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-[360px] sm:w-[380px] h-[520px] flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[#6B3FF3] to-[#a855f7] px-5 py-4 flex items-center justify-between flex-shrink-0">
                            <div className="flex items-center gap-3">
                                {/* Bot avatar */}
                                <div className="w-10 h-10 bg-white rounded-full overflow-hidden flex items-center justify-center shadow-md text-xl">
                                    🤖
                                </div>
                                <div>
                                    <p className="font-bold text-white text-sm">AEVA Assistant</p>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                        <span className="text-white/70 text-xs">Online · AI-Powered</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages area */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50/80">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[78%] flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                        <div className={`px-4 py-2.5 text-sm leading-relaxed ${msg.role === 'user'
                                                ? 'bg-[#6B3FF3] text-white rounded-2xl rounded-tr-none'
                                                : 'bg-white text-text-dark rounded-2xl rounded-tl-none shadow-sm border border-gray-100'
                                            }`}>
                                            {msg.content}
                                        </div>
                                        <span className="text-[10px] text-gray-400 px-1">{formatTime(msg.timestamp)}</span>
                                    </div>
                                </div>
                            ))}
                            {/* Typing indicator (3 animated dots) */}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1.5">
                                        {[0, 0.2, 0.4].map((delay, i) => (
                                            <motion.span key={i} className="w-2 h-2 bg-gray-400 rounded-full block"
                                                animate={{ y: [0, -6, 0] }}
                                                transition={{ duration: 0.6, delay, repeat: Infinity }} />
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick prompt chips */}
                        <div className="px-4 pt-3 pb-1 flex gap-2 flex-wrap bg-white border-t border-gray-100">
                            {QUICK_PROMPTS.map(p => (
                                <button
                                    key={p}
                                    onClick={() => sendMessage(p)}
                                    className="text-xs bg-purple-50 hover:bg-primary hover:text-white text-primary px-3 py-1.5 rounded-full border border-purple-200 transition-colors font-medium whitespace-nowrap"
                                >
                                    {p}
                                </button>
                            ))}
                        </div>

                        {/* Input */}
                        <div className="px-4 py-3 border-t border-gray-100 bg-white flex gap-2 flex-shrink-0">
                            <input
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKey}
                                placeholder="How can I help you today?"
                                className="flex-1 px-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-text-dark"
                            />
                            <button
                                onClick={() => sendMessage()}
                                disabled={!input.trim()}
                                className="w-10 h-10 bg-primary hover:bg-secondary disabled:bg-gray-200 text-white rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
                            >
                                <Sparkles className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Closed: Floating preview card (MakeMyTrip style) ── */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.div
                        key="card"
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 w-[200px] cursor-pointer overflow-hidden"
                        onClick={() => setIsOpen(true)}
                    >
                        {/* Dismiss button */}
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsDismissed(true); }}
                            className="absolute top-2 right-2 w-5 h-5 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-xs transition-colors z-10"
                            aria-label="Dismiss chatbot"
                        >
                            <X className="w-3 h-3" />
                        </button>

                        {/* Bot avatar + gradient header */}
                        <div className="bg-gradient-to-r from-[#6B3FF3] to-[#a855f7] px-4 pt-4 pb-6 flex flex-col items-center relative">
                            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-3xl shadow-lg mb-1">
                                🤖
                            </div>
                            {/* Floating pulse on avatar */}
                            <motion.div
                                className="absolute bottom-4 w-14 h-14 rounded-full border-2 border-white/40"
                                animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
                                transition={{ duration: 1.8, repeat: Infinity }}
                            />
                        </div>

                        {/* Preview message */}
                        <div className="px-3 py-2 bg-gray-50 text-xs text-text-muted text-center leading-relaxed font-medium">
                            {messages[messages.length - 1]?.content.slice(0, 50)}...
                        </div>

                        {/* Compact input bar preview */}
                        <div className="px-3 py-2 border-t border-gray-100 flex items-center gap-2 bg-white">
                            <span className="flex-1 text-xs text-gray-400 truncate">How can I help you today?</span>
                            <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                                <Sparkles className="w-3 h-3 text-white" />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
