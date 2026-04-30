import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';

export default function ChatWindow() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'ai', text: 'Hi there! I am your AEVA AI Assistant. What kind of event are you looking to plan?' }
    ]);
    const [inputStr, setInputStr] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = () => {
        if (!inputStr.trim()) return;
        const newMsg = { role: 'user', text: inputStr };
        setMessages(prev => [...prev, newMsg]);
        setInputStr('');
        setIsTyping(true);

        // Mock AI response
        setTimeout(() => {
            setMessages(prev => [
                ...prev,
                { role: 'ai', text: "That sounds amazing! I can certainly help you find the perfect venue in Cairo for 150 guests. Should we prioritize outdoor spaces or a grand ballroom?" }
            ]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <>
            {/* Floating Action Button */}
            {!isOpen && (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    onClick={() => setIsOpen(true)}
                    style={{
                        position: 'fixed',
                        bottom: '24px',
                        right: '24px',
                        width: '64px',
                        height: '64px',
                        background: '#6B3FF3',
                        color: 'white',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'var(--shadow-2xl)',
                        border: 'none',
                        cursor: 'pointer',
                        zIndex: 50,
                        overflow: 'hidden',
                        transition: 'transform 300ms'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(168, 85, 247, 0)',
                        transition: 'background 300ms'
                    }} onMouseEnter={(e) => e.target.style.background = 'rgba(168, 85, 247, 0.5)'} onMouseLeave={(e) => e.target.style.background = 'rgba(168, 85, 247, 0)'}></div>
                    <Sparkles size={28} style={{ position: 'relative', zIndex: 10 }} />
                </motion.button>
            )}

            {/* Chat Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        style={{
                            position: 'fixed',
                            bottom: '24px',
                            right: '24px',
                            width: '380px',
                            height: '600px',
                            maxHeight: '85vh',
                            background: 'var(--aeva-canvas)',
                            borderRadius: 'var(--r-3xl)',
                            boxShadow: 'var(--shadow-2xl)',
                            zIndex: 50,
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            border: '1px solid var(--aeva-line)'
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            background: 'linear-gradient(to right, #6B3FF3, #a855f7)',
                            padding: '20px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            color: 'white',
                            flexShrink: 0
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    background: 'rgba(255,255,255,0.2)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backdropFilter: 'blur(8px)'
                                }}>
                                    <Sparkles size={20} style={{ color: 'white' }} />
                                </div>
                                <div>
                                    <h3 style={{ fontWeight: 700 }}>AEVA Assistant</h3>
                                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', textAlign: 'left' }}>Online & ready to plan</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} style={{
                                color: 'rgba(255,255,255,0.8)',
                                transition: 'color 300ms',
                                background: 'rgba(255,255,255,0.1)',
                                padding: '8px',
                                borderRadius: '50%',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div style={{
                            flex: 1,
                            background: 'var(--aeva-paper)',
                            padding: '20px',
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px'
                        }}>
                            {messages.map((msg, i) => (
                                <div key={i} style={{
                                    display: 'flex',
                                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                                }}>
                                    <div style={{
                                        maxWidth: '80%',
                                        padding: '14px',
                                        borderRadius: 'var(--r-2xl)',
                                        fontSize: '14px',
                                        lineHeight: 1.5,
                                        background: msg.role === 'user' ? '#6B3FF3' : 'var(--aeva-canvas)',
                                        color: msg.role === 'user' ? 'white' : 'var(--aeva-ink)',
                                        borderBottomRightRadius: msg.role === 'user' ? 0 : 'var(--r-2xl)',
                                        borderBottomLeftRadius: msg.role === 'user' ? 'var(--r-2xl)' : 0,
                                        boxShadow: msg.role === 'user' ? 'none' : 'var(--shadow-sm)',
                                        border: msg.role === 'user' ? 'none' : '1px solid var(--aeva-line)'
                                    }}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}

                            {isTyping && (
                                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                    <div style={{
                                        background: 'var(--aeva-canvas)',
                                        border: '1px solid var(--aeva-line)',
                                        boxShadow: 'var(--shadow-sm)',
                                        padding: '16px',
                                        borderRadius: 'var(--r-2xl)',
                                        borderBottomLeftRadius: 0,
                                        display: 'flex',
                                        gap: '4px',
                                        alignItems: 'center',
                                        maxWidth: '80%'
                                    }}>
                                        <span style={{
                                            width: '8px',
                                            height: '8px',
                                            background: 'rgba(107, 63, 243, 0.4)',
                                            borderRadius: '50%',
                                            animation: 'bounce 1.4s infinite'
                                        }}></span>
                                        <span style={{
                                            width: '8px',
                                            height: '8px',
                                            background: 'rgba(107, 63, 243, 0.4)',
                                            borderRadius: '50%',
                                            animation: 'bounce 1.4s infinite',
                                            animationDelay: '0.2s'
                                        }}></span>
                                        <span style={{
                                            width: '8px',
                                            height: '8px',
                                            background: 'rgba(107, 63, 243, 0.4)',
                                            borderRadius: '50%',
                                            animation: 'bounce 1.4s infinite',
                                            animationDelay: '0.4s'
                                        }}></span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div style={{
                            padding: '16px',
                            background: 'var(--aeva-canvas)',
                            borderTop: '1px solid var(--aeva-line)',
                            flexShrink: 0
                        }}>
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                                <input
                                    type="text"
                                    value={inputStr}
                                    onChange={(e) => setInputStr(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Tell me about your event..."
                                    style={{
                                        flex: 1,
                                        background: 'var(--aeva-paper)',
                                        padding: '12px 16px',
                                        borderRadius: 'var(--r-xl)',
                                        outline: 'none',
                                        border: '2px solid transparent',
                                        fontSize: '14px',
                                        color: 'var(--aeva-ink)',
                                        boxSizing: 'border-box',
                                        transition: 'all 300ms'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.background = 'var(--aeva-canvas)';
                                        e.target.style.borderColor = 'rgba(107, 63, 243, 0.2)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.background = 'var(--aeva-paper)';
                                        e.target.style.borderColor = 'transparent';
                                    }}
                                />
                                <button onClick={handleSend} style={{
                                    background: '#6B3FF3',
                                    color: 'white',
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: 'var(--r-xl)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'background 300ms',
                                    border: 'none',
                                    cursor: 'pointer',
                                    flexShrink: 0
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#a855f7'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#6B3FF3'}>
                                    <Send size={20} />
                                </button>
                            </div>
                            <p style={{
                                fontSize: '10px',
                                textAlign: 'center',
                                color: 'var(--aeva-ink-soft)'
                            }}>AI can make mistakes. Verify important info.</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
