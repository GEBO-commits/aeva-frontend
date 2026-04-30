import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, DollarSign, ArrowLeft, AlertCircle } from 'lucide-react';
import { getEvent } from '../services/planningService';
import { createBooking } from '../services/bookingService';
import { usePlanStore } from '../store/plan.store';
import { Button } from '../components/ui/Button';

export default function BookingConfirmation() {
    const location = useLocation();
    const navigate = useNavigate();
    const eventId = location.state?.eventId;
    const { getTotalCost } = usePlanStore();

    const [event, setEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isConfirming, setIsConfirming] = useState(false);
    const [error, setError] = useState(null);

    const planTotal = getTotalCost();
    const estimatedTotal = planTotal > 0 ? planTotal : (event?.budget_max || 0);

    useEffect(() => {
        const fetchEvent = async () => {
            console.log('[BookingConfirmation] eventId:', eventId);

            if (!eventId) {
                setError('No event ID provided');
                setIsLoading(false);
                return;
            }

            const { event: fetchedEvent, error: fetchError } = await getEvent(eventId);

            if (fetchError) {
                console.error('[BookingConfirmation] Failed to fetch event:', fetchError);
                setError('Failed to load event details');
                setIsLoading(false);
                return;
            }

            setEvent(fetchedEvent);
            setIsLoading(false);
        };

        fetchEvent();
    }, [eventId]);

    const handleConfirmAndPay = async () => {
        setIsConfirming(true);
        setError(null);

        const { booking, error: bookingError } = await createBooking(eventId);

        if (bookingError) {
            console.error('[BookingConfirmation] Failed to create booking:', bookingError);
            setError('Failed to confirm booking. Please try again.');
            setIsConfirming(false);
            return;
        }

        navigate('/booking/success', { state: { bookingId: booking.id } });
    };

    if (isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}
            >
                <div style={{
                    width: '32px',
                    height: '32px',
                    border: '4px solid var(--aeva-line)',
                    borderTop: '4px solid var(--aeva-ink)',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }} />
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ maxWidth: '56rem', margin: '0 auto', padding: '40px 32px 80px' }}
        >
            <div style={{
                background: 'var(--aeva-canvas)',
                padding: '32px',
                borderRadius: 'var(--r-2xl)',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--aeva-line)'
            }}>
                {/* Hero Section */}
                <div style={{
                    background: 'linear-gradient(to bottom right, var(--aeva-ink), var(--aeva-ink-strong))',
                    color: 'var(--aeva-paper)',
                    padding: '24px',
                    borderRadius: 'var(--r-lg)',
                    marginBottom: '32px'
                }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Confirm Your Booking</h1>
                    <p style={{ color: 'rgba(250,248,245,0.8)' }}>Review your event details before confirming</p>
                </div>

                {!eventId ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            background: 'var(--aeva-paper-warm)',
                            border: '1px solid var(--aeva-line)',
                            borderRadius: 'var(--r-lg)',
                            padding: '16px'
                        }}>
                            <AlertCircle className="w-6 h-6" style={{ color: 'var(--aeva-ink)', flexShrink: 0 }} />
                            <div>
                                <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--aeva-ink)', marginBottom: '4px' }}>No event found.</p>
                                <p style={{ fontSize: '14px', color: 'var(--aeva-ink-soft)' }}>Please go back and complete the survey first.</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Button variant="primary" onClick={() => navigate('/survey')}>
                                Back to Survey
                            </Button>
                        </div>
                    </div>
                ) : event ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* Event Details */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                <MapPin className="w-5 h-5" style={{ color: 'var(--aeva-ink)', marginTop: '4px', flexShrink: 0 }} />
                                <div>
                                    <p style={{ fontSize: '14px', color: 'var(--aeva-ink-soft)' }}>Event</p>
                                    <p style={{ fontSize: '18px', fontWeight: 700, color: 'var(--aeva-ink)' }}>{event.title}</p>
                                </div>
                            </div>

                            {event.event_date && (
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                    <Calendar className="w-5 h-5" style={{ color: 'var(--aeva-ink)', marginTop: '4px', flexShrink: 0 }} />
                                    <div>
                                        <p style={{ fontSize: '14px', color: 'var(--aeva-ink-soft)' }}>Event Date</p>
                                        <p style={{ fontSize: '18px', fontWeight: 700, color: 'var(--aeva-ink)' }}>
                                            {new Date(event.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                <DollarSign className="w-5 h-5" style={{ color: 'var(--aeva-ink)', marginTop: '4px', flexShrink: 0 }} />
                                <div>
                                    <p style={{ fontSize: '14px', color: 'var(--aeva-ink-soft)' }}>Estimated Total</p>
                                    <p style={{ fontSize: '18px', fontWeight: 700, color: 'var(--aeva-ink)' }}>{estimatedTotal.toLocaleString()} EGP</p>
                                </div>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div style={{
                                background: 'var(--aeva-paper-warm)',
                                border: '1px solid var(--aeva-line)',
                                borderRadius: 'var(--r-lg)',
                                padding: '16px',
                                color: 'var(--aeva-ink)',
                                fontSize: '14px'
                            }}>
                                {error}
                            </div>
                        )}

                        {/* Terms Note */}
                        <div style={{
                            background: 'var(--aeva-paper-warm)',
                            border: '1px solid var(--aeva-line)',
                            borderRadius: 'var(--r-lg)',
                            padding: '16px'
                        }}>
                            <p style={{ fontSize: '14px', color: 'var(--aeva-ink)' }}>
                                By confirming, you agree to our booking terms. A confirmation email will be sent to your registered email address.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div style={{
                            display: 'flex',
                            gap: '16px',
                            paddingTop: '16px',
                            borderTop: '1px solid var(--aeva-line)'
                        }}>
                            <Button variant="ghost" onClick={() => navigate(-1)} disabled={isConfirming}>
                                <ArrowLeft className="w-4 h-4" /> Back to Plan
                            </Button>
                            <Button variant="primary" size="lg" onClick={handleConfirmAndPay} disabled={isConfirming}>
                                {isConfirming ? 'Confirming...' : 'Confirm and Pay'}
                            </Button>
                        </div>
                    </div>
                ) : !isLoading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            background: 'var(--aeva-paper-warm)',
                            border: '1px solid var(--aeva-line)',
                            borderRadius: 'var(--r-lg)',
                            padding: '16px'
                        }}>
                            <AlertCircle className="w-6 h-6" style={{ color: 'var(--aeva-ink)', flexShrink: 0 }} />
                            <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--aeva-ink)' }}>Could not load event details.</p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Button variant="primary" onClick={() => navigate(-1)}>
                                <ArrowLeft className="w-4 h-4" /> Back to Plan
                            </Button>
                        </div>
                    </div>
                ) : null}
            </div>
        </motion.div>
    );
}
