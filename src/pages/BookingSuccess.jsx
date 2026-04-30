import React from 'react';
import { motion } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Home } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function BookingSuccess() {
    const location = useLocation();
    const bookingId = location.state?.bookingId;

    const bookingReference = bookingId?.slice(0, 8).toUpperCase() || 'N/A';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '70vh'
            }}
        >
            <div style={{
                background: 'var(--aeva-canvas)',
                padding: '32px',
                borderRadius: 'var(--r-2xl)',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--aeva-line)',
                width: '100%',
                maxWidth: '28rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
            }}>
                {/* Success Icon */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '16px'
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'var(--aeva-sage)',
                        opacity: 0.15,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <CheckCircle className="w-12 h-12" style={{ color: 'var(--aeva-sage)' }} />
                    </div>
                </div>

                {/* Heading */}
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--aeva-ink)', marginBottom: '8px' }}>Your Event is Confirmed!</h1>
                    <p style={{ color: 'var(--aeva-ink-soft)' }}>Your booking has been successfully created and is pending payment.</p>
                </div>

                {/* Booking Reference */}
                <div style={{
                    background: 'var(--aeva-paper-warm)',
                    padding: '24px',
                    borderRadius: 'var(--r-lg)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                }}>
                    <p style={{ fontSize: '14px', color: 'var(--aeva-ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Booking Reference</p>
                    <p style={{ fontSize: '20px', fontFamily: 'monospace', fontWeight: 700, color: 'var(--aeva-ink)' }}>{bookingReference}</p>
                </div>

                {/* Confirmation Message */}
                <div style={{
                    background: 'var(--aeva-paper-warm)',
                    border: '1px solid var(--aeva-line)',
                    borderRadius: 'var(--r-lg)',
                    padding: '16px'
                }}>
                    <p style={{ fontSize: '14px', color: 'var(--aeva-ink)' }}>
                        A confirmation email has been sent to your registered email address. Please check your inbox for booking details and next steps.
                    </p>
                </div>

                {/* Action Button */}
                <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                    <Button variant="primary" size="lg" style={{ width: '100%' }}>
                        <Home className="w-5 h-5" /> Go to Dashboard
                    </Button>
                </Link>
            </div>
        </motion.div>
    );
}
