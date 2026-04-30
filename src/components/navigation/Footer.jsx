import React from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerColumns = [
    {
      title: 'Plan',
      items: ['Survey', 'AI chat', 'Manual builder', 'Templates'],
    },
    {
      title: 'Discover',
      items: ['Venues', 'Catering', 'Decorations', 'Vendors'],
    },
    {
      title: 'About',
      items: ['Our story', 'Press', 'Careers', 'Contact'],
    },
  ];

  return (
    <footer
      style={{
        borderTop: '1px solid var(--aeva-line)',
        background: 'var(--aeva-paper-deep)',
        padding: '40px 32px',
        marginTop: 'var(--space-5xl)',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '40px',
          flexWrap: 'wrap',
          marginBottom: '40px',
        }}
      >
        {/* Brand section */}
        <div style={{ maxWidth: '320px' }}>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '20px',
              fontWeight: 400,
              color: 'var(--aeva-ink)',
              fontStyle: 'italic',
              marginBottom: '12px',
            }}
          >
            aeva
          </div>
          <p
            style={{
              fontSize: '13px',
              color: 'var(--aeva-ink-mute)',
              lineHeight: '1.55',
            }}
          >
            The thoughtful way to plan an event. Calm, considered, and a little
            bit clever.
          </p>
        </div>

        {/* Nav columns */}
        <div style={{ display: 'flex', gap: 'var(--space-3xl)' }}>
          {footerColumns.map(col => (
            <div key={col.title}>
              <p className="t-eyebrow" style={{ marginBottom: '14px' }}>
                {col.title}
              </p>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                {col.items.map(item => (
                  <li key={item}>
                    <a
                      href="#"
                      style={{
                        color: 'var(--aeva-ink-soft)',
                        fontSize: '13.5px',
                        textDecoration: 'none',
                        transition: 'color 200ms ease',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.color = 'var(--aeva-ink)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.color = 'var(--aeva-ink-soft)';
                      }}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Copyright footer */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          paddingTop: '20px',
          borderTop: '1px solid var(--aeva-line)',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: 'var(--aeva-ink-mute)',
        }}
      >
        <span>© {currentYear} AEVA Inc.</span>
        <span>Made with care.</span>
      </div>
    </footer>
  );
}
