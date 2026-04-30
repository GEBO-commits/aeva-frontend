/* AEVA — Survey: 4-step intake with "form transforms into brief" moment */

const Survey = ({ onNavigate, tweaks = {} }) => {
  const [step, setStep] = React.useState(0);
  const [data, setData] = React.useState({
    occasion: 'Birthday',
    vibe: ['Intimate', 'Warm'],
    date: 'Sat, Jun 14',
    time: 'Evening',
    headcount: 24,
    budget: 4500,
    location: 'Brooklyn, NY',
    name: 'Maya',
  });
  const accent = tweaks.accent || 'var(--aeva-ember)';

  const steps = ['The basics', 'The vibe', 'The logistics', 'Your brief'];

  const update = (k, v) => setData(d => ({ ...d, [k]: v }));
  const toggleVibe = (v) => update('vibe', data.vibe.includes(v) ? data.vibe.filter(x => x !== v) : [...data.vibe, v]);

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', padding: '64px 32px' }}>
      {/* Progress rail */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 56 }}>
        {steps.map((s, i) => (
          <React.Fragment key={s}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: i <= step ? 'var(--aeva-ink)' : 'var(--aeva-canvas)', color: i <= step ? 'var(--aeva-paper)' : 'var(--aeva-ink-mute)', border: i <= step ? 'none' : '1px solid var(--aeva-line-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
                {i < step ? <Icon name="check" size={12}/> : i + 1}
              </div>
              <span style={{ fontSize: 12.5, color: i === step ? 'var(--aeva-ink)' : 'var(--aeva-ink-mute)', fontWeight: i === step ? 600 : 400 }}>{s}</span>
            </div>
            {i < steps.length - 1 && <div style={{ flex: 1, height: 1, background: i < step ? 'var(--aeva-ink)' : 'var(--aeva-line)' }}/>}
          </React.Fragment>
        ))}
      </div>

      {step === 0 && (
        <div className="aeva-rise">
          <p className="t-eyebrow" style={{ marginBottom: 12 }}>Step 1 of 4</p>
          <h1 className="t-display-lg" style={{ marginBottom: 12 }}>What are we celebrating?</h1>
          <p className="t-body-lg" style={{ color: 'var(--aeva-ink-soft)', marginBottom: 40 }}>Pick the closest fit. You can change it later.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 40 }}>
            {['Birthday', 'Wedding', 'Corporate', 'Workshop', 'Conference', 'Anniversary', 'Holiday', 'Reunion', 'Other'].map(o => (
              <button key={o} onClick={() => update('occasion', o)} style={{ padding: '20px 16px', borderRadius: 'var(--r-md)', background: data.occasion === o ? 'var(--aeva-ink)' : 'var(--aeva-canvas)', color: data.occasion === o ? 'var(--aeva-paper)' : 'var(--aeva-ink)', border: data.occasion === o ? 'none' : '1px solid var(--aeva-line)', fontSize: 14.5, fontWeight: 500, textAlign: 'left', cursor: 'pointer' }}>
                {o}
              </button>
            ))}
          </div>
          <div style={{ marginBottom: 40 }}>
            <label className="t-eyebrow" style={{ display: 'block', marginBottom: 12 }}>Whose event is it for?</label>
            <input className="field" value={data.name} onChange={e => update('name', e.target.value)} placeholder="A first name, nickname, or company"/>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="aeva-rise">
          <p className="t-eyebrow" style={{ marginBottom: 12 }}>Step 2 of 4</p>
          <h1 className="t-display-lg" style={{ marginBottom: 12 }}>What should it feel like?</h1>
          <p className="t-body-lg" style={{ color: 'var(--aeva-ink-soft)', marginBottom: 40 }}>Pick a few — these guide the recommendations.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 40 }}>
            {['Intimate', 'Lively', 'Elegant', 'Casual', 'Warm', 'Modern', 'Playful', 'Romantic', 'Outdoors', 'Minimal', 'Maximal', 'Quirky', 'Black-tie', 'Daytime'].map(v => (
              <button key={v} onClick={() => toggleVibe(v)} style={{ padding: '10px 18px', borderRadius: 999, background: data.vibe.includes(v) ? 'var(--aeva-ink)' : 'var(--aeva-canvas)', color: data.vibe.includes(v) ? 'var(--aeva-paper)' : 'var(--aeva-ink-soft)', border: data.vibe.includes(v) ? 'none' : '1px solid var(--aeva-line)', fontSize: 13.5, fontWeight: 500, cursor: 'pointer' }}>
                {data.vibe.includes(v) && <Icon name="check" size={12} style={{ marginRight: 6, verticalAlign: 'middle' }}/>}{v}
              </button>
            ))}
          </div>
          <div style={{ marginBottom: 40 }}>
            <label className="t-eyebrow" style={{ display: 'block', marginBottom: 12 }}>One sentence on the energy you want (optional)</label>
            <textarea className="field" rows="2" defaultValue="Cozy enough to feel personal, lively enough to dance."/>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="aeva-rise">
          <p className="t-eyebrow" style={{ marginBottom: 12 }}>Step 3 of 4</p>
          <h1 className="t-display-lg" style={{ marginBottom: 12 }}>The practical bits.</h1>
          <p className="t-body-lg" style={{ color: 'var(--aeva-ink-soft)', marginBottom: 40 }}>When, where, how many, and roughly how much.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
            <div>
              <label className="t-eyebrow" style={{ display: 'block', marginBottom: 8 }}>Date</label>
              <input className="field" value={data.date} onChange={e => update('date', e.target.value)}/>
            </div>
            <div>
              <label className="t-eyebrow" style={{ display: 'block', marginBottom: 8 }}>Time of day</label>
              <div style={{ display: 'flex', gap: 6 }}>
                {['Morning', 'Afternoon', 'Evening', 'Late night'].map(t => (
                  <button key={t} onClick={() => update('time', t)} style={{ flex: 1, padding: '11px 8px', borderRadius: 'var(--r-sm)', background: data.time === t ? 'var(--aeva-ink)' : 'var(--aeva-canvas)', color: data.time === t ? 'var(--aeva-paper)' : 'var(--aeva-ink-soft)', border: data.time === t ? 'none' : '1px solid var(--aeva-line)', fontSize: 12.5, fontWeight: 500, cursor: 'pointer' }}>{t}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="t-eyebrow" style={{ display: 'block', marginBottom: 8 }}>Location</label>
              <input className="field" value={data.location} onChange={e => update('location', e.target.value)}/>
            </div>
            <div>
              <label className="t-eyebrow" style={{ display: 'block', marginBottom: 8 }}>Headcount: <span style={{ color: 'var(--aeva-ink)', fontWeight: 600 }}>{data.headcount}</span></label>
              <input type="range" min="2" max="300" value={data.headcount} onChange={e => update('headcount', +e.target.value)} style={{ width: '100%' }}/>
            </div>
          </div>
          <div style={{ marginBottom: 40 }}>
            <label className="t-eyebrow" style={{ display: 'block', marginBottom: 8 }}>Budget: <span style={{ color: 'var(--aeva-ink)', fontWeight: 600 }}>${data.budget.toLocaleString()}</span></label>
            <input type="range" min="500" max="50000" step="100" value={data.budget} onChange={e => update('budget', +e.target.value)} style={{ width: '100%' }}/>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--aeva-ink-mute)', marginTop: 6, fontFamily: 'var(--font-mono)' }}>
              <span>$500</span><span>$25k</span><span>$50k+</span>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="aeva-rise">
          <p className="t-eyebrow" style={{ marginBottom: 12 }}>Step 4 of 4 · The transformation</p>
          <h1 className="t-display-lg" style={{ marginBottom: 12 }}>Here's your brief.</h1>
          <p className="t-body-lg" style={{ color: 'var(--aeva-ink-soft)', marginBottom: 32 }}>This is what AEVA will use to draft your plan. Edit anything, or hand it off.</p>

          {/* The brief card — the artifact */}
          <div style={{ background: 'var(--aeva-canvas)', border: '1px solid var(--aeva-line)', borderRadius: 'var(--r-lg)', padding: 40, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: 200, height: 200, background: `radial-gradient(circle at 70% 30%, ${accent}22 0%, transparent 70%)` }}/>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, position: 'relative' }}>
              <div>
                <p className="t-eyebrow" style={{ marginBottom: 8 }}>Event Brief · 26.04.30</p>
                <h2 className="t-display-md" style={{ marginBottom: 4 }}>{data.name}'s {data.occasion}</h2>
                <p style={{ fontSize: 13.5, color: 'var(--aeva-ink-soft)' }}>{data.date} · {data.time} · {data.location}</p>
              </div>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--aeva-paper-warm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="sparkles" size={20} style={{ color: accent }}/>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 32, paddingBottom: 32, borderBottom: '1px solid var(--aeva-line)' }}>
              <div>
                <p className="t-eyebrow" style={{ marginBottom: 6 }}>Guests</p>
                <p className="t-display-xs">{data.headcount}</p>
              </div>
              <div>
                <p className="t-eyebrow" style={{ marginBottom: 6 }}>Budget</p>
                <p className="t-display-xs">${(data.budget/1000).toFixed(1)}k</p>
              </div>
              <div>
                <p className="t-eyebrow" style={{ marginBottom: 6 }}>Per head</p>
                <p className="t-display-xs">${Math.round(data.budget/data.headcount)}</p>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <p className="t-eyebrow" style={{ marginBottom: 10 }}>The vibe</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {data.vibe.map(v => <Tag key={v} tone="ember">{v}</Tag>)}
              </div>
            </div>

            <div>
              <p className="t-eyebrow" style={{ marginBottom: 10 }}>What we'll source</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <Tag icon="building">Venue (3 options)</Tag>
                <Tag icon="utensils">Catering</Tag>
                <Tag icon="flower">Decor</Tag>
                <Tag icon="music">Music</Tag>
                <Tag icon="camera">Photographer</Tag>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer nav */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 48 }}>
        <button className="btn btn-quiet" onClick={() => step === 0 ? onNavigate('landing') : setStep(step - 1)}>
          <Icon name="chevronLeft" size={14}/> {step === 0 ? 'Back to home' : 'Previous'}
        </button>
        {step < 3 ? (
          <button className="btn btn-primary btn-lg" onClick={() => setStep(step + 1)}>
            Continue <Icon name="arrowRight" size={14}/>
          </button>
        ) : (
          <button className="btn btn-ember btn-lg" onClick={() => onNavigate('recommendations')}>
            <Icon name="sparkles" size={14}/> Generate plan
          </button>
        )}
      </div>
    </div>
  );
};

window.Survey = Survey;
