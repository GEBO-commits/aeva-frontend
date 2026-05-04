import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ArrowRight, Check, Sparkles, Building2, UtensilsCrossed, Flower2, Music, Camera } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Tag } from '../components/ui/Tag';
import { createEventFromSurvey, saveSurveyResponse } from '../services/planningService';

const steps = ['The basics', 'The vibe', 'The logistics', 'Your brief'];

export default function Survey() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [data, setData] = useState({
    occasion: '',
    name: '',
    gender: '',
    vibe: [],
    date: '',
    time: 'Evening',
    location: '',
    headcount: 24,
    budget: 50000
  });

  const update = (k, v) => setData(prev => ({ ...prev, [k]: v }));
  const toggleVibe = (v) => setData(prev => ({
    ...prev,
    vibe: prev.vibe.includes(v) ? prev.vibe.filter(x => x !== v) : [...prev.vibe, v]
  }));

  // Validation for each step
  const isStepValid = () => {
    if (currentStep === 0) return data.occasion !== '';
    if (currentStep === 1) return data.vibe.length > 0;
    if (currentStep === 2) return data.date !== '' && data.location !== '';
    if (currentStep === 3) return true; // Always allow submit step
    return true;
  };

  const handleNext = () => {
    if (isStepValid()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1);
  };

  const onSubmit = async () => {
    if (!isStepValid()) return;

    try {
      setIsSubmitting(true);

      // Map data to createEventFromSurvey expected shape
      const surveyPayload = {
        fullName: data.name,
        gender: data.gender || null,
        eventType: data.occasion.toLowerCase(),
        guestCount: String(data.headcount),
        location: data.location,
        eventDate: data.date,
        budget: data.budget
      };

      const { event, error: eventError } = await createEventFromSurvey(surveyPayload);

      if (eventError) {
        console.error('[Survey] Failed to create event:', eventError);
        alert('Failed to create event. Please try again.');
        setIsSubmitting(false);
        return;
      }

      const { error: responseError } = await saveSurveyResponse(event.id, 'survey_complete', data);
      if (responseError) {
        console.warn('[Survey] Failed to save survey response (continuing anyway):', responseError);
      }

      setIsSubmitting(false);
      navigate('/event-plan', { state: { eventId: event.id } });
    } catch (err) {
      console.error('[Survey] Unexpected error in onSubmit:', err);
      alert('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
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
                    <button
                      key={o}
                      type="button"
                      onClick={() => update('occasion', o)}
                      style={{
                        padding: '20px 16px',
                        borderRadius: 'var(--r-md)',
                        background: data.occasion === o ? 'var(--aeva-ink)' : 'var(--aeva-canvas)',
                        color: data.occasion === o ? 'var(--aeva-paper)' : 'var(--aeva-ink)',
                        border: data.occasion === o ? 'none' : '1px solid var(--aeva-line)',
                        fontSize: 14.5,
                        fontWeight: 500,
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 200ms'
                      }}
                      onMouseEnter={e => { if (data.occasion !== o) e.currentTarget.style.borderColor = 'var(--aeva-line-strong)'; }}
                      onMouseLeave={e => { if (data.occasion !== o) e.currentTarget.style.borderColor = 'var(--aeva-line)'; }}
                    >
                      {o}
                    </button>
                  ))}
                </div>
                <div style={{ marginBottom: 40 }}>
                  <label className="t-eyebrow" style={{ display: 'block', marginBottom: 12 }}>Whose event is it for?</label>
                  <input
                    className="field"
                    value={data.name}
                    onChange={e => update('name', e.target.value)}
                    placeholder="A first name, nickname, or company"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label className="t-eyebrow" style={{ display: 'block', marginBottom: 12 }}>Gender (optional)</label>
                  <select
                    className="field"
                    value={data.gender}
                    onChange={e => update('gender', e.target.value)}
                    style={{ width: '100%' }}
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
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
                    <button
                      key={v}
                      type="button"
                      onClick={() => toggleVibe(v)}
                      style={{
                        padding: '10px 18px',
                        borderRadius: 999,
                        background: data.vibe.includes(v) ? 'var(--aeva-ink)' : 'var(--aeva-canvas)',
                        color: data.vibe.includes(v) ? 'var(--aeva-paper)' : 'var(--aeva-ink-soft)',
                        border: data.vibe.includes(v) ? 'none' : '1px solid var(--aeva-line)',
                        fontSize: 13.5,
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 200ms',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                      onMouseEnter={e => { if (!data.vibe.includes(v)) { e.currentTarget.style.borderColor = 'var(--aeva-line-strong)'; } }}
                      onMouseLeave={e => { if (!data.vibe.includes(v)) { e.currentTarget.style.borderColor = 'var(--aeva-line)'; } }}
                    >
                      {data.vibe.includes(v) && <Check size={12} />}
                      {v}
                    </button>
                  ))}
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
                    <input
                      type="date"
                      className="field"
                      value={data.date}
                      onChange={e => update('date', e.target.value)}
                      min={new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label className="t-eyebrow" style={{ display: 'block', marginBottom: 8 }}>Time of day</label>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {['Morning', 'Afternoon', 'Evening', 'Late night'].map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => update('time', t)}
                          style={{
                            flex: 1,
                            padding: '11px 8px',
                            borderRadius: 'var(--r-sm)',
                            background: data.time === t ? 'var(--aeva-ink)' : 'var(--aeva-canvas)',
                            color: data.time === t ? 'var(--aeva-paper)' : 'var(--aeva-ink-soft)',
                            border: data.time === t ? 'none' : '1px solid var(--aeva-line)',
                            fontSize: 12.5,
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'all 200ms'
                          }}
                          onMouseEnter={e => { if (data.time !== t) e.currentTarget.style.borderColor = 'var(--aeva-line-strong)'; }}
                          onMouseLeave={e => { if (data.time !== t) e.currentTarget.style.borderColor = 'var(--aeva-line)'; }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="t-eyebrow" style={{ display: 'block', marginBottom: 8 }}>Location</label>
                    <input
                      className="field"
                      value={data.location}
                      onChange={e => update('location', e.target.value)}
                      placeholder="e.g. Cairo, Giza, Alexandria"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label className="t-eyebrow" style={{ display: 'block', marginBottom: 8 }}>Headcount: <span style={{ color: 'var(--aeva-ink)', fontWeight: 600 }}>{data.headcount}</span></label>
                    <input
                      type="range"
                      min="2"
                      max="300"
                      value={data.headcount}
                      onChange={e => update('headcount', parseInt(e.target.value))}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
                <div style={{ marginBottom: 40 }}>
                  <label className="t-eyebrow" style={{ display: 'block', marginBottom: 8 }}>Budget: <span style={{ color: 'var(--aeva-ink)', fontWeight: 600 }}>{data.budget.toLocaleString()} EGP</span></label>
                  <input
                    type="range"
                    min="5000"
                    max="500000"
                    step="1000"
                    value={data.budget}
                    onChange={e => update('budget', parseInt(e.target.value))}
                    style={{ width: '100%' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--aeva-ink-mute)', marginTop: 6, fontFamily: 'var(--font-mono)' }}>
                    <span>5k</span><span>250k</span><span>500k+</span>
                  </div>
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
                      <h2 className="t-display-md" style={{ marginBottom: 4 }}>{data.name}'s {data.occasion}</h2>
                      <p style={{ fontSize: 13.5, color: 'var(--aeva-ink-soft)' }}>{data.date} · {data.time} · {data.location}</p>
                    </div>
                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--aeva-paper-warm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Sparkles size={20} style={{ color: 'var(--aeva-ember)' }} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 32, paddingBottom: 32, borderBottom: '1px solid var(--aeva-line)' }}>
                    <div>
                      <p className="t-eyebrow" style={{ marginBottom: 6 }}>Guests</p>
                      <p className="t-display-xs">{data.headcount}</p>
                    </div>
                    <div>
                      <p className="t-eyebrow" style={{ marginBottom: 6 }}>Budget</p>
                      <p className="t-display-xs">{(data.budget / 1000).toFixed(1)}k EGP</p>
                    </div>
                    <div>
                      <p className="t-eyebrow" style={{ marginBottom: 6 }}>Per head</p>
                      <p className="t-display-xs">~{Math.round(data.budget / data.headcount)} EGP</p>
                    </div>
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <p className="t-eyebrow" style={{ marginBottom: 10 }}>The vibe</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {data.vibe.map(v => (
                        <Tag key={v} tone="ember">{v}</Tag>
                      ))}
                    </div>
                  </div>
                  <div>
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
        <Button
          variant="quiet"
          onClick={handlePrev}
          disabled={currentStep === 0}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, opacity: currentStep === 0 ? 0.3 : 1, pointerEvents: currentStep === 0 ? 'none' : 'auto' }}
        >
          <ChevronLeft size={14} /> {currentStep === 0 ? 'Back to home' : 'Previous'}
        </Button>
        {currentStep < 3 ? (
          <Button
            variant="primary"
            size="lg"
            onClick={handleNext}
            disabled={!isStepValid()}
            style={{ opacity: isStepValid() ? 1 : 0.5, pointerEvents: isStepValid() ? 'auto' : 'none' }}
          >
            Continue <ArrowRight size={14} />
          </Button>
        ) : (
          <Button
            variant="ember"
            size="lg"
            onClick={onSubmit}
            disabled={isSubmitting}
            style={{ opacity: isSubmitting ? 0.7 : 1, pointerEvents: isSubmitting ? 'none' : 'auto' }}
          >
            {isSubmitting ? 'Generating...' : 'Generate plan'} <ArrowRight size={14} />
          </Button>
        )}
      </div>
    </div>
  );
}
