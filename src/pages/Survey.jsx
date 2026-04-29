import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createEventFromSurvey, saveSurveyResponse } from '../services/planningService';

const steps = ['Basic Info', 'Event Details', 'Preferences', 'Review'];

const surveySchema = z.object({
    fullName: z.string().min(2, "Name is required"),
    gender: z.string().min(1, "Select gender"),
    eventType: z.string().min(1, "Select event type"),
    guestCount: z.string().min(1, "Select guest range"),
    location: z.string().min(2, "Location is required"),
    eventDate: z.string().min(1, "Event date is required").refine(date => new Date(date) > new Date(), "Event date must be in the future"),
    budget: z.number().min(1000, "Budget must be at least 1000 EGP")
});

export default function Survey() {
    const [currentStep, setCurrentStep] = useState(0);
    const navigate = useNavigate();

    const { register, handleSubmit, trigger, watch, formState: { errors } } = useForm({
        resolver: zodResolver(surveySchema),
        defaultValues: { budget: 50000 }
    });

    const formData = watch();

    const handleNext = async () => {
        // Validate current step fields before proceeding
        let fieldsToValidate = [];
        if (currentStep === 0) fieldsToValidate = ['fullName', 'gender'];
        if (currentStep === 1) fieldsToValidate = ['eventType', 'guestCount'];
        if (currentStep === 2) fieldsToValidate = ['location', 'eventDate', 'budget'];

        const isStepValid = await trigger(fieldsToValidate);
        if (isStepValid) setCurrentStep(prev => prev + 1);
    };

    const handlePrev = () => {
        setCurrentStep(prev => prev - 1);
    };

    const onSubmit = async (data) => {
        try {
            // Create event from survey data
            const { event, error: eventError } = await createEventFromSurvey(data);

            if (eventError) {
                console.error('[Survey] Failed to create event:', eventError);
                alert('Failed to create event. Please try again.');
                return;
            }

            // Save survey response (non-blocking; log warn if it fails)
            const { error: responseError } = await saveSurveyResponse(event.id, 'survey_complete', data);

            if (responseError) {
                console.warn('[Survey] Failed to save survey response (continuing anyway):', responseError);
            }

            // Navigate to event plan with eventId in state
            navigate('/event-plan', { state: { eventId: event.id } });
        } catch (err) {
            console.error('[Survey] Unexpected error in onSubmit:', err);
            alert('An unexpected error occurred. Please try again.');
        }
    };

    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto py-10">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">

                {/* Progress Bar */}
                <div className="mb-8 relative">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-primary">Step {currentStep + 1} of {steps.length}</span>
                        <span className="text-sm text-text-muted">{steps[currentStep]}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-primary"
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="min-h-[300px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-6"
                            >
                                {/* Step 0: Basic Info */}
                                {currentStep === 0 && (
                                    <>
                                        <h2 className="text-2xl font-display font-bold text-text-dark mb-4">Let's get to know you</h2>
                                        <div>
                                            <label className="block text-sm font-medium mb-1 ml-1">Full Name</label>
                                            <input {...register('fullName')} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none" placeholder="Enter your name" />
                                            {errors.fullName && <p className="text-accent text-sm mt-1">{errors.fullName.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1 ml-1">Gender</label>
                                            <select {...register('gender')} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none">
                                                <option value="">Select Gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                            </select>
                                            {errors.gender && <p className="text-accent text-sm mt-1">{errors.gender.message}</p>}
                                        </div>
                                    </>
                                )}

                                {/* Step 1: Event Details */}
                                {currentStep === 1 && (
                                    <>
                                        <h2 className="text-2xl font-display font-bold text-text-dark mb-4">What are we celebrating?</h2>
                                        <div>
                                            <label className="block text-sm font-medium mb-1 ml-1">Event Type</label>
                                            <select {...register('eventType')} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none">
                                                <option value="">Select Event</option>
                                                <option value="wedding">Wedding</option>
                                                <option value="birthday">Birthday</option>
                                                <option value="corporate">Corporate Event</option>
                                            </select>
                                            {errors.eventType && <p className="text-accent text-sm mt-1">{errors.eventType.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1 ml-1">Guest Count</label>
                                            <select {...register('guestCount')} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none">
                                                <option value="">Select Size</option>
                                                <option value="10-50">10 - 50</option>
                                                <option value="50-100">50 - 100</option>
                                                <option value="100-300">100 - 300</option>
                                                <option value="300+">300+</option>
                                            </select>
                                            {errors.guestCount && <p className="text-accent text-sm mt-1">{errors.guestCount.message}</p>}
                                        </div>
                                    </>
                                )}

                                {/* Step 2: Preferences */}
                                {currentStep === 2 && (
                                    <>
                                        <h2 className="text-2xl font-display font-bold text-text-dark mb-4">Where and how much?</h2>
                                        <div>
                                            <label className="block text-sm font-medium mb-1 ml-1">Location Preference</label>
                                            <input {...register('location')} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none" placeholder="e.g. Cairo, Giza, Alexandria" />
                                            {errors.location && <p className="text-accent text-sm mt-1">{errors.location.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1 ml-1">Event Date</label>
                                            <input type="date" {...register('eventDate')} min={new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none" />
                                            {errors.eventDate && <p className="text-accent text-sm mt-1">{errors.eventDate.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1 ml-1 flex justify-between">
                                                <span>Budget (EGP)</span>
                                                <span className="text-primary font-bold">{formData.budget?.toLocaleString() || 50000}</span>
                                            </label>
                                            <input type="range" {...register('budget', { valueAsNumber: true })} min="5000" max="500000" step="1000" className="w-full accent-primary h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2" />
                                            {errors.budget && <p className="text-accent text-sm mt-1">{errors.budget.message}</p>}
                                        </div>
                                    </>
                                )}

                                {/* Step 3: Review */}
                                {currentStep === 3 && (
                                    <>
                                        <h2 className="text-2xl font-display font-bold text-text-dark mb-4">Review your details</h2>
                                        <div className="bg-gray-50 p-6 rounded-2xl space-y-3">
                                            <div className="flex justify-between border-b pb-2"><span className="text-text-muted">Name</span><span className="font-medium text-text-dark">{formData.fullName}</span></div>
                                            <div className="flex justify-between border-b pb-2"><span className="text-text-muted">Event</span><span className="font-medium text-text-dark capitalize">{formData.eventType}</span></div>
                                            <div className="flex justify-between border-b pb-2"><span className="text-text-muted">Guests</span><span className="font-medium text-text-dark">{formData.guestCount}</span></div>
                                            <div className="flex justify-between border-b pb-2"><span className="text-text-muted">Location</span><span className="font-medium text-text-dark">{formData.location}</span></div>
                                            <div className="flex justify-between border-b pb-2"><span className="text-text-muted">Event Date</span><span className="font-medium text-text-dark">{formData.eventDate ? new Date(formData.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</span></div>
                                            <div className="flex justify-between"><span className="text-text-muted">Budget</span><span className="font-medium text-text-dark">{formData.budget?.toLocaleString()} EGP</span></div>
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={handlePrev}
                            disabled={currentStep === 0}
                            className="px-6 py-2.5 rounded-full font-semibold text-text-muted hover:bg-gray-100 disabled:opacity-0 transition-all font-sans"
                        >
                            Back
                        </button>

                        {currentStep < steps.length - 1 ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="bg-primary hover:bg-secondary text-white px-8 py-2.5 rounded-full font-bold shadow-md hover:shadow-lg transition-all"
                            >
                                Next Step
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="bg-accent hover:bg-red-500 text-white px-8 py-2.5 rounded-full font-bold shadow-md hover:shadow-lg transition-all"
                            >
                                Get Recommendations
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </motion.div>
    );
}
