/* AEVA — Plan Summary (the shareable artifact) + Dashboard + Guests */

const PlanSummary = ({ onNavigate, tweaks = {} }) => {
  const accent = tweaks.accent || 'var(--aeva-ember)';
  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: '40px 32px 80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 32 }}>
        <button className="btn btn-quiet btn-sm" onClick={() => onNavigate('builder')} style={{ marginLeft: -10 }}><Icon name="chevronLeft" size={13} /> Back to plan</button>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost btn-sm"><Icon name="download" size={13} /> Download PDF</button>
          <button className="btn btn-ghost btn-sm"><Icon name="share" size={13} /> Share link</button>
          <button className="btn btn-ember btn-sm"><Icon name="mail" size={13} /> Send invitations</button>
        </div>
      </div>

      {/* The shareable event card */}
      <div style={{ background: 'var(--aeva-canvas)', border: '1px solid var(--aeva-line)', borderRadius: 'var(--r-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
        {/* Hero band */}
        <div style={{ position: 'relative', height: 320, overflow: 'hidden' }}>
          <img src={PHOTOS.loft} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 30%, rgba(26,24,20,0.85) 100%)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 40, color: 'white' }}>
            <p style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.7, marginBottom: 12, fontWeight: 600 }}>Event No. 042 · You're invited</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 64, fontWeight: 380, lineHeight: 0.95, letterSpacing: '-0.03em', marginBottom: 8, fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}>
              Maya turns thirty.
            </h1>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontStyle: 'italic', fontWeight: 320, opacity: 0.85 }}>An evening of pasta, candles, and questionable dancing.</p>
          </div>
        </div>

        {/* Detail grid */}
        <div style={{ padding: 40 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, paddingBottom: 32, marginBottom: 32, borderBottom: '1px solid var(--aeva-line)' }}>
            {[
            ['When', 'Sat, Jun 14', '6:00 — 11:00 PM'],
            ['Where', 'The Wythe Loft', '212 Wythe Ave, Brooklyn'],
            ['Dress', 'Smart casual', 'Layers · we\'ll dance'],
            ['Bring', 'Yourself', 'Photos & a song to request']].
            map(([k, v, sub]) =>
            <div key={k}>
                <p className="t-eyebrow" style={{ marginBottom: 8 }}>{k}</p>
                <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 2 }}>{v}</p>
                <p style={{ fontSize: 12, color: 'var(--aeva-ink-mute)' }}>{sub}</p>
              </div>
            )}
          </div>

          {/* Schedule */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginBottom: 32 }}>
            <div>
              <p className="t-eyebrow" style={{ marginBottom: 14 }}>The arc of the night</p>
              {[
              ['6:00', 'Doors + cocktails'],
              ['7:00', 'Family-style dinner'],
              ['8:15', 'Cake & a song'],
              ['8:40', 'DJ set begins'],
              ['11:00', 'Last call']].
              map(([t, x]) =>
              <div key={t} style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: 16, padding: '8px 0', borderTop: '1px solid var(--aeva-line)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--aeva-ink-mute)' }}>{t} PM</span>
                  <span style={{ fontSize: 14 }}>{x}</span>
                </div>
              )}
            </div>
            <div>
              <p className="t-eyebrow" style={{ marginBottom: 14 }}>Crew</p>
              {[
              ['Venue', 'The Wythe Loft', PHOTOS.loft],
              ['Catering', 'Sunday Supper Co.', PHOTOS.catering],
              ['Music', 'DJ Carmine', PHOTOS.djSet],
              ['Photo', 'Lou Mendez', PHOTOS.photographer],
              ['Decor', 'Petal & Pine', PHOTOS.florist]].
              map(([k, n, img]) =>
              <div key={k} style={{ display: 'grid', gridTemplateColumns: '40px 60px 1fr', gap: 12, padding: '8px 0', borderTop: '1px solid var(--aeva-line)', alignItems: 'center' }}>
                  <img src={img} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
                  <span style={{ fontSize: 11, color: 'var(--aeva-ink-mute)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>{k}</span>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{n}</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 20, background: 'var(--aeva-paper-warm)', borderRadius: 'var(--r-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--aeva-ink)', color: accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="sparkles" size={14} />
              </div>
              <div>
                <p style={{ fontSize: 12.5, fontWeight: 600 }}>Planned with AEVA</p>
                <p style={{ fontSize: 11, color: 'var(--aeva-ink-mute)' }}>aeva.events/maya30 · pw: brooklyn</p>
              </div>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => onNavigate('guests')}>RSVP <Icon name="arrowRight" size={12} /></button>
          </div>
        </div>
      </div>
    </div>);

};

const Dashboard = ({ onNavigate, tweaks = {} }) => {
  const accent = tweaks.accent || 'var(--aeva-ember)';
  const events = [
  { name: "Maya's 30th", date: 'Jun 14', daysOut: 45, status: 'In progress', img: PHOTOS.loft, prog: 71, head: 24, rsvp: 18 },
  { name: 'Q3 Team Offsite', date: 'Sep 8', daysOut: 131, status: 'Drafting', img: PHOTOS.warehouse, prog: 30, head: 42, rsvp: 0 },
  { name: 'Mom & Dad — 35th', date: 'Oct 22', daysOut: 175, status: 'Idea', img: PHOTOS.vineyard, prog: 12, head: 60, rsvp: 0 }];

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 32px 80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
        <div>
          <p className="t-eyebrow" style={{ marginBottom: 8 }}>Hello, Maya</p>
          <h1 className="t-display-lg">Three on the horizon.</h1>
        </div>
        <button className="btn btn-ember" onClick={() => onNavigate('chat')}><Icon name="plus" size={14} /> New event</button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 40 }}>
        {[
        ['Events planned', '7', 'all-time'],
        ['Active', '3', 'in flight'],
        ['Guests this year', '124', 'across all events'],
        ['Total spent', '$18.2k', 'lifetime']].
        map(([k, v, s]) =>
        <div key={k} style={{ padding: 20, background: 'var(--aeva-canvas)', border: '1px solid var(--aeva-line)', borderRadius: 'var(--r-md)' }}>
            <p className="t-eyebrow" style={{ marginBottom: 8 }}>{k}</p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 460, lineHeight: 1, marginBottom: 4, fontVariationSettings: "'opsz' 96" }}>{v}</p>
            <p style={{ fontSize: 11.5, color: 'var(--aeva-ink-mute)' }}>{s}</p>
          </div>
        )}
      </div>

      <p className="t-eyebrow" style={{ marginBottom: 16 }}>Your events</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 48 }}>
        {events.map((e, i) =>
        <div key={i} onClick={() => onNavigate(i === 0 ? 'event' : 'builder')} style={{ background: 'var(--aeva-canvas)', border: '1px solid var(--aeva-line)', borderRadius: 'var(--r-md)', padding: 16, display: 'grid', gridTemplateColumns: '120px 1fr auto auto', gap: 24, alignItems: 'center', cursor: 'pointer', transition: 'all 180ms' }}
        onMouseEnter={(ev) => ev.currentTarget.style.borderColor = 'var(--aeva-line-strong)'}
        onMouseLeave={(ev) => ev.currentTarget.style.borderColor = 'var(--aeva-line)'}>
            <div style={{ width: 120, height: 80, borderRadius: 10, overflow: 'hidden' }}>
              <img src={e.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 480, fontVariationSettings: "'opsz' 36" }}>{e.name}</h3>
                <Tag size="sm" tone={e.status === 'In progress' ? 'ember' : 'neutral'}>{e.status}</Tag>
              </div>
              <p style={{ color: 'var(--aeva-ink-mute)', marginBottom: 6, fontSize: "12.5px" }}>{e.date} · {e.daysOut} days · {e.head} guests</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 200, height: 4, background: 'var(--aeva-paper-warm)', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ width: `${e.prog}%`, height: '100%', background: 'var(--aeva-ink)' }} />
                </div>
                <span style={{ fontSize: 11, color: 'var(--aeva-ink-mute)', fontFamily: 'var(--font-mono)' }}>{e.prog}%</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 11, color: 'var(--aeva-ink-mute)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600, marginBottom: 2 }}>RSVPs</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600 }}>{e.rsvp}/{e.head}</p>
            </div>
            <Icon name="chevronRight" size={16} style={{ color: 'var(--aeva-ink-mute)' }} />
          </div>
        )}
      </div>

      <p className="t-eyebrow" style={{ marginBottom: 16 }}>What needs your eyes</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[
        { tag: 'RSVP', t: '6 friends still pending', d: 'Last reminder sent 4 days ago.', icon: 'mail' },
        { tag: 'Vendor', t: 'DJ Carmine confirmed', d: 'Set list link added.', icon: 'check' },
        { tag: 'AEVA', t: 'Add a photographer?', d: 'Most 30ths your size do.', icon: 'sparkles' }].
        map((c, i) =>
        <div key={i} style={{ padding: 18, background: 'var(--aeva-canvas)', border: '1px solid var(--aeva-line)', borderRadius: 'var(--r-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Icon name={c.icon} size={13} style={{ color: i === 2 ? accent : 'var(--aeva-ink-mute)' }} />
              <span className="t-eyebrow">{c.tag}</span>
            </div>
            <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{c.t}</p>
            <p style={{ fontSize: 12.5, color: 'var(--aeva-ink-soft)' }}>{c.d}</p>
          </div>
        )}
      </div>
    </div>);

};

