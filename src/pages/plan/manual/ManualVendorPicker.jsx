/**
 * ManualVendorPicker.jsx
 *
 * Reusable step component for selecting a vendor category.
 * Props:
 *   - category: 'catering' | 'decorations' | 'photography' | 'dj' | 'videography'
 *   - label: display label (e.g. "Catering")
 *   - icon: emoji or icon
 *   - storeKey: key in usePlanStore (e.g. 'selectedCatering', 'selectedDecorations')
 *   - setFn: setter function from usePlanStore (e.g. setCatering)
 *   - eventSelectionType: event_selections type string (e.g. 'catering')
 */

import React, { useState, useEffect, useContext } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getVendors } from '../../../services/catalogService';
import { usePlanStore } from '../../../store/plan.store';
import { PlanBuilderContext } from '../../../contexts/PlanBuilderContext';
import { saveEventSelection } from '../../../services/planningService';
import { Check, DollarSign } from 'lucide-react';
import { Tag } from '../../../components/ui/Tag';

export default function ManualVendorPicker({
  category,
  label,
  icon,
  storeKey,
  setFn,
  eventSelectionType,
}) {
  const store = usePlanStore();
  const selected = store[storeKey];
  const setSel = setFn;

  const { eventId } = useContext(PlanBuilderContext);
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchVendors = async () => {
      setIsLoading(true);
      const { data, error } = await getVendors(category);
      if (!cancelled) {
        if (error) {
          console.error(`[ManualVendorPicker] Failed to fetch ${category}:`, error);
          setVendors([]);
        } else {
          const mapped = (data || []).map(v => ({
            id: v.id,
            name: v.name,
            category: v.category,
            price: v.price || 0,
            description: v.description,
            image: Array.isArray(v.image_urls)
              ? v.image_urls[0]
              : (JSON.parse(v.image_urls || '[]')[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800'),
            rating: v.rating || 0,
            features: Array.isArray(v.features) ? v.features : (JSON.parse(v.features || '[]') || []),
          }));
          setVendors(mapped);
        }
        setIsLoading(false);
      }
    };
    fetchVendors();
    return () => { cancelled = true; };
  }, [category]);

  const handleVendorSelect = async (vendor) => {
    const isSelected = selected?.id === vendor.id;
    setSel(isSelected ? null : vendor);

    if (!isSelected && vendor && eventId) {
      const { error } = await saveEventSelection(eventId, eventSelectionType, vendor.id);
      if (error) {
        console.error(`[ManualVendorPicker] Failed to save ${eventSelectionType} selection:`, error);
      }
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            style={{
              background: 'var(--aeva-canvas)',
              border: '1px solid var(--aeva-line)',
              borderRadius: 'var(--r-lg)',
              height: '280px',
              animation: 'pulse 2s infinite',
              opacity: 0.6,
            }}
          />
        ))}
      </div>
    );
  }

  if (vendors.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 32px', color: 'var(--aeva-ink-mute)' }}>
        <p style={{ fontSize: '16px' }}>No {category} options available</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="t-display-md" style={{ marginBottom: '12px' }}>
        {icon} {label}
      </h2>
      <p style={{ fontSize: '16px', color: 'var(--aeva-ink-soft)', marginBottom: '32px' }}>
        Select your preferred {category.toLowerCase()}.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {vendors.map((vendor, i) => {
          const isSelected = selected?.id === vendor.id;
          return (
            <motion.div
              key={vendor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => handleVendorSelect(vendor)}
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

              <img src={vendor.image} alt={vendor.name} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />

              <div style={{ padding: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--aeva-ink)', marginBottom: '4px' }}>
                  {vendor.name}
                </h3>

                {vendor.description && (
                  <p style={{ fontSize: '12px', color: 'var(--aeva-ink-soft)', marginBottom: '12px', lineHeight: 1.4 }}>
                    {vendor.description}
                  </p>
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--aeva-line)', paddingBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <DollarSign size={14} color="var(--aeva-ink-mute)" />
                    <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--aeva-ink)' }}>
                      {vendor.price?.toLocaleString()} EGP
                    </p>
                  </div>
                </div>

                {vendor.features && vendor.features.length > 0 && (
                  <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {vendor.features.slice(0, 2).map(feature => (
                      <Tag key={feature} size="sm">
                        {feature}
                      </Tag>
                    ))}
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
