import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, DollarSign, ArrowLeft } from 'lucide-react';
import { getEvent } from '../services/planningService';
import { createBooking } from '../services/bookingService';

export default function BookingConfirmation() {
    const location = useLocation();
    const navigate = useNavigate();
    const eventId = location.state?.eventId;

    const [event, setEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isConfirming, setIsConfirming] = useState(false);
    const [error, setError] = useState(null);

    const estimatedTotal = 133000;

    useEffect(() => {
        const fetchEvent = async () => {
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
                className="flex justify-center items-center min-h-[70vh]"
            >
                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto py-10"
        >
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                {/* Hero Section */}
                <div className="bg-gradient-to-br from-[#6B3FF3] to-[#a855f7] text-white p-6 rounded-2xl mb-8">
                    <h1 className="text-3xl font-display font-bold mb-2">Confirm Your Booking</h1>
                    <p className="text-white/80">Review your event details before confirming</p>
                </div>

                {event && (
                    <div className="space-y-6">
                        {/* Event Details */}
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                                <div>
                                    <p className="text-sm text-text-muted">Event</p>
                                    <p className="text-lg font-bold text-text-dark">{event.title}</p>
                                </div>
                            </div>

                            {event.event_date && (
                                <div className="flex items-start gap-4">
                                    <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                                    <div>
                                        <p className="text-sm text-text-muted">Event Date</p>
                                        <p className="text-lg font-bold text-text-dark">
                                            {new Date(event.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-start gap-4">
                                <DollarSign className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                                <div>
                                    <p className="text-sm text-text-muted">Estimated Total</p>
                                    <p className="text-lg font-bold text-text-dark">{estimatedTotal.toLocaleString()} EGP</p>
                                </div>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Terms Note */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <p className="text-sm text-blue-900">
                                By confirming, you agree to our booking terms. A confirmation email will be sent to your registered email address.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100">
                            <button
                                onClick={() => navigate(-1)}
                                disabled={isConfirming}
                                className="flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-text-muted hover:bg-gray-100 disabled:opacity-50 transition-all"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back to Plan
                            </button>
                            <button
                                onClick={handleConfirmAndPay}
                                disabled={isConfirming}
                                className="flex items-center justify-center gap-2 px-8 py-3 rounded-full font-bold text-white shadow-lg transition-all bg-gradient-to-r from-[#6B3FF3] to-[#a855f7] hover:shadow-purple-300 hover:scale-105 disabled:opacity-70"
                            >
                                {isConfirming ? (
                                    <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Confirming...</>
                                ) : (
                                    'Confirm and Pay'
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
