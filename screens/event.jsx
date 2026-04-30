/* AEVA — Event Detail (post-plan, pre-event hub) */

const EventDetail = ({ onNavigate, tweaks = {} }) => {
  const accent = tweaks.accent || 'var(--aeva-ember)';
  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 32px 80px' }}>
      {/* Hero */}
      <div style={{ position: 'relative', height: 280, borderRadius: 'var(--r-lg)', overflow: 'hidden', marginBottom: 32 }}>
        <img src={PHOTOS.loft} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 30%, rgba(26,24,20,0.85) 100%)' }}/>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 32, color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <p style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.7, marginBottom: 8, fontWeight: 600 }}>Event No. 042 · 10 days out</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 56, fontWeight: 380, lineHeight: 0.95, fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}>Maya's 30th</h1>
            <p style={{ fontSize: 14, marginTop: 8, opacity: 0.85 }}>Sat, Jun 14 · The Wythe Loft, Brooklyn</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost btn-sm" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}><Icon name="share" size={13}/> Share</button>
            <button className="btn btn-ember btn-sm">Edit plan</button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32 }}>
        <div>
          {/* Status row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 32 }}>
            {[
              ['Days to go', '10', accent],
              ['RSVPs', '18/24', 'var(--aeva-sage)'],
              ['Vendors confirmed', '4/5', 'var(--aeva-ink)'],
              ['Tasks open', '3', 'var(--aeva-warning)'],
            ].map(([k, v, c]) => (
              <div key={k} style={{ padding: 18, background: 'var(--aeva-canvas)', border: '1px solid var(--aeva-line)', borderRadius: 'var(--r-md)' }}>
                <p className="t-eyebrow" style={{ marginBottom: 8 }}>{k}</p>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 460, fontVariationSettings: "'opsz' 60", color: c }}>{v}</p>
              </div>
            ))}
          </div>

          {/* Timeline preview */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <p className="t-eyebrow">Day-of timeline</p>
              <button className="btn btn-quiet btn-sm" onClick={() => onNavigate('builder')}>Edit <Icon name="arrowRight" size={12}/></button>
            </div>
            <div style={{ background: 'var(--aeva-canvas)', border: '1px solid var(--aeva-line)', borderRadius: 'var(--r-md)', padding: 20 }}>
              {[
                ['6:00 PM', 'Doors + cocktails', '45 min'],
                ['6:45 PM', 'Toast', '15 min'],
                ['7:00 PM', 'Family-style dinner', '75 min'],
                ['8:15 PM', 'Cake & a song', '25 min'],
                ['8:40 PM', 'DJ set', '2h 20m'],
              ].map(([t, x, d], i) => (
                <div key={t} style={{ display: 'grid', gridTemplateColumns: '70px 1fr auto', gap: 16, padding: '10px 0', borderTop: i > 0 ? '1px solid var(--aeva-line)' : 'none' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--aeva-ink-soft)', fontWeight: 500 }}>{t}</span>
                  <span style={{ fontSize: 13.5 }}>{x}</span>
                  <span style={{ fontSize: 11.5, color: 'var(--aeva-ink-mute)' }}>{d}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity */}
          <div>
            <p className="t-eyebrow" style={{ marginBottom: 14 }}>Recent activity</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                ['DJ Carmine confirmed the set list', '2h ago', 'check'],
                ['Sara Cohen RSVP\'d yes', '4h ago', 'mail'],
                ['AEVA suggested adding a coat check', '1d ago', 'sparkles'],
                ['Petal & Pine sent decor mockups', '2d ago', 'flower'],
              ].map(([t, when, ic], i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'var(--aeva-canvas)', border: '1px solid var(--aeva-line)', borderRadius: 'var(--r-sm)' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--aeva-paper-warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: ic === 'sparkles' ? accent : 'var(--aeva-ink-soft)' }}>
                    <Icon name={ic} size={13}/>
                  </div>
                  <span style={{ flex: 1, fontSize: 13.5 }}>{t}</span>
                  <span style={{ fontSize: 11.5, color: 'var(--aeva-ink-mute)', fontFamily: 'var(--font-mono)' }}>{when}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
            <button className="btn btn-primary" onClick={() => onNavigate('guests')} style={{ justifyContent: 'space-between' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Icon name="users" size={14}/> Guest list</span>
              <Icon name="arrowRight" size={13}/>
            </button>
            <button className="btn btn-ghost" onClick={() => onNavigate('summary')} style={{ justifyContent: 'space-between' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Icon name="mail" size={14}/> Invitation card</span>
              <Icon name="arrowRight" size={13}/>
            </button>
            <button className="btn btn-ghost" style={{ justifyContent: 'space-between' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Icon name="building" size={14}/> Vendor inbox</span>
              <Tag size="sm" tone="ember">2 new</Tag>
            </button>
          </div>

          {/* Vendors */}
          <p className="t-eyebrow" style={{ marginBottom: 12 }}>Crew</p>
          <div style={{ background: 'var(--aeva-canvas)', border: '1px solid var(--aeva-line)', borderRadius: 'var(--r-md)', padding: 6, marginBottom: 24 }}>
            {[
              ['Venue', 'The Wythe Loft', 'confirmed'],
              ['Catering', 'Sunday Supper Co.', 'confirmed'],
              ['Music', 'DJ Carmine', 'confirmed'],
              ['Decor', 'Petal & Pine', 'pending'],
              ['Photo', 'Lou Mendez', 'confirmed'],
            ].map(([k, n, s], i) => (
              <div key={k} style={{ display: 'grid', gridTemplateColumns: '60px 1fr auto', gap: 10, padding: '10px 12px', alignItems: 'center', borderBottom: i < 4 ? '1px solid var(--aeva-line)' : 'none' }}>
                <span style={{ fontSize: 11, color: 'var(--aeva-ink-mute)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>{k}</span>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{n}</span>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: s === 'confirmed' ? 'var(--aeva-sage)' : 'var(--aeva-warning)' }}/>
              </div>
            ))}
          </div>

          {/* AEVA assistant card */}
          <div style={{ padding: 18, background: 'var(--aeva-ink)', color: 'var(--aeva-paper)', borderRadius: 'var(--r-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Icon name="sparkles" size={14} style={{ color: accent }}/>
              <span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.7, fontWeight: 600 }}>AEVA</span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.55, marginBottom: 12 }}>"Want me to draft a final reminder text for the 6 still-pending guests?"</p>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn btn-ember btn-sm" style={{ flex: 1 }}>Yes, draft it</button>
              <button className="btn btn-quiet btn-sm" style={{ background: 'rgba(250,248,245,0.1)', color: 'var(--aeva-paper)', borderColor: 'rgba(250,248,245,0.2)' }}>Not now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

window.EventDetail = EventDetail;
