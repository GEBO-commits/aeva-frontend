import React from 'react';
import { motion } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Home } from 'lucide-react';

export default function BookingSuccess() {
    const location = useLocation();
    const bookingId = location.state?.bookingId;

    const bookingReference = bookingId?.slice(0, 8).toUpperCase() || 'N/A';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex justify-center items-center min-h-[70vh]"
        >
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 w-full max-w-md text-center space-y-6">
                {/* Success Icon */}
                <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                </div>

                {/* Heading */}
                <div>
                    <h1 className="text-3xl font-display font-bold text-primary mb-2">Your Event is Confirmed!</h1>
                    <p className="text-text-muted">Your booking has been successfully created and is pending payment.</p>
                </div>

                {/* Booking Reference */}
                <div className="bg-gray-50 p-6 rounded-2xl space-y-2">
                    <p className="text-sm text-text-muted uppercase tracking-widest">Booking Reference</p>
                    <p className="text-2xl font-mono font-bold text-text-dark">{bookingReference}</p>
                </div>

                {/* Confirmation Message */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm text-blue-900">
                        A confirmation email has been sent to your registered email address. Please check your inbox for booking details and next steps.
                    </p>
                </div>

                {/* Action Button */}
                <Link
                    to="/dashboard"
                    className="flex items-center justify-center gap-2 w-full px-8 py-3 rounded-full font-bold text-white shadow-lg transition-all bg-gradient-to-r from-[#6B3FF3] to-[#a855f7] hover:shadow-purple-300 hover:scale-105"
                >
                    <Home className="w-5 h-5" /> Go to Dashboard
                </Link>
            </div>
        </motion.div>
    );
}
