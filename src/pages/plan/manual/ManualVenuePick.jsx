import React, { useState, useEffect, useContext } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getVenues } from '../../../services/catalogService';
import { usePlanStore } from '../../../store/plan.store';
import { PlanBuilderContext } from '../../../contexts/PlanBuilderContext';
import { saveEventSelection } from '../../../services/planningService';
import { MapPin, Users, Star, Check } from 'lucide-react';
import { Tag } from '../../../components/ui/Tag';

export default function ManualVenuePick() {
  const { selectedVenue, setVenue } = usePlanStore();
  const { eventId } = useContext(PlanBuilderContext);
  const { onNavigatePastStep0 } = useOutletContext();
  const [venues, setVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchVenues = async () => {
      setIsLoading(true);
      const { data, error } = await getVenues();
      if (!cancelled) {
        if (error) {
          console.error('[ManualVenuePick] Failed to fetch venues:', error);
          setVenues([]);
        } else {
          const mapped = (data || []).map(v => ({
            id: v.id,
            name: v.name,
            type: v.venue_type,
            minGuests: v.capacity_min,
            maxGuests: v.capacity_max,
            startingPrice: v.price_min,
            rating: v.rating,
            image: Array.isArray(v.image_urls)
              ? v.image_urls[0]
              : (JSON.parse(v.image_urls || '[]')[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800'),
            location: v.city,
            amenities: Array.isArray(v.features)
              ? v.features
              : (JSON.parse(v.features || '[]') || []),
            description: v.description,
          }));
          setVenues(mapped);
        }
        setIsLoading(false);
      }
    };
    fetchVenues();
    return () => { cancelled = true; };
  }, []);

  const handleVenueSelect = async (venue) => {
    const isSelected = selectedVenue?.id === venue.id;
    setVenue(isSelected ? null : venue);

    if (!isSelected && venue && eventId) {
      const { error } = await saveEventSelection(eventId, 'venue', venue.id);
      if (error) {
        console.error('[ManualVenuePick] Failed to save venue selection:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div
            key={i}
            style={{
              background: 'var(--aeva-canvas)',
              border: '1px solid var(--aeva-line)',
              borderRadius: 'var(--r-lg)',
              height: '320px',
              animation: 'pulse 2s infinite',
              opacity: 0.6,
            }}
          />
        ))}
      </div>
    );
  }

  if (venues.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 32px', color: 'var(--aeva-ink-mute)' }}>
        <p style={{ fontSize: '16px' }}>No venues available</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="t-display-md" style={{ marginBottom: '12px' }}>
        🏛️ Choose a Venue
      </h2>
      <p style={{ fontSize: '16px', color: 'var(--aeva-ink-soft)', marginBottom: '32px' }}>
        Select the perfect space for your event.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {venues.map((venue, i) => {
          const isSelected = selectedVenue?.id === venue.id;
          return (
            <motion.div
              key={venue.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => handleVenueSelect(venue)}
              style={{
                position: 'relative',
                background: 'var(--aeva-canvas)',
                borderRadius: 'var(--r-lg)',
                overflow: 'hidden',
                border: isSelected ? '2px solid var(--aeva-ink)' : '1px solid var(--aeva-line)',
                cursor: 'pointer',
                transition: 'all 200ms',
                boxShadow: isSelected ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = isSelected ? 'var(--shadow-lg)' : 'var(--shadow-sm)';
              }}
            >
              {isSelected && (
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    zIndex: 10,
                    width: '32px',
                    height: '32px',
                    background: 'var(--aeva-ink)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-md)',
                  }}
                >
                  <Check size={16} color="var(--aeva-paper)" />
                </div>
              )}

              <img src={venue.image} alt={venue.name} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />

              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--aeva-ink)' }}>
                    {venue.name}
                  </h3>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--aeva-ink-mute)' }}>
                    <Star size={12} fill="currentColor" />
                    {venue.rating}
                  </span>
                </div>

                <p style={{ fontSize: '12px', color: 'var(--aeva-ink-mute)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
                  <MapPin size={12} />
                  {venue.location}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', paddingTop: '12px', borderTop: '1px solid var(--aeva-line)', paddingBottom: '12px' }}>
                  <div>
                    <p className="t-eyebrow" style={{ marginBottom: '2px' }}>
                      From
                    </p>
                    <p style={{ fontWeight: 600, color: 'var(--aeva-ink)' }}>
                      {venue.startingPrice?.toLocaleString()} EGP
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p className="t-eyebrow" style={{ marginBottom: '2px' }}>
                      Capacity
                    </p>
                    <p style={{ fontWeight: 600, color: 'var(--aeva-ink)' }}>
                      {venue.maxGuests}
                    </p>
                  </div>
                </div>

                {venue.type && (
                  <div style={{ marginTop: '12px', marginBottom: '12px' }}>
                    <Tag size="sm">{venue.type.replace('-', ' ')}</Tag>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
