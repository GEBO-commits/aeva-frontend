import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, DollarSign, ArrowLeft, AlertCircle } from 'lucide-react';
import { getEvent } from '../services/planningService';
import { createBooking } from '../services/bookingService';
import { usePlanStore } from '../store/plan.store';

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

        const { booking, error: bookingError } = await createBooking(eventId, {
            status: 'pending',
            totalAmount: estimatedTotal,
        });

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

                {!eventId ? (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-xl p-4">
                            <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-bold text-orange-900">No event found.</p>
                                <p className="text-sm text-orange-800">Please go back and complete the survey first.</p>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <button
                                onClick={() => navigate('/survey')}
                                className="px-6 py-3 rounded-full font-bold text-white shadow-lg transition-all bg-gradient-to-r from-[#6B3FF3] to-[#a855f7] hover:shadow-purple-300 hover:scale-105"
                            >
                                Back to Survey
                            </button>
                        </div>
                    </div>
                ) : event ? (
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
                ) : !isLoading ? (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
                            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                            <p className="text-sm font-bold text-red-900">Could not load event details.</p>
                        </div>
                        <div className="flex justify-center">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white shadow-lg transition-all bg-gradient-to-r from-[#6B3FF3] to-[#a855f7] hover:shadow-purple-300 hover:scale-105"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back to Plan
                            </button>
                        </div>
                    </div>
                ) : null}
            </div>
        </motion.div>
    );
}
