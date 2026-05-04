import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePlanStore } from '../../store/plan.store';
import { Download, Share2, Mail, ChevronLeft, Sparkles } from 'lucide-react';

export default function PlanSummary() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getTotalCost } = usePlanStore();

  // Mock data matching prototype
  const eventTitle = "Maya turns thirty.";
  const eventSubtitle = "An evening of pasta, candles, and questionable dancing.";
  const eventDate = "Sat, Jun 14";
  const eventTime = "6:00 — 11:00 PM";
  const eventLocation = "The Wythe Loft";
  const eventAddress = "212 Wythe Ave, Brooklyn";
  const totalSpend = 4900;
  const totalCost = getTotalCost() || totalSpend;

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: '40px 32px 80px', background: 'var(--aeva-paper)' }}>
      {/* Top navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 32 }}>
        <button style={{ padding: '8px 12px', borderRadius: 'var(--r-md)', background: 'transparent', border: 'none', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--aeva-ink-soft)', marginLeft: -10 }} onClick={() => navigate('/plan/builder')}>
          <ChevronLeft size={13}/> Back to plan
        </button>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ padding: '8px 12px', borderRadius: 'var(--r-md)', background: 'var(--aeva-canvas)', border: '1px solid var(--aeva-line)', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }} onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--aeva-line-strong)'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--aeva-line)'; }}><Download size={13}/> Download PDF</button>
          <button style={{ padding: '8px 12px', borderRadius: 'var(--r-md)', background: 'var(--aeva-canvas)', border: '1px solid var(--aeva-line)', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }} onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--aeva-line-strong)'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--aeva-line)'; }}><Share2 size={13}/> Share link</button>
          <button style={{ padding: '8px 12px', borderRadius: 'var(--r-md)', background: 'var(--aeva-ember)', color: 'white', border: 'none', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }} onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; }} onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}><Mail size={13}/> Send invitations</button>
        </div>
      </div>

      {/* The shareable event card */}
      <div style={{ background: 'var(--aeva-canvas)', border: '1px solid var(--aeva-line)', borderRadius: 'var(--r-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
        {/* Hero band */}
        <div style={{ position: 'relative', height: 320, overflow: 'hidden', background: 'linear-gradient(135deg, var(--aeva-ember-soft) 0%, var(--aeva-sage-soft) 100%)' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 30%, rgba(26,24,20,0.85) 100%)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 40, color: 'white' }}>
            <p style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.7, marginBottom: 12, fontWeight: 600 }}>Event No. 042 · You're invited</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 64, fontWeight: 380, lineHeight: 0.95, letterSpacing: '-0.03em', marginBottom: 8, fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}>
              {eventTitle}
            </h1>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontStyle: 'italic', fontWeight: 320, opacity: 0.85 }}>
              {eventSubtitle}
            </p>
          </div>
        </div>

        {/* Detail grid */}
        <div style={{ padding: 40 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, paddingBottom: 32, marginBottom: 32, borderBottom: '1px solid var(--aeva-line)' }}>
            {[
              ['When', eventDate, eventTime],
              ['Where', eventLocation, eventAddress],
              ['Dress', 'Smart casual', 'Layers · we\'ll dance'],
              ['Bring', 'Yourself', 'Photos & a song to request']
            ].map(([k, v, sub]) => (
              <div key={k}>
                <p className="t-eyebrow" style={{ marginBottom: 8 }}>{k}</p>
                <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 2 }}>{v}</p>
                <p style={{ fontSize: 12, color: 'var(--aeva-ink-mute)' }}>{sub}</p>
              </div>
            ))}
          </div>

          {/* Schedule & Crew */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginBottom: 32 }}>
            <div>
              <p className="t-eyebrow" style={{ marginBottom: 14 }}>The arc of the night</p>
              {[
                ['6:00', 'Doors + cocktails'],
                ['7:00', 'Family-style dinner'],
                ['8:15', 'Cake & a song'],
                ['8:40', 'DJ set begins'],
                ['11:00', 'Last call']
              ].map(([t, x]) => (
                <div key={t} style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: 16, padding: '8px 0', borderTop: '1px solid var(--aeva-line)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--aeva-ink-mute)' }}>{t} PM</span>
                  <span style={{ fontSize: 14 }}>{x}</span>
                </div>
              ))}
            </div>
            <div>
              <p className="t-eyebrow" style={{ marginBottom: 14 }}>Crew</p>
              {[
                ['Venue', 'The Wythe Loft'],
                ['Catering', 'Sunday Supper Co.'],
                ['Music', 'DJ Carmine'],
                ['Photo', 'Lou Mendez'],
                ['Decor', 'Petal & Pine']
              ].map(([k, n]) => (
                <div key={k} style={{ display: 'grid', gridTemplateColumns: '40px 60px 1fr', gap: 12, padding: '8px 0', borderTop: '1px solid var(--aeva-line)', alignItems: 'center' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: 'linear-gradient(135deg, var(--aeva-ember-soft) 0%, var(--aeva-sage-soft) 100%)', overflow: 'hidden' }} />
                  <span style={{ fontSize: 11, color: 'var(--aeva-ink-mute)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>{k}</span>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{n}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 20, background: 'var(--aeva-paper-warm)', borderRadius: 'var(--r-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--aeva-ink)', color: 'var(--aeva-ember)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={14} />
              </div>
              <div>
                <p style={{ fontSize: 12.5, fontWeight: 600 }}>Planned with AEVA</p>
                <p style={{ fontSize: 11, color: 'var(--aeva-ink-mute)' }}>aeva.events/maya30 · pw: brooklyn</p>
              </div>
            </div>
            <button style={{ padding: '8px 16px', borderRadius: 'var(--r-md)', background: 'var(--aeva-ink)', color: 'var(--aeva-paper)', border: 'none', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }} onClick={() => navigate('/booking/confirm', { state: { eventId: location.state?.eventId } })} onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; }} onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}>
              Lock In This Plan <ChevronLeft size={12} style={{ transform: 'rotate(180deg)' }}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
