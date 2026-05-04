/* AEVA — Recommendations grid with AI reasoning (signature) */

const Recommendations = ({ onNavigate, tweaks = {} }) => {
  const accent = tweaks.accent || 'var(--aeva-ember)';
  const [expanded, setExpanded] = React.useState(0);
  const [filter, setFilter] = React.useState('all');

  const venues = [
    { id: 0, name: 'The Wythe Loft', area: 'Williamsburg, Brooklyn', price: '$1,800', cap: '30', img: PHOTOS.loft, score: 94, tags: ['Indoor', 'Warm', 'Brick'], why: [
      { match: 'Vibe', detail: 'Brick walls + Edison lighting matches your "intimate, lively" cue.' },
      { match: 'Capacity', detail: 'Seats 24 with floor space left over for dancing.' },
      { match: 'Budget', detail: 'At 40% of your budget, leaves room for catering + DJ.' },
    ]},
    { id: 1, name: 'Sunset Rooftop', area: 'DUMBO, Brooklyn', price: '$2,400', cap: '40', img: PHOTOS.rooftop, score: 89, tags: ['Outdoor', 'Skyline', 'Bar'], why: [
      { match: 'Vibe', detail: 'Open air + skyline reads "celebration."' },
      { match: 'Risk', detail: 'June 14 evening — 12% rain probability historically.' },
    ]},
    { id: 2, name: 'Garden Pavilion', area: 'Prospect Heights', price: '$1,950', cap: '60', img: PHOTOS.garden, score: 87, tags: ['Outdoor', 'Garden'], why: [
      { match: 'Vibe', detail: 'Lush + intimate at 24 guests, scales up if list grows.' },
    ]},
    { id: 3, name: 'Castello Ballroom', area: 'Park Slope', price: '$3,200', cap: '120', img: PHOTOS.ballroom, score: 78, tags: ['Indoor', 'Elegant'], why: [
      { match: 'Note', detail: 'Beautiful but reads more "wedding" than "30th."' },
    ]},
    { id: 4, name: 'Brooklyn Vineyard', area: 'Red Hook', price: '$2,100', cap: '50', img: PHOTOS.vineyard, score: 84, tags: ['Outdoor', 'Wine'], why: [
      { match: 'Vibe', detail: 'Wine-forward, leans more daytime than night.' },
    ]},
    { id: 5, name: 'The Annex', area: 'Bushwick', price: '$1,400', cap: '35', img: PHOTOS.warehouse, score: 81, tags: ['Indoor', 'Industrial'], why: [
      { match: 'Budget', detail: 'Cheapest qualified option, frees $400 for upgrades.' },
    ]},
  ];

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 32px 80px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, gap: 32, flexWrap: 'wrap' }}>
        <div>
          <button className="btn btn-quiet btn-sm" onClick={() => onNavigate('chat')} style={{ marginBottom: 16, marginLeft: -10 }}>
            <Icon name="chevronLeft" size={13}/> Back to chat
          </button>
          <p className="t-eyebrow" style={{ marginBottom: 8 }}>Step 1 of 4 · venue</p>
          <h1 className="t-display-lg" style={{ marginBottom: 12, maxWidth: 720 }}>Six venues that fit Maya's 30th.</h1>
          <p className="t-body-lg" style={{ color: 'var(--aeva-ink-soft)', maxWidth: 600 }}>
            Sorted by how well each matches your brief. Tap any card to see exactly why AEVA picked it.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['all', 'indoor', 'outdoor', 'under $2k', 'available'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '8px 14px', borderRadius: 999, background: filter === f ? 'var(--aeva-ink)' : 'var(--aeva-canvas)', color: filter === f ? 'var(--aeva-paper)' : 'var(--aeva-ink-soft)', border: filter === f ? 'none' : '1px solid var(--aeva-line)', fontSize: 12.5, fontWeight: 500, cursor: 'pointer', textTransform: 'capitalize' }}>{f}</button>
          ))}
        </div>
      </div>

      {/* Brief reminder strip */}
      <div style={{ display: 'flex', gap: 16, padding: '14px 20px', background: 'var(--aeva-paper-warm)', border: '1px solid var(--aeva-line)', borderRadius: 'var(--r-md)', marginBottom: 32, alignItems: 'center', flexWrap: 'wrap' }}>
        <Icon name="target" size={16} style={{ color: accent }}/>
        <span style={{ fontSize: 12.5, color: 'var(--aeva-ink-soft)' }}>Matching against:</span>
        <Tag size="sm">24 guests</Tag>
        <Tag size="sm">$4.5k budget</Tag>
        <Tag size="sm">Brooklyn</Tag>
        <Tag size="sm">Sat eve, Jun 14</Tag>
        <Tag size="sm" tone="ember">Intimate · Lively</Tag>
        <button className="btn btn-quiet btn-sm" style={{ marginLeft: 'auto', fontSize: 12 }}>Edit brief <Icon name="edit" size={11}/></button>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {venues.map((v, i) => {
          const isExpanded = expanded === v.id;
          return (
            <div key={v.id} onClick={() => setExpanded(v.id)} style={{ background: 'var(--aeva-canvas)', border: `1px solid ${isExpanded ? 'var(--aeva-ink)' : 'var(--aeva-line)'}`, borderRadius: 'var(--r-lg)', overflow: 'hidden', cursor: 'pointer', transition: 'all 240ms', boxShadow: isExpanded ? 'var(--shadow-lg)' : 'none', position: 'relative' }}
              onMouseEnter={e => !isExpanded && (e.currentTarget.style.borderColor = 'var(--aeva-line-strong)')}
              onMouseLeave={e => !isExpanded && (e.currentTarget.style.borderColor = 'var(--aeva-line)')}>

              {/* Image */}
              <div style={{ position: 'relative', height: 200 }}>
                <img src={v.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                {/* Score badge */}
                <div style={{ position: 'absolute', top: 12, left: 12, padding: '6px 10px', background: 'rgba(26,24,20,0.85)', backdropFilter: 'blur(6px)', borderRadius: 999, color: 'white', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Icon name="sparkles" size={10} style={{ color: accent }}/>
                  {v.score}% match
                </div>
                <button style={{ position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.95)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={e => e.stopPropagation()}>
                  <Icon name="bookmark" size={14}/>
                </button>
              </div>

              {/* Body */}
              <div style={{ padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 480, fontVariationSettings: "'opsz' 36" }}>{v.name}</h3>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{v.price}</span>
                </div>
                <p style={{ fontSize: 12.5, color: 'var(--aeva-ink-mute)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Icon name="mapPin" size={11}/> {v.area} · holds {v.cap}
                </p>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 14 }}>
                  {v.tags.map(t => <Tag key={t} size="sm">{t}</Tag>)}
                </div>

                {/* AI reasoning expansion */}
                <div style={{ overflow: 'hidden', maxHeight: isExpanded ? 400 : 0, transition: 'max-height 360ms ease' }}>
                  <div style={{ paddingTop: 14, borderTop: '1px solid var(--aeva-line)' }}>
                    <p className="t-eyebrow" style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Icon name="sparkles" size={11} style={{ color: accent }}/> Why AEVA picked this
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
                      {v.why.map((r, j) => (
                        <div key={j} style={{ display: 'flex', gap: 10 }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: accent, marginTop: 7, flexShrink: 0 }}/>
                          <div style={{ minWidth: 0 }}>
                            <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--aeva-ink)', marginRight: 8 }}>{r.match}</span>
                            <span style={{ fontSize: 12.5, color: 'var(--aeva-ink-soft)', lineHeight: 1.5 }}>{r.detail}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-ember btn-sm" style={{ flex: 1 }} onClick={e => { e.stopPropagation(); onNavigate('builder'); }}>
                        Pick this venue
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={e => e.stopPropagation()}>
                        <Icon name="eye" size={13}/>
                      </button>
                    </div>
                  </div>
                </div>

                {!isExpanded && (
                  <div style={{ fontSize: 12, color: 'var(--aeva-ink-soft)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    Tap to see reasoning <Icon name="arrowRight" size={11}/>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Continue bar */}
      <div style={{ marginTop: 32, padding: 20, background: 'var(--aeva-canvas)', border: '1px solid var(--aeva-line)', borderRadius: 'var(--r-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Icon name="check" size={16} style={{ color: 'var(--aeva-sage)' }}/>
          <span style={{ fontSize: 13.5 }}>The Wythe Loft selected · <span style={{ color: 'var(--aeva-ink-mute)' }}>4 more steps to go</span></span>
        </div>
        <button className="btn btn-primary" onClick={() => onNavigate('builder')}>
          Continue to catering <Icon name="arrowRight" size={14}/>
        </button>
      </div>
    </div>
  );
};

window.Recommendations = Recommendations;
