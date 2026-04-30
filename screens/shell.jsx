/* AEVA — App shell (top nav, footer, page wrapper) */

const { useState: useStateShell } = React;

const TopNav = ({ active = "home", onNavigate, authenticated = true }) => {
  const items = [
    { id: 'venues', label: 'Venues' },
    { id: 'catering', label: 'Catering' },
    { id: 'decorations', label: 'Decorations' },
    { id: 'vendors', label: 'Vendors' },
  ];
  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 30, background: 'rgba(250, 248, 245, 0.85)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid var(--aeva-line)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
          <button onClick={() => onNavigate?.('landing')} style={{ background: 'none', border: 'none', padding: 0 }}>
            <AevaLogo size={20} />
          </button>
          <div style={{ display: 'flex', gap: 4 }}>
            {items.map(i => (
              <button key={i.id} onClick={() => onNavigate?.(i.id)} style={{
                background: active === i.id ? 'var(--aeva-paper-warm)' : 'transparent',
                border: 'none',
                padding: '7px 14px',
                borderRadius: 'var(--r-sm)',
                fontSize: 13.5,
                fontWeight: 500,
                color: active === i.id ? 'var(--aeva-ink)' : 'var(--aeva-ink-soft)',
                letterSpacing: '-0.005em'
              }}>{i.label}</button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn btn-quiet btn-sm" onClick={() => onNavigate?.('chat')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Icon name="sparkles" size={14} /> Ask AEVA
          </button>
          {authenticated ? (
            <>
              <button onClick={() => onNavigate?.('dashboard')} className="btn btn-ghost btn-sm">Dashboard</button>
              <button style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid var(--aeva-line)', background: 'var(--aeva-canvas)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <Icon name="bell" size={15} />
                <span style={{ position: 'absolute', top: 6, right: 7, width: 7, height: 7, borderRadius: '50%', background: 'var(--aeva-ember)', border: '2px solid var(--aeva-canvas)' }}/>
              </button>
              <Avatar name="Maya Chen" size={34} />
            </>
          ) : (
            <>
              <button className="btn btn-quiet btn-sm">Log in</button>
              <button className="btn btn-primary btn-sm">Get started</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const Footer = () => (
  <footer style={{ borderTop: '1px solid var(--aeva-line)', background: 'var(--aeva-paper-deep)', padding: '40px 32px', marginTop: 80 }}>
    <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 40, flexWrap: 'wrap' }}>
      <div style={{ maxWidth: 320 }}>
        <AevaLogo size={20}/>
        <p style={{ marginTop: 12, fontSize: 13, color: 'var(--aeva-ink-mute)', lineHeight: 1.55 }}>
          The thoughtful way to plan an event. Calm, considered, and a little bit clever.
        </p>
      </div>
      <div style={{ display: 'flex', gap: 56 }}>
        {[
          { title: 'Plan', items: ['Survey', 'AI chat', 'Manual builder', 'Templates'] },
          { title: 'Discover', items: ['Venues', 'Catering', 'Decorations', 'Vendors'] },
          { title: 'About', items: ['Our story', 'Press', 'Careers', 'Contact'] },
        ].map(col => (
          <div key={col.title}>
            <p className="t-eyebrow" style={{ marginBottom: 14 }}>{col.title}</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {col.items.map(i => <li key={i}><a href="#" style={{ color: 'var(--aeva-ink-soft)', fontSize: 13.5, textDecoration: 'none' }}>{i}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
    <div style={{ maxWidth: 1280, margin: '40px auto 0', paddingTop: 20, borderTop: '1px solid var(--aeva-line)', display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--aeva-ink-mute)' }}>
      <span>© 2026 AEVA Inc.</span>
      <span>Made with care.</span>
    </div>
  </footer>
);

Object.assign(window, { TopNav, Footer });
