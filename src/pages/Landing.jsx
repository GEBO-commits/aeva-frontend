/**
 * Landing.jsx
 *
 * Redesigned Landing page for AEVA with a premium hero section.
 * Includes: permanent purple gradient, floating blobs, stars,
 * glassmorphism buttons, and a smooth bottom transition wave.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, CalendarHeart, MessageSquare, MapPin, ArrowRight } from 'lucide-react';

// ─── Animation variants ────────────────────────────────────────────────────────
const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0 }
};
const containerVariants = { animate: { transition: { staggerChildren: 0.1 } } };
const cardVariants = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } };

/** Floating category pills for hero */
const floatingBubbles = [
    { emoji: '💍', label: 'Wedding', x: '5%', y: '10px', driftX: 8, duration: 5, delay: 0 },
    { emoji: '🎂', label: 'Birthday', x: '24%', y: '55px', driftX: -6, duration: 6.5, delay: 0.8 },
    { emoji: '🏢', label: 'Corporate', x: '46%', y: '5px', driftX: 10, duration: 4.8, delay: 1.4 },
    { emoji: '🎊', label: 'Gala Night', x: '65%', y: '60px', driftX: -8, duration: 5.6, delay: 0.4 },
    { emoji: '🌸', label: 'Decorations', x: '80%', y: '15px', driftX: 6, duration: 7, delay: 1.2 },
    { emoji: '📸', label: 'Photography', x: '14%', y: '70px', driftX: -7, duration: 5.2, delay: 2.1 },
    { emoji: '🍽️', label: 'Catering', x: '55%', y: '68px', driftX: 5, duration: 6, delay: 0.6 },
];

const categories = [
    { icon: '🏛️', label: 'Venues', href: '/recommendations' },
    { icon: '🍽️', label: 'Catering', href: '/catering' },
    { icon: '🌸', label: 'Decorations', href: '/decorations' },
    { icon: '🎵', label: 'Vendors', href: '/vendors' },
    { icon: '✉️', label: 'Survey', href: '/survey' },
];

function FeatureCard({ title, desc, icon }) {
    return (
        <motion.div variants={cardVariants} className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-3 text-text-dark">{title}</h3>
            <p className="text-text-muted">{desc}</p>
        </motion.div>
    );
}

function Step({ number, title, desc }) {
    return (
        <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-white shadow-lg border-4 border-primary rounded-full flex items-center justify-center text-3xl font-display font-bold text-primary mb-6 relative hover:scale-110 transition-transform cursor-default">
                {number}
            </div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-text-muted">{desc}</p>
        </div>
    );
}

