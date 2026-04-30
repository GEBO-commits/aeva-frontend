import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Sparkles, Paperclip, Mic } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Tag } from '../components/ui/Tag';
import { Avatar } from '../components/ui/Avatar';

export default function Chat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: "Hi — I'm AEVA. Tell me about the event you're planning. A sentence or two is plenty.",
      t: '10:42 AM',
    },
  ]);
  const [input, setInput] = useState('');
  const [planStage, setPlanStage] = useState(0);
  const [streaming, setStreaming] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (planStage < 6 && messages.length > 1) {
      const timer = setTimeout(() => setPlanStage(s => s + 1), 800);
      return () => clearTimeout(timer);
    }
  }, [planStage, messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage = {
      role: 'user',
      text: input,
      t: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(m => [...m, newMessage]);
    setInput('');
    setStreaming(true);

    setTimeout(() => {
      setMessages(m => [
        ...m,
        {
          role: 'ai',
          text: 'Noted — updating the plan based on your input.',
          t: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setStreaming(false);
    }, 1400);
  };

  const planItems = [
    { kind: 'Venue', title: 'The Wythe Loft', sub: 'Williamsburg · capacity 30 · $1,800', icon: '🏛️' },
    { kind: 'Catering', title: 'Sunday Supper Co.', sub: 'Family-style Italian · $1,152', icon: '🍽️' },
    { kind: 'Decor', title: 'Petal & Pine', sub: 'Tablescape + candles · $620', icon: '🌸' },
    { kind: 'Music', title: 'DJ Carmine', sub: 'Disco-leaning set · 4 hrs · $750', icon: '🎵' },
    { kind: 'Photo', title: 'Lou Mendez', sub: 'Documentary · 3 hrs · $580', icon: '📸' },
  ];

  const totalSpend = 1800 + 1152 + 620 + 750 + 580;
  const budget = 4500;

  const suggestedFollowUps = ['Make it more upscale', 'Add a photographer', 'Vegetarian menu', 'Find cheaper venues'];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.15fr',
        height: 'calc(100vh - 65px)',
        borderTop: '1px solid var(--aeva-line)',
        background: 'var(--aeva-paper)',
      }}
    >
      {/* ─── CHAT PANEL ─── */}
      <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--aeva-line)', background: 'var(--aeva-paper)' }}>
        {/* Header */}
        <div style={{ padding: '20px 32px', borderBottom: '1px solid var(--aeva-line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p className="t-eyebrow" style={{ marginBottom: '4px' }}>
              Conversation · planning session
            </p>
            <h2 className="t-display-xs" style={{ fontVariationSettings: "'opsz' 36" }}>
              Your Event Plan
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button style={{ background: 'transparent', border: 'none', padding: '6px', cursor: 'pointer', color: 'var(--aeva-ink-mute)', transition: 'all 200ms' }} onMouseEnter={e => (e.currentTarget.style.color = 'var(--aeva-ink)')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--aeva-ink-mute)')}>
              ⚙️
            </button>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }} className="aeva-rise">
              {m.role === 'ai' ? (
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--aeva-ink)',
                    color: 'var(--aeva-ember)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Sparkles size={14} />
                </div>
              ) : (
                <Avatar name="You" size="md" />
              )}

              <div style={{ maxWidth: '78%', minWidth: 0 }}>
                <div
                  style={{
                    background: m.role === 'user' ? 'var(--aeva-ink)' : 'var(--aeva-canvas)',
                    color: m.role === 'user' ? 'var(--aeva-paper)' : 'var(--aeva-ink)',
                    border: m.role === 'user' ? 'none' : '1px solid var(--aeva-line)',
                    borderRadius: 'var(--r-md)',
                    padding: '12px 16px',
                    fontSize: '14px',
                    lineHeight: 1.55,
                  }}
                >
                  {m.text}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--aeva-ink-mute)', marginTop: '4px', fontFamily: 'var(--font-mono)', textAlign: m.role === 'user' ? 'right' : 'left' }}>
                  {m.t}
                </div>
              </div>
            </div>
          ))}

          {streaming && (
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--aeva-ink)', color: 'var(--aeva-ember)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={14} />
              </div>
              <div style={{ background: 'var(--aeva-canvas)', border: '1px solid var(--aeva-line)', borderRadius: 'var(--r-md)', padding: '12px 16px', display: 'inline-flex', gap: '4px' }}>
                {[0, 1, 2].map(d => (
                  <span key={d} style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--aeva-ink-mute)', animation: `aeva-pulse 1.2s infinite ${d * 0.2}s` }} />
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested follow-ups */}
        <div style={{ padding: '0 32px 12px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {suggestedFollowUps.map(s => (
            <button
              key={s}
              onClick={() => setInput(s)}
              style={{
                padding: '7px 12px',
                fontSize: '12px',
                background: 'var(--aeva-canvas)',
                border: '1px solid var(--aeva-line)',
                borderRadius: '999px',
                color: 'var(--aeva-ink-soft)',
                cursor: 'pointer',
                transition: 'all 200ms',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--aeva-paper-warm)';
                e.currentTarget.style.borderColor = 'var(--aeva-line-strong)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'var(--aeva-canvas)';
                e.currentTarget.style.borderColor = 'var(--aeva-line)';
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input */}
        <div style={{ padding: '12px 32px 24px' }}>
          <div style={{ background: 'var(--aeva-canvas)', border: '1px solid var(--aeva-line)', borderRadius: 'var(--r-md)', padding: '12px', display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
            <button style={{ background: 'transparent', border: 'none', padding: '6px', color: 'var(--aeva-ink-mute)', cursor: 'pointer' }}>
              <Paperclip size={16} />
            </button>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Reply, ask a question, or paste a link…"
              style={{ flex: 1, border: 'none', resize: 'none', background: 'transparent', fontFamily: 'inherit', fontSize: '14px', outline: 'none', minHeight: '22px', lineHeight: 1.5 }}
              rows="1"
            />
            <button style={{ background: 'transparent', border: 'none', padding: '6px', color: 'var(--aeva-ink-mute)', cursor: 'pointer' }}>
              <Mic size={16} />
            </button>
            <Button variant="ember" size="sm" onClick={handleSend} disabled={!input.trim()} style={{ padding: '8px 12px' }}>
              <Send size={13} />
            </Button>
          </div>
        </div>
      </div>

      {/* ─── LIVE PLAN PANEL ─── */}
      <div style={{ overflowY: 'auto', background: 'var(--aeva-paper-deep)' }}>
        <div style={{ padding: '24px 36px', borderBottom: '1px solid var(--aeva-line)', position: 'sticky', top: 0, background: 'var(--aeva-paper-deep)', zIndex: 5 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '999px', background: 'var(--aeva-ember-soft)', border: '1px solid var(--aeva-ember-line)', marginBottom: '8px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--aeva-ember)', animation: 'aeva-pulse 1.5s infinite' }} />
                <span style={{ fontSize: '11px', color: 'var(--aeva-ember-deep)', fontWeight: 600 }}>Live · drafting plan</span>
              </div>
              <h2 className="t-display-sm">Your Event · June 14, Brooklyn</h2>
            </div>
            <Button variant="primary" size="sm" onClick={() => navigate('/event-plan')}>
              View Full Plan <ArrowRight size={13} />
            </Button>
          </div>

          {/* Progress */}
          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ flex: 1, height: '4px', background: 'var(--aeva-line)', borderRadius: '999px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${Math.min(100, (planStage / 6) * 100)}%`,
                  height: '100%',
                  background: 'var(--aeva-ember)',
                  transition: 'width 500ms ease',
                }}
              />
            </div>
            <span style={{ fontSize: '12px', color: 'var(--aeva-ink-mute)', fontFamily: 'var(--font-mono)' }}>
              {Math.min(planStage, 5)}/5 sourced
            </span>
          </div>
        </div>

        <div style={{ padding: '24px 36px' }}>
          {/* Brief */}
          <div className="aeva-rise" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', padding: '20px', background: 'var(--aeva-canvas)', border: '1px solid var(--aeva-line)', borderRadius: 'var(--r-md)', marginBottom: '24px' }}>
            {[['Date', 'Sat, Jun 14'], ['Guests', '24'], ['Budget', '$4,500'], ['Vibe', 'Intimate']].map(([k, v]) => (
              <div key={k}>
                <p className="t-eyebrow" style={{ marginBottom: '4px', fontSize: '10px' }}>
                  {k}
                </p>
                <p style={{ fontSize: '13.5px', fontWeight: 500 }}>{v}</p>
              </div>
            ))}
          </div>

          <p className="t-eyebrow" style={{ marginBottom: '16px' }}>
            Plan · assembling
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {planItems.map((item, i) => {
              const visible = i < planStage;
              const isStreaming = i === planStage - 1 && i < 5;

              return (
                <div
                  key={item.kind}
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0)' : 'translateY(12px)',
                    transition: 'all 500ms cubic-bezier(0.2, 0.8, 0.2, 1)',
                    background: 'var(--aeva-canvas)',
                    border: `1px solid ${isStreaming ? 'var(--aeva-ember)' : 'var(--aeva-line)'}`,
                    borderRadius: 'var(--r-md)',
                    padding: '14px',
                    display: visible ? 'grid' : 'none',
                    gridTemplateColumns: '64px 1fr auto',
                    gap: '14px',
                    alignItems: 'center',
                    boxShadow: isStreaming ? `0 0 0 3px rgba(212, 89, 58, 0.13)` : 'none',
                  }}
                >
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      background: 'var(--aeva-paper-warm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '32px',
                    }}
                  >
                    {item.icon}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                      <span style={{ fontSize: '10.5px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--aeva-ink-mute)', fontWeight: 600 }}>
                        {item.kind}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '14.5px', fontWeight: 600, marginBottom: '2px' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '12.5px', color: 'var(--aeva-ink-soft)' }}>
                      {item.sub}
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <Button variant="ghost" size="sm" style={{ padding: '6px 10px', fontSize: '11px' }}>
                      Swap
                    </Button>
                    <Button variant="quiet" size="sm" style={{ padding: '6px 10px', fontSize: '11px' }}>
                      Details
                    </Button>
                  </div>
                </div>
              );
            })}

            {planStage < 6 && planStage > 0 && (
              <div style={{ padding: '14px', border: '1px dashed var(--aeva-line-strong)', borderRadius: 'var(--r-md)', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--aeva-ink-mute)', fontSize: '12.5px' }}>
                <span style={{ display: 'inline-flex', gap: '3px' }}>
                  {[0, 1, 2].map(d => (
                    <span key={d} style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--aeva-ink-mute)', animation: `aeva-pulse 1.2s infinite ${d * 0.2}s` }} />
                  ))}
                </span>
                Sourcing...
              </div>
            )}
          </div>

          {/* Total */}
          {planStage >= 6 && (
            <div className="aeva-rise" style={{ marginTop: '24px', padding: '20px', background: 'var(--aeva-ink)', color: 'var(--aeva-paper)', borderRadius: 'var(--r-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(250,248,245,0.5)', marginBottom: '4px', fontWeight: 600 }}>
                  Estimated total
                </p>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 480, fontVariationSettings: "'opsz' 60" }}>
                  ${totalSpend.toLocaleString()}
                </p>
                <p style={{ fontSize: '12px', color: 'rgba(250,248,245,0.6)', marginTop: '2px' }}>
                  ${Math.round(totalSpend / 24)}/head · 9% under budget
                </p>
              </div>
              <Button variant="ember" size="lg" onClick={() => navigate('/booking/confirm')}>
                Review & approve <span>→</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ArrowRight() {
  return <>→</>;
}
