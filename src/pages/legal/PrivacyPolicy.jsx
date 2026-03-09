/** PrivacyPolicy.jsx — Public page, no auth required */
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

export default function PrivacyPolicy() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto py-12 px-4"
        >
            <div className="flex items-center gap-3 mb-8">
                <ShieldCheck className="w-8 h-8 text-primary" />
                <h1 className="text-4xl font-display font-bold text-text-dark">Privacy Policy</h1>
            </div>
            <p className="text-text-muted mb-4 text-sm">Last updated: March 2, 2026</p>

            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 space-y-8 text-text-dark">
                {[
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
                ].map(section => (
                    <div key={section.title}>
                        <h2 className="text-xl font-bold mb-3 text-text-dark">{section.title}</h2>
                        <p className="text-text-muted leading-relaxed">{section.body}</p>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
