import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, ArrowRight, Check, Sparkles, Building2, UtensilsCrossed, Flower2, Music, Camera } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Tag } from '../components/ui/Tag';
import { createEventFromSurvey, saveSurveyResponse } from '../services/planningService';

const steps = ['The basics', 'The vibe', 'The logistics', 'Your brief'];

const surveySchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  gender: z.string().min(1, 'Select gender'),
  eventType: z.string().min(1, 'Select event type'),
  guestCount: z.string().min(1, 'Select guest range'),
  location: z.string().min(2, 'Location is required'),
  eventDate: z.string().min(1, 'Event date is required').refine(date => new Date(date) > new Date(), 'Event date must be in the future'),
  budget: z.number().min(1000, 'Budget must be at least 1000 EGP'),
  venue_type: z.string().optional(),
  theme: z.string().optional(),
  vibe_summary: z.string().max(150).optional(),
});

export default function Survey() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const { register, handleSubmit, trigger, watch, formState: { errors } } = useForm({
    resolver: zodResolver(surveySchema),
    defaultValues: { budget: 50000 },
  });

  const formData = watch();

  const handleNext = async () => {
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
      const { event, error: eventError } = await createEventFromSurvey(data);

      if (eventError) {
        console.error('[Survey] Failed to create event:', eventError);
        alert('Failed to create event. Please try again.');
        return;
      }

      const { error: responseError } = await saveSurveyResponse(event.id, 'survey_complete', data);
      if (responseError) {
        console.warn('[Survey] Failed to save survey response (continuing anyway):', responseError);
      }

      navigate('/event-plan', { state: { eventId: event.id } });
    } catch (err) {
      console.error('[Survey] Unexpected error in onSubmit:', err);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', padding: '64px 32px', background: 'var(--aeva-paper)' }}>
      {/* Progress indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 56 }}>
        {steps.map((s, i) => (
          <React.Fragment key={s}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: i <= currentStep ? 'var(--aeva-ink)' : 'var(--aeva-canvas)', color: i <= currentStep ? 'var(--aeva-paper)' : 'var(--aeva-ink-mute)', border: i <= currentStep ? 'none' : '1px solid var(--aeva-line-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, transition: 'all 200ms ease' }}>
                {i < currentStep ? <Check size={12} /> : i + 1}
              </div>
              <span style={{ fontSize: 12.5, color: i === currentStep ? 'var(--aeva-ink)' : 'var(--aeva-ink-mute)', fontWeight: i === currentStep ? 600 : 400, transition: 'all 200ms ease' }}>
                {s}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 1, background: i < currentStep ? 'var(--aeva-ink)' : 'var(--aeva-line)', transition: 'all 200ms ease' }}/>
            )}
          </React.Fragment>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ minHeight: 300 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="aeva-rise"
            >
              {/* Step 0: The basics */}
              {currentStep === 0 && (
                <div>
                  <p className="t-eyebrow" style={{ marginBottom: 12 }}>Step 1 of 4</p>
                  <h1 className="t-display-lg" style={{ marginBottom: 12 }}>What are we celebrating?</h1>
                  <p className="t-body-lg" style={{ color: 'var(--aeva-ink-soft)', marginBottom: 40 }}>Pick the closest fit. You can change it later.</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 40 }}>
                    {['Birthday', 'Wedding', 'Corporate', 'Workshop', 'Conference', 'Anniversary', 'Holiday', 'Reunion', 'Other'].map(o => (
                      <button key={o} type="button" onClick={() => {
                        const input = document.querySelector('select[name="eventType"]');
                        if (input) input.value = o.toLowerCase();
                      }} style={{ padding: '20px 16px', borderRadius: 'var(--r-md)', background: formData.eventType === o.toLowerCase() ? 'var(--aeva-ink)' : 'var(--aeva-canvas)', color: formData.eventType === o.toLowerCase() ? 'var(--aeva-paper)' : 'var(--aeva-ink)', border: formData.eventType === o.toLowerCase() ? 'none' : '1px solid var(--aeva-line)', fontSize: 14.5, fontWeight: 500, textAlign: 'left', cursor: 'pointer', transition: 'all 200ms' }} onMouseEnter={e => { if (formData.eventType !== o.toLowerCase()) e.currentTarget.style.borderColor = 'var(--aeva-line-strong)'; }} onMouseLeave={e => { if (formData.eventType !== o.toLowerCase()) e.currentTarget.style.borderColor = 'var(--aeva-line)'; }}>{o}</button>
                    ))}
                  </div>
                  <select {...register('eventType')} style={{ display: 'none' }} onChange={e => {}} />
                  {errors.eventType && <p style={{ color: 'var(--aeva-danger)', fontSize: 14, marginBottom: 20 }}>{errors.eventType.message}</p>}
                  <div style={{ marginBottom: 40 }}>
                    <label className="t-eyebrow" style={{ display: 'block', marginBottom: 12 }}>Whose event is it for?</label>
                    <input className="field" {...register('fullName')} placeholder="A first name, nickname, or company" style={{ width: '100%' }} />
                    {errors.fullName && <p style={{ color: 'var(--aeva-danger)', fontSize: 14, marginTop: 8 }}>{errors.fullName.message}</p>}
                  </div>
                  <div>
                    <label className="t-eyebrow" style={{ display: 'block', marginBottom: 12 }}>Gender (optional)</label>
                    <select {...register('gender')} className="field" style={{ width: '100%' }}>
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    {errors.gender && <p style={{ color: 'var(--aeva-danger)', fontSize: 14, marginTop: 8 }}>{errors.gender.message}</p>}
                  </div>
                </div>
              )}

              {/* Step 1: The vibe */}
              {currentStep === 1 && (
                <div>
                  <p className="t-eyebrow" style={{ marginBottom: 12 }}>Step 2 of 4</p>
                  <h1 className="t-display-lg" style={{ marginBottom: 12 }}>What should it feel like?</h1>
                  <p className="t-body-lg" style={{ color: 'var(--aeva-ink-soft)', marginBottom: 40 }}>Pick a few — these guide the recommendations.</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 40 }}>
                    {['Intimate', 'Lively', 'Elegant', 'Casual', 'Warm', 'Modern', 'Playful', 'Romantic', 'Outdoors', 'Minimal', 'Maximal', 'Quirky', 'Black-tie', 'Daytime'].map(v => (
                      <button key={v} type="button" onClick={() => {}} style={{ padding: '10px 18px', borderRadius: 999, background: 'var(--aeva-canvas)', color: 'var(--aeva-ink-soft)', border: '1px solid var(--aeva-line)', fontSize: 13.5, fontWeight: 500, cursor: 'pointer', transition: 'all 200ms' }} onMouseEnter={e => { e.currentTarget.style.background = 'var(--aeva-ink)'; e.currentTarget.style.color = 'var(--aeva-paper)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'var(--aeva-canvas)'; e.currentTarget.style.color = 'var(--aeva-ink-soft)'; }}>{v}</button>
                    ))}
                  </div>
                  <select {...register('guestCount')} style={{ display: 'none' }}>
                    <option value="">Select Size</option>
                    <option value="10-50">10 - 50</option>
                    <option value="50-100">50 - 100</option>
                    <option value="100-300">100 - 300</option>
                    <option value="300+">300+</option>
                  </select>
                  <div>
                    <label className="t-eyebrow" style={{ display: 'block', marginBottom: 12 }}>How many guests? (approximate)</label>
                    <select {...register('guestCount')} className="field" style={{ width: '100%' }}>
                      <option value="">Select Size</option>
                      <option value="10-50">10 - 50</option>
                      <option value="50-100">50 - 100</option>
                      <option value="100-300">100 - 300</option>
                      <option value="300+">300+</option>
                    </select>
                    {errors.guestCount && <p style={{ color: 'var(--aeva-danger)', fontSize: 14, marginTop: 8 }}>{errors.guestCount.message}</p>}
                  </div>
                </div>
              )}

              {/* Step 2: The logistics */}
              {currentStep === 2 && (
                <div>
                  <p className="t-eyebrow" style={{ marginBottom: 12 }}>Step 3 of 4</p>
                  <h1 className="t-display-lg" style={{ marginBottom: 12 }}>The practical bits.</h1>
                  <p className="t-body-lg" style={{ color: 'var(--aeva-ink-soft)', marginBottom: 40 }}>When, where, how many, and roughly how much.</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
                    <div>
                      <label className="t-eyebrow" style={{ display: 'block', marginBottom: 8 }}>Date</label>
                      <input type="date" {...register('eventDate')} min={new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]} className="field" style={{ width: '100%' }} />
                      {errors.eventDate && <p style={{ color: 'var(--aeva-danger)', fontSize: 12, marginTop: 4 }}>{errors.eventDate.message}</p>}
                    </div>
                    <div>
                      <label className="t-eyebrow" style={{ display: 'block', marginBottom: 8 }}>Time of day</label>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {['Morning', 'Afternoon', 'Evening', 'Late night'].map(t => <button key={t} type="button" style={{ flex: 1, padding: '11px 8px', borderRadius: 'var(--r-sm)', background: 'var(--aeva-canvas)', color: 'var(--aeva-ink-soft)', border: '1px solid var(--aeva-line)', fontSize: 12.5, fontWeight: 500, cursor: 'pointer', transition: 'all 200ms' }} onMouseEnter={e => { e.currentTarget.style.background = 'var(--aeva-ink)'; e.currentTarget.style.color = 'var(--aeva-paper)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'var(--aeva-canvas)'; e.currentTarget.style.color = 'var(--aeva-ink-soft)'; }}>{t}</button>)}
                      </div>
                    </div>
                    <div>
                      <label className="t-eyebrow" style={{ display: 'block', marginBottom: 8 }}>Location</label>
                      <input {...register('location')} placeholder="e.g. Cairo, Giza, Alexandria" className="field" style={{ width: '100%' }} />
                      {errors.location && <p style={{ color: 'var(--aeva-danger)', fontSize: 12, marginTop: 4 }}>{errors.location.message}</p>}
                    </div>
                    <div>
                      <label className="t-eyebrow" style={{ display: 'block', marginBottom: 8 }}>Headcount: <span style={{ color: 'var(--aeva-ink)', fontWeight: 600 }}>{formData.guestCount || '—'}</span></label>
                      <input type="range" min="2" max="300" value={formData.guestCount || 50} onChange={e => {}} style={{ width: '100%' }} />
                    </div>
                  </div>
                  <div style={{ marginBottom: 40 }}>
                    <label className="t-eyebrow" style={{ display: 'block', marginBottom: 8 }}>Budget: <span style={{ color: 'var(--aeva-ink)', fontWeight: 600 }}>{formData.budget?.toLocaleString()} EGP</span></label>
                    <input type="range" {...register('budget', { valueAsNumber: true })} min="5000" max="500000" step="1000" style={{ width: '100%' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--aeva-ink-mute)', marginTop: 6, fontFamily: 'var(--font-mono)' }}>
                      <span>5k</span><span>250k</span><span>500k+</span>
                    </div>
                    {errors.budget && <p style={{ color: 'var(--aeva-danger)', fontSize: 12, marginTop: 8 }}>{errors.budget.message}</p>}
                  </div>
                </div>
              )}

              {/* Step 3: Your brief */}
              {currentStep === 3 && (
                <div>
                  <p className="t-eyebrow" style={{ marginBottom: 12 }}>Step 4 of 4 · The transformation</p>
                  <h1 className="t-display-lg" style={{ marginBottom: 12 }}>Here's your brief.</h1>
                  <p className="t-body-lg" style={{ color: 'var(--aeva-ink-soft)', marginBottom: 32 }}>This is what AEVA will use to draft your plan. Edit anything, or hand it off.</p>
                  <div style={{ background: 'var(--aeva-canvas)', border: '1px solid var(--aeva-line)', borderRadius: 'var(--r-lg)', padding: 40, position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, right: 0, width: 200, height: 200, background: 'radial-gradient(circle at 70% 30%, var(--aeva-ember-soft) 0%, transparent 70%)' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, position: 'relative' }}>
                      <div>
                        <p className="t-eyebrow" style={{ marginBottom: 8 }}>Event Brief · 26.04.30</p>
                        <h2 className="t-display-md" style={{ marginBottom: 4 }}>{formData.fullName}'s {formData.eventType || 'Event'}</h2>
                        <p style={{ fontSize: 13.5, color: 'var(--aeva-ink-soft)' }}>{formData.eventDate} · {formData.location}</p>
                      </div>
                      <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--aeva-paper-warm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Sparkles size={20} style={{ color: 'var(--aeva-ember)' }} />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 32, paddingBottom: 32, borderBottom: '1px solid var(--aeva-line)' }}>
                      <div>
                        <p className="t-eyebrow" style={{ marginBottom: 6 }}>Guests</p>
                        <p className="t-display-xs">{formData.guestCount || '—'}</p>
                      </div>
                      <div>
                        <p className="t-eyebrow" style={{ marginBottom: 6 }}>Budget</p>
                        <p className="t-display-xs">{formData.budget ? `${(formData.budget / 1000).toFixed(1)}k` : '—'} EGP</p>
                      </div>
                      <div>
                        <p className="t-eyebrow" style={{ marginBottom: 6 }}>Per head</p>
                        <p className="t-display-xs">{formData.budget && formData.guestCount ? `~${Math.round(formData.budget / 30)}` : '—'} EGP</p>
                      </div>
                    </div>
                    <div style={{ marginBottom: 24 }}>
                      <p className="t-eyebrow" style={{ marginBottom: 10 }}>What we'll source</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        <Tag><Building2 size={14} style={{ marginRight: 4 }} />Venue</Tag>
                        <Tag><UtensilsCrossed size={14} style={{ marginRight: 4 }} />Catering</Tag>
                        <Tag><Flower2 size={14} style={{ marginRight: 4 }} />Decor</Tag>
                        <Tag><Music size={14} style={{ marginRight: 4 }} />Music</Tag>
                        <Tag><Camera size={14} style={{ marginRight: 4 }} />Photographer</Tag>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 48 }}>
          <Button variant="quiet" onClick={handlePrev} disabled={currentStep === 0} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, opacity: currentStep === 0 ? 0.3 : 1, pointerEvents: currentStep === 0 ? 'none' : 'auto' }}>
            <ChevronLeft size={14} /> {currentStep === 0 ? 'Back to home' : 'Previous'}
          </Button>
          {currentStep < 3 ? (
            <Button variant="primary" size="lg" onClick={handleNext}>
              Continue <ArrowRight size={14} />
            </Button>
          ) : (
            <Button variant="ember" size="lg" type="submit">
              Generate plan <ArrowRight size={14} />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
