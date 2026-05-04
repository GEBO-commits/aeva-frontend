/* AEVA — Landing page */

const Landing = ({ onNavigate, tweaks = {} }) => {
  const accent = tweaks.accent || 'var(--aeva-ember)';

  return (
    <div>
      {/* HERO — editorial split */}
      <section style={{ padding: '64px 32px 32px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 56, alignItems: 'center', minHeight: 560 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 999, background: 'var(--aeva-paper-warm)', border: '1px solid var(--aeva-line)', fontSize: 12, color: 'var(--aeva-ink-soft)', marginBottom: 32 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: accent, animation: 'aeva-pulse 2s infinite' }}/>
              <span style={{ fontWeight: 500 }}>AI-assisted planning · in private beta</span>
            </div>
            <h1 className="t-display-xl" style={{ marginBottom: 28 }}>
              Events,<br/>
              <span style={{ fontStyle: 'italic', fontWeight: 320, color: 'var(--aeva-ink-soft)' }}>thoughtfully</span><br/>
              planned.
            </h1>
            <p className="t-body-lg" style={{ color: 'var(--aeva-ink-soft)', maxWidth: 480, marginBottom: 36 }}>
              From a backyard birthday to a 200-person conference — AEVA turns a few sentences into a complete plan, with curated venues, vendors, and a day-of timeline.
            </p>
            <div style={{ display: 'flex', gap: 12, marginBottom: 56 }}>
              <button className="btn btn-ember btn-lg" onClick={() => onNavigate('chat')}>
                <Icon name="sparkles" size={16}/> Plan with AEVA
              </button>
              <button className="btn btn-ghost btn-lg" onClick={() => onNavigate('survey')}>
                Start with a survey <Icon name="arrowRight" size={15}/>
              </button>
            </div>
            <div style={{ display: 'flex', gap: 32, paddingTop: 28, borderTop: '1px solid var(--aeva-line)' }}>
              {[
                ['540+', 'events planned'],
                ['96%', 'rated 5 stars'],
                ['12 min', 'average plan time'],
              ].map(([n, l]) => (
                <div key={l}>
                  <div className="t-display-xs" style={{ marginBottom: 2 }}>{n}</div>
                  <div className="t-caption">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: 'relative', height: 580 }}>
            <div style={{ position: 'absolute', top: 0, left: 30, width: 280, height: 360, borderRadius: 'var(--r-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', transform: 'rotate(-3deg)' }}>
              <img src={PHOTOS.weddingTable} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
            </div>
            <div style={{ position: 'absolute', top: 80, right: 0, width: 240, height: 300, borderRadius: 'var(--r-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', transform: 'rotate(4deg)' }}>
              <img src={PHOTOS.partyLights} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
            </div>
            <div style={{ position: 'absolute', bottom: 0, left: 80, width: 220, height: 200, borderRadius: 'var(--r-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', transform: 'rotate(-1deg)' }}>
              <img src={PHOTOS.rooftop} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
            </div>
            {/* Floating event-card */}
            <div style={{ position: 'absolute', bottom: 30, right: 20, width: 240, padding: 16, background: 'var(--aeva-canvas)', border: '1px solid var(--aeva-line)', borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-xl)', transform: 'rotate(2deg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: accent }}/>
                <span className="t-eyebrow">Plan generated</span>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 460, marginBottom: 6, fontVariationSettings: "'opsz' 36" }}>Maya's 30th</div>
              <div style={{ fontSize: 12, color: 'var(--aeva-ink-mute)', marginBottom: 12 }}>Sat, Jun 14 · 6 PM · Brooklyn</div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                <Tag size="sm" tone="ember">Rooftop</Tag>
                <Tag size="sm">Italian</Tag>
                <Tag size="sm">DJ</Tag>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THREE WAYS section */}
      <section style={{ padding: '80px 32px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, gap: 40 }}>
          <div>
            <p className="t-eyebrow" style={{ marginBottom: 12 }}>Three ways to start</p>
            <h2 className="t-display-md" style={{ maxWidth: 600 }}>However you think about your event, AEVA meets you there.</h2>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {[
            { kind: 'Conversation', title: 'Just talk it through', desc: 'Describe what you want in plain English. AEVA asks the right questions, drafts a plan, and lets you nudge it.', icon: 'chat', cta: 'Plan with AI', screen: 'chat' },
            { kind: 'Survey', title: 'Answer 8 quick questions', desc: 'Date, vibe, headcount, budget. Two minutes, then we hand you a curated brief.', icon: 'wand', cta: 'Take the survey', screen: 'survey' },
            { kind: 'Manual', title: 'Build it yourself', desc: 'You know what you want. Pick a venue, add catering, drop in vendors. We just stay out of your way.', icon: 'layers', cta: 'Open builder', screen: 'builder' },
          ].map((card, i) => (
            <button key={card.kind} onClick={() => onNavigate(card.screen)} style={{ textAlign: 'left', padding: 32, background: i === 0 ? 'var(--aeva-ink)' : 'var(--aeva-canvas)', color: i === 0 ? 'var(--aeva-paper)' : 'var(--aeva-ink)', border: i === 0 ? 'none' : '1px solid var(--aeva-line)', borderRadius: 'var(--r-lg)', minHeight: 280, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer', transition: 'all 200ms' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
              <div>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: i === 0 ? 'rgba(250,248,245,0.1)' : 'var(--aeva-paper-warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, color: i === 0 ? accent : 'var(--aeva-ink)' }}>
                  <Icon name={card.icon} size={20}/>
                </div>
                <p style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: i === 0 ? 'rgba(250,248,245,0.5)' : 'var(--aeva-ink-mute)', marginBottom: 12, fontWeight: 600 }}>{card.kind}</p>
                <h3 className="t-display-sm" style={{ color: 'inherit', marginBottom: 12 }}>{card.title}</h3>
                <p style={{ fontSize: 14, color: i === 0 ? 'rgba(250,248,245,0.7)' : 'var(--aeva-ink-soft)', lineHeight: 1.55 }}>{card.desc}</p>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, marginTop: 24, color: i === 0 ? accent : 'var(--aeva-ink)' }}>
                {card.cta} <Icon name="arrowRight" size={14}/>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* FEATURED INSPIRATION */}
      <section style={{ padding: '40px 32px 80px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
          <h2 className="t-display-md">Recently planned</h2>
          <button className="btn btn-quiet btn-sm">Browse all <Icon name="arrowRight" size={13}/></button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 16 }}>
          {[
            { img: PHOTOS.vineyard, title: 'A vineyard wedding for 80', meta: 'Sonoma · Sep 2026', tone: 'Wedding · Outdoor · Intimate' },
            { img: PHOTOS.warehouse, title: '"Future of Fintech" summit', meta: 'NYC · Apr 2026', tone: 'Corporate · 220 guests' },
            { img: PHOTOS.birthdayCake, title: 'Theo turns 6', meta: 'Brooklyn · Mar 2026', tone: 'Birthday · Cozy' },
          ].map((c, i) => (
            <div key={i} style={{ position: 'relative', height: i === 0 ? 420 : 200, gridRow: i === 0 ? 'span 2' : 'auto', borderRadius: 'var(--r-lg)', overflow: 'hidden', cursor: 'pointer' }}>
              <img src={c.img} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 600ms' }}/>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(26,24,20,0.7) 100%)' }}/>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, color: 'white' }}>
                <p style={{ fontSize: 10.5, letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.7, marginBottom: 6, fontWeight: 600 }}>{c.tone}</p>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: i === 0 ? 28 : 18, fontWeight: 460, lineHeight: 1.15, marginBottom: 4 }}>{c.title}</h3>
                <p style={{ fontSize: 12, opacity: 0.75 }}>{c.meta}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS — minimal */}
      <section style={{ background: 'var(--aeva-paper-deep)', padding: '96px 32px', borderTop: '1px solid var(--aeva-line)', borderBottom: '1px solid var(--aeva-line)' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <p className="t-eyebrow" style={{ marginBottom: 12 }}>How it works</p>
          <h2 className="t-display-md" style={{ maxWidth: 720, marginBottom: 64 }}>From idea to invitations in four unhurried steps.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 22, left: 24, right: 24, height: 1, background: 'var(--aeva-line-strong)', zIndex: 0 }}/>
            {[
              ['01', 'Tell us about it', 'Share the rough idea — date, vibe, headcount.'],
              ['02', 'Get a draft plan', 'AEVA suggests venue, catering, vendors, a timeline.'],
              ['03', 'Refine it', 'Swap, tweak, approve. Changes are saved live.'],
              ['04', 'Invite + run it', 'RSVPs, vendor confirms, day-of timeline — done.'],
            ].map(([n, t, d]) => (
              <div key={n} style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--aeva-canvas)', border: '1px solid var(--aeva-line-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--aeva-ink-soft)', marginBottom: 20 }}>{n}</div>
                <h3 className="t-display-xs" style={{ marginBottom: 8 }}>{t}</h3>
                <p style={{ fontSize: 13.5, color: 'var(--aeva-ink-soft)', lineHeight: 1.55 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BIG CTA */}
      <section style={{ padding: '96px 32px', maxWidth: 1080, margin: '0 auto', textAlign: 'center' }}>
        <h2 className="t-display-lg" style={{ marginBottom: 20 }}>Your next event,<br/><em style={{ fontWeight: 320, color: 'var(--aeva-ink-soft)' }}>fewer tabs.</em></h2>
        <p className="t-body-lg" style={{ color: 'var(--aeva-ink-soft)', marginBottom: 32, maxWidth: 540, margin: '0 auto 32px' }}>Tell AEVA what you're celebrating. We'll handle the spreadsheet.</p>
        <button className="btn btn-ember btn-lg" onClick={() => onNavigate('chat')}>
          <Icon name="sparkles" size={16}/> Start planning
        </button>
      </section>
    </div>
  );
};

window.Landing = Landing;