function IdeaCard({ title, img }) {
    return (
        <motion.div variants={cardVariants} whileHover={{ y: -8 }} className="relative h-80 rounded-3xl overflow-hidden group cursor-pointer shadow-lg">
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors z-10" />
            <img src={img} alt={title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute bottom-0 left-0 p-8 z-20 w-full bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-3xl font-display font-bold text-white">{title}</h3>
            </div>
        </motion.div>
    );
}

export default function Landing() {
    const [currentWord, setCurrentWord] = useState(0);
    const words = ['Wedding', 'Birthday', 'Corporate Event', 'Gala'];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentWord((prev) => (prev + 1) % words.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">

            {/* ─── PREMIUM HERO SECTION ────────────────────────────────────────────── */}
            <section
                style={{
                    background: 'linear-gradient(135deg, #6B3FF3 0%, #A855F7 50%, #7C3AED 100%)',
                    minHeight: '100vh',
                    paddingTop: '64px',
                    position: 'relative',
                    overflow: 'hidden',
                }}
                className="flex flex-col items-center justify-center text-center px-4"
            >
                {/* Background decorative blobs */}
                <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
                    {/* Large soft blob top-left */}
                    <div style={{
                        position: 'absolute',
                        width: '600px',
                        height: '600px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(167,139,250,0.4) 0%, transparent 70%)',
                        top: '-200px',
                        left: '-200px',
                        animation: 'floatBlob 12s ease-in-out infinite',
                    }} />

                    {/* Medium blob top-right */}
                    <div style={{
                        position: 'absolute',
                        width: '400px',
                        height: '400px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(99,102,241,0.5) 0%, transparent 70%)',
                        top: '-100px',
                        right: '-100px',
                        animation: 'floatBlob 15s ease-in-out infinite reverse',
                    }} />

                    {/* Small blob bottom-left */}
                    <div style={{
                        position: 'absolute',
                        width: '300px',
                        height: '300px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%)',
                        bottom: '-100px',
                        left: '20%',
                        animation: 'floatBlob 18s ease-in-out infinite 3s',
                    }} />

                    {/* Small blob bottom-right */}
                    <div style={{
                        position: 'absolute',
                        width: '250px',
                        height: '250px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)',
                        bottom: '50px',
                        right: '10%',
                        animation: 'floatBlob 10s ease-in-out infinite 1s',
                    }} />

                    {/* Scattered small star dots */}
                    {[...Array(25)].map((_, i) => (
                        <div
                            key={i}
                            style={{
                                position: 'absolute',
                                width: i % 3 === 0 ? '3px' : '2px',
                                height: i % 3 === 0 ? '3px' : '2px',
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.5)',
                                left: `${5 + (i * 37) % 90}%`,
                                top: `${10 + (i * 23) % 80}%`,
                                animation: `floatBlob ${6 + (i % 5) * 2}s ease-in-out infinite`,
                                animationDelay: `${(i % 4) * 1.5}s`,
                            }}
                        />
                    ))}
                </div>

                {/* Hero Content */}
                <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6">
                            Plan Your Perfect <br className="hidden md:block" />
                            <span className="text-yellow-300">
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={currentWord}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="inline-block min-w-[300px]"
                                    >
                                        {words[currentWord]}
                                    </motion.span>
                                </AnimatePresence>
                            </span>
                        </h1>
                        <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                            AEVA uses AI to recommend venues, track RSVPs, and turn your vision into an unforgettable reality.
                        </p>
                    </motion.div>

                    {/* CTAs */}
                    <motion.div variants={containerVariants} initial="initial" animate="animate" className="flex justify-center gap-4 flex-wrap mb-16">
                        <Link to="/survey" className="bg-white text-primary font-semibold px-8 py-4 rounded-full hover:bg-yellow-50 transition-all shadow-lg flex items-center gap-2 transform hover:-translate-y-1">
                            <Sparkles size={20} /> Start with AI
                        </Link>
                        <Link to="/survey" className="bg-white/20 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-full border border-white/40 hover:bg-white/30 transition-all flex items-center gap-2 transform hover:-translate-y-1">
                            <CalendarHeart size={20} /> Fill Survey
                        </Link>
                        <Link to="/plan/build" className="bg-white/20 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-full border border-white/40 hover:bg-white/30 transition-all flex items-center gap-2 transform hover:-translate-y-1">
                            <ArrowRight size={20} /> Build My Plan
                        </Link>
                    </motion.div>

                    {/* Stats */}
                    <div className="flex justify-center items-center gap-8 md:gap-16 flex-wrap">
                        <div className="text-center">
                            <p className="text-white font-bold text-2xl lg:text-3xl">500+</p>
                            <p className="text-white/60 text-sm uppercase tracking-wider">Events Planned</p>
                        </div>
                        <div className="w-px h-10 bg-white/20" />
                        <div className="text-center">
                            <p className="text-white font-bold text-2xl lg:text-3xl">2400+</p>
                            <p className="text-white/60 text-sm uppercase tracking-wider">Happy Guests</p>
                        </div>
                        <div className="w-px h-10 bg-white/20" />
                        <div className="text-center">
                            <p className="text-white font-bold text-2xl lg:text-3xl">98%</p>
                            <p className="text-white/60 text-sm uppercase tracking-wider">Success Rate</p>
                        </div>
                    </div>

                    {/* Floating category pills */}
                    <div className="relative w-full max-w-3xl h-32 mt-12 select-none pointer-events-none hidden md:block">
                        {floatingBubbles.map((bubble, i) => (
                            <motion.div
                                key={i}
                                className="absolute"
                                style={{ left: bubble.x, top: bubble.y }}
                                animate={{
                                    y: [0, -12, 0, 10, 0],
                                    x: [0, bubble.driftX, 0, -bubble.driftX / 2, 0],
                                    opacity: [0.7, 1, 0.7, 0.9, 0.7]
                                }}
                                transition={{ duration: bubble.duration, delay: bubble.delay, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 whitespace-nowrap shadow-xl">
                                    {bubble.emoji} {bubble.label}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Bottom wave transition */}
                <div
                    aria-hidden="true"
                    style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10 }}
                >
                    <svg
                        viewBox="0 0 1440 80"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ display: 'block' }}
                    >
                        <path
                            d="M0 80L1440 80L1440 40C1320 0 1080 80 720 40C360 0 120 80 0 40L0 80Z"
                            fill="#F0F2FF"
                        />
                    </svg>
                </div>
            </section>

            {/* ─── Browse by Category bar ─────────────────────────────────── */}
            <div className="relative z-20 bg-white py-12 px-4 shadow-sm">
                <div className="max-w-7xl mx-auto">
                    <p className="text-text-muted text-xs font-bold uppercase tracking-widest text-center mb-8 italic">Or Browse by Category</p>
                    <div className="flex justify-center flex-wrap gap-6">
                        {categories.map((cat, i) => (
                            <motion.div
                                key={cat.label}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 * i }}
                            >
                                <Link
                                    to={cat.href}
                                    className="group flex flex-col items-center gap-3 bg-gray-50 hover:bg-primary/5 border border-gray-100 hover:border-primary/20 p-6 rounded-[2.5rem] transition-all hover:-translate-y-2 min-w-[120px] shadow-sm hover:shadow-xl"
                                >
                                    <span className="text-4xl group-hover:scale-125 transition-transform duration-500">{cat.icon}</span>
                                    <span className="text-text-dark text-xs font-bold tracking-tight uppercase">{cat.label}</span>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ─── Rest of Content (Why Choose AEVA / How It Works / Event Ideas) ──────────────── */}
            <section className="bg-background pt-24 pb-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-display font-bold text-text-dark mb-4">Why Choose AEVA?</h2>
                        <p className="text-text-muted text-lg max-w-2xl mx-auto">Our intelligent platform handles the logistics, so you can focus on the celebration.</p>
                    </div>
                    <motion.div variants={containerVariants} initial="initial" whileInView="animate" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <FeatureCard title="AI Assistant" desc="Chat with our conversational AI to brainstorm and plan your entire event seamlessly." icon={<MessageSquare className="w-8 h-8 text-primary" />} />
                        <FeatureCard title="Smart Venues" desc="Get tailored venue recommendations matching your budget, location, and guest list." icon={<MapPin className="w-8 h-8 text-secondary" />} />
                        <FeatureCard title="Guided Survey" desc="Quickly outline your needs with an easy 4-step interactive survey process." icon={<CalendarHeart className="w-8 h-8 text-accent" />} />
                        <FeatureCard title="Digital Invites" desc="Create stunning invitations and track real-time RSVP responses visually." icon={<Sparkles className="w-8 h-8 text-primary" />} />
                    </motion.div>
                </div>
            </section>

            <section className="bg-white py-24 px-4">
                <div className="max-w-7xl mx-auto text-center mb-16">
                    <h2 className="text-4xl font-display font-bold text-text-dark mb-4">How It Works</h2>
                </div>
                <div className="max-w-4xl mx-auto relative">
                    <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-gradient-to-r from-primary/30 to-accent/30 -z-0" />
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                        <Step number="1" title="Share Vision" desc="Tell us what you want via survey or AI chat." />
                        <Step number="2" title="Find Venue" desc="Review perfectly matched venue recommendations." />
                        <Step number="3" title="Invite Friends" desc="Send custom digital RSVPs to your guest list." />
                        <Step number="4" title="Celebrate" desc="Enjoy your flawlessly managed event day." />
                    </div>
                </div>
            </section>

            <section className="bg-background py-24 px-4">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-display font-bold text-text-dark mb-12 text-center">Discover Event Ideas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <IdeaCard title="Weddings" img="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800" />
                        <IdeaCard title="Birthdays" img="https://images.unsplash.com/photo-1533227260871-3323087a3cb1?auto=format&fit=crop&q=80&w=800" />
                        <IdeaCard title="Corporate" img="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800" />
                    </div>
                </div>
            </section>
        </motion.div>
    );
}
