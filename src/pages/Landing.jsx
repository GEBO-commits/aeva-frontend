import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Tag } from '../components/ui/Tag';

export default function Landing() {
  const navigate = useNavigate();

  const threeWays = [
    {
      kind: 'Conversation',
      title: 'Just talk it through',
      desc: 'Describe what you want in plain English. AEVA asks the right questions, drafts a plan, and lets you nudge it.',
      icon: 'sparkles',
      cta: 'Plan with AI',
      screen: 'chat',
    },
    {
      kind: 'Survey',
      title: 'Answer 8 quick questions',
      desc: 'Date, vibe, headcount, budget. Two minutes, then we hand you a curated brief.',
      icon: 'wand',
      cta: 'Take the survey',
      screen: 'survey',
    },
    {
      kind: 'Manual',
      title: 'Build it yourself',
      desc: 'You know what you want. Pick a venue, add catering, drop in vendors. We just stay out of your way.',
      icon: 'layers',
      cta: 'Open builder',
      screen: 'builder',
    },
  ];

  const howItWorks = [
    ['01', 'Tell us about it', 'Share the rough idea — date, vibe, headcount.'],
    ['02', 'Get a draft plan', 'AEVA suggests venue, catering, vendors, a timeline.'],
    ['03', 'Refine it', 'Swap, tweak, approve. Changes are saved live.'],
    ['04', 'Invite + run it', 'RSVPs, vendor confirms, day-of timeline — done.'],
  ];

  const stats = [
    ['540+', 'events planned'],
    ['96%', 'rated 5 stars'],
    ['12 min', 'average plan time'],
  ];

  const handleNavigation = (screen) => {
    if (screen === 'chat') navigate('/chat');
    else if (screen === 'survey') navigate('/survey');
    else if (screen === 'builder') navigate('/plan/build');
  };

  return (
    <div style={{ background: 'var(--aeva-paper)' }}>
      {/* ─── HERO ─── */}
      <section style={{ padding: '64px 32px 32px', maxWidth: '1280px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 0.9fr',
            gap: '56px',
            alignItems: 'center',
            minHeight: '560px',
          }}
        >
          {/* Left: copy + CTAs */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: '999px',
                background: 'var(--aeva-paper-warm)',
                border: '1px solid var(--aeva-line)',
                fontSize: '12px',
                color: 'var(--aeva-ink-soft)',
                marginBottom: '32px',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--aeva-ember)',
                  animation: 'aeva-pulse 2s infinite',
                }}
              />
              <span style={{ fontWeight: 500 }}>AI-assisted planning · in private beta</span>
            </div>

            <h1 className="t-display-lg" style={{ marginBottom: '28px' }}>
              Events,<br />
              <span
                style={{
                  fontStyle: 'italic',
                  fontWeight: 320,
                  color: 'var(--aeva-ink-soft)',
                }}
              >
                thoughtfully
              </span>
              <br />
              planned.
            </h1>

            <p className="t-body-lg" style={{ color: 'var(--aeva-ink-soft)', maxWidth: '480px', marginBottom: '36px' }}>
              From a backyard birthday to a 200-person conference — AEVA turns a few sentences into a complete plan, with curated
              venues, vendors, and a day-of timeline.
            </p>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '56px', flexWrap: 'wrap' }}>
              <Button variant="ember" size="lg" onClick={() => handleNavigation('chat')}>
                <Sparkles size={16} /> Plan with AEVA
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => handleNavigation('survey')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                Start with a survey <ArrowRight size={15} />
              </Button>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '32px', paddingTop: '28px', borderTop: '1px solid var(--aeva-line)' }}>
              {stats.map(([num, label]) => (
                <div key={label}>
                  <div className="t-display-xs" style={{ marginBottom: '2px' }}>
                    {num}
                  </div>
                  <div className="t-caption">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: hero images (rotated stack) */}
          <div style={{ position: 'relative', height: '580px' }}>
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 30,
                width: 280,
                height: 360,
                borderRadius: 'var(--r-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)',
                transform: 'rotate(-3deg)',
                background: 'linear-gradient(135deg, var(--aeva-ember-soft) 0%, var(--aeva-sage-soft) 100%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 80,
                right: 0,
                width: 240,
                height: 300,
                borderRadius: 'var(--r-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)',
                transform: 'rotate(4deg)',
                background: 'linear-gradient(135deg, var(--aeva-sage-soft) 0%, var(--aeva-paper-warm) 100%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 80,
                width: 220,
                height: 200,
                borderRadius: 'var(--r-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)',
                transform: 'rotate(-1deg)',
                background: 'linear-gradient(135deg, var(--aeva-paper-warm) 0%, var(--aeva-ember-soft) 100%)',
              }}
            />

            {/* Floating event card */}
            <div
              style={{
                position: 'absolute',
                bottom: 30,
                right: 20,
                width: 240,
                padding: '16px',
                background: 'var(--aeva-canvas)',
                border: '1px solid var(--aeva-line)',
                borderRadius: 'var(--r-md)',
                boxShadow: 'var(--shadow-xl)',
                transform: 'rotate(2deg)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--aeva-ember)',
                  }}
                />
                <span className="t-eyebrow">Plan generated</span>
              </div>
              <div className="t-display-xs" style={{ marginBottom: '6px' }}>
                Maya's 30th
              </div>
              <div style={{ fontSize: '12px', color: 'var(--aeva-ink-mute)', marginBottom: '12px' }}>Sat, Jun 14 · 6 PM · Brooklyn</div>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                <Tag tone="ember" size="sm">
                  Rooftop
                </Tag>
                <Tag size="sm">Italian</Tag>
                <Tag size="sm">DJ</Tag>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── THREE WAYS ─── */}
      <section style={{ padding: '80px 32px', maxWidth: '1280px', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '48px',
            gap: '40px',
          }}
        >
          <div>
            <p className="t-eyebrow" style={{ marginBottom: '12px' }}>
              Three ways to start
            </p>
            <h2 className="t-display-md" style={{ maxWidth: '600px' }}>
              However you think about your event, AEVA meets you there.
            </h2>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {threeWays.map((card, i) => (
            <button
              key={card.kind}
              onClick={() => handleNavigation(card.screen)}
              style={{
                textAlign: 'left',
                padding: '32px',
                background: i === 0 ? 'var(--aeva-ink)' : 'var(--aeva-canvas)',
                color: i === 0 ? 'var(--aeva-paper)' : 'var(--aeva-ink)',
                border: i === 0 ? 'none' : '1px solid var(--aeva-line)',
                borderRadius: 'var(--r-lg)',
                minHeight: '280px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 200ms',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '';
              }}
            >
              <div>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: i === 0 ? 'rgba(250,248,245,0.1)' : 'var(--aeva-paper-warm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '24px',
                    color: i === 0 ? 'var(--aeva-ember)' : 'var(--aeva-ink)',
                  }}
                >
                  <Sparkles size={20} />
                </div>
                <p
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: i === 0 ? 'rgba(250,248,245,0.5)' : 'var(--aeva-ink-mute)',
                    marginBottom: '12px',
                    fontWeight: 600,
                  }}
                >
                  {card.kind}
                </p>
                <h3 className="t-display-sm" style={{ color: 'inherit', marginBottom: '12px' }}>
                  {card.title}
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    color: i === 0 ? 'rgba(250,248,245,0.7)' : 'var(--aeva-ink-soft)',
                    lineHeight: 1.55,
                  }}
                >
                  {card.desc}
                </p>
              </div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  fontWeight: 500,
                  marginTop: '24px',
                  color: i === 0 ? 'var(--aeva-ember)' : 'var(--aeva-ink)',
                }}
              >
                {card.cta} <ArrowRight size={14} />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section
        style={{
          background: 'var(--aeva-paper-deep)',
          padding: '96px 32px',
          borderTop: '1px solid var(--aeva-line)',
          borderBottom: '1px solid var(--aeva-line)',
        }}
      >
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <p className="t-eyebrow" style={{ marginBottom: '12px' }}>
            How it works
          </p>
          <h2 className="t-display-md" style={{ maxWidth: '720px', marginBottom: '64px' }}>
            From idea to invitations in four unhurried steps.
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '24px',
              position: 'relative',
            }}
          >
            <div style={{ position: 'absolute', top: 22, left: 24, right: 24, height: 1, background: 'var(--aeva-line-strong)', zIndex: 0 }} />

            {howItWorks.map(([num, title, desc]) => (
              <div key={num} style={{ position: 'relative', zIndex: 1 }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'var(--aeva-canvas)',
                    border: '1px solid var(--aeva-line-strong)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    color: 'var(--aeva-ink-soft)',
                    marginBottom: '20px',
                  }}
                >
                  {num}
                </div>
                <h3 className="t-display-xs" style={{ marginBottom: '8px' }}>
                  {title}
                </h3>
                <p style={{ fontSize: '13.5px', color: 'var(--aeva-ink-soft)', lineHeight: 1.55 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BIG CTA ─── */}
      <section style={{ padding: '96px 32px', maxWidth: '1080px', margin: '0 auto', textAlign: 'center' }}>
        <h2 className="t-display-lg" style={{ marginBottom: '20px' }}>
          Your next event,
          <br />
          <em style={{ fontWeight: 320, color: 'var(--aeva-ink-soft)' }}>fewer tabs.</em>
        </h2>
        <p className="t-body-lg" style={{ color: 'var(--aeva-ink-soft)', marginBottom: '32px', maxWidth: '540px', margin: '0 auto 32px' }}>
          Tell AEVA what you're celebrating. We'll handle the spreadsheet.
        </p>
        <Button variant="ember" size="lg" onClick={() => handleNavigation('chat')}>
          <Sparkles size={16} /> Start planning
        </Button>
      </section>
    </div>
  );
}
