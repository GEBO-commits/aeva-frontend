import React from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

export default function TermsOfService() {
    const sections = [
        {
            title: "1. Acceptance of Terms",
            body: "By accessing or using AEVA, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use the platform."
        },
        {
            title: "2. Use of the Platform",
            body: "AEVA is an event planning and venue recommendation platform. You agree to use it only for lawful purposes and in a manner consistent with all applicable regulations. You must not use the platform to post false information or impersonate others."
        },
        {
            title: "3. Account Responsibility",
            body: "You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately at support@aeva.app of any unauthorized use of your account."
        },
        {
            title: "4. Payments & Refunds",
            body: "Payments made through AEVA for venue bookings and vendor services are subject to the individual vendor's cancellation and refund policies. AEVA acts as an intermediary and does not directly process payments."
        },
        {
            title: "5. Intellectual Property",
            body: "All content on AEVA, including logos, text, graphics, and AI-generated recommendations, is the property of AEVA or its content suppliers and is protected by intellectual property laws."
        },
        {
            title: "6. Termination",
            body: "We reserve the right to suspend or terminate your account at our sole discretion if you violate these Terms. Upon termination, your right to use the platform will immediately cease."
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 32px', display: 'flex', flexDirection: 'column', gap: '32px' }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <FileText size={32} style={{ color: 'var(--aeva-ink)' }} />
                <h1 style={{ fontSize: '40px', fontWeight: 700, color: 'var(--aeva-ink)', margin: 0 }}>Terms of Service</h1>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--aeva-ink-soft)', margin: 0 }}>Effective: March 2, 2026</p>

            <div style={{
                background: 'var(--aeva-canvas)',
                borderRadius: 'var(--r-2xl)',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--aeva-line)',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                gap: '32px',
                color: 'var(--aeva-ink)'
            }}>
                {sections.map(section => (
                    <div key={section.title}>
                        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', color: 'var(--aeva-ink)', margin: 0 }}>{section.title}</h2>
                        <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--aeva-ink-soft)', margin: 0 }}>{section.body}</p>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
