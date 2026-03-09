/** TermsOfService.jsx — Public page, no auth required */
import React from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

export default function TermsOfService() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto py-12 px-4"
        >
            <div className="flex items-center gap-3 mb-8">
                <FileText className="w-8 h-8 text-primary" />
                <h1 className="text-4xl font-display font-bold text-text-dark">Terms of Service</h1>
            </div>
            <p className="text-text-muted mb-4 text-sm">Effective: March 2, 2026</p>

            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 space-y-8 text-text-dark">
                {[
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
