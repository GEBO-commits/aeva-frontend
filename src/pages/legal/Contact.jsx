import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle } from 'lucide-react';

export default function Contact() {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Contact form submitted:", form);
        setSubmitted(true);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ maxWidth: '768px', margin: '0 auto', padding: '48px 32px', display: 'flex', flexDirection: 'column', gap: '32px' }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <Mail size={32} style={{ color: 'var(--aeva-ember)' }} />
                <h1 style={{ fontSize: '40px', fontWeight: 700, color: 'var(--aeva-ink)', margin: 0 }}>Contact Us</h1>
            </div>
            <p style={{ fontSize: '15px', color: 'var(--aeva-ink-soft)', margin: 0 }}>Have a question or need help? We'd love to hear from you.</p>

            <div style={{
                background: 'var(--aeva-canvas)',
                borderRadius: 'var(--r-2xl)',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--aeva-line)',
                padding: '32px'
            }}>
                {submitted ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '48px 32px',
                            textAlign: 'center',
                            gap: '16px'
                        }}
                    >
                        <CheckCircle size={64} style={{ color: 'var(--aeva-sage)' }} />
                        <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--aeva-ink)', margin: 0 }}>Message Sent!</h2>
                        <p style={{ fontSize: '15px', color: 'var(--aeva-ink-soft)', margin: 0 }}>Thanks for reaching out. We'll get back to you within 24 hours.</p>
                        <button
                            onClick={() => { setSubmitted(false); setForm({ name: '', email: '', message: '' }); }}
                            style={{
                                marginTop: '16px',
                                background: 'var(--aeva-ember)',
                                color: 'white',
                                padding: '10px 24px',
                                borderRadius: 'var(--r-full)',
                                fontWeight: 600,
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '14px',
                                transition: 'opacity 200ms'
                            }}
                            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                        >
                            Send Another
                        </button>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: 600,
                                color: 'var(--aeva-ink)',
                                marginBottom: '8px',
                                marginLeft: '4px'
                            }} htmlFor="name">Your Name</label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Sara Ahmed"
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '1px solid var(--aeva-line)',
                                    borderRadius: 'var(--r-lg)',
                                    background: 'var(--aeva-paper-warm)',
                                    color: 'var(--aeva-ink)',
                                    fontSize: '14px',
                                    outline: 'none',
                                    transition: 'all 200ms',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={e => {
                                    e.currentTarget.style.borderColor = 'var(--aeva-ink)';
                                    e.currentTarget.style.boxShadow = '0 0 0 2px rgba(0,0,0,0.1)';
                                }}
                                onBlur={e => {
                                    e.currentTarget.style.borderColor = 'var(--aeva-line)';
                                    e.currentTarget.style.boxShadow = '';
                                }}
                            />
                        </div>
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: 600,
                                color: 'var(--aeva-ink)',
                                marginBottom: '8px',
                                marginLeft: '4px'
                            }} htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                placeholder="sara@example.com"
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '1px solid var(--aeva-line)',
                                    borderRadius: 'var(--r-lg)',
                                    background: 'var(--aeva-paper-warm)',
                                    color: 'var(--aeva-ink)',
                                    fontSize: '14px',
                                    outline: 'none',
                                    transition: 'all 200ms',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={e => {
                                    e.currentTarget.style.borderColor = 'var(--aeva-ink)';
                                    e.currentTarget.style.boxShadow = '0 0 0 2px rgba(0,0,0,0.1)';
                                }}
                                onBlur={e => {
                                    e.currentTarget.style.borderColor = 'var(--aeva-line)';
                                    e.currentTarget.style.boxShadow = '';
                                }}
                            />
                        </div>
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: 600,
                                color: 'var(--aeva-ink)',
                                marginBottom: '8px',
                                marginLeft: '4px'
                            }} htmlFor="message">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                required
                                rows={5}
                                placeholder="Tell us how we can help..."
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '1px solid var(--aeva-line)',
                                    borderRadius: 'var(--r-lg)',
                                    background: 'var(--aeva-paper-warm)',
                                    color: 'var(--aeva-ink)',
                                    fontSize: '14px',
                                    outline: 'none',
                                    transition: 'all 200ms',
                                    boxSizing: 'border-box',
                                    resize: 'none',
                                    fontFamily: 'inherit'
                                }}
                                onFocus={e => {
                                    e.currentTarget.style.borderColor = 'var(--aeva-ink)';
                                    e.currentTarget.style.boxShadow = '0 0 0 2px rgba(0,0,0,0.1)';
                                }}
                                onBlur={e => {
                                    e.currentTarget.style.borderColor = 'var(--aeva-line)';
                                    e.currentTarget.style.boxShadow = '';
                                }}
                            />
                        </div>
                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                background: 'var(--aeva-ember)',
                                color: 'white',
                                padding: '12px 24px',
                                borderRadius: 'var(--r-lg)',
                                fontWeight: 700,
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                transition: 'opacity 200ms',
                                boxShadow: 'var(--shadow-md)'
                            }}
                            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                        >
                            <Send size={16} /> Send Message
                        </button>
                    </form>
                )}
            </div>
        </motion.div>
    );
}
