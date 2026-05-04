import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

export default function PrivacyPolicy() {
    const sections = [
        {
            title: "1. Information We Collect",
            body: "We collect information you provide when you register for an account, fill out a survey, or communicate with us. This includes name, email address, event preferences, and usage data generated when you interact with our platform."
        },
        {
            title: "2. How We Use Your Information",
            body: "We use your information to provide and improve our services, recommend venues and vendors, send event-related communications, and analyze usage patterns to enhance your experience."
        },
        {
            title: "3. Data Sharing",
            body: "We do not sell your personal data. We may share limited data with venue partners and vendors only for the purpose of fulfilling your event planning requests, and only with your consent."
        },
        {
            title: "4. Data Security",
            body: "We implement industry-standard security measures to protect your data. All data transmissions are encrypted using SSL. Access to personal data is restricted to authorized personnel only."
        },
        {
            title: "5. Your Rights",
            body: "You have the right to access, correct, or delete your personal data at any time. To do so, contact us at privacy@aeva.app. We will process your request within 30 days."
        },
        {
            title: "6. Contact Us",
            body: "If you have any questions about this Privacy Policy, please contact our Data Protection Officer at privacy@aeva.app or write to us at AEVA Headquarters, Cairo, Egypt."
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 32px', display: 'flex', flexDirection: 'column', gap: '32px' }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <ShieldCheck size={32} style={{ color: 'var(--aeva-sage)' }} />
                <h1 style={{ fontSize: '40px', fontWeight: 700, color: 'var(--aeva-ink)', margin: 0 }}>Privacy Policy</h1>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--aeva-ink-soft)', margin: 0 }}>Last updated: March 2, 2026</p>

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
