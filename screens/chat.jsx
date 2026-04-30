/* AEVA — AI Chat with live plan assembly (signature screen) */

const AIChat = ({ onNavigate, tweaks = {} }) => {
  const accent = tweaks.accent || 'var(--aeva-ember)';
  const [messages, setMessages] = React.useState([
    { role: 'ai', text: "Hi — I'm AEVA. Tell me about the event you're planning. A sentence or two is plenty.", t: '10:42 AM' },
    { role: 'user', text: "It's a 30th birthday for my partner. Maya. Around 24 people, mostly close friends. Brooklyn, evening of June 14th. Budget around 4500. We want it to feel intimate but lively — somewhere we can have dinner then dance.", t: '10:43 AM' },
    { role: 'ai', kind: 'thinking', text: 'Reading the brief…', t: '10:43 AM' },
    { role: 'ai', text: "Got it. A warm, dinner-then-dancing 30th in Brooklyn for 24, ~$190/head — that's a comfortable budget for a private space with food and music. I'm drafting a plan now. Tell me if I'm reading the vibe right.", t: '10:43 AM' },
  ]);
  const [input, setInput] = React.useState('');
  const [planStage, setPlanStage] = React.useState(0); // 0..6 for progressive reveal
  const [streaming, setStreaming] = React.useState(false);

  React.useEffect(() => {
    // animate plan items appearing
    if (planStage < 6) {
      const t = setTimeout(() => setPlanStage(s => s + 1), 600);
      return () => clearTimeout(t);
    }
  }, [planStage]);

  const send = () => {
    if (!input.trim()) return;
    setMessages(m => [...m, { role: 'user', text: input, t: 'now' }]);
    setInput('');
    setStreaming(true);
    setTimeout(() => {
      setMessages(m => [...m, { role: 'ai', text: "Noted — I'll lean a touch more toward warm and intimate. Updating the plan.", t: 'now' }]);
      setStreaming(false);
    }, 1400);
  };

  const planItems = [
    { kind: 'venue', title: 'The Wythe Loft', sub: 'Williamsburg · capacity 30 · $1,800', icon: 'building', img: PHOTOS.loft, why: 'Brick + warm lighting, dinner setup that converts to dance floor.' },
    { kind: 'catering', title: 'Sunday Supper Co.', sub: 'Family-style Italian · $48/head', icon: 'utensils', img: PHOTOS.catering, why: 'Pasta course pacing keeps energy social, not seated.' },
    { kind: 'decor', title: 'Petal & Pine', sub: 'Tablescape + candles · $620', icon: 'flower', img: PHOTOS.florist, why: 'Low taper candles match "intimate but lively."' },
    { kind: 'music', title: 'DJ Carmine', sub: 'Disco-leaning set · 4 hrs · $750', icon: 'music', img: PHOTOS.djSet, why: 'Plays the dinner-to-dance arc you described.' },
    { kind: 'photo', title: 'Lou Mendez', sub: 'Documentary · 3 hrs · $580', icon: 'camera', img: PHOTOS.photographer, why: 'Candid style, no posed group shots unless asked.' },
  ];

  const totalSpend = 1800 + 48 * 24 + 620 + 750 + 580;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr', height: 'calc(100vh - 65px)', borderTop: '1px solid var(--aeva-line)' }}>
      {/* CHAT PANEL */}
      <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--aeva-line)', background: 'var(--aeva-paper)' }}>
        {/* chat header */}
        <div style={{ padding: '20px 32px', borderBottom: '1px solid var(--aeva-line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p className="t-eyebrow" style={{ marginBottom: 4 }}>Conversation · planning session</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 480, fontVariationSettings: "'opsz' 36" }}>Maya's 30th</h2>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn btn-quiet btn-sm"><Icon name="share" size={13}/></button>
            <button className="btn btn-quiet btn-sm"><Icon name="moreH" size={14}/></button>
          </div>
        </div>

        {/* messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {messages.map((m, i) => (
            <div key={i} className="aeva-rise" style={{ display: 'flex', gap: 12, flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
              {m.role === 'ai' ? (
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--aeva-ink)', color: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name="sparkles" size={14}/>
                </div>
              ) : (
                <Avatar name="Maya Chen" size={32}/>
              )}
              <div style={{ maxWidth: '78%', minWidth: 0 }}>
                <div style={{ background: m.role === 'user' ? 'var(--aeva-ink)' : 'var(--aeva-canvas)', color: m.role === 'user' ? 'var(--aeva-paper)' : 'var(--aeva-ink)', border: m.role === 'user' ? 'none' : '1px solid var(--aeva-line)', borderRadius: 'var(--r-md)', padding: '12px 16px', fontSize: 14, lineHeight: 1.55 }}>
                  {m.kind === 'thinking' ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--aeva-ink-mute)', fontStyle: 'italic' }}>
                      <span style={{ display: 'inline-flex', gap: 3 }}>
                        {[0, 1, 2].map(d => <span key={d} style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--aeva-ink-mute)', animation: `aeva-pulse 1.2s infinite ${d * 0.2}s` }}/>)}
                      </span>
                      {m.text}
                    </span>
                  ) : m.text}
                </div>
                <div style={{ fontSize: 11, color: 'var(--aeva-ink-mute)', marginTop: 4, fontFamily: 'var(--font-mono)', textAlign: m.role === 'user' ? 'right' : 'left' }}>{m.t}</div>
              </div>
            </div>
          ))}
          {streaming && (
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--aeva-ink)', color: accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="sparkles" size={14}/></div>
              <div style={{ background: 'var(--aeva-canvas)', border: '1px solid var(--aeva-line)', borderRadius: 'var(--r-md)', padding: '12px 16px', display: 'inline-flex', gap: 4 }}>
                {[0, 1, 2].map(d => <span key={d} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--aeva-ink-mute)', animation: `aeva-pulse 1.2s infinite ${d * 0.2}s` }}/>)}
              </div>
            </div>
          )}
        </div>

        {/* suggested follow-ups */}
        <div style={{ padding: '0 32px 12px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['Make it more upscale', 'Add a photographer', 'Vegetarian menu', 'Find cheaper venues'].map(s => (
            <button key={s} onClick={() => setInput(s)} style={{ padding: '7px 12px', fontSize: 12, background: 'var(--aeva-canvas)', border: '1px solid var(--aeva-line)', borderRadius: 999, color: 'var(--aeva-ink-soft)', cursor: 'pointer' }}>{s}</button>
          ))}
        </div>

        {/* input */}
        <div style={{ padding: '12px 32px 24px' }}>
          <div style={{ background: 'var(--aeva-canvas)', border: '1px solid var(--aeva-line)', borderRadius: 'var(--r-md)', padding: 12, display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            <button style={{ background: 'transparent', border: 'none', padding: 6, color: 'var(--aeva-ink-mute)' }}><Icon name="paperclip" size={16}/></button>
            <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }}} placeholder="Reply, ask a question, or paste a link…" style={{ flex: 1, border: 'none', resize: 'none', background: 'transparent', fontFamily: 'inherit', fontSize: 14, outline: 'none', minHeight: 22, lineHeight: 1.5 }} rows="1"/>
            <button style={{ background: 'transparent', border: 'none', padding: 6, color: 'var(--aeva-ink-mute)' }}><Icon name="mic" size={16}/></button>
            <button onClick={send} className="btn btn-ember btn-sm" disabled={!input.trim()}>
              <Icon name="send" size={13}/>
            </button>
          </div>
        </div>
      </div>

      {/* LIVE PLAN PANEL */}
      <div style={{ overflowY: 'auto', background: 'var(--aeva-paper-deep)' }}>
        <div style={{ padding: '24px 36px', borderBottom: '1px solid var(--aeva-line)', position: 'sticky', top: 0, background: 'var(--aeva-paper-deep)', zIndex: 5 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999, background: 'var(--aeva-ember-soft)', border: '1px solid var(--aeva-ember-line)', marginBottom: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: accent, animation: 'aeva-pulse 1.5s infinite' }}/>
                <span style={{ fontSize: 11, color: 'var(--aeva-ember-deep)', fontWeight: 600 }}>Live · drafting plan</span>
              </div>
              <h2 className="t-display-sm">Maya's 30th — June 14, Brooklyn</h2>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => onNavigate('recommendations')}>Continue to catering <Icon name="arrowRight" size={13}/></button>
          </div>
          {/* progress */}
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, height: 4, background: 'var(--aeva-line)', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ width: `${Math.min(100, (planStage / 6) * 100)}%`, height: '100%', background: accent, transition: 'width 500ms ease' }}/>
            </div>
            <span style={{ fontSize: 12, color: 'var(--aeva-ink-mute)', fontFamily: 'var(--font-mono)' }}>{Math.min(planStage, 5)}/5 sourced</span>
          </div>
        </div>

        <div style={{ padding: '24px 36px' }}>
          {/* Brief summary */}
          <div className="aeva-rise" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, padding: 20, background: 'var(--aeva-canvas)', border: '1px solid var(--aeva-line)', borderRadius: 'var(--r-md)', marginBottom: 24 }}>
            {[['Date', 'Sat, Jun 14'], ['Guests', '24'], ['Budget', '$4,500'], ['Vibe', 'Intimate · Lively']].map(([k, v]) => (
              <div key={k}>
                <p className="t-eyebrow" style={{ marginBottom: 4, fontSize: 10 }}>{k}</p>
                <p style={{ fontSize: 13.5, fontWeight: 500 }}>{v}</p>
              </div>
            ))}
          </div>

          <p className="t-eyebrow" style={{ marginBottom: 16 }}>Plan · assembling</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {planItems.map((item, i) => {
              const visible = i < planStage;
              const isStreaming = i === planStage - 1 && i < 5;
              return (
                <div key={item.kind} style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(12px)',
                  transition: 'all 500ms cubic-bezier(0.2, 0.8, 0.2, 1)',
                  background: 'var(--aeva-canvas)', border: `1px solid ${isStreaming ? accent : 'var(--aeva-line)'}`,
                  borderRadius: 'var(--r-md)', padding: 14,
                  display: visible ? 'grid' : 'none',
                  gridTemplateColumns: '64px 1fr auto', gap: 14, alignItems: 'center',
                  boxShadow: isStreaming ? `0 0 0 3px ${accent}22` : 'none'
                }}>
                  <div style={{ width: 64, height: 64, borderRadius: 10, overflow: 'hidden', position: 'relative' }}>
                    <img src={item.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                      <Icon name={item.icon} size={11} style={{ color: 'var(--aeva-ink-mute)' }}/>
                      <span style={{ fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--aeva-ink-mute)', fontWeight: 600 }}>{item.kind}</span>
                    </div>
                    <h3 style={{ fontSize: 14.5, fontWeight: 600, marginBottom: 2 }}>{item.title}</h3>
                    <p style={{ fontSize: 12.5, color: 'var(--aeva-ink-soft)', marginBottom: 4 }}>{item.sub}</p>
                    <p style={{ fontSize: 11.5, color: accent, fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Icon name="sparkles" size={10}/> {item.why}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <button className="btn btn-ghost btn-sm" style={{ padding: '6px 10px', fontSize: 11 }}>Swap</button>
                    <button className="btn btn-quiet btn-sm" style={{ padding: '6px 10px', fontSize: 11 }}>Details</button>
                  </div>
                </div>
              );
            })}
            {planStage < 6 && planStage > 0 && (
              <div style={{ padding: 14, border: '1px dashed var(--aeva-line-strong)', borderRadius: 'var(--r-md)', display: 'flex', alignItems: 'center', gap: 10, color: 'var(--aeva-ink-mute)', fontSize: 12.5 }}>
                <span style={{ display: 'inline-flex', gap: 3 }}>
                  {[0, 1, 2].map(d => <span key={d} style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--aeva-ink-mute)', animation: `aeva-pulse 1.2s infinite ${d * 0.2}s` }}/>)}
                </span>
                Sourcing {['venue', 'catering', 'decor', 'music', 'photographer'][Math.min(planStage, 4)]}…
              </div>
            )}
          </div>

          {/* Total */}
          {planStage >= 6 && (
            <div className="aeva-rise" style={{ marginTop: 24, padding: 20, background: 'var(--aeva-ink)', color: 'var(--aeva-paper)', borderRadius: 'var(--r-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(250,248,245,0.5)', marginBottom: 4, fontWeight: 600 }}>Estimated total</p>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 480, fontVariationSettings: "'opsz' 60" }}>${totalSpend.toLocaleString()}</p>
                <p style={{ fontSize: 12, color: 'rgba(250,248,245,0.6)', marginTop: 2 }}>${Math.round(totalSpend/24)}/head · 9% under budget</p>
              </div>
              <button className="btn btn-ember btn-lg" onClick={() => onNavigate('summary')}>Review & approve <Icon name="arrowRight" size={14}/></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

window.AIChat = AIChat;
