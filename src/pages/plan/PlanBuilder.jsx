import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlanStore } from '../../store/plan.store';
import { Sparkles, Share2, GripVertical, Plus, ChevronLeft } from 'lucide-react';
import { Tag } from '../../components/ui/Tag';

export default function PlanBuilder() {
  const navigate = useNavigate();
  const { getTotalCost } = usePlanStore();
  const [activeTab, setActiveTab] = useState('venue');
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [timeline, setTimeline] = useState([
    { time: '5:30 PM', title: 'Doors open', detail: 'Welcome cocktails at the bar', kind: 'arrival', dur: 30, suggested: false },
    { time: '6:00 PM', title: 'Guests arrive', detail: 'Light hors d\'oeuvres', kind: 'social', dur: 45, suggested: false },
    { time: '6:45 PM', title: 'Toast', detail: 'Best friend speech (~3 min)', kind: 'moment', dur: 15, suggested: true },
    { time: '7:00 PM', title: 'Family-style dinner', detail: 'Three pasta courses, wine pairings', kind: 'meal', dur: 75, suggested: false },
    { time: '8:15 PM', title: 'Cake & a song', detail: 'Coffee, dessert, candle moment', kind: 'moment', dur: 25, suggested: false },
    { time: '8:40 PM', title: 'DJ set begins', detail: 'Disco-leaning, slow build', kind: 'music', dur: 140, suggested: false },
    { time: '11:00 PM', title: 'Last call', detail: 'Bar closes', kind: 'wrap', dur: 30, suggested: true },
  ]);

  const sections = [
    { id: 'venue', label: 'Venue', icon: 'building', status: 'done', summary: 'The Wythe Loft · $1,800' },
    { id: 'catering', label: 'Catering', icon: 'utensils', status: 'done', summary: 'Sunday Supper Co. · $1,152' },
    { id: 'decor', label: 'Decorations', icon: 'flower', status: 'done', summary: 'Petal & Pine · $620' },
    { id: 'music', label: 'Music', icon: 'music', status: 'done', summary: 'DJ Carmine · $750' },
    { id: 'photo', label: 'Photography', icon: 'camera', status: 'done', summary: 'Lou Mendez · $580' },
    { id: 'guests', label: 'Guests', icon: 'users', status: 'progress', summary: '18 of 24 invited' },
    { id: 'invites', label: 'Invitations', icon: 'mail', status: 'todo', summary: 'Not yet sent' },
  ];

  const totalSpend = 1800 + 1152 + 620 + 750 + 580;
  const budget = 4500;

  const moveItem = (from, to) => {
    setTimeline(t => {
      const c = [...t];
      const [item] = c.splice(from, 1);
      c.splice(to, 0, item);
      return c;
    });
  };

  const getStatusIcon = (status) => {
    if (status === 'done') return '✓';
    if (status === 'progress') return '◌';
    return '◯';
  };

  const getStatusColor = (status) => {
    if (status === 'done') return 'var(--aeva-sage-soft)';
    if (status === 'progress') return 'var(--aeva-ember-soft)';
    return 'var(--aeva-paper-warm)';
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 320px', gap: 0, minHeight: 'calc(100vh - 65px)', borderTop: '1px solid var(--aeva-line)', background: 'var(--aeva-paper)' }}>
      {/* Sidebar — section list */}
      <aside style={{ background: 'var(--aeva-paper-deep)', borderRight: '1px solid var(--aeva-line)', padding: '24px 20px', overflowY: 'auto' }}>
        <div style={{ marginBottom: 20 }}>
          <p className="t-eyebrow" style={{ marginBottom: 6 }}>Plan</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 480, fontVariationSettings: "'opsz' 36" }}>Maya's 30th</h2>
          <p style={{ fontSize: 12, color: 'var(--aeva-ink-mute)' }}>Sat, Jun 14 · 24 guests</p>
        </div>
        {/* progress */}
        <div style={{ marginBottom: 24, padding: 14, background: 'var(--aeva-canvas)', border: '1px solid var(--aeva-line)', borderRadius: 'var(--r-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--aeva-ink-soft)' }}>Plan complete</span>
            <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>5/7</span>
          </div>
          <div style={{ height: 4, background: 'var(--aeva-paper-warm)', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ width: '71%', height: '100%', background: 'var(--aeva-ink)' }}/>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {sections.map(s => (
            <button key={s.id} onClick={() => setActiveTab(s.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 'var(--r-sm)', background: activeTab === s.id ? 'var(--aeva-canvas)' : 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', width: '100%', transition: 'all 200ms' }} onMouseEnter={e => { if (activeTab !== s.id) e.currentTarget.style.background = 'rgba(26,24,20,0.02)'; }} onMouseLeave={e => { if (activeTab !== s.id) e.currentTarget.style.background = 'transparent'; }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: getStatusColor(s.status), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 11, fontWeight: 600, color: s.status === 'done' ? 'var(--aeva-sage)' : s.status === 'progress' ? 'var(--aeva-ember)' : 'var(--aeva-ink-mute)' }}>
                {getStatusIcon(s.status)}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{s.label}</div>
                <div style={{ fontSize: 11.5, color: 'var(--aeva-ink-mute)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.summary}</div>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Main canvas — Timeline */}
      <main style={{ padding: '32px 40px', overflowY: 'auto', background: 'var(--aeva-paper)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
          <div>
            <p className="t-eyebrow" style={{ marginBottom: 8 }}>Day-of timeline</p>
            <h1 className="t-display-md">Saturday, June 14</h1>
            <p style={{ fontSize: 13.5, color: 'var(--aeva-ink-soft)', marginTop: 6 }}>Drag to reorder · click to edit · <span style={{ color: 'var(--aeva-ember)', fontWeight: 500 }}>highlighted</span> are AEVA's suggestions</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ padding: '8px 12px', borderRadius: 'var(--r-md)', background: 'var(--aeva-canvas)', border: '1px solid var(--aeva-line)', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }} onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--aeva-line-strong)'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--aeva-line)'; }}><Share2 size={13}/> Share</button>
            <button style={{ padding: '8px 12px', borderRadius: 'var(--r-md)', background: 'var(--aeva-ember)', color: 'white', border: 'none', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }} onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; }} onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}><Sparkles size={13}/> Suggest a moment</button>
          </div>
        </div>

        {/* Timeline */}
        <div style={{ position: 'relative', paddingLeft: 80 }}>
          <div style={{ position: 'absolute', left: 80, top: 16, bottom: 16, width: 2, background: 'var(--aeva-line)' }}/>
          {timeline.map((item, i) => (
            <div key={i}
              draggable
              onDragStart={() => setDraggedIdx(i)}
              onDragOver={e => e.preventDefault()}
              onDrop={() => { if (draggedIdx !== null && draggedIdx !== i) moveItem(draggedIdx, i); setDraggedIdx(null); }}
              style={{ position: 'relative', display: 'flex', gap: 24, marginBottom: 12, opacity: draggedIdx === i ? 0.4 : 1, cursor: 'grab' }}>
              <div style={{ position: 'absolute', left: -80, top: 14, width: 64, textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--aeva-ink-soft)', fontWeight: 500 }}>
                {item.time}
              </div>
              <div style={{ position: 'absolute', left: -8, top: 16, width: 14, height: 14, borderRadius: '50%', background: item.suggested ? 'var(--aeva-ember)' : 'var(--aeva-canvas)', border: `2px solid ${item.suggested ? 'var(--aeva-ember)' : 'var(--aeva-line-strong)'}`, zIndex: 2 }}/>
              <div style={{ flex: 1, padding: '14px 18px', background: 'var(--aeva-canvas)', border: `1px solid ${item.suggested ? 'var(--aeva-ember)' : 'var(--aeva-line)'}`, borderRadius: 'var(--r-md)', display: 'flex', alignItems: 'center', gap: 16 }}>
                <GripVertical size={16} style={{ color: 'var(--aeva-ink-mute)', cursor: 'grab', flexShrink: 0 }}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <h3 style={{ fontSize: 14.5, fontWeight: 600 }}>{item.title}</h3>
                    {item.suggested && <Tag size="sm" tone="ember">AI suggestion</Tag>}
                  </div>
                  <p style={{ fontSize: 12.5, color: 'var(--aeva-ink-soft)' }}>{item.detail} · {item.dur} min</p>
                </div>
                <button style={{ background: 'transparent', border: 'none', padding: 4, color: 'var(--aeva-ink-mute)', cursor: 'pointer' }}>⋮</button>
              </div>
            </div>
          ))}
          {/* add new */}
          <button style={{ marginLeft: 0, marginTop: 4, padding: '12px 18px', background: 'transparent', border: '1px dashed var(--aeva-line-strong)', borderRadius: 'var(--r-md)', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--aeva-ink-mute)', fontSize: 13, cursor: 'pointer', width: '100%' }} onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--aeva-ink)'; e.currentTarget.style.color = 'var(--aeva-ink)'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--aeva-line-strong)'; e.currentTarget.style.color = 'var(--aeva-ink-mute)'; }}>
            <Plus size={14}/> Add a moment
          </button>
        </div>
      </main>

      {/* Right rail — budget + AI nudges */}
      <aside style={{ background: 'var(--aeva-paper-deep)', borderLeft: '1px solid var(--aeva-line)', padding: '24px 20px', overflowY: 'auto' }}>
        {/* Budget */}
        <div style={{ padding: 18, background: 'var(--aeva-canvas)', border: '1px solid var(--aeva-line)', borderRadius: 'var(--r-md)', marginBottom: 20 }}>
          <p className="t-eyebrow" style={{ marginBottom: 10 }}>Budget</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 480, fontVariationSettings: "'opsz' 60" }}>${totalSpend.toLocaleString()}</span>
            <span style={{ fontSize: 12, color: 'var(--aeva-ink-mute)', fontFamily: 'var(--font-mono)' }}>of ${budget.toLocaleString()}</span>
          </div>
          <div style={{ height: 6, background: 'var(--aeva-paper-warm)', borderRadius: 999, overflow: 'hidden', marginBottom: 12 }}>
            <div style={{ width: `${(totalSpend/budget)*100}%`, height: '100%', background: 'var(--aeva-sage)' }}/>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[['Venue', 1800], ['Catering', 1152], ['Decor', 620], ['Music', 750], ['Photo', 580]].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: 'var(--aeva-ink-soft)' }}>{k}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>${v}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginTop: 6, paddingTop: 6, borderTop: '1px dashed var(--aeva-line)', color: 'var(--aeva-sage)' }}>
              <span style={{ fontWeight: 600 }}>Remaining</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>${(budget - totalSpend).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* AI Nudges */}
        <p className="t-eyebrow" style={{ marginBottom: 12 }}>AEVA notes</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { icon: '✨', tone: 'ember', t: 'Add a toast?', d: 'A 3-min toast at 6:45 paces the night nicely. Already added it as a suggestion.' },
            { icon: 'ℹ', tone: 'neutral', t: 'Heads up', d: 'Sunday Supper needs a final headcount by Jun 7 (one week prior).' },
            { icon: '⚡', tone: 'sage', t: 'Save $80', d: 'Skip the late dessert tray — guests rarely revisit after cake.' },
          ].map((n, i) => (
            <div key={i} style={{ padding: 12, background: 'var(--aeva-canvas)', border: '1px solid var(--aeva-line)', borderRadius: 'var(--r-md)', display: 'flex', gap: 10 }}>
              <div style={{ width: 26, height: 26, borderRadius: 7, background: n.tone === 'ember' ? 'var(--aeva-ember-soft)' : n.tone === 'sage' ? 'var(--aeva-sage-soft)' : 'var(--aeva-paper-warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: n.tone === 'ember' ? 'var(--aeva-ember)' : n.tone === 'sage' ? 'var(--aeva-sage)' : 'var(--aeva-ink-mute)', fontSize: 14 }}>
                {n.icon}
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 3 }}>{n.t}</p>
                <p style={{ fontSize: 11.5, color: 'var(--aeva-ink-soft)', lineHeight: 1.5 }}>{n.d}</p>
              </div>
            </div>
          ))}
        </div>

        <button style={{ width: '100%', marginTop: 24, padding: '10px 16px', borderRadius: 'var(--r-md)', background: 'var(--aeva-ember)', color: 'white', border: 'none', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }} onClick={() => navigate('/plan/summary')} onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; }} onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}>
          Lock in the plan <ChevronLeft size={13} style={{ transform: 'rotate(180deg)' }}/>
        </button>
      </aside>
    </div>
  );
}
