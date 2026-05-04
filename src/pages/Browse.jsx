import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function Browse() {
  const navigate = useNavigate();

  const categories = [
    {
      id: 'venues',
      label: 'Venues',
      title: 'Find Your Perfect Space',
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop',
      route: '/recommendations'
    },
    {
      id: 'catering',
      label: 'Catering',
      title: 'Culinary Excellence',
      image: 'https://images.unsplash.com/photo-1555440992-ed2b0fbf1c75?w=800&h=600&fit=crop',
      route: '/catering'
    },
    {
      id: 'decorations',
      label: 'Decorations',
      title: 'Bring Your Vision to Life',
      image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&h=600&fit=crop',
      route: '/decorations'
    },
    {
      id: 'vendors',
      label: 'Entertainment & Services',
      title: 'Entertainment & More',
      image: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=800&h=600&fit=crop',
      route: '/vendors'
    },
    {
      id: 'inspiration',
      label: 'Inspiration',
      title: 'Get Inspired',
      image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&h=600&fit=crop',
      route: '/recommendations'
    },
    {
      id: 'calendar',
      label: 'Quick Start',
      title: 'Begin Your Journey',
      image: 'https://images.unsplash.com/photo-1516534775068-bb57a2b7b7e0?w=800&h=600&fit=crop',
      route: '/survey'
    }
  ];

  const recentlyViewed = [
    {
      id: 1,
      name: 'The Wythe Loft',
      type: 'Venue',
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=200&h=200&fit=crop'
    },
    {
      id: 2,
      name: 'Sunday Supper Co.',
      type: 'Catering',
      image: 'https://images.unsplash.com/photo-1555440992-ed2b0fbf1c75?w=200&h=200&fit=crop'
    },
    {
      id: 3,
      name: 'Petal & Pine',
      type: 'Decorations',
      image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=200&h=200&fit=crop'
    }
  ];

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 32px 80px', background: 'var(--aeva-paper)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40, gap: 32, flexWrap: 'wrap' }}>
        <div>
          <p style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--aeva-ink-mute)', marginBottom: 12, fontWeight: 600, margin: 0 }}>
            browse
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 400,
            lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 12, maxWidth: 720, margin: 0
          }}>
            Build your own plan.
          </h1>
          <p style={{ fontSize: 16, color: 'var(--aeva-ink-soft)', maxWidth: 600, lineHeight: 1.6, margin: 0 }}>
            Pick from our full catalog — venues, caterers, decorators, and entertainment.
          </p>
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-start' }}>
          <button
            onClick={() => navigate('/plan/build')}
            style={{
              padding: '10px 20px',
              borderRadius: 'var(--r-lg)',
              background: 'transparent',
              border: '1px solid var(--aeva-line)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              color: 'var(--aeva-ink)',
              transition: 'all 200ms'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--aeva-ink)';
              e.currentTarget.style.background = 'var(--aeva-paper)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--aeva-line)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            Open my plan builder
          </button>
          <button
            onClick={() => navigate('/chat')}
            style={{
              padding: '10px 20px',
              borderRadius: 'var(--r-lg)',
              background: 'var(--aeva-ember)',
              border: 'none',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              color: 'white',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 200ms'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.opacity = '0.9';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            <Sparkles size={14} /> Ask AEVA
          </button>
        </div>
      </div>

      {/* Bento Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 20,
        marginBottom: 56
      }} className="lg:grid-cols-3">
        {categories.map((cat, idx) => (
          <div
            key={cat.id}
            onClick={() => navigate(cat.route)}
            style={{
              position: 'relative',
              height: idx === 0 ? 400 : 280,
              overflow: 'hidden',
              borderRadius: 'var(--r-2xl)',
              cursor: 'pointer',
              transition: 'transform 300ms',
              gridColumn: idx === 0 ? 'span 2' : 'span 1'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {/* Background Image */}
            <img
              src={cat.image}
              alt={cat.label}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 300ms',
                transform: 'scale(1)'
              }}
            />

            {/* Dark Overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(26,24,20,0) 0%, rgba(26,24,20,0.8) 100%)',
                transition: 'opacity 300ms',
                opacity: 0.8
              }}
            />

            {/* Content */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: 24,
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                gap: 8
              }}
            >
              <p style={{
                fontSize: 11,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontWeight: 600,
                margin: 0,
                opacity: 0.8
              }}>
                {cat.label}
              </p>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 28,
                fontWeight: 400,
                lineHeight: 1.2,
                margin: 0,
                letterSpacing: '-0.01em'
              }}>
                {cat.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Recently Viewed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 28,
          fontWeight: 400,
          letterSpacing: '-0.01em',
          marginBottom: 8,
          color: 'var(--aeva-ink)',
          margin: 0
        }}>
          Recently Viewed
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16
        }}>
          {recentlyViewed.map(item => (
            <div
              key={item.id}
              style={{
                background: 'var(--aeva-paper-warm)',
                borderRadius: 'var(--r-lg)',
                border: '1px solid var(--aeva-line)',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 200ms'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: '100%',
                  height: 120,
                  objectFit: 'cover'
                }}
              />
              <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <p style={{ fontSize: 12, color: 'var(--aeva-ink-mute)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
                  {item.type}
                </p>
                <h4 style={{ fontSize: 15, fontWeight: 600, color: 'var(--aeva-ink)', margin: 0 }}>
                  {item.name}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
