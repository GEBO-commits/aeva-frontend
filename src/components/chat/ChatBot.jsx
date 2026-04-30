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
        <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '8px'
        }}>

            {/* ── Open: Full chat panel ── */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="panel"
                        initial={{ opacity: 0, y: 30, scale: 0.94 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 30, scale: 0.94 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        style={{
                            background: 'var(--aeva-canvas)',
                            borderRadius: 'var(--r-3xl)',
                            boxShadow: 'var(--shadow-2xl)',
                            border: '1px solid var(--aeva-line)',
                            width: '360px',
                            height: '520px',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden'
                        }}
                        className="sm:w-[380px]"
                    >
                        {/* Header */}
                        <div style={{
                            background: 'linear-gradient(to right, #6B3FF3, #a855f7)',
                            padding: '16px 20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexShrink: 0
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                {/* Bot avatar */}
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    background: 'white',
                                    borderRadius: '50%',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: 'var(--shadow-md)',
                                    fontSize: '20px'
                                }}>
                                    🤖
                                </div>
                                <div>
                                    <p style={{ fontWeight: 700, color: 'white', fontSize: '14px' }}>AEVA Assistant</p>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}>
                                        <span style={{
                                            width: '8px',
                                            height: '8px',
                                            background: '#4ade80',
                                            borderRadius: '50%',
                                            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                                        }} />
                                        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>Online · AI-Powered</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} style={{
                                color: 'rgba(255,255,255,0.7)',
                                padding: '8px',
                                borderRadius: '50%',
                                border: 'none',
                                background: 'transparent',
                                cursor: 'pointer',
                                transition: 'all 300ms',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = 'white';
                                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                                e.currentTarget.style.background = 'transparent';
                            }}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages area */}
                        <div style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                            background: 'rgba(var(--aeva-paper-rgb), 0.8)'
                        }}>
                            {messages.map((msg, i) => (
                                <div key={i} style={{
                                    display: 'flex',
                                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                                }}>
                                    <div style={{
                                        maxWidth: '78%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '4px',
                                        alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start'
                                    }}>
                                        <div style={{
                                            padding: '10px 16px',
                                            fontSize: '14px',
                                            lineHeight: 1.5,
                                            background: msg.role === 'user' ? '#6B3FF3' : 'var(--aeva-canvas)',
                                            color: msg.role === 'user' ? 'white' : 'var(--aeva-ink)',
                                            borderRadius: 'var(--r-2xl)',
                                            borderTopRightRadius: msg.role === 'user' ? 0 : 'var(--r-2xl)',
                                            borderTopLeftRadius: msg.role === 'user' ? 'var(--r-2xl)' : 0,
                                            boxShadow: msg.role === 'user' ? 'none' : 'var(--shadow-sm)',
                                            border: msg.role === 'user' ? 'none' : '1px solid var(--aeva-line)'
                                        }}>
                                            {msg.content}
                                        </div>
                                        <span style={{
                                            fontSize: '10px',
                                            color: 'var(--aeva-ink-soft)',
                                            padding: '0 4px'
                                        }}>{formatTime(msg.timestamp)}</span>
                                    </div>
                                </div>
                            ))}
                            {/* Typing indicator (3 animated dots) */}
                            {isTyping && (
                                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                    <div style={{
                                        background: 'var(--aeva-canvas)',
                                        border: '1px solid var(--aeva-line)',
                                        boxShadow: 'var(--shadow-sm)',
                                        borderRadius: 'var(--r-2xl)',
                                        borderTopLeftRadius: 0,
                                        padding: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}>
                                        {[0, 0.2, 0.4].map((delay, i) => (
                                            <motion.span key={i} style={{
                                                width: '8px',
                                                height: '8px',
                                                background: 'var(--aeva-ink-soft)',
                                                borderRadius: '50%',
                                                display: 'block'
                                            }}
                                                animate={{ y: [0, -6, 0] }}
                                                transition={{ duration: 0.6, delay, repeat: Infinity }} />
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick prompt chips */}
                        <div style={{
                            padding: '12px 16px 4px',
                            display: 'flex',
                            gap: '8px',
                            flexWrap: 'wrap',
                            background: 'var(--aeva-canvas)',
                            borderTop: '1px solid var(--aeva-line)'
                        }}>
                            {QUICK_PROMPTS.map(p => (
                                <button
                                    key={p}
                                    onClick={() => sendMessage(p)}
                                    style={{
                                        fontSize: '12px',
                                        background: 'rgba(107, 63, 243, 0.1)',
                                        color: '#6B3FF3',
                                        padding: '6px 12px',
                                        borderRadius: 'var(--r-full)',
                                        border: '1px solid rgba(107, 63, 243, 0.3)',
                                        transition: 'all 300ms',
                                        fontWeight: 500,
                                        whiteSpace: 'nowrap',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = '#6B3FF3';
                                        e.currentTarget.style.color = 'white';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(107, 63, 243, 0.1)';
                                        e.currentTarget.style.color = '#6B3FF3';
                                    }}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>

                        {/* Input */}
                        <div style={{
                            padding: '12px 16px',
                            borderTop: '1px solid var(--aeva-line)',
                            background: 'var(--aeva-canvas)',
                            display: 'flex',
                            gap: '8px',
                            flexShrink: 0
                        }}>
                            <input
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKey}
                                placeholder="How can I help you today?"
                                style={{
                                    flex: 1,
                                    padding: '10px 16px',
                                    background: 'var(--aeva-paper)',
                                    borderRadius: 'var(--r-xl)',
                                    fontSize: '14px',
                                    border: '1px solid var(--aeva-line)',
                                    outline: 'none',
                                    color: 'var(--aeva-ink)',
                                    transition: 'border-color 300ms',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#6B3FF3'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--aeva-line)'}
                            />
                            <button
                                onClick={() => sendMessage()}
                                disabled={!input.trim()}
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    background: input.trim() ? '#6B3FF3' : 'var(--aeva-paper)',
                                    color: 'white',
                                    borderRadius: 'var(--r-xl)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'background 300ms',
                                    border: 'none',
                                    cursor: input.trim() ? 'pointer' : 'not-allowed',
                                    opacity: input.trim() ? 1 : 0.6,
                                    flexShrink: 0
                                }}
                                onMouseEnter={(e) => {
                                    if (input.trim()) e.currentTarget.style.background = '#a855f7';
                                }}
                                onMouseLeave={(e) => {
                                    if (input.trim()) e.currentTarget.style.background = '#6B3FF3';
                                }}
                            >
                                <Sparkles size={16} />
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
                        style={{
                            position: 'relative',
                            background: 'var(--aeva-canvas)',
                            borderRadius: 'var(--r-2xl)',
                            boxShadow: 'var(--shadow-2xl)',
                            border: '1px solid var(--aeva-line)',
                            width: '200px',
                            cursor: 'pointer',
                            overflow: 'hidden'
                        }}
                        onClick={() => setIsOpen(true)}
                    >
                        {/* Dismiss button */}
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsDismissed(true); }}
                            style={{
                                position: 'absolute',
                                top: '8px',
                                right: '8px',
                                width: '20px',
                                height: '20px',
                                background: 'var(--aeva-paper)',
                                color: 'var(--aeva-ink-soft)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px',
                                transition: 'all 300ms',
                                border: 'none',
                                cursor: 'pointer',
                                zIndex: 10
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(0,0,0,0.1)';
                                e.currentTarget.style.color = 'var(--aeva-ink)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'var(--aeva-paper)';
                                e.currentTarget.style.color = 'var(--aeva-ink-soft)';
                            }}
                            aria-label="Dismiss chatbot"
                        >
                            <X size={12} />
                        </button>

                        {/* Bot avatar + gradient header */}
                        <div style={{
                            background: 'linear-gradient(to right, #6B3FF3, #a855f7)',
                            padding: '16px 16px 24px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            position: 'relative'
                        }}>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                background: 'white',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '32px',
                                boxShadow: 'var(--shadow-lg)',
                                marginBottom: '4px'
                            }}>
                                🤖
                            </div>
                            {/* Floating pulse on avatar */}
                            <motion.div
                                style={{
                                    position: 'absolute',
                                    bottom: '16px',
                                    width: '56px',
                                    height: '56px',
                                    borderRadius: '50%',
                                    border: '2px solid rgba(255,255,255,0.4)'
                                }}
                                animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
                                transition={{ duration: 1.8, repeat: Infinity }}
                            />
                        </div>

                        {/* Preview message */}
                        <div style={{
                            padding: '12px',
                            background: 'var(--aeva-paper)',
                            fontSize: '12px',
                            color: 'var(--aeva-ink-soft)',
                            textAlign: 'center',
                            lineHeight: 1.5,
                            fontWeight: 500
                        }}>
                            {messages[messages.length - 1]?.content.slice(0, 50)}...
                        </div>

                        {/* Compact input bar preview */}
                        <div style={{
                            padding: '12px',
                            borderTop: '1px solid var(--aeva-line)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'var(--aeva-canvas)'
                        }}>
                            <span style={{
                                flex: 1,
                                fontSize: '12px',
                                color: 'var(--aeva-ink-soft)',
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap'
                            }}>How can I help you today?</span>
                            <div style={{
                                width: '24px',
                                height: '24px',
                                background: '#6B3FF3',
                                borderRadius: 'var(--r-lg)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                <Sparkles size={12} style={{ color: 'white' }} />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
