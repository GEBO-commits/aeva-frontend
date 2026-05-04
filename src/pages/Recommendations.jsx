import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVenues } from '../services/catalogService';
import { Sparkles, MapPin, Bookmark, Eye, ArrowRight, ChevronLeft } from 'lucide-react';
import { CardSkeleton } from '../components/ui/Skeleton';
import { usePlanStore } from '../store/plan.store';
import { Tag } from '../components/ui/Tag';

export default function Recommendations() {
  const navigate = useNavigate();
  const { setVenue } = usePlanStore();
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    const fetchVenues = async () => {
      setIsLoading(true);
      const { data, error } = await getVenues();
      if (error) {
        console.error('[Recommendations] Failed to fetch venues:', error);
        setVenues([]);
      } else {
        const mapped = (data || []).map(v => ({
          id: v.id,
          name: v.name,
          type: v.venue_type,
          maxGuests: v.capacity_max,
          startingPrice: v.price_min,
          image: Array.isArray(v.image_urls)
            ? v.image_urls[0]
            : (JSON.parse(v.image_urls || '[]')[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800'),
          location: v.city,
          description: v.description || 'Premium venue'
        }));
        setVenues(mapped);
      }
      setIsLoading(false);
    };
    fetchVenues();
  }, []);

  const renderLoadingState = () => {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {[1, 2, 3, 4, 5, 6].map(i => <CardSkeleton key={i} />)}
      </div>
    );
  };

  const renderCard = (v) => {
    const isExpanded = expanded === v.id;
    const matchScore = Math.round(75 + Math.random() * 20);

    return (
      <div
        key={v.id}
        onClick={() => setExpanded(isExpanded ? null : v.id)}
        style={{
          background: 'var(--aeva-canvas)',
          border: `1px solid ${isExpanded ? 'var(--aeva-ink)' : 'var(--aeva-line)'}`,
          borderRadius: 'var(--r-lg)',
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'all 240ms',
          boxShadow: isExpanded ? 'var(--shadow-lg)' : 'none',
          position: 'relative'
        }}
        onMouseEnter={e => !isExpanded && (e.currentTarget.style.borderColor = 'var(--aeva-line-strong)')}
        onMouseLeave={e => !isExpanded && (e.currentTarget.style.borderColor = 'var(--aeva-line)')}>

        {/* Image */}
        <div style={{ position: 'relative', height: 200 }}>
          <img src={v.image} alt={v.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

          {/* Score badge */}
          <div style={{
            position: 'absolute', top: 12, left: 12, padding: '6px 10px',
            background: 'rgba(26,24,20,0.85)', backdropFilter: 'blur(6px)',
            borderRadius: 999, color: 'white', fontSize: 11, fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 5
          }}>
            <Sparkles size={10} style={{ color: 'var(--aeva-ember)' }} />
            {matchScore}% match
          </div>

          {/* Bookmark button */}
          <button
            style={{
              position: 'absolute', top: 12, right: 12, width: 32, height: 32,
              borderRadius: '50%', background: 'rgba(255,255,255,0.95)',
              border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 200ms'
            }}
            onClick={e => e.stopPropagation()}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; }}>
            <Bookmark size={14} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <h3 style={{
              fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 480,
              fontVariationSettings: "'opsz' 36", margin: 0
            }}>
              {v.name}
            </h3>
            <span style={{ fontSize: 14, fontWeight: 600, flexShrink: 0 }}>
              ${v.startingPrice.toLocaleString()}
            </span>
          </div>

          <p style={{
            fontSize: 12.5, color: 'var(--aeva-ink-mute)', marginBottom: 10,
            display: 'flex', alignItems: 'center', gap: 5, margin: 0
          }}>
            <MapPin size={11} /> {v.location} · holds {v.maxGuests}
          </p>

          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 14 }}>
            {v.type && <Tag size="sm">{v.type}</Tag>}
          </div>

          {/* Expansion area */}
          <div style={{
            overflow: 'hidden',
            maxHeight: isExpanded ? 400 : 0,
            transition: 'max-height 360ms ease'
          }}>
            <div style={{ paddingTop: 14, borderTop: '1px solid var(--aeva-line)' }}>
              <p style={{
                fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
                marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6,
                fontWeight: 600, color: 'var(--aeva-ink)', margin: 0
              }}>
                <Sparkles size={11} style={{ color: 'var(--aeva-ember)' }} /> Why AEVA picked this
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
                <div style={{ display: 'flex', gap: 10 }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: 'var(--aeva-ember)', marginTop: 7, flexShrink: 0
                  }} />
                  <div style={{ minWidth: 0 }}>
                    <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--aeva-ink)', marginRight: 8 }}>
                      Vibe
                    </span>
                    <span style={{ fontSize: 12.5, color: 'var(--aeva-ink-soft)', lineHeight: 1.5 }}>
                      Matches your brief for an intimate, lively gathering.
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: 'var(--aeva-ember)', marginTop: 7, flexShrink: 0
                  }} />
                  <div style={{ minWidth: 0 }}>
                    <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--aeva-ink)', marginRight: 8 }}>
                      Budget
                    </span>
                    <span style={{ fontSize: 12.5, color: 'var(--aeva-ink-soft)', lineHeight: 1.5 }}>
                      At {Math.round((v.startingPrice / 4500) * 100)}% of budget, leaves room for catering and entertainment.
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  style={{
                    flex: 1, padding: '10px 16px', background: 'var(--aeva-ember)',
                    color: 'white', border: 'none', borderRadius: 'var(--r-md)',
                    fontSize: 13, fontWeight: 500, cursor: 'pointer',
                    transition: 'all 200ms', display: 'inline-flex',
                    alignItems: 'center', justifyContent: 'center', gap: 6
                  }}
                  onClick={e => {
                    e.stopPropagation();
                    setVenue(v);
                    navigate('/plan/build/venue');
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}>
                  Pick this venue
                </button>

                <button
                  style={{
                    padding: '10px 16px', background: 'var(--aeva-canvas)',
                    color: 'var(--aeva-ink)', border: '1px solid var(--aeva-line)',
                    borderRadius: 'var(--r-md)', fontSize: 13, fontWeight: 500,
                    cursor: 'pointer', display: 'inline-flex', alignItems: 'center',
                    justifyContent: 'center', gap: 6, transition: 'all 200ms'
                  }}
                  onClick={e => { e.stopPropagation(); navigate(`/venues/${v.id}`); }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--aeva-line-strong)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--aeva-line)'; }}>
                  <Eye size={13} />
                </button>
              </div>
            </div>
          </div>

          {!isExpanded && (
            <div style={{ fontSize: 12, color: 'var(--aeva-ink-soft)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              Tap to see reasoning <ArrowRight size={11} />
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderGrid = () => {
    if (isLoading) return renderLoadingState();
    if (venues.length === 0) {
      return (
        <div style={{
          background: 'var(--aeva-canvas)', padding: '48px', borderRadius: 'var(--r-lg)',
          border: '1px solid var(--aeva-line)', textAlign: 'center', display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '40vh'
        }}>
          <div style={{
            width: '80px', height: '80px', background: 'var(--aeva-paper-warm)',
            borderRadius: '50%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', marginBottom: '16px'
          }}>
            <Sparkles size={32} style={{ color: 'var(--aeva-ink-soft)' }} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--aeva-ink)', marginBottom: '8px', margin: 0 }}>
            No venues found
          </h3>
          <p style={{ color: 'var(--aeva-ink-soft)', margin: 0 }}>Try adjusting your filters.</p>
        </div>
      );
    }

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {venues.map(v => renderCard(v))}
      </div>
    );
  };

  const renderContinueBar = () => {
    if (isLoading || venues.length === 0) return null;

    return (
      <div style={{
        marginTop: 32, padding: 20, background: 'var(--aeva-canvas)',
        border: '1px solid var(--aeva-line)', borderRadius: 'var(--r-md)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Sparkles size={16} style={{ color: 'var(--aeva-sage)' }} />
          <span style={{ fontSize: 13.5 }}>
            Browse and pick a venue · <span style={{ color: 'var(--aeva-ink-mute)' }}>4 more steps to go</span>
          </span>
        </div>
        <button
          style={{
            padding: '10px 16px', background: 'var(--aeva-ink)', color: 'var(--aeva-paper)',
            border: 'none', borderRadius: 'var(--r-md)', fontSize: 13, fontWeight: 500,
            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
            transition: 'all 200ms'
          }}
          onClick={() => navigate('/plan/build/catering')}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}>
          Continue <ArrowRight size={14} />
        </button>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 32px 80px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, gap: 32, flexWrap: 'wrap' }}>
        <div>
          <button
            style={{
              padding: '8px 12px', borderRadius: 'var(--r-md)', background: 'transparent',
              border: 'none', fontSize: 13, fontWeight: 500, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--aeva-ink-soft)',
              marginLeft: -10, marginBottom: 16
            }}
            onClick={() => navigate(-1)}>
            <ChevronLeft size={13} /> Back
          </button>
          <p style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--aeva-ink-mute)', marginBottom: 8, fontWeight: 600, margin: 0 }}>
            Step 1 of 4 · venue
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 400,
            lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 12, maxWidth: 720, margin: 0
          }}>
            Venues that fit your event.
          </h1>
          <p style={{ fontSize: 16, color: 'var(--aeva-ink-soft)', maxWidth: 600, lineHeight: 1.6, margin: 0 }}>
            Sorted by match score. Tap any card to see why AEVA picked it.
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['all', 'indoor', 'outdoor', 'under $2k'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '8px 14px', borderRadius: 999,
                background: filter === f ? 'var(--aeva-ink)' : 'var(--aeva-canvas)',
                color: filter === f ? 'var(--aeva-paper)' : 'var(--aeva-ink-soft)',
                border: filter === f ? 'none' : '1px solid var(--aeva-line)',
                fontSize: 12.5, fontWeight: 500, cursor: 'pointer',
                textTransform: 'capitalize', transition: 'all 200ms'
              }}
              onMouseEnter={e => { if (filter !== f) e.currentTarget.style.borderColor = 'var(--aeva-line-strong)'; }}
              onMouseLeave={e => { if (filter !== f) e.currentTarget.style.borderColor = 'var(--aeva-line)'; }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Brief strip */}
      <div style={{
        display: 'flex', gap: 16, padding: '14px 20px', background: 'var(--aeva-paper-warm)',
        border: '1px solid var(--aeva-line)', borderRadius: 'var(--r-md)', marginBottom: 32,
        alignItems: 'center', flexWrap: 'wrap'
      }}>
        <Sparkles size={16} style={{ color: 'var(--aeva-ember)', flexShrink: 0 }} />
        <span style={{ fontSize: 12.5, color: 'var(--aeva-ink-soft)' }}>Matching against:</span>
        <Tag size="sm">24 guests</Tag>
        <Tag size="sm">$4.5k budget</Tag>
        <Tag size="sm">Brooklyn</Tag>
        <Tag size="sm">Sat eve, Jun 14</Tag>
        <Tag size="sm" tone="ember">Intimate · Lively</Tag>
      </div>

      {/* Grid */}
      {renderGrid()}

      {/* Continue bar */}
      {renderContinueBar()}
    </div>
  );
}