const Guests = ({ onNavigate, tweaks = {} }) => {
  const accent = tweaks.accent || 'var(--aeva-ember)';
  const guests = [
  { name: 'Liam Park', status: 'yes', plus: 1 }, { name: 'Sara Cohen', status: 'yes', plus: 0 },
  { name: 'Devin Wu', status: 'yes', plus: 0 }, { name: 'Marcus Reid', status: 'yes', plus: 1 },
  { name: 'Iris Wallace', status: 'yes', plus: 0 }, { name: 'Tom Salinas', status: 'yes', plus: 0 },
  { name: 'Amelia Ford', status: 'yes', plus: 1 }, { name: 'Jordan Hill', status: 'yes', plus: 0 },
  { name: 'Priya Shah', status: 'maybe', plus: 0 }, { name: 'Noah Bates', status: 'maybe', plus: 0 },
  { name: 'Alex Reyes', status: 'pending', plus: 0 }, { name: 'Kim Tran', status: 'pending', plus: 0 },
  { name: 'River Owens', status: 'pending', plus: 0 }, { name: 'Sofia Lee', status: 'pending', plus: 0 },
  { name: 'Mira Joshi', status: 'pending', plus: 1 }, { name: 'Beck Allen', status: 'pending', plus: 0 },
  { name: 'Nina Park', status: 'no', plus: 0 }, { name: 'Wes Holm', status: 'no', plus: 0 }];

  const total = 24;
  const yes = guests.filter((g) => g.status === 'yes').reduce((a, g) => a + 1 + g.plus, 0);
  const maybe = guests.filter((g) => g.status === 'maybe').length;
  const no = guests.filter((g) => g.status === 'no').length;
  const pending = guests.filter((g) => g.status === 'pending').length;

  const STATUS = {
    yes: { c: 'var(--aeva-sage)', label: 'Going' },
    maybe: { c: 'var(--aeva-warning)', label: 'Maybe' },
    pending: { c: 'var(--aeva-ink-mute)', label: 'Pending' },
    no: { c: 'var(--aeva-danger)', label: "Can't" }
  };

  const yesPct = yes / total * 100;
  const maybePct = maybe / total * 100;
  const noPct = no / total * 100;

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 32px 80px' }}>
      <div style={{ marginBottom: 40 }}>
        <button className="btn btn-quiet btn-sm" onClick={() => onNavigate('event')} style={{ marginLeft: -10, marginBottom: 16 }}><Icon name="chevronLeft" size={13} /> Back to event</button>
        <p className="t-eyebrow" style={{ marginBottom: 8 }}>Maya's 30th · 10 days out</p>
        <h1 className="t-display-lg">Guest list</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 32 }}>
        {/* Visualization */}
        <div style={{ padding: 28, background: 'var(--aeva-canvas)', border: '1px solid var(--aeva-line)', borderRadius: 'var(--r-lg)', alignSelf: 'start' }}>
          <p className="t-eyebrow" style={{ marginBottom: 20 }}>Headcount</p>
          {/* Donut */}
          <div style={{ position: 'relative', width: 200, height: 200, margin: '0 auto 24px' }}>
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--aeva-paper-warm)" strokeWidth="12" />
              <circle cx="50" cy="50" r="42" fill="none" stroke={STATUS.yes.c} strokeWidth="12" strokeDasharray={`${yesPct / 100 * 264} 264`} strokeDashoffset="0" />
              <circle cx="50" cy="50" r="42" fill="none" stroke={STATUS.maybe.c} strokeWidth="12" strokeDasharray={`${maybePct / 100 * 264} 264`} strokeDashoffset={`${-(yesPct / 100) * 264}`} />
              <circle cx="50" cy="50" r="42" fill="none" stroke={STATUS.no.c} strokeWidth="12" strokeDasharray={`${noPct / 100 * 264} 264`} strokeDashoffset={`${-((yesPct + maybePct) / 100) * 264}`} />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 480, lineHeight: 1, fontVariationSettings: "'opsz' 96" }}>{yes}</p>
              <p style={{ fontSize: 11, color: 'var(--aeva-ink-mute)', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 600, marginTop: 4 }}>going of {total}</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[['yes', yes], ['maybe', maybe], ['pending', pending], ['no', no]].map(([k, v]) =>
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: STATUS[k].c }} />
                  {STATUS[k].label}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{v}</span>
              </div>
            )}
          </div>
          <button className="btn btn-ember" style={{ width: '100%', marginTop: 24 }}>
            <Icon name="mail" size={13} /> Nudge {pending} pending
          </button>
        </div>

        {/* Guest grid */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {['All', 'Going', 'Maybe', 'Pending', 'Can\'t'].map((f, i) =>
              <button key={f} style={{ padding: '6px 12px', borderRadius: 999, background: i === 0 ? 'var(--aeva-ink)' : 'var(--aeva-canvas)', color: i === 0 ? 'var(--aeva-paper)' : 'var(--aeva-ink-soft)', border: i === 0 ? 'none' : '1px solid var(--aeva-line)', fontSize: 12.5, fontWeight: 500, cursor: 'pointer' }}>{f}</button>
              )}
            </div>
            <button className="btn btn-ghost btn-sm"><Icon name="plus" size={13} /> Add guest</button>
          </div>

          <div style={{ background: 'var(--aeva-canvas)', border: '1px solid var(--aeva-line)', borderRadius: 'var(--r-md)', overflow: 'hidden' }}>
            {guests.map((g, i) =>
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 80px 100px 60px', gap: 16, padding: '12px 16px', borderBottom: i < guests.length - 1 ? '1px solid var(--aeva-line)' : 'none', alignItems: 'center' }}>
                <Avatar name={g.name} size={32} />
                <div>
                  <p style={{ fontSize: 13.5, fontWeight: 500 }}>{g.name}</p>
                  {g.plus > 0 && <p style={{ fontSize: 11, color: 'var(--aeva-ink-mute)' }}>+{g.plus} guest</p>}
                </div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: STATUS[g.status].c }} />
                  {STATUS[g.status].label}
                </span>
                <span style={{ fontSize: 11, color: 'var(--aeva-ink-mute)', fontFamily: 'var(--font-mono)' }}>{g.status === 'pending' ? 'sent 4d' : g.status === 'yes' ? 'yes 3d' : g.status === 'maybe' ? 'maybe 2d' : 'no 5d'}</span>
                <button style={{ background: 'transparent', border: 'none', color: 'var(--aeva-ink-mute)', padding: 4 }}><Icon name="moreH" size={14} /></button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>);

};

Object.assign(window, { PlanSummary, Dashboard, Guests });