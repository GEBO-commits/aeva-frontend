import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVendors } from '../services/catalogService';
import { usePlanStore } from '../store/plan.store';
import { Sparkles, Star, ChevronLeft, Eye, ArrowRight } from 'lucide-react';
import { CardSkeleton } from '../components/ui/Skeleton';
import { Tag } from '../components/ui/Tag';

export default function Vendors() {
  const navigate = useNavigate();
  const { setVendor } = usePlanStore();
  const [expanded, setExpanded] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allVendors, setAllVendors] = useState([]);

  useEffect(() => {
    const fetchVendors = async () => {
      setIsLoading(true);
      const { data, error } = await getVendors();
      if (error) {
        console.error('[Vendors] Failed to fetch vendors:', error);
        setAllVendors([]);
      } else {
        const mapped = (data || []).map(v => {
          let details = {};
          if (v.details) {
            details = typeof v.details === 'string' ? JSON.parse(v.details) : v.details;
          }
          return {
            id: v.id,
            name: v.name,
            category: v.category,
            description: v.description,
            rating: v.rating || 4.5,
            image: Array.isArray(v.image_urls)
              ? v.image_urls[0]
              : (JSON.parse(v.image_urls || '[]')[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800'),
            startingPrice: v.price_min,
            features: details.services || details.specialties || details.packages || []
          };
        });
        setAllVendors(mapped);
      }
      setIsLoading(false);
    };
    fetchVendors();
  }, []);

  const categories = [
    { key: 'dj', label: 'DJ / Music', icon: '🎵' },
    { key: 'photography', label: 'Photography', icon: '📸' },
    { key: 'videography', label: 'Videography', icon: '🎬' }
  ];

  const getCategoryVendors = (catKey) => {
    return allVendors.filter(v => v.category === catKey);
  };

  const renderLoadingState = () => {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {[1, 2, 3, 4, 5, 6].map(i => <CardSkeleton key={i} />)}
      </div>
    );
  };

  const renderCard = (v) => {
    const isExpanded = expanded === v.id;
    const matchScore = Math.round(60 + Math.random() * 35);

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

          {/* Rating badge */}
          <div style={{
            position: 'absolute', bottom: 12, right: 12, padding: '6px 10px',
            background: 'rgba(26,24,20,0.85)', backdropFilter: 'blur(6px)',
            borderRadius: 'var(--r-md)', color: 'white', fontSize: 11, fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 4
          }}>
            <Star size={10} style={{ fill: 'white' }} />
            {v.rating}
          </div>
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
              from ${v.startingPrice.toLocaleString()}
            </span>
          </div>

          <p style={{
            fontSize: 12.5, color: 'var(--aeva-ink-soft)', marginBottom: 10, margin: 0
          }}>
            {v.description}
          </p>

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
                <Sparkles size={11} style={{ color: 'var(--aeva-ember)' }} /> Services & features
              </p>

              {v.features.length > 0 && (
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 14 }}>
                  {v.features.map(feat => (
                    <Tag key={feat} size="sm">{feat}</Tag>
                  ))}
                </div>
              )}

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
                    setVendor(v.category, v);
                    navigate('/plan/build/vendors');
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}>
                  Pick this vendor
                </button>

                <button
                  style={{
                    padding: '10px 16px', background: 'var(--aeva-canvas)',
                    color: 'var(--aeva-ink)', border: '1px solid var(--aeva-line)',
                    borderRadius: 'var(--r-md)', fontSize: 13, fontWeight: 500,
                    cursor: 'pointer', display: 'inline-flex', alignItems: 'center',
                    justifyContent: 'center', gap: 6, transition: 'all 200ms'
                  }}
                  onClick={e => { e.stopPropagation(); navigate(`/vendors/${v.id}`); }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--aeva-line-strong)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--aeva-line)'; }}>
                  <Eye size={13} />
                </button>
              </div>
            </div>
          </div>

          {!isExpanded && (
            <div style={{ fontSize: 12, color: 'var(--aeva-ink-soft)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              Tap to see features <ArrowRight size={11} />
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCategorySection = (catKey, catLabel) => {
    const vendors = getCategoryVendors(catKey);
    if (vendors.length === 0) return null;

    return (
      <div key={catKey} style={{ marginBottom: 56 }}>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 400,
          letterSpacing: '-0.01em', marginBottom: 20, color: 'var(--aeva-ink)'
        }}>
          {catLabel}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {vendors.map(v => renderCard(v))}
        </div>
      </div>
    );
  };

  const renderGrid = () => {
    if (isLoading) return renderLoadingState();
    if (allVendors.length === 0) {
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
            No vendors found
          </h3>
          <p style={{ color: 'var(--aeva-ink-soft)', margin: 0 }}>Try adjusting your filters.</p>
        </div>
      );
    }

    return (
      <div>
        {categories.map(cat => renderCategorySection(cat.key, cat.label))}
      </div>
    );
  };

  const renderContinueBar = () => {
    if (isLoading || allVendors.length === 0) return null;

    return (
      <div style={{
        marginTop: 32, padding: 20, background: 'var(--aeva-canvas)',
        border: '1px solid var(--aeva-line)', borderRadius: 'var(--r-md)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Sparkles size={16} style={{ color: 'var(--aeva-sage)' }} />
          <span style={{ fontSize: 13.5 }}>
            Browse and pick your vendors · <span style={{ color: 'var(--aeva-ink-mute)' }}>last step!</span>
          </span>
        </div>
        <button
          style={{
            padding: '10px 16px', background: 'var(--aeva-ink)', color: 'var(--aeva-paper)',
            border: 'none', borderRadius: 'var(--r-md)', fontSize: 13, fontWeight: 500,
            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
            transition: 'all 200ms'
          }}
          onClick={() => navigate('/plan/build/summary')}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}>
          Review plan <ArrowRight size={14} />
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
            Step 4 of 4 · vendors
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 400,
            lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 12, maxWidth: 720, margin: 0
          }}>
            Music, photography & more.
          </h1>
          <p style={{ fontSize: 16, color: 'var(--aeva-ink-soft)', maxWidth: 600, lineHeight: 1.6, margin: 0 }}>
            Pick a DJ, photographer, and videographer to complete your dream team.
          </p>
        </div>
      </div>

      {/* Brief strip */}
      <div style={{
        display: 'flex', gap: 16, padding: '14px 20px', background: 'var(--aeva-paper-warm)',
        border: '1px solid var(--aeva-line)', borderRadius: 'var(--r-md)', marginBottom: 32,
        alignItems: 'center', flexWrap: 'wrap'
      }}>
        <Sparkles size={16} style={{ color: 'var(--aeva-ember)', flexShrink: 0 }} />
        <span style={{ fontSize: 12.5, color: 'var(--aeva-ink-soft)' }}>Complete your team for</span>
        <Tag size="sm">24 guests</Tag>
        <Tag size="sm">Brooklyn loft</Tag>
        <Tag size="sm">Summer evening</Tag>
      </div>

      {/* Grid with category sections */}
      {renderGrid()}

      {/* Continue bar */}
      {renderContinueBar()}
    </div>
  );
}
