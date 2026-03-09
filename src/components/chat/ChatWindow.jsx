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
                    className="fixed bottom-6 right-6 w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform z-50 overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/50 transition-colors"></div>
                    <Sparkles className="w-7 h-7 relative z-10" />
                </motion.button>
            )}

            {/* Chat Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed bottom-6 right-6 w-[380px] h-[600px] max-h-[85vh] bg-white rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-100"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-primary to-secondary p-5 flex justify-between items-center text-white shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold">AEVA Assistant</h3>
                                    <p className="text-white/80 text-xs text-left">Online & ready to plan</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors bg-white/10 p-2 rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 bg-gray-50 p-5 overflow-y-auto flex flex-col gap-4">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                            ? 'bg-primary text-white rounded-br-none'
                                            : 'bg-white text-text-dark border border-gray-100 shadow-sm rounded-bl-none'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-gray-100 shadow-sm p-4 rounded-2xl rounded-bl-none flex gap-1 items-center max-w-[80%]">
                                        <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"></span>
                                        <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                        <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={inputStr}
                                    onChange={(e) => setInputStr(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Tell me about your event..."
                                    className="flex-1 bg-gray-100 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all text-sm"
                                />
                                <button onClick={handleSend} className="bg-primary hover:bg-secondary text-white w-12 h-12 rounded-xl flex items-center justify-center transition-colors shrink-0">
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="text-[10px] text-center mt-3 text-gray-400">AI can make mistakes. Verify important info.</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
