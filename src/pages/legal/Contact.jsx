/**
 * Contact.jsx
 * Public contact form page — no login required.
 * Allows users to send a message to the AEVA team.
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle } from 'lucide-react';

export default function Contact() {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: wire to backend POST /api/contact
        console.log("Contact form submitted:", form);
        setSubmitted(true);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto py-12 px-4"
        >
            <div className="flex items-center gap-3 mb-8">
                <Mail className="w-8 h-8 text-primary" />
                <h1 className="text-4xl font-display font-bold text-text-dark">Contact Us</h1>
            </div>
            <p className="text-text-muted mb-8">Have a question or need help? We'd love to hear from you.</p>

            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
                {submitted ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-12 text-center gap-4"
                    >
                        <CheckCircle className="w-16 h-16 text-green-500" />
                        <h2 className="text-2xl font-bold text-text-dark">Message Sent!</h2>
                        <p className="text-text-muted">Thanks for reaching out. We'll get back to you within 24 hours.</p>
                        <button
                            onClick={() => { setSubmitted(false); setForm({ name: '', email: '', message: '' }); }}
                            className="mt-4 bg-primary text-white px-6 py-2.5 rounded-full font-medium hover:bg-secondary transition-colors"
                        >
                            Send Another
                        </button>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-text-dark mb-1.5">Your Name</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Sara Ahmed"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-text-dark"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-dark mb-1.5">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                placeholder="sara@example.com"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-text-dark"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-dark mb-1.5">Message</label>
                            <textarea
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                required
                                rows={5}
                                placeholder="Tell us how we can help..."
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-text-dark resize-none"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-primary hover:bg-secondary text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-md"
                        >
                            <Send className="w-4 h-4" /> Send Message
                        </button>
                    </form>
                )}
            </div>
        </motion.div>
    );
}
